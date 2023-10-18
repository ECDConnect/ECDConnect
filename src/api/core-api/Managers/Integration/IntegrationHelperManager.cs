using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using Microsoft.AspNetCore.Http;
using System.Text;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Integration;
    public class IntegrationHelperManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private readonly ISystemSetting<IntegrationApiOptions> _options;
        private IntegrationLogManager _logManager;
        private IntegrationAPIManager _apiManager;
        private string _uId;
        private IGenericRepository<IntegrationEntityMapping, Guid> _mapperRepo;
        private IGenericRepository<IntegrationAudit, Guid> _auditRepo;
        private IGenericRepository<IntegrationColumnMapping, Guid> _columnmapperRepo;
        private IGenericRepository<Language, Guid> _staticLanguageRepo;
        private IGenericRepository<Gender, Guid> _staticGenderRepo;
        private IGenericRepository<Race, Guid> _staticRaceRepo;
        private IGenericRepository<Province, Guid> _staticProvinceRepo;
        private IGenericRepository<DocumentType, Guid> _docTypeRepo;
        private IGenericRepository<Relation, Guid> _staticRelationRepo;
        private IGenericRepository<Education, Guid> _staticEducationRepo;
        private IGenericRepository<Grant, Guid> _staticGrantRepo;
        private readonly HierarchyEngine _hierarchyEngine;

        public IntegrationHelperManager(
            IHttpContextAccessor contextAccessor, IGenericRepositoryFactory repoFactory, IntegrationLogManager logManager, ISystemSetting<IntegrationApiOptions> options, IntegrationAPIManager apiManager, HierarchyEngine hierarchyEngine)
        {
            _uId = hierarchyEngine.GetIntegrationUserId();
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _logManager = logManager;
            _apiManager = apiManager;
            _options = options;
            _mapperRepo = repoFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
            _auditRepo = repoFactory.CreateGenericRepository<IntegrationAudit>(userContext: _uId);
            _columnmapperRepo = repoFactory.CreateGenericRepository<IntegrationColumnMapping>(userContext: _uId);
            _staticLanguageRepo = repoFactory.CreateGenericRepository<Language>(userContext: _uId);
            _staticGenderRepo = repoFactory.CreateGenericRepository<Gender>(userContext: _uId);
            _staticRaceRepo = repoFactory.CreateGenericRepository<Race>(userContext: _uId);
            _staticProvinceRepo = repoFactory.CreateGenericRepository<Province>(userContext: _uId);
            _staticRelationRepo = repoFactory.CreateGenericRepository<Relation>(userContext: _uId);
            _staticEducationRepo = repoFactory.CreateGenericRepository<Education>(userContext: _uId); ;
            _staticGrantRepo = repoFactory.CreateGenericRepository<Grant>(userContext: _uId);
            _docTypeRepo = repoFactory.CreateGenericRepository<DocumentType>(userContext: _uId);
        }

        public async Task<IntegrationEntityMapping> GetMappedEntity(string localUserId, string entityType)
        {
            return _mapperRepo.GetAll().Where(x => string.Equals(x.UserId, localUserId) && string.Equals(x.LocalEntity, entityType)).FirstOrDefault();
        }

        public async Task<List<IntegrationColumnMapping>> GetMappedColumnsForUpdate(string entityType)
        {
            string[] directions = { "Both", "SSToSL" };
            return _columnmapperRepo.GetAll().Where(x => string.Equals(x.EntityGrouping, entityType) && directions.Contains(x.UpdateDirection) && x.IsActive==true).ToList();
        }

        public async Task<List<IntegrationAudit>> GetRelatedAudits(string localId)
        {
            return _auditRepo.GetAll().Where(x => string.Equals(x.RelatedId, localId) && x.Submitted == null).ToList();
        }

        public async Task<bool> UpdateRemoteEntity(string localUserId, string entityType)
        {
            var entity = await GetMappedEntity(localUserId, entityType);
            var mappedColumns = await GetMappedColumnsForUpdate(entityType);
            var updateLogs = await GetRelatedAudits(localUserId);
            List<IntegrationAudit> completedList = new List<IntegrationAudit>();
            var responseString = "";

            if (entity != null && mappedColumns.Count > 0 && updateLogs.Count > 0)
            {
                string url = "";
                StringBuilder jsonString = new StringBuilder();
                jsonString.AppendLine("[");
                bool validUpdate = false;

                if (entity != null) //if we have this entity mapped to remote?
                {
                    string localEntity = entity.LocalEntity;
                    string remoteEntity = entity.RemoteEntity;

                    url = remoteEntity + Constants.SSIntegrationSettings.UpdateMultiple;
                    jsonString.AppendLine("{");

                    if (updateLogs.Count() > 0)
                    {
                        jsonString.AppendLine("\"Guid\":\"" + entity.RemoteId + "\","); //add entity GUID first and changes to follow
                        foreach (var changeLine in updateLogs)
                        {
                            if (changeLine.Property == "IsActive" && changeLine.ValueAfter == "False")
                            {
                                //process deactivates first seperately
                                //call delete with the deactivates
                                await DeleteRemoteEntity(entity);
                                //break out of this loop
                                //remove all antries for this entity from the run
                                break;
                            }

                            var mappedColumnLine = mappedColumns.Where(x => x.EntityGrouping.Equals(localEntity) && x.LocalColumn.Equals(changeLine.Property) && x.IsActive == true).FirstOrDefault(); 
                            if (mappedColumnLine != null)
                            {
                                if (mappedColumnLine.UpdateDirection == UpdateDirection.Both.ToString() || mappedColumnLine.UpdateDirection == UpdateDirection.SSToSL.ToString()) //only update mapped columns configured to update
                                {
                                    if (changeLine.Property == "IsActive") //special logic for deactivating
                                    {
                                        //TODO: complete status change logic
                                    }

                                    string valueToSend = changeLine.ValueAfter;

                                    //When columns need remapping between systems - get mappedcolumn from columnmapping and remap values that SL expects - like language, SS use Guids, SL requires string
                                    if (mappedColumnLine.RemapToString)
                                    {
                                        if (mappedColumnLine.RemapEntity != null && !string.IsNullOrEmpty(valueToSend))
                                        {
                                            valueToSend = await RemapStaticToString(mappedColumnLine.RemapEntity, valueToSend);
                                        }
                                    }
                                    if (!string.IsNullOrEmpty(valueToSend))
                                    {
                                        switch (mappedColumnLine.EntityDataType)
                                        {
                                            case "bool":
                                                jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + bool.Parse(valueToSend) + "\",");
                                                break;
                                            case "integer":
                                                jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":" + int.Parse(valueToSend) + ",");
                                                break;
                                            case "datetime":
                                                jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + DateTime.Parse(valueToSend).ToString("yyyy-MM-ddT00:00:00Z") + "\",");
                                                break;
                                            case "date":
                                                jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + DateTime.Parse(valueToSend).ToString("yyyy-MM-dd") + "\",");
                                                break;
                                            default:
                                                jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + valueToSend + "\",");
                                                break;
                                        }
                                        validUpdate = true;
                                    }
                                    //jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + valueToSend + "\",");
                                }
                            }

                            //remove entry from audits list as we have processed it here and sending
                            completedList.Add(changeLine);
                        }
                    }
                    jsonString.AppendLine("}");
                }

                jsonString.AppendLine("]");
                try
                {
                    if (validUpdate)
                    {
                        //now send to API call <entity type>/Multiple
                        responseString = await _apiManager.GetAPIHandlerResponse(url, null, null, null, false, true, jsonString.ToString());
                        if (!string.IsNullOrEmpty(responseString))
                        {
                            if (responseString.StartsWith("{\"ExceptionMessage\":\""))
                            {
                                await _logManager.IntegrationLog("Data Push Fail: ", jsonString.ToString() + " | " + responseString, null, LogRelatedType.Error, "IntegrationHelper > UpdateRemoteEntity > GetAPIHandlerResponse");
                            }
                            else
                            {
                                await _logManager.UpdateAuditSubmitted(completedList);
                                await _logManager.IntegrationLog("Data Push Success: ", jsonString.ToString(), null, LogRelatedType.Log, "IntegrationHelper > UpdateRemoteEntity > GetAPIHandlerResponse");
                            }
                        }
                    }
                    else
                    {
                        //nothing valid to have updated, just remove the audit entries
                        await _logManager.UpdateAuditSubmitted(completedList);
                    }
                }
                catch (Exception e)
                {
                    await _logManager.IntegrationLog("SmartLink API Error: " + e.Message + " - " + responseString, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationHelper > UpdateRemoteEntity > GetAPIHandlerResponse");
                }
                return validUpdate;
            }

            return false;
        }

        private async Task<bool> DeleteRemoteEntity(IntegrationEntityMapping entityToDelete)
        {
            //Delete entry json todo

            return true;
        }

        public async Task<string> RemapStaticToString(string entityToRemap, string valueToSend)
        {
            if (!string.IsNullOrEmpty(valueToSend))
            {
                switch (entityToRemap)
                {
                    case "Race":
                        var race = _staticRaceRepo.GetAll().Where(x => x.Id == Guid.Parse(valueToSend)).OrderBy(x => x.Id).FirstOrDefault();
                        valueToSend = (race != null ? race.Description : null);
                        break;
                    case "Gender":
                        var gender = _staticGenderRepo.GetAll().Where(x => x.Id == Guid.Parse(valueToSend)).OrderBy(x => x.Id).FirstOrDefault();
                        valueToSend = (gender != null ? gender.Description : null);
                        break;
                    case "Language":
                        var lang = _staticLanguageRepo.GetAll().Where(x => x.Id == Guid.Parse(valueToSend)).OrderBy(x => x.Id).FirstOrDefault();
                        valueToSend = (lang != null ? lang.Description : null);
                        break;
                    case "Relation":
                        var rel = _staticRelationRepo.GetAll().Where(x => x.Id == Guid.Parse(valueToSend)).OrderBy(x => x.Id).FirstOrDefault();
                        valueToSend = (rel != null ? rel.Description : null);
                        break;
                    case "Province":
                        var prov = _staticProvinceRepo.GetAll().Where(x => x.Id == Guid.Parse(valueToSend)).OrderBy(x => x.Id).FirstOrDefault();
                        valueToSend = (prov != null ? prov.Description : null);
                        break;
                    case "Education":
                        var edu = _staticEducationRepo.GetAll().Where(x => x.Id == Guid.Parse(valueToSend)).OrderBy(x => x.Id).FirstOrDefault();
                        valueToSend = (edu != null ? edu.Description : null);
                        break;
                    case "Grant":
                        var grant = _staticGrantRepo.GetAll().Where(x => x.Id == Guid.Parse(valueToSend)).OrderBy(x => x.Id).FirstOrDefault();
                        valueToSend = (grant != null ? grant.Description : null);
                        break;
                    case "DocumentType":
                        var doctype = _docTypeRepo.GetAll().Where(x => x.Id == Guid.Parse(valueToSend)).OrderBy(x => x.Id).FirstOrDefault();
                        valueToSend = (doctype != null ? doctype.Description : null);
                        break;
                }
            }

            return valueToSend;
        }

    public async Task<string> RemapStaticStringToGuid(string entityToRemap, string valueToSend)
    {
        if (!string.IsNullOrEmpty(valueToSend))
        {
            switch (entityToRemap)
            {
                case "Race":
                    var race = _staticRaceRepo.GetAll().Where(x => x.Description == valueToSend).OrderBy(x => x.Id).FirstOrDefault();
                    valueToSend = race.Id.ToString();
                    break;
                case "Gender":
                    var gender = _staticGenderRepo.GetAll().Where(x => x.Description == valueToSend).OrderBy(x => x.Id).FirstOrDefault();
                    valueToSend = gender.Id.ToString();
                    break;
                case "Language":
                    var lang = _staticLanguageRepo.GetAll().Where(x => x.Description == valueToSend).OrderBy(x => x.Id).FirstOrDefault();
                    valueToSend = lang.Id.ToString();
                    break;
                case "Relation":
                    var rel = _staticRelationRepo.GetAll().Where(x => x.Description == valueToSend).OrderBy(x => x.Id).FirstOrDefault();
                    valueToSend = rel.Id.ToString();
                    break;
                case "Province":
                    var prov = _staticProvinceRepo.GetAll().Where(x => x.Description == valueToSend).OrderBy(x => x.Id).FirstOrDefault();
                    valueToSend = prov.Id.ToString();
                    break;
                case "Education":
                    var edu = _staticEducationRepo.GetAll().Where(x => x.Description == valueToSend).OrderBy(x => x.Id).FirstOrDefault();
                    valueToSend = edu.Id.ToString();
                    break;
                case "Grant":
                    var grant = _staticGrantRepo.GetAll().Where(x => x.Description == valueToSend).OrderBy(x => x.Id).FirstOrDefault();
                    valueToSend = grant.Id.ToString();
                    break;
                case "DocumentType":
                    var doctype = _docTypeRepo.GetAll().Where(x => x.Description == valueToSend).OrderBy(x => x.Id).FirstOrDefault();
                    valueToSend = doctype.Id.ToString();
                    break;
            }
        }

        return valueToSend;
    }
}
