using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
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
    public class VisitBackReferralManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private HierarchyEngine _hierarchyEngine;

        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitData, Guid> _visitDataRepo;
        private IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;
        private IGenericRepository<VisitBackReferral, Guid> _visitBackReferralRepo;

        private Guid _applicationUserId;

        public VisitBackReferralManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;

            _applicationUserId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);
            _visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            _visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            _visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);
            _visitBackReferralRepo = _repoFactory.CreateGenericRepository<VisitBackReferral>(userContext: _applicationUserId);
        }

        public VisitBackReferral AddVisitBackReferral(VisitBackReferralModel input)
        {
            var referral = GetVisitBackReferralFromInputModel(input, _applicationUserId.ToString());

            // update the status record
            var entityToUpdate = _visitDataStatusRepo.GetById(Guid.Parse(input.VisitDataStatusId));
            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId.ToString();
            entityToUpdate.BackReferralCompleted = true;
            entityToUpdate.BackReferralDateCompleted = DateTime.Now;
            _visitDataStatusRepo.Update(entityToUpdate);

            return _visitBackReferralRepo.Insert(referral);
        }

        private VisitBackReferral GetVisitBackReferralFromInputModel(VisitBackReferralModel input, string applicationUserId)
        {
            if (input == null)
            {
                return null;
            }

            return new VisitBackReferral()
            {
                Id = Guid.NewGuid(),
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToString(),
                Question = input.Question,
                Answer = input.Answer,
                Comment = input.Comment,
                VisitDataStatusId = new Guid(input.VisitDataStatusId)
            };
        }

        public List<VisitBackReferral> GetBackReferralDataForClient(string id, string clientType, bool referralCompleted, bool backReferralCompleted) 
        {
            // This data is for the past 6 months
            List<VisitBackReferral> allReferrals = new List<VisitBackReferral>();
            DateTime today = DateTime.Today;
            var sixMonthsBack = today.AddMonths(-6);

            if (clientType == Constants.GGSettings.client_mother) {
                allReferrals = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.PlannedVisitDate >= sixMonthsBack).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == referralCompleted && x.BackReferralCompleted == backReferralCompleted && x.Type == Constants.GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                    join visitBackReferralData in _visitBackReferralRepo.GetAll() on visitStatusData.Id equals visitBackReferralData.VisitDataStatusId
                    select visitBackReferralData
                ).ToList();
            }
            else {
                allReferrals = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id && x.PlannedVisitDate >= sixMonthsBack).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == referralCompleted && x.BackReferralCompleted == backReferralCompleted && x.Type == Constants.GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                    join visitBackReferralData in _visitBackReferralRepo.GetAll() on visitStatusData.Id equals visitBackReferralData.VisitDataStatusId
                    select visitBackReferralData
                ).ToList();
            }

            return allReferrals;
        }

        public VisitBackReferral GetBackReferralDataForId(Guid VisitDataStatusId)
        {
            // This data is for the past 6 months
            DateTime today = DateTime.Today;
            var sixMonthsBack = today.AddMonths(-6);

            return (
                from visitBackReferralData in _visitBackReferralRepo.GetAll().Where(x => x.VisitDataStatusId == VisitDataStatusId)
                join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.InsertedDate >= sixMonthsBack) on visitBackReferralData.VisitDataStatusId equals visitStatusData.Id
                select visitBackReferralData
            ).FirstOrDefault();

        }



    }
}

