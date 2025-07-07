using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models.Visits;
using EcdLink.Api.CoreApi.Managers.Users;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Visits
{
    public class VisitDataManager : BaseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private HierarchyEngine _hierarchyEngine;

        private VisitDataStatusManager _visitDataStatusManager;
        private VisitDataStatusManager_Practitioner _visitDataStatusManager_practitioner;
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitData, Guid> _visitDataRepo;
        private IGenericRepository<VisitType, Guid> _visitTypeRepo;
        private IGenericRepository<PQARating, Guid> _pqaRatingRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private VisitManager _visitManager;

        private Guid _applicationUserId;
        private INotificationService _notificationService;

        public VisitDataManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitDataStatusManager visitDataStatusManager,
            VisitDataStatusManager_Practitioner visitDataStatusManager_Practitioner,
            VisitManager visitManager,
            HierarchyEngine hierarchyEngine, 
            [Service] INotificationService notificationService)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _visitDataStatusManager = visitDataStatusManager;
            _visitDataStatusManager_practitioner = visitDataStatusManager_Practitioner;
            _hierarchyEngine = hierarchyEngine;
            _visitManager = visitManager;
            _notificationService = notificationService;

            _applicationUserId = contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();
            _visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            _visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            _visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: _applicationUserId);
            _pqaRatingRepo = _repoFactory.CreateGenericRepository<PQARating>(userContext: _applicationUserId);
            _practitionerRepo = _repoFactory.CreateRepository<Practitioner>(userContext: _applicationUserId);
        }

        /// <summary>
        /// Adds data to a visit and marks it as attended
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public Visit AddVisitData(CMSVisitDataInputModel input)
        {
            var visit = _visitRepo.GetAll().Where(x => x.Id == Guid.Parse(input.VisitId)).SingleOrDefault();

            if (visit == null)
            {
                throw new ArgumentNullException("VisitId, no matching visit found");
            }

            if (input.VisitData.Sections == null)
            {
                var section = new CMSVisitSection();
                
                section.Questions = new List<CMSQuestion>();
                var question = new CMSQuestion();
               question.Question = "";
               question.Answer = "";
               section.Questions.Add(question);
               input.VisitData.Sections = new CMSVisitSection[] { section };
            }

            // Add visit data
            var visitDataItems = new List<VisitData>();
            foreach (CMSVisitSection section in input.VisitData.Sections)
            {
                foreach (CMSQuestion question in section.Questions)
                {
                    var visitData = GetVisitDataFromInputModel(question, input.VisitId, input.VisitData.VisitName, section.VisitSection);
                    if (!visit.VisitData.Any(x =>
                        x.VisitName == visitData.VisitName &&
                        x.VisitSection == visitData.VisitSection &&
                        x.Question == visitData.Question &&
                        x.QuestionAnswer == visitData.QuestionAnswer))
                    {
                        visitDataItems.Add(visitData);
                    }
                }
            }

            if (visitDataItems.Any())
            {
                _visitDataRepo.InsertMany(visitDataItems);
            }

            // update the visit record to show attended when follow up is done
            // int count = _visitDataRepo.GetAll().Where(x => x.VisitId == Guid.Parse(input.VisitId) && x.VisitName == Constants.GGSettings.visit_follow_up).Select(y => y.VisitName).Distinct().Count();
            // if (count != 0)
            // {
            //    visit.UpdatedDate = DateTime.Now;
            //    visit.UpdatedBy = _applicationUserId.ToString();
            //    visit.Attended = true;
            //    visit.ActualVisitDate = DateTime.Now;
            // }        

            return _visitRepo.Update(visit);
        }

        public Visit AddPractitionerVisitData(CMSVisitDataInputModel input, bool markVisitAsCompleted)
        {
            Visit visit = _visitRepo.GetById(new Guid(input.VisitId));

            if (input.VisitData.Sections == null)
            {
                var _section = new CMSVisitSection();
                _section.VisitSection = "";
                _section.Questions = new List<CMSQuestion>();

                var _question = new CMSQuestion();
                _question.Question = "";
                _question.Answer = "";
                _section.Questions.Add(_question);
                input.VisitData.Sections = new CMSVisitSection[] { _section };
            }

            // first add all your questions and answers
            foreach (CMSVisitSection section in input.VisitData.Sections)
            {
                foreach (CMSQuestion question in section.Questions)
                {
                    VisitData visitData = (VisitData)GetVisitDataFromInputModel(question, input.VisitId, input.VisitData.VisitName, section.VisitSection);
                    if (ValidateInsertRecord(visitData))
                    {
                        _visitDataRepo.Insert(visitData);
                    }
                }
            }

            if (markVisitAsCompleted)
            {
                // update the visit record to show attended/completed 
                visit.UpdatedDate = DateTime.Now;
                visit.UpdatedBy = _applicationUserId.ToString();
                visit.Attended = true;
                visit.ActualVisitDate = DateTime.Now;
                return _visitRepo.Update(visit);
            }

            // then handle status data
            if (visit.VisitType.Type == Constants.SSSettings.visitType_pqa_visit_1 || visit.VisitType.Type == Constants.SSSettings.visitType_re_accreditation_1)
            {
                _visitDataStatusManager_practitioner.ManageVisitDataStatus(input.PractitionerId, input.VisitId);
            }

            return visit;
        }
      
        public Visit MarkChecklistVisitStatus(Guid visitId)
        {
            int programmeCount = _visitDataRepo.GetAll().Where(x => x.VisitId == visitId && x.VisitName == Constants.SSSettings.smart_space_checklist && x.VisitSection == Constants.SSSettings.ss_programme).Count();
            int healthCount = _visitDataRepo.GetAll().Where(x => x.VisitId == visitId && x.VisitName == Constants.SSSettings.smart_space_checklist && x.VisitSection == Constants.SSSettings.ss_health && x.QuestionAnswer == "true").Count();
            int safetyCount = _visitDataRepo.GetAll().Where(x => x.VisitId == visitId && x.VisitName == Constants.SSSettings.smart_space_checklist && x.VisitSection == Constants.SSSettings.ss_safety && x.QuestionAnswer == "true").Count();

            // EC-1359 - remove spacecount which is not compulsory
            if (programmeCount >= 6 && healthCount == 7 && safetyCount == 10)
            {          
               
               // update the visit record to show attended/completed 
               var entityToUpdate = _visitRepo.GetById(visitId);
               entityToUpdate.UpdatedDate = DateTime.Now;
               entityToUpdate.UpdatedBy = _applicationUserId.ToString();
               entityToUpdate.Attended = true;
               entityToUpdate.ActualVisitDate = DateTime.Now;
               return _visitRepo.Update(entityToUpdate);  
            }
            return null;
        }
        public Visit AddCoachData(CMSVisitDataInputModel input)
        {
            if (input.VisitData.Sections == null)
            {
                var _section = new CMSVisitSection();
                _section.VisitSection = "";
                _section.Questions = new List<CMSQuestion>();

                var _question = new CMSQuestion();
                _question.Question = "";
                _question.Answer = "";
                _section.Questions.Add(_question);
                input.VisitData.Sections = new CMSVisitSection[] { _section };
            }

            // first add all your questions and answers
            foreach (CMSVisitSection section in input.VisitData.Sections)
            {
                foreach (CMSQuestion question in section.Questions)
                {
                    VisitData visitData = (VisitData)GetVisitDataFromInputModel(question, input.VisitId, input.VisitData.VisitName, section.VisitSection);
                    VisitData existingRecord = ValidateInsertRecordWithoutAnswer(visitData);
                    if (existingRecord != null)
                    {
                        var entityToUpdate = _visitDataRepo.GetById(existingRecord.Id);
                        entityToUpdate.QuestionAnswer = visitData.QuestionAnswer;
                        _visitDataRepo.Update(entityToUpdate);
                    } else
                    {
                        _visitDataRepo.Insert(visitData);
                    }
                }
            }

            return new Visit();
        }
        public bool EditVisitData(CMSVisitDataInputModel input)
        {
            if (input.VisitData.Sections == null)
            {
                var _section = new CMSVisitSection();
                _section.VisitSection = "";
                _section.Questions = new List<CMSQuestion>();

                var _question = new CMSQuestion();
                _question.Question = "";
                _question.Answer = "";
                _section.Questions.Add(_question);
                input.VisitData.Sections = new CMSVisitSection[] { _section };
            }

            foreach (CMSVisitSection section in input.VisitData.Sections)
            {
                foreach (CMSQuestion question in section.Questions)
                {
                    VisitData visitData = (VisitData)GetVisitDataFromInputModel(question, input.VisitId, input.VisitData.VisitName, section.VisitSection);
                    VisitData existingRecord = ValidateInsertRecordWithoutAnswer(visitData);
                    if (existingRecord != null)
                    {
                        var entityToUpdate = _visitDataRepo.GetById(existingRecord.Id);
                        entityToUpdate.QuestionAnswer = visitData.QuestionAnswer;
                        _visitDataRepo.Update(entityToUpdate);
                    } else
                    {
                        _visitDataRepo.Insert(visitData);
                    }
                }
            }

            if (input.VisitData.VisitName == Constants.SSSettings.smart_space_checklist)
            {
                List<string> sections = new List<string>();
                sections.Add(Constants.SSSettings.ss_programme);
                sections.Add(Constants.SSSettings.ss_health);
                sections.Add(Constants.SSSettings.ss_safety);
                var completedSections = _visitDataRepo.GetAll()
                        .Where(x => x.VisitId == Guid.Parse(input.VisitId) && x.VisitName == Constants.SSSettings.smart_space_checklist &&
                               sections.Contains(x.VisitSection)).Select(y => y.VisitSection).Distinct().ToList();
                if (completedSections.Count == 3)
                {
                    MarkChecklistVisitStatus(Guid.Parse(input.VisitId));
                }
            }

            return true;
        }
        public bool AddSupportVisitData(CMSVisitDataInputModel input)
        {
            if (input.VisitData.Sections == null)
            {
                var _section = new CMSVisitSection();
                _section.VisitSection = "";
                _section.Questions = new List<CMSQuestion>();

                var _question = new CMSQuestion();
                _question.Question = "";
                _question.Answer = "";
                _section.Questions.Add(_question);
                input.VisitData.Sections = new CMSVisitSection[] { _section };
            }

            foreach (CMSVisitSection section in input.VisitData.Sections)
            {
                foreach (CMSQuestion question in section.Questions)
                {
                    VisitData visitData = (VisitData)GetVisitDataFromInputModel(question, input.VisitId, input.VisitData.VisitName, section.VisitSection);
                    VisitData existingRecord = ValidateInsertRecordWithoutAnswer(visitData);
                    if (existingRecord != null)
                    {
                        var entityToUpdate = _visitDataRepo.GetById(existingRecord.Id);
                        entityToUpdate.QuestionAnswer = visitData.QuestionAnswer;
                        _visitDataRepo.Update(entityToUpdate);
                    }
                    else
                    {
                        _visitDataRepo.Insert(visitData);
                    }
                }
            }

            Visit visit = _visitRepo.GetById(new Guid(input.VisitId));
            visit.Attended = true;
            visit.ActualVisitDate = DateTime.Now;
            visit.UpdatedDate = DateTime.Now;
            visit.UpdatedBy = _applicationUserId.ToString();
            _visitRepo.Update(visit);

            return true;
        }
        private VisitData GetVisitDataFromInputModel(CMSQuestion input, string visitId, string visitName, string visitSection)
        {
            if (input == null)
            {
                return null;
            }

            return new VisitData()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToString(),
                VisitId = new Guid(visitId),
                VisitName = visitName,
                VisitSection = visitSection,
                Question = input.Question,
                QuestionAnswer = input.Answer
            };
        }
        public List<VisitData> GetVisitAnswersForClient(string visitId, string visitName, string visitSection) {

            return _visitDataRepo.GetAll().Where(x => x.Visit.Id.ToString() == visitId && x.VisitName == visitName && x.VisitSection == visitSection).OrderBy(x => x.Visit.PlannedVisitDate).ToList();
        }
        public List<string> GetCompletedVisitsForVisitId(string visitId) {

            return _visitDataRepo.GetAll().Where(x => x.Visit.Id.ToString() == visitId).OrderBy(x => x.Visit.PlannedVisitDate).Select(y => y.VisitName).Distinct().ToList();
        }
        public List<VisitData> GetVisitDataForVisitId(string visitId)
        {
            return _visitDataRepo.GetAll().Where(x => x.Visit.Id.ToString() == visitId).OrderBy(x => x.Visit.PlannedVisitDate).ToList();
        }
        
        public PQARating CalculateAndSavePractitionerPQARating(Visit pqaVisit)
        {
            int totalSections = Constants.SSSettings.step2_total + Constants.SSSettings.step3_total + Constants.SSSettings.step4_total + Constants.SSSettings.step5_total +
                                Constants.SSSettings.step6_total + Constants.SSSettings.step7_total + Constants.SSSettings.step8_total;
            var totalScores = 0.0;

            // Check if we have a rating
            var rating = _pqaRatingRepo.GetAll().FirstOrDefault(x => x.VisitId == pqaVisit.Id);
            var isNewRating = false;
            var step12_count = 0;
            if (rating == null)
            {
                isNewRating = true;
                rating = new PQARating() { Id = Guid.NewGuid() };
            }

            if (pqaVisit != null) {

                rating.VisitTypeName = pqaVisit.VisitType.Name;
                rating.LinkedVisitId = pqaVisit.LinkedVisitId;
                rating.VisitId = pqaVisit.Id;

                if (rating.Sections == null)
                {
                    rating.Sections = new List<PQASectionRating>();
                }

                var vData = _visitDataRepo.GetAll().Where(y => y.VisitId == pqaVisit.Id).ToList();
                double step5Score = -1;

                if (vData.Count > 0)
                {
                    var step2 = vData.Where(x => x.VisitSection == Constants.SSSettings.step2_section).ToList();
                    var step3 = vData.Where(x => x.VisitSection == Constants.SSSettings.step3_section && x.Question == Constants.SSSettings.step3_q1).ToList();
                    var step4 = vData.Where(x => x.VisitSection == Constants.SSSettings.step4_section && x.Question != Constants.SSSettings.step3_q1).ToList();
                    var step5 = vData.Where(x => x.VisitSection == Constants.SSSettings.step5_section).ToList();
                    var step6 = vData.Where(x => x.VisitSection == Constants.SSSettings.step6_section).ToList();
                    var step7 = vData.Where(x => x.VisitSection == Constants.SSSettings.step7_section).ToList();
                    var step8 = vData.Where(x => x.VisitSection == Constants.SSSettings.step8_section).ToList();
                    var step12 = vData.Where(x => x.VisitSection == Constants.SSSettings.step12_section).Select(x => x.QuestionAnswer).FirstOrDefault();

                    if (step2.Count > 0)
                    {
                        rating.VisitName = step2.GetItemByIndex(0).VisitName;
                        //rating.PlannedDate = step2.GetItemByIndex(0).Visit.PlannedVisitDate;
                        //rating.ActualVisitDate = step2.GetItemByIndex(0).Visit.ActualVisitDate;

                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == step2.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = step2.GetItemByIndex(0).VisitSection;
                        child.SectionScore = GetScoreForSection(step2);
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step2_total;
                        child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor(((double)child.SectionScore / (double)Constants.SSSettings.step2_total) * 100);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;

                    }

                    if (step3.Count > 0)
                    {
                        rating.VisitName = step3.GetItemByIndex(0).VisitName;
                        //rating.PlannedDate = step3.GetItemByIndex(0).Visit.PlannedVisitDate;
                        //rating.ActualVisitDate = step3.GetItemByIndex(0).Visit.ActualVisitDate;

                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == step3.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = step3.GetItemByIndex(0).VisitSection;
                        child.SectionScore = GetScoreForSection(step3);
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step3_total;
                        child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStep3RatingColor(child.SectionScore);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;
                    }

                    if (step4.Count > 0)
                    {
                        rating.VisitName = step4.GetItemByIndex(0).VisitName;
                        //rating.PlannedDate = step4.GetItemByIndex(0).Visit.PlannedVisitDate;
                        //rating.ActualVisitDate = step4.GetItemByIndex(0).Visit.ActualVisitDate;

                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == step4.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = step4.GetItemByIndex(0).VisitSection;
                        child.SectionScore = GetScoreForSection(step4);
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step4_total;
                        child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor(((double)child.SectionScore / (double)Constants.SSSettings.step4_total) * 100);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;
                    }

                    if (step5.Count > 0)
                    {
                        rating.VisitName = step5.GetItemByIndex(0).VisitName;
                        //rating.PlannedDate = step5.GetItemByIndex(0).Visit.PlannedVisitDate;
                        //rating.ActualVisitDate = step5.GetItemByIndex(0).Visit.ActualVisitDate;

                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == step5.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = step5.GetItemByIndex(0).VisitSection;
                        child.SectionScore = GetScoreForSection(step5);
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step5_total;
                        child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor(((double)child.SectionScore / (double)Constants.SSSettings.step5_total) * 100);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;
                        step5Score = child.SectionScore;
                    }

                    if (step6.Count > 0)
                    {
                        rating.VisitName = step6.GetItemByIndex(0).VisitName;
                        //rating.PlannedDate = step6.GetItemByIndex(0).Visit.PlannedVisitDate;
                        //rating.ActualVisitDate = step6.GetItemByIndex(0).Visit.ActualVisitDate;

                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == step6.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = step6.GetItemByIndex(0).VisitSection;
                        child.SectionScore = GetScoreForSection(step6);
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step6_total;
                        child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor(((double)child.SectionScore / (double)Constants.SSSettings.step6_total) * 100);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;
                    }

                    if (step7.Count > 0)
                    {
                        rating.VisitName = step7.GetItemByIndex(0).VisitName;
                        //rating.PlannedDate = step7.GetItemByIndex(0).Visit.PlannedVisitDate;
                        //rating.ActualVisitDate = step7.GetItemByIndex(0).Visit.ActualVisitDate;

                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == step7.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = step7.GetItemByIndex(0).VisitSection;
                        child.SectionScore = GetScoreForSection(step7);
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step7_total;
                        child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor(((double)child.SectionScore / (double)Constants.SSSettings.step7_total) * 100);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;
                    }

                    if (step8.Count > 0)
                    {
                        rating.VisitName = step8.GetItemByIndex(0).VisitName;
                        //rating.PlannedDate = step8.GetItemByIndex(0).Visit.PlannedVisitDate;
                        //rating.ActualVisitDate = step8.GetItemByIndex(0).Visit.ActualVisitDate;

                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == step8.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = step8.GetItemByIndex(0).VisitSection;
                        child.SectionScore = GetScoreForSection(step8);
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step8_total;
                        child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor(((double)child.SectionScore / (double)Constants.SSSettings.step8_total) * 100);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;
                    }

                    if (step12 != null)
                    {
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a1) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a2) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a3) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a4) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a5) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a6) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a7) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a8) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a9) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a10) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a11) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a12) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a13) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a14) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a15) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a16) != -1) { step12_count++; }
                        if (step12.IndexOf(Constants.SSSettings.step12_q1_a17) != -1) { step12_count++; }
                    }

                    // overall rating calc
                    rating.OverallScore = totalScores;
                    rating.OverallRating = totalScores + "/" + totalSections;

                    VisitData step14_q1 = vData.Where(x => x.Question == Constants.SSSettings.step14_q1).FirstOrDefault();
                    VisitData step16_q1 = vData.Where(x => x.Question == Constants.SSSettings.step16_q1).FirstOrDefault();
                    VisitData step16_q3 = vData.Where(x => x.Question == Constants.SSSettings.step16_q3).FirstOrDefault();
                    VisitData step16_q4 = vData.Where(x => x.Question == Constants.SSSettings.step16_q4).FirstOrDefault();
                    VisitData step11_q1 = vData.Where(x => x.Question == Constants.SSSettings.step11_q1).FirstOrDefault();

                    // Green Rating
                    // "Scenario: practitioner received a score over 42 AND
                    // user either did not do the smartspace check (ie responded ""No"" in use case 15) OR
                    // re-issued the SmartSpace licence (ie the use case 18 scenario);

                    if (rating.OverallScore > 42 ||
                        (step11_q1 != null && step11_q1.QuestionAnswer == Constants.SSSettings.answer_no) ||
                        (step14_q1 != null && step14_q1.QuestionAnswer == Constants.SSSettings.answer_yes))
                    {
                        rating.OverallRatingColor = MetricsColorEnum.Success.ToString();
                    }

                    // Orange Rating
                    // "To get an orange rating, at least one of the following must be true:
                    // 1.overall score is greater than or equal to 18 and less than or equal to 42 out of 68
                    // 2. if user selected ""No"" to the second question in use case 21(ie, ""Is the SmartStart programme being implemented for long enough?""
                    // 3. if user selected ""Yes"" to the third question in use case 21(ie, ""Are there too many children attending the SmartStart programme ? "")
                    if (rating.OverallScore >= 18 && rating.OverallScore <= 42 ||
                        (step16_q3 != null && step16_q3.QuestionAnswer == Constants.SSSettings.answer_no) ||
                        (step16_q4 != null && step16_q4.QuestionAnswer == Constants.SSSettings.answer_yes))
                    {
                        rating.OverallRatingColor = MetricsColorEnum.Warning.ToString();
                    }

                    // Red Rating
                    // "To get a red rating, at least one of the following must be true:
                    // 1. if the overall PQA score is less than 18 out of 68
                    // 2. if the score for step 5 of the PQA(ie, section 3, use case 9) was less than 5
                    // 3. if the user did NOT re-issue the SmartSpace license(use case 16)
                    // (4.note that if the user selected ""Yes"" to the first question in use case 21, then the scenario in use case 23 applies - please see use case 23 above for that red rating case, not covered here) 

                    if (rating.OverallScore < 18 || (step5Score > 0 && step5Score < 5) ||
                        (step14_q1 != null && step14_q1.QuestionAnswer == Constants.SSSettings.answer_no) ||
                        (step16_q1 != null && step16_q1.QuestionAnswer == Constants.SSSettings.answer_yes) ||
                        (step12 != null && step12_count <= 12))
                    {
                        rating.OverallRatingColor = MetricsColorEnum.Error.ToString();
                    }
                }
            }

            // Save or update the rating
            if (isNewRating)
            {
                _pqaRatingRepo.Insert(rating);
            }
            else
            {
                _pqaRatingRepo.Update(rating);
            }

            if (pqaVisit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
            {
                pqaVisit.Rating = rating.OverallRatingColor;
                _visitRepo.Update(pqaVisit);
            }

            return rating;
        }
        
        public PQARating CalculateAndSaveReAccreditationRating(Visit RAVisit) 
        {
            // Check if we have a rating
            var rating = _pqaRatingRepo.GetAll().FirstOrDefault(x => x.VisitId == RAVisit.Id);
            var isNewRating = false;
            if (rating == null)
            {
                isNewRating = true;
                rating = new PQARating() { Id = Guid.NewGuid() };
            }

            int totalSections = Constants.SSSettings.re_accreditation_A_total + Constants.SSSettings.re_accreditation_B_total +
                                Constants.SSSettings.re_accreditation_C_total + Constants.SSSettings.re_accreditation_D_total;
            var totalScores = 0.0;

            if (RAVisit != null)
            {
                rating.VisitTypeName = RAVisit.VisitType.Name;
                rating.LinkedVisitId = RAVisit.LinkedVisitId;
                rating.VisitId = RAVisit.Id;

                if (rating.Sections == null)
                {
                    rating.Sections = new List<PQASectionRating>();
                }

                var vData = _visitDataRepo.GetAll().Where(y => y.VisitId == RAVisit.Id).ToList();

                if (vData.Count > 0)
                {
                    var stepA = vData.Where(x => x.VisitSection == Constants.SSSettings.step_8_section).ToList();
                    var stepB = vData.Where(x => x.VisitSection == Constants.SSSettings.step_10_section).ToList();
                    var stepC = vData.Where(x => x.VisitSection == Constants.SSSettings.step_11_section).ToList();
                    var stepD = vData.Where(x => x.VisitSection == Constants.SSSettings.step_12_section).ToList();

                    // Section A
                    if (stepA.Count > 0)
                    {
                        rating.VisitName = stepA.GetItemByIndex(0).VisitName;
                        //rating.PlannedDate = stepA.GetItemByIndex(0).Visit.PlannedVisitDate;
                        //rating.ActualVisitDate = stepA.GetItemByIndex(0).Visit.ActualVisitDate;

                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == stepA.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = stepA.GetItemByIndex(0).VisitSection;
                        child.SectionScore = GetCheckBoxScore(stepA);
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.re_accreditation_A_total;
                        child.SectionRatingColor = GetSectionRatingColor(((double)child.SectionScore / (double)Constants.SSSettings.re_accreditation_A_total) * 100);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;
                    }

                    // Section B
                    if (stepB.Count > 0)
                    {
                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == stepB.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = stepB.GetItemByIndex(0).VisitSection;
                        child.SectionScore = stepB.Select(x => Int32.Parse(x.QuestionAnswer)).Sum();
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.re_accreditation_B_total;
                        child.SectionRatingColor = GetSectionRatingColor(((double)child.SectionScore / (double)Constants.SSSettings.re_accreditation_B_total) * 100);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;
                    }

                    // Section C
                    if (stepC.Count > 0)
                    {
                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == stepC.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = stepC.GetItemByIndex(0).VisitSection;
                        child.SectionScore = GetCheckBoxScore(stepC);
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.re_accreditation_C_total;
                        child.SectionRatingColor = GetSectionRatingColor(((double)child.SectionScore / (double)Constants.SSSettings.re_accreditation_C_total) * 100);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;
                    }

                    // Section D
                    if (stepD.Count > 0)
                    {
                        var child = rating.Sections.FirstOrDefault(x => x.VisitSection == stepD.GetItemByIndex(0).VisitSection) ?? new PQASectionRating();
                        child.VisitSection = stepD.GetItemByIndex(0).VisitSection;
                        child.SectionScore = GetCheckBoxScore(stepD);
                        child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.re_accreditation_D_total;
                        child.SectionRatingColor = GetSectionRatingColor(((double)child.SectionScore / (double)Constants.SSSettings.re_accreditation_D_total) * 100);
                        if (child.Id == Guid.Empty)
                        {
                            child.Id = Guid.NewGuid();
                            child.PQARatingId = rating.Id;
                            rating.Sections.Add(child);
                        }
                        totalScores += child.SectionScore;
                    }
                }

                // overall rating calc
                rating.OverallScore = totalScores;
                rating.OverallRating = totalScores + "/" + totalSections;

                VisitData step16_q1 = vData.Where(x => x.Question == Constants.SSSettings.step16_q1).FirstOrDefault();
                VisitData step16_q3 = vData.Where(x => x.Question == Constants.SSSettings.step16_q3).FirstOrDefault();
                VisitData step16_q4 = vData.Where(x => x.Question == Constants.SSSettings.step16_q4).FirstOrDefault();
                VisitData step16_q5 = vData.Where(x => x.Question == Constants.SSSettings.step16_q5).FirstOrDefault();

                // Green Rating
                if (totalScores >= 39 && totalScores <= 44)
                {
                    rating.OverallRatingColor = MetricsColorEnum.Success.ToString();
                    rating.OverallRatingStars = Constants.SSSettings.four_stars;
                }
                if (totalScores >= 33 && totalScores <= 38)
                {
                    rating.OverallRatingColor = MetricsColorEnum.Success.ToString();
                    rating.OverallRatingStars = Constants.SSSettings.three_stars;
                }

                // Orange Rating
                if (totalScores >= 27 && totalScores <= 32)
                {
                    rating.OverallRatingColor = MetricsColorEnum.Warning.ToString();
                    rating.OverallRatingStars = Constants.SSSettings.two_stars;
                }
                if (totalScores >= 13 && totalScores <= 26)
                {
                    rating.OverallRatingColor = MetricsColorEnum.Warning.ToString();
                    rating.OverallRatingStars = Constants.SSSettings.one_star;
                }
                if (
                    (step16_q3 != null && step16_q3.QuestionAnswer == Constants.SSSettings.answer_no) ||
                    (step16_q4 != null && step16_q4.QuestionAnswer == Constants.SSSettings.answer_yes) ||
                    (step16_q5 != null && step16_q5.QuestionAnswer == Constants.SSSettings.answer_no)
                    )
                {
                    rating.OverallRatingColor = MetricsColorEnum.Warning.ToString();
                    rating.OverallRatingStars = Constants.SSSettings.one_star;
                }

                // Red Rating
                if (totalScores < 13 || (step16_q1 != null && step16_q1.QuestionAnswer == Constants.SSSettings.answer_yes))
                {
                    rating.OverallRatingColor = MetricsColorEnum.Error.ToString();
                    rating.OverallRatingStars = Constants.SSSettings.zero_stars;
                }
            }

            // Save or update the rating
            if (isNewRating)
            {
                _pqaRatingRepo.Insert(rating);
            }
            else
            {
                _pqaRatingRepo.Update(rating);
            }

            if (RAVisit.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1)
            {
                RAVisit.Rating = rating.OverallRatingColor;
                _visitRepo.Update(RAVisit);
            }

            return rating;
        }
        
        private int GetScoreForSection(List<VisitData> records)
        {
            int score = 0;
            foreach (VisitData record in records)
            {
                if (record.QuestionAnswer.StartsWith("1 -"))
                {
                    score++;
                } 
                else if (record.QuestionAnswer.StartsWith("2 -"))
                {
                    score += 2;
                }

                if (record.VisitSection == Constants.SSSettings.step3_section)
                {
                    if (record.QuestionAnswer != "None")
                    {
                        var arrItems = record.QuestionAnswer.Split(",");
                        if (arrItems.Length == 3)
                        {
                            score++;
                        } else if (arrItems.Length > 7)
                        {
                            score += 2;
                        }
                    }
                }
            }

            return score;
        }
       
        private int GetCheckBoxScore(List<VisitData> records)
        {
            int score = 0;

            foreach (VisitData record in records)
            {
                if (record.VisitSection == Constants.SSSettings.step_8_section)
                {
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a1) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a2) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a3) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a4) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a5) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a6) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a7) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a8) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a9) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a10) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a11) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step8_re_accreditation_a12) != -1) { score++; }
                } else if (record.VisitSection == Constants.SSSettings.step_11_section)
                {
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_11_re_accreditation_a1) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_11_re_accreditation_a2) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_11_re_accreditation_a3) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_11_re_accreditation_a4) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_11_re_accreditation_a5) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_11_re_accreditation_a6) != -1) { score++; }
                }
                else if (record.VisitSection == Constants.SSSettings.step_12_section)
                {
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_12_re_accreditation_a1) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_12_re_accreditation_a2) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_12_re_accreditation_a3) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_12_re_accreditation_a4) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_12_re_accreditation_a5) != -1) { score++; }
                    if (record.QuestionAnswer.IndexOf(Constants.SSSettings.step_12_re_accreditation_a6) != -1) { score++; }
                }
            }

            return score;
        }
        public string GetSectionRatingColor(double finalScore)
        {
            string color = "";

            if (finalScore < 28)
            {
                color = MetricsColorEnum.Error.ToString();
            }
            else if (finalScore >= 28 && finalScore <= 74)
            {
                color = MetricsColorEnum.Warning.ToString();
            }
            else if (finalScore > 74)
            {
                color = MetricsColorEnum.Success.ToString();
            }

            return color;
        }
        private bool ValidateInsertRecord(VisitData visitData)
        {
            VisitData record = _visitDataRepo.GetAll().Where(x => x.VisitId == visitData.VisitId && 
                                                                  x.VisitName == visitData.VisitName &&
                                                                  x.VisitSection == visitData.VisitSection &&
                                                                  x.Question == visitData.Question &&
                                                                  x.QuestionAnswer == visitData.QuestionAnswer).FirstOrDefault();
            if (record == null)
            {
                return true;
            }
            
            return false;
        }

        private VisitData ValidateInsertRecordWithoutAnswer(VisitData visitData)
        {
            VisitData record = _visitDataRepo.GetAll().Where(x => x.VisitId == visitData.VisitId &&
                                                                  x.VisitName == visitData.VisitName &&
                                                                  x.VisitSection == visitData.VisitSection &&
                                                                  x.Question == visitData.Question).FirstOrDefault();
            return record;
        }
        public List<PractitionerNotes> GetVisitNotesForPractitioner(string userId)
        {
            List<PractitionerNotes> vData = new List<PractitionerNotes>();
            List<VisitType> types = new List<VisitType>();

            // visits
            types =  (
                from visit in _visitRepo.GetAll().Where(x => x.Practitioner.UserId.ToString() == userId).OrderBy(x => x.PlannedVisitDate)
                join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.SSSettings.client_practitioner) && 
                                                                y.Name == Constants.SSSettings.visitType_practitioner_call && 
                                                                y.Name == Constants.SSSettings.visitType_practitioner_visit &&
                                                                y.Name == Constants.SSSettings.visitType_pre_pqa_visit_1 &&
                                                                y.Name == Constants.SSSettings.visitType_pre_pqa_visit_2) 
                on visit.VisitTypeId equals visitType.Id
                select visitType
            ).Distinct().OrderBy(z => z.Order).ToList();

            foreach (VisitType item in types)
            {
                var _note = new PractitionerNotes();
                _note.VisitName = item.Description;
                
                var _visit = _visitRepo.GetAll().Where(x => x.Practitioner.UserId.ToString() == userId && x.VisitTypeId == item.Id).FirstOrDefault();
                _note.ActualVisitDate = _visit.ActualVisitDate;
                _note.PlannedVisitDate = _visit.PlannedVisitDate;

                if (item.Name == Constants.SSSettings.visitType_pre_pqa_visit_1 && item.Name == Constants.SSSettings.visitType_pre_pqa_visit_2)
                {
                    _note.Answers = (from visit in _visitRepo.GetAll().Where(x => x.Practitioner.UserId.ToString() == userId && x.VisitTypeId == item.Id).OrderBy(x => x.PlannedVisitDate)
                                     join visitData in _visitDataRepo.GetAll().Where(y => y.VisitSection == Constants.SSSettings.section_discussion && 
                                                                                          y.Question == Constants.SSSettings.question_next_steps_step4) on visit.Id equals visitData.VisitId
                                     select visitData).ToList();
                } else
                {
                    _note.Answers = (from visit in _visitRepo.GetAll().Where(x => x.Practitioner.UserId.ToString() == userId && x.VisitTypeId == item.Id).OrderBy(x => x.PlannedVisitDate)
                                     join visitData in _visitDataRepo.GetAll().Where(y => y.Question == Constants.SSSettings.question_next_steps) on visit.Id equals visitData.VisitId
                                     select visitData).ToList();
                }

                vData.Add(_note);
            }

            return vData;
        }
    }
}

