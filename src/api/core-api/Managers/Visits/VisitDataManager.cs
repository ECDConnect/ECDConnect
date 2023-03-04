using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Visits {
    public class VisitDataManager
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
            // first add all your questions and answers
            foreach (CMSVisitSection section in input.VisitData.Sections)
            {
                foreach (CMSQuestion question in section.Questions) {
                    VisitData visitData = (VisitData)GetVisitDataFromInputModel(question, input.VisitId, input.VisitData.VisitName, section.VisitSection);
                    _visitDataRepo.Insert(visitData);
                }
            }

            // update the visit record to show attended/completed
            var entityToUpdate = _visitRepo.GetAll().Where(x => x.Id.ToString() == input.VisitId).FirstOrDefault();
            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId;
            entityToUpdate.Attended = true;
            _visitRepo.Update(entityToUpdate);

            // then handle status data
            _visitDataStatusManager.ManageVisitDataStatus(input.InfantId, Constants.GGSettings.client_child, input.VisitId);

            return true;
        }
        public Boolean AddAntenatalVisitData(CMSVisitDataInputModel input)
        {
            // first add all your questions and answers
            foreach (CMSVisitSection section in input.VisitData.Sections) {
                foreach (CMSQuestion question in section.Questions) {
                    VisitData visitData = (VisitData)GetVisitDataFromInputModel(question, input.VisitId, input.VisitData.VisitName, section.VisitSection);
                    _visitDataRepo.Insert(visitData);
                }
            }

            // update the visit record to show attended/completed
            var entityToUpdate = _visitRepo.GetAll().Where(x => x.Id.ToString() == input.VisitId).FirstOrDefault();
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

        public List<string> GetCompletedVisitsForClient(string id, string type) {

            List<string> vData = new List<string>();
            if (type == Constants.GGSettings.client_mother) {
                vData = (
                from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                select visitData
            ).Select(y => y.VisitName).Distinct().ToList();
            } else {
                vData = (
                from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                select visitData
            ).Select(y => y.VisitName).Distinct().ToList();
            }

            return vData;
        }

        public List<VisitData> GetGrowthDataForInfant(string id) {

              List<VisitData> vData = new List<VisitData>();
              vData = (
                  from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id).OrderBy(x => x.PlannedVisitDate)
                  join visitData in _visitDataRepo.GetAll().Where(y => y.Question == Constants.GGSettings.q_weight || 
                                                                       y.Question == Constants.GGSettings.q_length || 
                                                                       y.Question == Constants.GGSettings.q_muac) on visit.Id equals visitData.VisitId
                  select visitData
              ).ToList();

              return vData;
          }
    }
}

