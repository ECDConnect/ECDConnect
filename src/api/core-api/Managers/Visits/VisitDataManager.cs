using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Integration;
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
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitData, Guid> _visitDataRepo;

        private string _applicationUserId;

        public VisitDataManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitDataStatusManager visitDataStatusManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _visitDataStatusManager = visitDataStatusManager;

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
                    _visitDataRepo.Insert(visitData);
                }
            }

            // update the visit record to show attended/completed
            var entityToUpdate = _visitRepo.GetById(Guid.Parse(input.VisitId));
            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId;
            entityToUpdate.Attended = true;
            entityToUpdate.ActualVisitDate = DateTime.Now;
            _visitRepo.Update(entityToUpdate);

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
                    _visitDataRepo.Insert(visitData);
                }
            }

            // update the visit record to show attended/completed
            var entityToUpdate = _visitRepo.GetById(Guid.Parse(input.VisitId));
            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId;
            entityToUpdate.Attended = true;
            _visitRepo.Update(entityToUpdate);

            // then handle status data
            _visitDataStatusManager.ManageVisitDataStatus(input.MotherId, Constants.GGSettings.client_mother, input.VisitId);
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
                from visit in _visitRepo.GetAll().Where(x => x.Id.ToString() == visitId && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                select visitData
            ).Select(y => y.VisitName).Distinct().ToList();

            return vData;
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
    }
}

