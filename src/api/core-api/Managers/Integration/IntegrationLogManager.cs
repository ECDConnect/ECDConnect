using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Managers.Integration
{
    public class IntegrationLogManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private string _uId;
        private IGenericRepository<IntegrationLog, Guid> _logRepo;
        public Guid tenantId = TenantExecutionContext.Tenant.Id;

        public IntegrationLogManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
        }

        #region Logging

        public async Task<bool> IntegrationLog(string log, string logNotes = null, string relatedId = null, LogRelatedType logRelatedType = LogRelatedType.Error, string relatedArea = "IntegrationService")
        {
            logNotes = logRelatedType == LogRelatedType.Error ? "Error In: " + relatedArea : "";
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

