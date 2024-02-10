using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Tenancy.Context;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Managers.Integration;

    public class IntegrationLogManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repositoryFactory;
        private string _uId;
        private IGenericRepository<IntegrationLog, Guid> _logRepo;
        private IGenericRepository<IntegrationEntityMapping, Guid> _mapperRepo;
        private IGenericRepository<IntegrationAudit, Guid> _auditRepo;

        public Guid tenantId = TenantExecutionContext.Tenant.Id;

        public IntegrationLogManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _logRepo = _repositoryFactory.CreateGenericRepository<IntegrationLog>(userContext: _uId);
            _mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
            _auditRepo = _repositoryFactory.CreateGenericRepository<IntegrationAudit>(userContext: _uId);
        }

        #region Logging

        public async Task<bool> IntegrationLog(string log, string logNotes = null, string relatedId = null, LogRelatedType logRelatedType = LogRelatedType.Error, string relatedArea = "IntegrationService")
        {
            logNotes = logRelatedType == LogRelatedType.Error ? "Error In: " + relatedArea + " " + logNotes: logNotes;
            _logRepo.Insert(new IntegrationLog()
            {
                IsActive = true,
                InsertedDate = DateTime.Now,
                UserId = Guid.Parse(_uId),
                TenantId = tenantId,
                RelatedId = relatedId,
                RelatedType = logRelatedType,
                LogNotes = logNotes,
                LogResult = log
            });

            return true;
        }

        public async Task<bool> IntegrationEntity(IntegrationEntityMapping entity)
        {
            _mapperRepo.Insert(entity);

            return true;
        }

        public async Task<bool> UpdateAuditSubmitted(List<IntegrationAudit> completedAudits)
        {
            if (!completedAudits.Any())
                return false;
            else
            {
                foreach (var audit in completedAudits)
                {
                    var auditRow = _auditRepo.GetById(audit.Id);
                    if (auditRow != null)
                    {
                        auditRow.UpdatedDate = DateTime.Now;
                        auditRow.UpdatedBy = _uId;
                        auditRow.Submitted = DateTime.Now;

                        _auditRepo.Update(auditRow);
                    }
                }

                return true;
            }
        }

        #endregion

    }
