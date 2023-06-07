using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Tenancy.Context;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Managers.Integration
{
    public class IntegrationLogManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repositoryFactory;
        private string _uId;
        private IGenericRepository<IntegrationLog, Guid> _logRepo;
        public Guid tenantId = TenantExecutionContext.Tenant.Id;

        public IntegrationLogManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _logRepo = _repositoryFactory.CreateGenericRepository<IntegrationLog>(userContext: _uId);
        }

        #region Logging

        public async Task<bool> IntegrationLog(string log, string logNotes = null, string relatedId = null, LogRelatedType logRelatedType = LogRelatedType.Error, string relatedArea = "IntegrationService")
        {
            logNotes = logRelatedType == LogRelatedType.Error ? "Error In: " + relatedArea + " " + logNotes: "";
            _logRepo.Insert(new IntegrationLog()
            {
                IsActive = true,
                InsertedDate = DateTime.Now,
                UserId = _uId,
                TenantId = tenantId,
                RelatedId = relatedId,
                RelatedType = logRelatedType,
                LogNotes = logNotes,
                LogResult = log
            });

            return true;
        }

        #endregion

    }
}

