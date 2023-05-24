using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Integration;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Visits;
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
        private VisitDataStatusManager _visitDataStatusManager;
        private VisitDataStatusManager_Practitioner _visitDataStatusManager_practitioner;
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitData, Guid> _visitDataRepo;

        private string _applicationUserId;

        public VisitDataManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitDataStatusManager visitDataStatusManager,
            VisitDataStatusManager_Practitioner visitDataStatusManager_Practitioner)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _visitDataStatusManager = visitDataStatusManager;
            _visitDataStatusManager_practitioner = visitDataStatusManager_Practitioner;

            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            _visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            _visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
        }

        public Boolean AddChildVisitData(CMSVisitDataInputModel input)
        {

            if (input.VisitData.Sections == null)
            {
                var _section = new CMSVisitSection();
                _section.VisitSection = "";
                if (input.VisitData.VisitName == Constants.GGSettings.pillar3_db)
                {
                    _section.VisitSection = Constants.GGSettings.pillar3_section;
                }
                _section.Questions = new List<CMSQuestion>();
                var _question = new CMSQuestion();
                _question.Question = "";
                _question.Answer = "";
                _section.Questions.Add(_question);
                input.VisitData.Sections = new CMSVisitSection[] { _section };
            }


            // first add all your questions and answers
            foreach (CMSVisitSection section in input.VisitData.Sections) {
                foreach (CMSQuestion question in section.Questions) {
                    VisitData visitData = (VisitData)GetVisitDataFromInputModel(question, input.VisitId, input.VisitData.VisitName, section.VisitSection);
                    if (ValidateInsertRecord(visitData))
                    {
                        _visitDataRepo.Insert(visitData);
                    }
                }
            }

            // update the visit record to show attended/completed when all 7 questionnaires are completed
            int count = _visitDataRepo.GetAll().Where(x => x.VisitId == Guid.Parse(input.VisitId) && x.VisitName == Constants.GGSettings.visit_follow_up).Select(y => y.VisitName).Distinct().Count();
            if (count != 0)
            {
                var entityToUpdate = _visitRepo.GetById(Guid.Parse(input.VisitId));
                entityToUpdate.UpdatedDate = DateTime.Now;
                entityToUpdate.UpdatedBy = _applicationUserId;
                entityToUpdate.Attended = true;
                entityToUpdate.ActualVisitDate = DateTime.Now;
                _visitRepo.Update(entityToUpdate);
            }

            // then handle status data
            _visitDataStatusManager.ManageVisitDataStatus(input.InfantId, Constants.GGSettings.client_child, input.VisitId);

            return true;
        }
        public Boolean AddAntenatalVisitData(CMSVisitDataInputModel input)
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
            foreach (CMSVisitSection section in input.VisitData.Sections) {
                foreach (CMSQuestion question in section.Questions) {
                    VisitData visitData = (VisitData)GetVisitDataFromInputModel(question, input.VisitId, input.VisitData.VisitName, section.VisitSection);
                    if (ValidateInsertRecord(visitData))
                    {
                        _visitDataRepo.Insert(visitData);
                    }
                }
            }

            // update the visit record to show attended/completed when all 5 questionnaires are completed
            int count = _visitDataRepo.GetAll().Where(x => x.VisitId == Guid.Parse(input.VisitId) && x.VisitName == Constants.GGSettings.visit_follow_up).Select(y => y.VisitName).Distinct().Count();
            if (count != 0)
            {
                var entityToUpdate = _visitRepo.GetById(Guid.Parse(input.VisitId));
                entityToUpdate.UpdatedDate = DateTime.Now;
                entityToUpdate.UpdatedBy = _applicationUserId;
                entityToUpdate.Attended = true;
                entityToUpdate.ActualVisitDate = DateTime.Now;
                _visitRepo.Update(entityToUpdate);
            }

            // then handle status data
            _visitDataStatusManager.ManageVisitDataStatus(input.MotherId, Constants.GGSettings.client_mother, input.VisitId);
            return true;
        }
        public Boolean AddPractitionerVisitData(CMSVisitDataInputModel input, bool markVisitAsCompleted)
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
                    if (ValidateInsertRecord(visitData))
                    {
                        _visitDataRepo.Insert(visitData);
                    }
                }
            }

            if (markVisitAsCompleted)
            {
                // update the visit record to show attended/completed 
                var entityToUpdate = _visitRepo.GetById(Guid.Parse(input.VisitId));
                entityToUpdate.UpdatedDate = DateTime.Now;
                entityToUpdate.UpdatedBy = _applicationUserId;
                entityToUpdate.Attended = true;
                entityToUpdate.ActualVisitDate = DateTime.Now;
                _visitRepo.Update(entityToUpdate);
            }

            // then handle status data
            if (input.VisitData.VisitName == Constants.SSSettings.pqa_visit)
            {
                _visitDataStatusManager_practitioner.ManageVisitDataStatus(input.PractitionerId, input.VisitId);
            }
            return true;
        }

        private VisitData GetVisitDataFromInputModel(CMSQuestion input, String visitId, String visitName, String visitSection)
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
                UpdatedBy = _applicationUserId,
                VisitId = new Guid(visitId),
                VisitName = visitName,
                VisitSection = visitSection,
                Question = input.Question,
                QuestionAnswer = input.Answer
            };
        }
        public List<VisitData> GetVisitAnswersForClient(string visitId, string visitName, string visitSection) {

            List<VisitData> vData = new List<VisitData>();
            vData = (
                from visit in _visitRepo.GetAll().Where(x => x.Id.ToString() == visitId).OrderBy(x => x.PlannedVisitDate)
                join visitData in _visitDataRepo.GetAll().Where(y => y.VisitName == visitName && y.VisitSection == visitSection) on visit.Id equals visitData.VisitId
                select visitData
            ).ToList();

            return vData;
        }
        public List<string> GetCompletedVisitsForVisitId(string visitId) {

            List<string> vData = new List<string>();
                vData = (
                from visit in _visitRepo.GetAll().Where(x => x.Id.ToString() == visitId).OrderBy(x => x.PlannedVisitDate)
                join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                select visitData
            ).Select(y => y.VisitName).Distinct().ToList();

            return vData;
        }
        public List<VisitData> GetVisitDataForVisitId(string visitId)
        {
            return (
                from visit in _visitRepo.GetAll().Where(x => x.Id.ToString() == visitId).OrderBy(x => x.PlannedVisitDate)
                join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                select visitData
            ).ToList();
        }
        public List<VisitData> GetGrowthDataForInfant(string id) {

              List<VisitData> vData = new List<VisitData>();
              vData = (
                  from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId == id).OrderBy(x => x.PlannedVisitDate)
                  join visitData in _visitDataRepo.GetAll().Where(y => y.Question == Constants.GGSettings.q_weight || 
                                                                       y.Question == Constants.GGSettings.q_length || 
                                                                       y.Question == Constants.GGSettings.q_muac) on visit.Id equals visitData.VisitId
                  select visitData
              ).ToList();

              return vData;
        }
        public int GetTotalGrowthInfantsForWeek(string id, Boolean currentWeek)
        {
            //- the number of children for which either a weight. length. and/or MUAC measure was taken
            DateTime today = DateTime.Today;
            var monday = StartOfWeek(today, DayOfWeek.Monday);
            var next7Days = monday.AddDays(6);

            if (!currentWeek)
            {
                int days = DateTime.Now.DayOfWeek - DayOfWeek.Sunday;
                DateTime pastDate = DateTime.Now.AddDays(-days);
                monday = StartOfWeek(pastDate, DayOfWeek.Monday);
                next7Days = monday.AddDays(6);
            }

            return (
                from visit in _visitRepo.GetAll().Where(x => x.Infant.Caregiver.HealthCareWorker.Id.ToString() == id && x.ActualVisitDate >= monday && x.ActualVisitDate <= next7Days)
                join visitData in _visitDataRepo.GetAll().Where(y => y.Question == Constants.GGSettings.q_weight || y.Question == Constants.GGSettings.q_length || y.Question == Constants.GGSettings.q_muac) on visit.Id equals visitData.VisitId
                select visit.InfantId
            ).Distinct().Count();

        }
        public string GetIDDocCSGStatusForInfant(string id)
        {
            var status = "";

            List<VisitData> vData = (
                from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                join visitData in _visitDataRepo.GetAll().Where(y => y.Question == Constants.GGSettings.q_birth_certificate || y.Question == Constants.GGSettings.q_csg_receiving)
                                                        .OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                select visitData
            ).ToList();

            if (vData.Count != 0)
            {
                var birth = vData.Where(x => x.Question == Constants.GGSettings.q_birth_certificate).OrderBy(x => x.Id).FirstOrDefault();
                var csg = vData.Where(x => x.Question == Constants.GGSettings.q_csg_receiving).OrderBy(x => x.Id).FirstOrDefault();

                if (birth?.QuestionAnswer == "false")
                {
                    status = "No birth certificate";
                }

                if (csg?.QuestionAnswer == "false")
                {
                    if (status == "")
                    {
                        status = "No CSG";
                    } else
                    {
                        status = status + "/No CSG";
                    }
                }
            }
            return status;
        }
        public string GetCSGStatusForInfant(string id)
        {
            var status = "";

            VisitData vData = (
                from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                join visitData in _visitDataRepo.GetAll().Where(y => y.Question == Constants.GGSettings.q_csg_applied && y.QuestionAnswer == "false")
                                                        .OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                select visitData
            ).FirstOrDefault();

            if (vData != null)
            {
                status = "Not applied for CSG";
            }
            return status;
        }
        public PQARating GetPractitionerPQARating(string userId)
        {
            int totalSections = Constants.SSSettings.step2_total + Constants.SSSettings.step3_total + Constants.SSSettings.step4_total + Constants.SSSettings.step5_total +
                                Constants.SSSettings.step6_total + Constants.SSSettings.step7_total + Constants.SSSettings.step8_total;
            var totalScores = 0;

            List<VisitData> vData = (
                from visit in _visitRepo.GetAll().Where(x => x.Practitioner.User.Id == userId && x.VisitType.Name == Constants.SSSettings.ss_smart_space_license)
                join visitData in _visitDataRepo.GetAll().Where(y => y.VisitName == Constants.SSSettings.pqa_visit && (
                                                                y.VisitSection == Constants.SSSettings.step2 ||
                                                                y.VisitSection == Constants.SSSettings.step3 ||
                                                                y.VisitSection == Constants.SSSettings.step4 ||
                                                                y.VisitSection == Constants.SSSettings.step5 ||
                                                                y.VisitSection == Constants.SSSettings.step6 ||
                                                                y.VisitSection == Constants.SSSettings.step7 ||
                                                                y.VisitSection == Constants.SSSettings.step8
                                                                )) on visit.Id equals visitData.VisitId
                select visitData
            ).ToList();

            List<VisitData> step2 = vData.Where(x => x.VisitSection == Constants.SSSettings.step2).ToList();
            List<VisitData> step3 = vData.Where(x => x.VisitSection == Constants.SSSettings.step3 && x.Question == Constants.SSSettings.step3_q1).ToList();
            List<VisitData> step4 = vData.Where(x => x.VisitSection == Constants.SSSettings.step4 && x.Question != Constants.SSSettings.step3_q1).ToList();
            List<VisitData> step5 = vData.Where(x => x.VisitSection == Constants.SSSettings.step5).ToList();
            List<VisitData> step6 = vData.Where(x => x.VisitSection == Constants.SSSettings.step6).ToList();
            List<VisitData> step7 = vData.Where(x => x.VisitSection == Constants.SSSettings.step7).ToList();
            List<VisitData> step8 = vData.Where(x => x.VisitSection == Constants.SSSettings.step8).ToList();


            var rating = new PQARating();
            rating.VisitName = step2.GetItemByIndex(0).VisitName;
            rating.PlannedDate = step2.GetItemByIndex(0).Visit.PlannedVisitDate;

            var child = new PQARatingChild();
            child.VisitSection = step2.GetItemByIndex(0).VisitSection;
            child.SectionScore = getScoreForSection(step2);
            child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step2_total;
            child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor((child.SectionScore / Constants.SSSettings.step2_total) * 100);
            rating.Children.Add(child);
            totalScores = totalScores + child.SectionScore;

            child = new PQARatingChild();
            child.VisitSection = step3.GetItemByIndex(0).VisitSection;
            child.SectionScore = getScoreForSection(step3);
            child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step3_total;
            child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStep3RatingColor(child.SectionScore);
            rating.Children.Add(child);
            totalScores = totalScores + child.SectionScore;

            child = new PQARatingChild();
            child.VisitSection = step4.GetItemByIndex(0).VisitSection;
            child.SectionScore = getScoreForSection(step4);
            child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step4_total;
            child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor((child.SectionScore / Constants.SSSettings.step4_total) * 100);
            rating.Children.Add(child);
            totalScores = totalScores + child.SectionScore;

            child = new PQARatingChild();
            child.VisitSection = step5.GetItemByIndex(0).VisitSection;
            child.SectionScore = getScoreForSection(step5);
            child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step5_total;
            child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor((child.SectionScore / Constants.SSSettings.step5_total) * 100);
            rating.Children.Add(child);
            totalScores = totalScores + child.SectionScore;

            child = new PQARatingChild();
            child.VisitSection = step6.GetItemByIndex(0).VisitSection;
            child.SectionScore = getScoreForSection(step6);
            child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step6_total;
            child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor((child.SectionScore / Constants.SSSettings.step6_total) * 100);
            rating.Children.Add(child);
            totalScores = totalScores + child.SectionScore;

            child = new PQARatingChild();
            child.VisitSection = step7.GetItemByIndex(0).VisitSection;
            child.SectionScore = getScoreForSection(step7);
            child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step7_total;
            child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor((child.SectionScore / Constants.SSSettings.step7_total) * 100);
            rating.Children.Add(child);
            totalScores = totalScores + child.SectionScore;

            child = new PQARatingChild();
            child.VisitSection = step8.GetItemByIndex(0).VisitSection;
            child.SectionScore = getScoreForSection(step8);
            child.SectionRating = child.SectionScore + "/" + Constants.SSSettings.step8_total;
            child.SectionRatingColor = _visitDataStatusManager_practitioner.GetStepRatingColor((child.SectionScore / Constants.SSSettings.step8_total) * 100);
            rating.Children.Add(child);
            totalScores = totalScores + child.SectionScore;


            // overall rating calc
            rating.OverallScore = totalScores;
            rating.OverallRating = totalScores + "/" + totalSections;


            VisitData step14_q1 = (
                from visit in _visitRepo.GetAll().Where(x => x.Practitioner.User.Id == userId && x.VisitType.Name == Constants.SSSettings.ss_smart_space_license)
                join visitData in _visitDataRepo.GetAll().Where(y => y.VisitName == Constants.SSSettings.pqa_visit && y.Question == Constants.SSSettings.step14_q1) on visit.Id equals visitData.VisitId
                select visitData
            ).FirstOrDefault();

            VisitData step16_q1 = (
                from visit in _visitRepo.GetAll().Where(x => x.Practitioner.User.Id == userId && x.VisitType.Name == Constants.SSSettings.ss_smart_space_license)
                join visitData in _visitDataRepo.GetAll().Where(y => y.VisitName == Constants.SSSettings.pqa_visit && y.Question == Constants.SSSettings.step16_q1) on visit.Id equals visitData.VisitId
                select visitData
            ).FirstOrDefault();

            VisitData step16_q3 = (
                from visit in _visitRepo.GetAll().Where(x => x.Practitioner.User.Id == userId && x.VisitType.Name == Constants.SSSettings.ss_smart_space_license)
                join visitData in _visitDataRepo.GetAll().Where(y => y.VisitName == Constants.SSSettings.pqa_visit && y.Question == Constants.SSSettings.step16_q3) on visit.Id equals visitData.VisitId
                select visitData
            ).FirstOrDefault();

            VisitData step16_q4 = (
                from visit in _visitRepo.GetAll().Where(x => x.Practitioner.User.Id == userId && x.VisitType.Name == Constants.SSSettings.ss_smart_space_license)
                join visitData in _visitDataRepo.GetAll().Where(y => y.VisitName == Constants.SSSettings.pqa_visit && y.Question == Constants.SSSettings.step16_q4) on visit.Id equals visitData.VisitId
                select visitData
            ).FirstOrDefault();

            VisitData step11_q1 = (
                from visit in _visitRepo.GetAll().Where(x => x.Practitioner.User.Id == userId && x.VisitType.Name == Constants.SSSettings.ss_smart_space_license)
                join visitData in _visitDataRepo.GetAll().Where(y => y.VisitName == Constants.SSSettings.pqa_visit && y.Question == Constants.SSSettings.step11_q1) on visit.Id equals visitData.VisitId
                select visitData
            ).FirstOrDefault();

            // Green Rating
            // "Scenario: practitioner received a score over 42 AND
            // user either did not do the smartspace check (ie responded ""No"" in use case 15) OR
            // re-issued the SmartSpace licence (ie the use case 18 scenario);

            if (rating.OverallScore > 42 || step11_q1.QuestionAnswer == Constants.GGSettings.answer_no || step14_q1.QuestionAnswer == Constants.GGSettings.answer_yes)
            {
                rating.OverallRatingColor = MetricsColorEnum.Success.ToString();
            }

            // Orange Rating
            // "To get an orange rating, at least one of the following must be true:
            // 1.overall score is greater than or equal to 18 and less than or equal to 42 out of 68
            // 2. if user selected ""No"" to the second question in use case 21(ie, ""Is the SmartStart programme being implemented for long enough?""
            // 3. if user selected ""Yes"" to the third question in use case 21(ie, ""Are there too many children attending the SmartStart programme ? "")
            if (rating.OverallScore >= 18 && rating.OverallScore <= 42 || step16_q3.QuestionAnswer == Constants.GGSettings.answer_no || step16_q4.QuestionAnswer == Constants.GGSettings.answer_yes)
            {
                rating.OverallRatingColor = MetricsColorEnum.Warning.ToString();
            }

            // Red Rating
            // "To get a red rating, at least one of the following must be true:
            // 1. if the overall PQA score is less than 18 out of 68
            // 2. if the score for step 5 of the PQA(ie, section 3, use case 9) was less than 5
            // 3. if the user did NOT re-issue the SmartSpace license(use case 16)
            // (4.note that if the user selected ""Yes"" to the first question in use case 21, then the scenario in use case 23 applies - please see use case 23 above for that red rating case, not covered here) 
            if (rating.OverallScore < 18 || rating.Children.GetItemByIndex(4).SectionScore < 5 || step14_q1.QuestionAnswer == Constants.GGSettings.answer_no || step16_q1.QuestionAnswer == Constants.GGSettings.answer_yes)
            {
                rating.OverallRatingColor = MetricsColorEnum.Error.ToString();
            }

            return rating;
        }

        private int getScoreForSection(List<VisitData> records)
        {
            int score = 0;
            foreach (VisitData record in records)
            {
                score = score + Int32.Parse(record.QuestionAnswer);
            }

            return score;
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
    }
}

