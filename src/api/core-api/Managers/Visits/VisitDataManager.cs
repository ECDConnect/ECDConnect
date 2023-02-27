using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Visits
{
    public class VisitDataManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private VisitDataStatusManager _visitDataStatusManager;
        private string _applicationUserId;

        public VisitDataManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitDataStatusManager visitDataStatusManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;

            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            _visitDataStatusManager = visitDataStatusManager;
        }

        public Boolean AddChildVisitData(CMSVisitDataInputModel input)
        {
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);

            // first add all your questions and answers
            foreach (CMSQuestion obj in input.Questions)
            {
                VisitData visitData = (VisitData)GetVisitDataFromInputModel(obj, input.VisitId, input.VisitName, input.VisitSection);
                visitDataRepo.Insert(visitData);
            }

            // update the visit record to show attended/completed
            var entityToUpdate = visitRepo.GetAll().Where(x => x.Id.ToString() == input.VisitId).FirstOrDefault();
            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId;
            entityToUpdate.Attended = true;
            visitRepo.Update(entityToUpdate);

            // then handle status data
            _visitDataStatusManager.ManageVisitDataStatus(input.InfantId, Constants.GGSettings.client_child, input.VisitId);

            return true;
        }
        public Boolean AddAntenatalVisitData(CMSVisitDataInputModel input)
        {
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);

            // first add all your questions and answers
            foreach (CMSQuestion obj in input.Questions)
            {
                VisitData visitData = (VisitData)GetVisitDataFromInputModel(obj, input.VisitId, input.VisitName, input.VisitSection);
                visitDataRepo.Insert(visitData);
            }

            // update the visit record to show attended/completed
            var entityToUpdate = visitRepo.GetAll().Where(x => x.Id.ToString() == input.VisitId).FirstOrDefault();
            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId;
            entityToUpdate.Attended = true;
            visitRepo.Update(entityToUpdate);

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
            var uId = _contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: uId);

            List<VisitData> vData = new List<VisitData>();
            vData = (
                from visit in visitRepo.GetAll().Where(x => x.Id.ToString() == visitId).OrderBy(x => x.PlannedVisitDate)
                join visitData in visitDataRepo.GetAll().Where(y => y.VisitName == visitName && y.VisitSection == visitSection) on visit.Id equals visitData.VisitId
                select visitData
            ).ToList();

            return vData;
        }
        public List<string> GetCompletedVisitsForClient(string id, string type) {
            var uId = _contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: uId);

            List<string> vData = new List<string>();
            if (type == Constants.GGSettings.client_mother) {
                vData = (
                from visit in visitRepo.GetAll().Where(x => x.Mother.UserId == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                select visitData
            ).Select(y => y.VisitName).Distinct().ToList();
            } else {
                vData = (
                from visit in visitRepo.GetAll().Where(x => x.Infant.UserId == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                select visitData
            ).Select(y => y.VisitName).Distinct().ToList();
            }

            return vData;
        }

        public List<VisitData> GetAllWeightsAndLengths(string id) {
            var uId = _contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: uId);

            List<VisitData> vData = new List<VisitData>();
            vData = (
                from visit in visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id).OrderBy(x => x.PlannedVisitDate)
                join visitData in visitDataRepo.GetAll().Where(y => y.Question == Constants.GGSettings.q_weight && y.Question == Constants.GGSettings.q_length) on visit.Id equals visitData.VisitId
                select visitData
            ).ToList();

            return vData;
        }
    }
}

