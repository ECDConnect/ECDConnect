using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using JsonSerializer = System.Text.Json.JsonSerializer;
using static EcdLink.Api.CoreApi.Constants;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities;
using Microsoft.AspNetCore.Identity;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.Abstractrions.Constants;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.Security.Managers;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Context;
using ECDLink.Core.Helpers;
using MediatR;
using ECDLink.DataAccessLayer.Entities.DataIngestion;

namespace ECDLink.Core.Services
{
    public class IntegrationService : IIntegrationService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly ISystemSetting<IntegrationDelayOptions> _integrationDelay;
        private readonly ISystemSetting<IntegrationApiOptions> _options;
        private HttpClient _smartLinkClient;
        private IHttpContextAccessor _contextAccessor;
        private string _uId;
        private UserManager<ApplicationUser> _userManager;
        private IGenericRepository<IntegrationAudit, Guid> _auditRepo;        
        private IGenericRepository<IntegrationEntityMapping, Guid> _mapperRepo;
        private IGenericRepository<IntegrationColumnMapping, Guid> _columnmapperRepo;
        private IGenericRepository<SiteAddress, Guid> _siteAddressRepo;
        private  AuthenticationDbContext _dbContext;
        private IGenericRepository<Classroom, Guid> _classroomGenericRepo;
        private IGenericRepository<ClassroomGroup, Guid> _classroomGroupGenericRepo;
        private IGenericRepository<ProgrammeType, Guid> _programmeTypeGenericRepo;
        private IGenericRepository<Language, Guid> _staticLanguageRepo;
        private IGenericRepository<Gender, Guid> _staticGenderRepo;
        private IGenericRepository<Race, Guid> _staticRaceRepo;
        private IGenericRepository<Province, Guid> _staticProvinceRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerGenericRepo;
        private IGenericRepository<Child, Guid> _childRepo;
        private IGenericRepository<Child, Guid> _childGenericRepo;
        private IGenericRepository<Coach, Guid> _coachGenericRepo;
        private IGenericRepository<Franchisor, Guid> _franchisorGenericRepo;
        private IGenericRepository<Caregiver, Guid> _caregiverRepo;
        private IGenericRepository<Relation, Guid> _staticRelationRepo;
        private IGenericRepository<Education, Guid> _staticEducationRepo;
        private IGenericRepository<Grant, Guid> _staticGrantRepo;
        private IGenericRepository<WorkflowStatus, Guid> _staticWorkflowRepo;
        private IGenericRepository<Document, Guid> _docRepo;

        private MappingMode _apiMode;
        private MappingMaskDataMode _maskMode;
        private readonly HierarchyEngine _hierarchyEngine;
        List<string> _errorsList = new List<string>();

        public static string password = "AQAAAAIAAYagAAAAEMsJuBqbYVml/ZCL4iKjPx8E7MgdBej7VYDmyM0JmGgUODifvGKiB4MhfiNO72w9Nw==";//ECDConnect123!
        public static string securityStamp = "7MLVEAR2UK2APFPOBGP4BPN7XJ4IJGQ6";
        public static string concurrencystamp = "a7ce158a-30c5-4cfb-aee2-027c000b8df6";
        public Guid tenantId = TenantExecutionContext.Tenant.Id;

        public IntegrationService(
            IGenericRepositoryFactory repositoryFactory,
            ISystemSetting<IntegrationDelayOptions> integrationDelay,
            ISystemSetting<IntegrationApiOptions> options,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            HierarchyEngine hierarchyEngine,
            //[Service] AuthenticationDbContext context,
            [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
            [Service] InvitationNotificationManager notificationManager,
             AuthenticationDbContext dbContext
            )//, HttpClient httpClient
        {
            _repositoryFactory = repositoryFactory;
            _integrationDelay = integrationDelay;
            _options = options;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            _hierarchyEngine = hierarchyEngine;
            _uId = _hierarchyEngine.GetAdminUserId();//_contextAccessor.HttpContext.GetUser().Id; //must map this as administrator
            //_smartLinkClient = httpClient;
            Enum.TryParse(_options.Value.Mode, out _apiMode);
            Enum.TryParse(_options.Value.MaskDataMode, out _maskMode);

            //Generic static repos
            _mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
            _columnmapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationColumnMapping>(userContext: _uId);
            _auditRepo = _repositoryFactory.CreateGenericRepository<IntegrationAudit>(userContext: _uId);
            _siteAddressRepo = _repositoryFactory.CreateGenericRepository<SiteAddress>(userContext: _uId);

            _classroomGenericRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: _uId);
            _classroomGroupGenericRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _uId);
            _programmeTypeGenericRepo = _repositoryFactory.CreateGenericRepository<ProgrammeType>(userContext: _uId);
            _staticLanguageRepo = _repositoryFactory.CreateGenericRepository<Language>(userContext: _uId);
            _staticGenderRepo = _repositoryFactory.CreateGenericRepository<Gender>(userContext: _uId);
            _staticRaceRepo = _repositoryFactory.CreateGenericRepository<Race>(userContext: _uId);
            _staticProvinceRepo = _repositoryFactory.CreateGenericRepository<Province>(userContext: _uId);
            _practitionerRepo = _repositoryFactory.CreateRepository<Practitioner>(userContext: _uId);
            _practitionerGenericRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
            _coachGenericRepo = _repositoryFactory.CreateGenericRepository<Coach>(userContext: _uId);
            _franchisorGenericRepo = _repositoryFactory.CreateGenericRepository<Franchisor>(userContext: _uId);

            _childRepo = _repositoryFactory.CreateRepository<Child>(userContext: _uId);
            _childGenericRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);
            _caregiverRepo = _repositoryFactory.CreateGenericRepository<Caregiver>(userContext: _uId);
            _staticRelationRepo = _repositoryFactory.CreateGenericRepository<Relation>(userContext: _uId);
            _staticEducationRepo = _repositoryFactory.CreateGenericRepository<Education>(userContext: _uId);;
            _staticGrantRepo = _repositoryFactory.CreateGenericRepository<Grant>(userContext: _uId);
            _staticWorkflowRepo = _repositoryFactory.CreateGenericRepository<WorkflowStatus>(userContext: _uId);
            _docRepo = _repositoryFactory.CreateGenericRepository<Document>(userContext: _uId);
            _dbContext = dbContext;
        }

        #region Utilities
        private HttpClient SmartLinkClient
        {
            get
            {
                //if (_smartLinkClient == null) //not reopening causes transient erroors - httpclient DI issues - shift to startup requires baseurl that isnt known until later on in load procedure
                //{
                _smartLinkClient = new HttpClient();
                _smartLinkClient.BaseAddress = new Uri(_options.Value.BaseUrl);
                _smartLinkClient.DefaultRequestHeaders.Add("API-Key", _options.Value.Key);
                //}

                return _smartLinkClient;
            }
        }

        private async Task<List<IntegrationAudit>> GetAudits(DateTime startTime, string entityType = null)
        {
            try
            {
                var audits = _auditRepo.GetAll().Where(x => x.InsertedDate >= startTime.AddMinutes(-10)).ToList(); //overlaps with 10 minutes of changes
                if (entityType != null)
                    return audits.Where(x => x.Entity.Equals(entityType) && x.Entity != "").ToList();

                return audits;
            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE          
                throw new HttpRequestException("GetAudits Error retrieving mapped " + entityType + ": " + e.Message);
            }
        }

        private async Task<List<IntegrationEntityMapping>> GetMappedEntities(string entityType = null)
        {
            try
            {

                if (entityType != null)
                    return _mapperRepo.GetAll().Where(x => x.LocalEntity.Equals(entityType) && x.RemoteEntity != "").ToList();
                else
                    return _mapperRepo.GetAll().ToList();
            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE          
                throw new HttpRequestException("GetMappedEntities Error retrieving mapped " + entityType + ": " + e.Message);
            }
        }

        private async Task<List<IntegrationColumnMapping>> GetMappedColumns(string entityType = null)
        {
            try
            {
                if (entityType != null)
                    return _columnmapperRepo.GetAll().Where(x => x.LocalEntity.Equals(entityType) && x.RemoteEntity != "").ToList();
                else
                    return _columnmapperRepo.GetAll().ToList();
            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE              
                throw new HttpRequestException("GetMappedColumns Error retrieving mapped " + entityType + ": " + e.Message);
            }
        }

        private async Task<string> GetAPIHandlerResponse(string endpointUrl, List<IntegrationOptionConditionEntity> optionConditions = null, List<IntegrationOptionRelatedEntity> relatedConditions = null, bool showOptions = true, bool isPut = false, string postString = "")
        {
            var request = new HttpRequestMessage();

            try
            {
                using (SmartLinkClient)
                {
                    if (SmartLinkClient != null)
                    {
                        var apiEntity = new IntegrationOptionEntity() { AllColumns = true, Conditions = optionConditions, Related = relatedConditions };

                        var payload = JsonSerializer.Serialize(apiEntity);
                        var content = showOptions ? new StringContent(payload, Encoding.UTF8, "application/json") : new StringContent(postString, Encoding.UTF8, "application/json");//.Replace("\u0022", "\"")
                        var response = !isPut ? await SmartLinkClient.PostAsync(endpointUrl, content) : await SmartLinkClient.PutAsync(endpointUrl, content);

                        if (!response.IsSuccessStatusCode)
                        {
                            throw new HttpRequestException("SmartLink API GetAPIHandlerResponse (" + endpointUrl + ") Error: " + response.StatusCode);
                        }
                        using var responseStream = await response.Content.ReadAsStreamAsync();
                        return await response.Content.ReadAsStringAsync();
                    }
                    else return null;
                }
            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE         
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        #endregion

        #region Get API Entity

        private async Task<List<RecordChange>> GetRecordChangesBetweenDates(DateTime startDate, DateTime endDate)
        {
            try
            {
                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "DateTimeStamp", Operator = "GreaterOrEqual", Value = startDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "DateTimeStamp", Operator = "LessOrEqual", Value = endDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") });
                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLRecordChange + SSIntegrationSettings.QueryAll, optionConditions);
                return JsonConvert.DeserializeObject<List<RecordChange>>(responseString);
            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE              
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        private async Task<List<ColumnChange>> GetColumnChangesBetweenDates(DateTime startDate, DateTime endDate)
        {
            try
            {

                List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
                relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "RecordChange", AllColumns = "True", Columns = "" });

                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "DateTimeStamp", Operator = "GreaterOrEqual", Value = startDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "DateTimeStamp", Operator = "LessOrEqual", Value = endDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") });
                string[] entities = { "Franchisee" };
                //optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "EntityName", Operator = "In", Value = string.Join(",", entities) });//,'Child','Coach','Franchisor','Caregiver','Address','Document'
                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLColumnChange + SSIntegrationSettings.QueryAll, optionConditions, relatedConditions);
                return JsonConvert.DeserializeObject<List<ColumnChange>>(responseString);
            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE           
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }


        private async Task<List<MappedCoach>> GetCoaches(string remoteFranchisorId)
        {
            try
            {
                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Franchisor", Operator = "Equals", Value = remoteFranchisorId });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLCoach + SSIntegrationSettings.QueryAll, optionConditions, null);
                return JsonConvert.DeserializeObject<List<MappedCoach>>(responseString);
            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE              
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        private async Task<List<MappedFranchisee>> GetFranchiseesByCoach(string remoteCoachId)
        {
            try
            {
                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Coach", Operator = "Equals", Value = remoteCoachId });

                List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
                relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "SiteAddress", AllColumns = "True", Columns = "", JoinType = "Outer" });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLPractitionerQueryAll, optionConditions, relatedConditions);
                return JsonConvert.DeserializeObject<List<MappedFranchisee>>(responseString);

            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE               
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        private async Task<List<MappedFranchisee>> GetFranchiseesById(string remoteId)
        {
            try
            {
                List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
                relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "SiteAddress", AllColumns = "True", Columns = "", JoinType = "Outer" });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLPractitionerQueryByGuid.Replace("{{Guid}}", remoteId), null, relatedConditions);

                var franchisee = JsonConvert.DeserializeObject<MappedFranchisee>(responseString);



                return new List<MappedFranchisee> { franchisee };

            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE                
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        private async Task<List<MappedChild>> GetChildren(string remoteFranchiseeId)
        {
            try
            {
                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = SSIntegrationSettings.SLPractitioner, Operator = "Equals", Value = remoteFranchiseeId });

                List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
                relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "Caregiver", AllColumns = "True", Columns = "", JoinType = "Outer" });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLChild + SSIntegrationSettings.QueryAll, optionConditions, relatedConditions);
                return JsonConvert.DeserializeObject<List<MappedChild>>(responseString);
            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE              
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        private async Task<List<MappedChild>> GetChildById(string remoteChildId)
        {
            try
            {
                List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
                relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "Caregiver", AllColumns = "True", Columns = "" });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLChild + SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", remoteChildId), null, relatedConditions);

                var child = JsonConvert.DeserializeObject<MappedChild>(responseString);

                return new List<MappedChild> { child };
            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE              
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        private async Task<List<MappedCaregiver>> GetCareGiversByFranchisee(string remoteFranchiseeId)
        {
            try
            {
                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = SSIntegrationSettings.SLPractitioner, Operator = "Equals", Value = remoteFranchiseeId });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLChild + SSIntegrationSettings.QueryAll, optionConditions, null);
                return JsonConvert.DeserializeObject<List<MappedCaregiver>>(responseString);
            }
            catch (Exception e)
            {
                //TODO: LOG ERROR AND HANDLE              
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }


        #endregion

        #region Post API Entity


        #endregion

        private async Task<bool> PushUpdates(List<IntegrationAudit> audits, List<IntegrationEntityMapping> entities, List<IntegrationColumnMapping> columns)
        {
            //1) Get list of entities and their types
            //2) iterate through these and group updates for same entity
            //3) build up JSON for the endpoint with blocks for each individual entity based on mapped columns only, any otehr changes is irrelevant
            //4) add remote guid
            //5) Send it to the /Multiple endpoint
            //move to next entity type thats mapped and ha sproperties

            audits = audits.Where(x => x.RelatedId.Equals("4dbdb108-0983-4de6-8c6a-35a905c869c6")).ToList();//audits.Where(x => x.Entity.Equals("ApplicationUser") || x.Entity.Equals("Practitioner")).ToList();

            var entityTypeList = audits.Select(x => x.Entity).Distinct();
            Dictionary<string,string> entitypes = new Dictionary<string,string>();
            var validEntities = entities.Where(x => x.LocalId != null).ToList();
            foreach (var updatedEntityType in entityTypeList)
            {
                StringBuilder jsonString = new StringBuilder();
                var entityIdList = audits.Where(x => x.Entity.Equals(updatedEntityType)).Select(y => y.RelatedId).Distinct().ToList();

                if (entityIdList.Any() && entities.Any())
                {
                    string url = "";
                    jsonString.AppendLine("[");
                    foreach (var entityToUpdate in entityIdList)
                    {
                        var mappedEntity = validEntities.Where(x => x.UserId == entityToUpdate).FirstOrDefault();// && x.LocalEntity.Equals(updatedEntityType)
                        if (mappedEntity != null) //if we have this entity mapped to remote?
                        {
                            string localEntity = mappedEntity.LocalEntity;
                            string remoteEntity = mappedEntity.RemoteEntity;
                            if (updatedEntityType.Equals("ApplicationUser"))
                            {
                                //determine what the related entity is here, we have to remap to SL because we split Application user and the entity in 2, they have all USer properties on entity only
                                var prac = _practitionerGenericRepo.GetByUserId(mappedEntity.UserId);
                                var child = _childGenericRepo.GetByUserId(mappedEntity.UserId);
                                var coach = _coachGenericRepo.GetByUserId(mappedEntity.UserId);
                                var franchisor = _franchisorGenericRepo.GetByUserId(mappedEntity.UserId);
                                if (prac != null)
                                {
                                    localEntity = SSIntegrationSettings.SSPractitioner;
                                    remoteEntity = SSIntegrationSettings.SLPractitioner;
                                }
                                else if (child != null)
                                {
                                    localEntity = SSIntegrationSettings.SSChild;
                                    remoteEntity = SSIntegrationSettings.SLChild;
                                }
                                else if (coach != null)
                                {
                                    localEntity = SSIntegrationSettings.SSCoach;
                                    remoteEntity = SSIntegrationSettings.SLCoach;
                                }
                                else if (franchisor != null)
                                {
                                    localEntity = SSIntegrationSettings.SSFranchisor;
                                    remoteEntity = SSIntegrationSettings.SLFranchisor;
                                }
                            }

                            url = remoteEntity + SSIntegrationSettings.UpdateMultiple;
                            jsonString.AppendLine("{");
                            //get all changes for this entity and group and build JSON
                            var allChanges = audits.Where(x => x.Entity.Equals(updatedEntityType) && x.RelatedId.Equals(entityToUpdate)).OrderByDescending(y => y.InsertedDate).Distinct().ToList();
                            if (allChanges.Count() > 0)
                            {
                                jsonString.AppendLine("\"Guid\":\"" + mappedEntity.RemoteId + "\","); //add entity GUID first and changes to follow
                                foreach (var changeLine in allChanges)
                                {
                                    var mappedColumnLine = columns.Where(x => x.LocalEntity.Equals(updatedEntityType) && x.LocalColumn.Equals(changeLine.Property)).FirstOrDefault();
                                    if (mappedColumnLine != null)
                                    {
                                        if (mappedColumnLine.UpdateDirection.Equals(UpdateDirection.Both) || mappedColumnLine.UpdateDirection.Equals(UpdateDirection.SSToSL)) //only update mapped columns configured to update
                                        {
                                            string valueToSend = changeLine.ValueAfter;
                                            //get mappedcolumn from columnmapping
                                            if (mappedColumnLine.RemapToString)
                                            {
                                                if (mappedColumnLine.RemapEntity != null && !string.IsNullOrEmpty(valueToSend)) {
                                                    valueToSend = await RemapStaticToString(mappedColumnLine.RemapEntity, valueToSend);
                                                }
                                            }
                                            jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + valueToSend + "\",");
                                        }
                                    }
                                    //remove entry from audits list as we have processed it here and sending to SL
                                    audits.Remove(changeLine);
                                }
                            }
                            jsonString.AppendLine("},");
                        }
                    }
                    jsonString.AppendLine("]");
                    //jsonString.AppendLine("[");
                    //jsonString.AppendLine("{");
                    //    jsonString.AppendLine("\"FirstName\": \"Ntombizanele Nozonela\", ");
                    //    jsonString.AppendLine("\"Surname\": \"Maasdorp\", ");
                    //    jsonString.AppendLine("\"IdNumber\": \"8509230915086\", ");
                    //    jsonString.AppendLine("\"PersonalNumber\": \"+27786832610\", ");
                    //    jsonString.AppendLine("\"WhatsAppNumber\": \"+27786832610\", ");
                    //    jsonString.AppendLine("\"BirthDate\": \"1985-09-23\", ");
                    //    jsonString.AppendLine("\"EmailAddress\": \"test@ecdconnect.co.za\", ");
                    //    jsonString.AppendLine("\"NextOfKinFirstName\": \"N/A\",");
                    //        jsonString.AppendLine("\"NextOfKinSurname\": \"N/A\",");
                    //        jsonString.AppendLine("\"NextOfKinContactNumber\": null,");
                    //    jsonString.AppendLine("\"Guid\": \"cc1cbf5d-d3a1-eb11-8346-00155d326100\"");
                    //  jsonString.AppendLine("}");
                    //jsonString.AppendLine("]");

                    //now send to API call <entity type>/Multiple
                    var responseString = await GetAPIHandlerResponse(url, null, null, false, true, jsonString.ToString());
                    if (responseString != null)
                    {

                    }
                }



            }

            return true;
        }

        private async Task<bool> PushDeletes(List<IntegrationAudit> audits, List<IntegrationEntityMapping> entities, List<IntegrationColumnMapping> columns)
        {


            return true;
        }

        private async Task<bool> PushInserts(List<IntegrationAudit> audits, List<IntegrationEntityMapping> entities, List<IntegrationColumnMapping> columns)
        {

            return true;
        }

        private async Task<bool> PushData(List<IntegrationEntityMapping> mappedEntities, List<IntegrationColumnMapping> mappedColumns)
        {
            int changesCheckTime = 1620;
            List<IntegrationAudit> audits = await GetAudits(DateTime.Now.AddMinutes((changesCheckTime * -1))); //get date from last service scheduler run or take last 24 hours

            //Inserts
            var inserts = audits.Where(x => x.ChangeType.Equals("Insert")).ToList();
            if (inserts.Count > 0)
                await PushInserts(inserts, mappedEntities, mappedColumns);

            var updates = audits.Where(x => x.ChangeType.Equals("Update")).ToList();
            if (updates.Count > 0)
                await PushUpdates(updates, mappedEntities, mappedColumns);

            var deletes = audits.Where(x => x.ChangeType.Equals("Delete")).ToList();
            if (deletes.Count > 0)
                await PushDeletes(deletes, mappedEntities, mappedColumns);

            return true;
        }

        public async Task<string> RemapStaticToString(string entityToRemap, string valueToSend)
        {
            switch (entityToRemap)
            {
                case "Race":
                    var race = _staticRaceRepo.GetById(Guid.Parse(valueToSend));
                    valueToSend = (race != null ? race.Description : null);
                    break;
                case "Gender":
                    var gender = _staticGenderRepo.GetById(Guid.Parse(valueToSend));
                    valueToSend = (gender != null ? gender.Description : null);
                    break;
                case "Language":
                    var lang = _staticLanguageRepo.GetById(Guid.Parse(valueToSend));
                    valueToSend = (lang != null ? lang.Description : null);
                    break;
                case "Relation":
                    var rel = _staticRelationRepo.GetById(Guid.Parse(valueToSend));
                    valueToSend = (rel != null ? rel.Description : null);
                    break;
                case "Province":
                    var prov = _staticProvinceRepo.GetById(Guid.Parse(valueToSend));
                    valueToSend = (prov != null ? prov.Description : null);
                    break;
                case "Education":
                    var edu = _staticEducationRepo.GetById(Guid.Parse(valueToSend));
                    valueToSend = (edu != null ? edu.Description : null);
                    break;
            }

            return valueToSend;
        }


        #region Integration Points      

        public async Task<bool> IntegrationByFranchisees()
        {            
            List<SL_Ingestion_User> ids = _dbContext.SL_Ingestion_Users.ToList();
            if (ids.Count > 0)
            {
                foreach (var item in ids)
                {
                    await IntegrationByMappedCoach(item.Id.ToString());
                }
            }


            return true;
        }
            
        public async Task<bool> IntegrationByMappedCoach(string franchiseeId = null)
        {        
            bool returnOK = false;
            DateTime startTime = DateTime.Now;
            int totalAddedToSS = 0;
            int totalFranchiseesAddedToSS = 0;
            int totalChildrenAddedToSS = 0;
            int totalFranchiseesAddedToSL = 0;
            int totalChildrenAddedToSL = 0;
            int totalUpdatedFromSL = 0;
            int totalUpdatedFromSS = 0;
            int errors = 0;
            
            try
            {
                //List<string> errorsList = new List<string>();
                /*
                 * 1) get all mapped coaches done
                * 2) iterate through franchisees of each remote against what we have and create what we dont have and do same for all child caregiver address document etc IN PROGRESS
                * 3) interate through franchisees we have and check any column/entity changes from SL and update what we have done
                * 4) check all changes we had since last r an and push any changes for the entities we had updates to - inserts/updates done
                * 5) start with updates
                * 6) start with income statements and attendance and push only to SL
                */

                //Only allow data pulling when api mode has been set
                
                if (_apiMode == MappingMode.Pull || _apiMode == MappingMode.PushPull)
                {
                    List<IntegrationEntityMapping> mappedEntities = await this.GetMappedEntities();
                    List<IntegrationColumnMapping> mappedColumns = await this.GetMappedColumns();

                    //-------------------
                    //1. - check all changes on known entities marked as changed from SL API and update
                    //-------------------
                    List<ColumnChange> changedColumns = await GetColumnChangesBetweenDates(DateTime.Now.AddDays(-10), DateTime.Now);                    
                    /*       
                    if (changedColumns != null) {
                        foreach (var change in changedColumns)
                        {
                            //match remote changed entity by name and type to what SS has locally, if we dont have it, we dont performa change and will be picked up by step 2 of integration - creates
                            if (mappedEntities.Where(x => x.RemoteId.Equals(change.RecordChange.RecordGuid) && x.RemoteEntity.Equals(change.Entity)) == null)
                            {
                                var remoteColumnChanges = changedColumns.Where(x => x.Entity.Equals(change.Entity) && x.RecordChange.RecordGuid.Equals(change.RecordChange.RecordGuid)).ToList();
                                //kick off change sequence depending on type
                                foreach (var item in remoteColumnChanges)
                                {
                                    UpdateLocalEntity updateEntity = new UpdateLocalEntity() { Guid = change.RecordChange.RecordGuid, 
                                                                                                EntityColumn = mappedColumns.Where(c => c.RemoteEntity.Equals(item.Entity) && c.RemoteColumn.Equals(item.Column)).Select(cc => cc.LocalColumn).FirstOrDefault().ToString(), 
                                                                                                EntityType = item.Entity, 
                                                                                                LastUpdatedDateTime = item.DateTimeStamp, NewData = change.NewValue };
                                    await this.UpdateEntityColumn(updateEntity);
                                }                    
                            }
                        }
                    }
                    /*/
                    //-------------------
                    //2. - check all changes on known entities marked as changed from SS Audit table and Update SL API
                    //-------------------
                    //Only allow data pushing when api mode has been set
                    if (_apiMode == MappingMode.Push || _apiMode == MappingMode.PushPull)
                    {
                        //await PushData(mappedEntities, mappedColumns);                        
                    }

                    //-------------------
                    //3. Iterate through all known coaches to get information below hierarchy
                    //-------------------

                    foreach (var coach in mappedEntities.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSCoach)).ToList())
                    {
                        //-------------------
                        //4. - check all changes on known entities that is not marked complete
                        //-------------------
                        //UpdateIncompletes(mappedEntities, mappedColumns, coach);
                    
                        //-------------------
                        //5. - get all data from API and discard whats complete and known to SS
                        //-------------------
                        //5.1) get all frannchisees and map them                
                        //List<MappedFranchisee> remoteFranchisees = await GetFranchiseesByCoach(coach.RemoteId);
                        List<MappedFranchisee> remoteFranchisees = (franchiseeId != null ? await GetFranchiseesById(franchiseeId) : await GetFranchiseesByCoach(coach.RemoteId));
                        //5.2) iterate through and check if we have it, 3) if not kick off process to create - 4) if we have it add to a new list of ids and move on with iteration. Point 12 will do iteration through changes by looking at recordchange object
                        if (remoteFranchisees != null)
                        {
                            //order all to load principals first
                            remoteFranchisees = remoteFranchisees.OrderBy(x => x.IsPrincipal).ToList();
                            try
                            {
                                foreach (var franchisee in remoteFranchisees)
                                {
                                    if (franchisee != null)
                                    {
                                        if (mappedEntities.Where(x => x.RemoteId.Equals(franchisee.Guid) && x.LocalEntity.Equals(SSIntegrationSettings.SSPractitioner)).Count() == 0)
                                        {
                                            //Create franchisee and map in SS system
                                            franchisee.localParentEntityId = coach.LocalId;
                                            Practitioner newPractitioner = await MapFranchisee(franchisee);
                                            if (newPractitioner != null)
                                            {
                                                totalFranchiseesAddedToSS++;
                                                //get all elements underneath and map those too

                                                //1. Children
                                                List<MappedChild> remoteChildren = await GetChildren(franchisee.Guid);
                                                if (remoteChildren != null)
                                                {
                                                    //List of allocated children to new practitioner
                                                    List<Child> newChildren = new List<Child>();

                                                    foreach (var remoteChild in remoteChildren)
                                                    {
                                                        if (remoteChild != null)
                                                        {
                                                            var newChild = await MapChildCaregiverOfFranchisee(remoteChild, newPractitioner);
                                                            if (newChild != null)
                                                            {
                                                                newChildren.Add(newChild);
                                                                totalChildrenAddedToSS++;
                                                            }
                                                        }
                                                    }

                                                    //realign hirarchy and learners to Unsure classgroups
                                                    await AlignChildHierarchy(newPractitioner, newChildren);
                                                    await AlignChildClassgroupToUnsure(newPractitioner, newChildren);
                                                }


                                                //2. Documents

                                                //3. Notes

                                                //4. Attendance

                                                //5. Income Statements

                                            }
                                        } else
                                        {
                                            var localPractitioner = mappedEntities.Where(x => x.RemoteId.Equals(franchisee.Guid) && x.LocalEntity.Equals(SSIntegrationSettings.SSPractitioner)).FirstOrDefault();
                                            Practitioner newPractitioner = _practitionerGenericRepo.GetByUserId(localPractitioner.UserId);

                                            totalFranchiseesAddedToSS++;
                                            //get all elements underneath and map those too

                                            //1. Children
                                            List<MappedChild> remoteChildren = await GetChildren(franchisee.Guid);
                                            if (remoteChildren != null)
                                            {
                                                //List of allocated children to new practitioner
                                                List<Child> newChildren = new List<Child>();

                                                foreach (var remoteChild in remoteChildren)
                                                {
                                                    if (remoteChild != null)
                                                    {
                                                        var newChild = await MapChildCaregiverOfFranchisee(remoteChild, newPractitioner);
                                                        if (newChild != null)
                                                        {
                                                            newChildren.Add(newChild);
                                                            totalChildrenAddedToSS++;
                                                        }
                                                    }
                                                }

                                                //realign hirarchy and learners to Unsure classgroups
                                                await AlignChildHierarchy(newPractitioner, newChildren);
                                                await AlignChildClassgroupToUnsure(newPractitioner, newChildren);
                                            }
                                        }
                                    }
                                }
                                //Map up principals that could not be mapped (when the principal mapped to hasnt been imported yet
                                await MatchPrincipals();
                            }
                            catch (Exception ex)
                            {
                                //TODO: LOG ERROR AND HANDLE
                            }
                            returnOK = true;
                        }
                    }
                }

                //-------------------
                //6.Update service scheduler and mapping tables with reports of what got done
                //-------------------
                //update iterations of run into ServiceScheduler as conclusion to run
                //save how many records updated to SL and from SL, created between SL and to SL and how it completed and when it stopped
                //This will be looked at again and picked up with time overlap to start checking for changes again on next iteration
                var schedulerRepo = _repositoryFactory.CreateGenericRepository<ServiceScheduler>(userContext: _uId);
                ServiceScheduler scheduledRun = schedulerRepo.GetAll().Where(x => x.Name.Equals("SmartLinkIntegrationDataSync")).FirstOrDefault();
                scheduledRun.Results = "Franchisees Added: " + totalFranchiseesAddedToSS.ToString() + " Children Added: " + totalChildrenAddedToSS.ToString() + " Errors: " + String.Join("|",_errorsList.ToArray());
                scheduledRun.EndTime = DateTime.Now;
                scheduledRun.StartTime = startTime;
                scheduledRun.UpdatedDate = DateTime.Now;
                scheduledRun.UpdatedBy = _uId;
                schedulerRepo.Update(scheduledRun);

            }
            catch (Exception ex)
            {
                //TODO: LOG ERROR AND HANDLE
            }
            return returnOK;
        }


        #endregion

        #region Local Creates

        private async Task<bool> MatchPrincipals()
        {
            bool returnOK = false;
            List<IntegrationEntityMapping> mappedEntities = await this.GetMappedEntities();
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
            //find all entries that has problematic principals that could not be matched at the time      
            try
            {
                foreach (var item in mappedEntities.Where(x => x.Notes != null && x.Notes.StartsWith("REMAP_PRINCIPAL_REMOTE_ID_")).ToList())
                {
                    string principalRemoteId = item.Notes.Replace("REMAP_PRINCIPAL_REMOTE_ID_", "");
                    if (mappedEntities.Where(x => x.RemoteId == principalRemoteId && x.LocalId != null).Any())
                    {
                        Practitioner pracToUpdate = practitionerRepo.GetById(Guid.Parse(item.LocalId));
                        if (pracToUpdate != null)
                        {
                            pracToUpdate.PrincipalHierarchy = Guid.Parse(mappedEntities.Where(x => x.RemoteId == principalRemoteId).Select(x => x.UserId).FirstOrDefault().ToString());
                            //pracToUpdate.DateLinked = DateTime.Now;
                            practitionerRepo.Update(pracToUpdate);

                            //clear the notes
                            item.Notes = null;
                            _mapperRepo.Update(item);
                            returnOK = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //TODO: LOG ERROR AND HANDLE
            }

            return returnOK;
        }

        private async Task<bool> AlignChildHierarchy(Practitioner newPractitioner, List<Child> childrenToAlign)
        {
            bool returnOK = false;
            if (newPractitioner != null && childrenToAlign.Count > 0)
            {
                var staticHierarchyRepo = _repositoryFactory.CreateGenericRepository<UserHierarchyEntity>(userContext: _uId);
                var childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);
                try
                {
                    foreach (var child in childrenToAlign)
                    {


                        string childNewHierarchy = "";
                        UserHierarchyEntity childHierarchy = staticHierarchyRepo.GetAll().Where(x => x.UserId.Equals(child.UserId)).FirstOrDefault();

                        if (childHierarchy != null)
                        {
                            //update NamedTypePath to not be System.Child. but System.Administrator.Practitioner.Child.
                            childHierarchy.NamedTypePath = childHierarchy.NamedTypePath.Replace("System.Child.", "System.Administrator.Practitioner.Child.");
                            //update hierarchy not be 0.466. but 0.1.455.459.
                            childNewHierarchy = childHierarchy.Hierarchy.Replace("0.", newPractitioner.Hierarchy);
                            childHierarchy.Hierarchy = childNewHierarchy;
                            childHierarchy.ParentId = newPractitioner.UserId;
                            staticHierarchyRepo.Update(childHierarchy);
                            //uppdate child record Hierarchy
                            Child updatedChild = childRepo.GetByUserId(child.UserId);
                            updatedChild.Hierarchy = child.Hierarchy.Replace("0.1.", newPractitioner.Hierarchy);
                            childRepo.Update(updatedChild);
                        }

                        returnOK = true;
                    }
                }
                catch (Exception ex)
                {
                    //TODO: LOG ERROR AND HANDLE
                }
            }

            return returnOK;
        }

        private async Task<bool> AlignChildClassgroupToUnsure(Practitioner newPractitioner, List<Child> childrenToAlign)
        {
            bool returnOK = false;
            if (newPractitioner != null && childrenToAlign.Count > 0)
            {
                if ((bool)newPractitioner.IsPrincipal || (bool)newPractitioner.IsFundaAppAdmin) //only FAA or principals will have classroomgroups
                {
                    var classroomgroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _uId);
                    var learnerRepo = _repositoryFactory.CreateGenericRepository<Learner>(userContext: _uId);
                    try
                    {
                        foreach (var child in childrenToAlign)
                        {
                            var group = classroomgroupRepo.GetAll().Where(x => x.UserId == Guid.Parse(newPractitioner.UserId) && x.Name == "Unsure").OrderBy(x => x.Id).FirstOrDefault();
                            Learner newLearner = new Learner()
                            {
                                UserId = child.UserId,
                                StartedAttendance = DateTime.Now,
                                Hierarchy = newPractitioner.Hierarchy
                            };

                            if (group != null)
                            {
                                newLearner.ClassroomGroupId = group.Id;
                                learnerRepo.Insert(newLearner);

                                returnOK = true;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        //TODO: LOG ERROR AND HANDLE
                    }
                }
            }

            return returnOK;
        }

        private async Task<Practitioner> MapFranchisee(MappedFranchisee entity)
        {
            try
            {
                IntegrationEntityMapping mapperLine = new IntegrationEntityMapping();
                if (entity != null)
                {
                    //basic checks to allow child to be imported
                    if (entity.IdNumber != null && entity.FirstName != null && entity.Surname != null && entity.PersonalNumber != null)
                    {
                        string userId = Guid.NewGuid().ToString();
                        Guid siteAddressId = Guid.NewGuid();
                        //start creating the practitioner mapped

                        //a) create franchisee, b) create children, c) create caregivers, d) create integration mapping, e) create documents, f) notes

                        var programmeTypeDesc = entity.ProgrammeType == "ECD Centre" ? "Preschool" : entity.ProgrammeType == "Full Week (Daymothers)" ? "Day Mother" : entity.ProgrammeType == "SmartStart ECD" ? "Preschool" : entity.ProgrammeType == "PlayGroup" ? "Preschool" : "Preschool";
                        var programmeType = _programmeTypeGenericRepo.GetAll().Where(x => x.Description.Equals(programmeTypeDesc)).OrderBy(x => x.Id).FirstOrDefault();
                        string siteName = "N/A";
                        bool pracCreated = false;

                        var newPractitioner = new Practitioner
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            CoachHierarchy = Guid.Parse(entity.localParentEntityId),
                            IsActive = true,
                            ProgrammeType = programmeTypeDesc,
                            IsClubOwner = entity.IsClubLeader,
                            AttendedBusinessSkills = entity.AttendedBusinessSkills,
                            AttendedChildProgress = entity.AttendedChildProgress,
                            MonthSinceFranchisee = int.Parse(entity.MonthsSinceFranchisee),
                            ConsentForPhoto = entity.ConsentForPhoto                            
                        };

                        //check phone number is valid
                        string numberToImport = null;
                        try
                        {
                            var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(entity.PersonalNumber);
                            if (!string.Equals(normalizePhoneNumber, entity.PersonalNumber))
                            {
                                numberToImport = normalizePhoneNumber;
                            }
                        } catch (Exception ex)
                        {
                            //if phone number cant be used, ignore it
                        }
                        string whatsappNumberToImport = null;
                        try
                        {
                            var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(entity.WhatsAppNumber);
                            if (!string.Equals(normalizePhoneNumber, entity.WhatsAppNumber))
                            {
                                whatsappNumberToImport = normalizePhoneNumber;
                            }
                        }
                        catch (Exception ex)
                        {
                            //if phone number cant be used, ignore it
                        }

                        var newUser = new ApplicationUser
                        {
                            Id = userId.ToString(),
                            PhoneNumber = (_maskMode == MappingMaskDataMode.MaskNumbers || _maskMode == MappingMaskDataMode.MaskAll || _maskMode == MappingMaskDataMode.MaskEmailsAndNumbers ? _options.Value.MaskDataNumber : numberToImport),
                            UserName = entity.IdNumber,
                            IdNumber = entity.IdNumber,
                            Email = (_maskMode == MappingMaskDataMode.MaskEmails || _maskMode == MappingMaskDataMode.MaskAll || _maskMode == MappingMaskDataMode.MaskEmailsAndNumbers ? _options.Value.MaskDataEmail : entity.EmailAddress),
                            IsSouthAfricanCitizen = (bool)entity.IsSouthAfricanCitizen,
                            VerifiedByHomeAffairs = (bool)entity.VerifiedByHomeAffairs,
                            DateOfBirth = Convert.ToDateTime(entity.BirthDate),
                            FirstName = entity.FirstName != null ? entity.FirstName.Trim() : entity.FirstName,
                            Surname = entity.Surname != null ? entity.Surname.Trim() : entity.Surname,
                            FullName = entity.FirstName + " " + entity.Surname,
                            ContactPreference = MessageTypeConstants.SMS,
                            IsActive = true,
                            PasswordHash = password,
                            NextOfKinFirstName = entity.NextOfKinFirstName,
                            NextOfKinSurname = entity.NextOfKinSurname,
                            NextOfKinContactNumber = entity.NextOfKinContactNumber,
                            EmergencyContactFirstName = entity.EmergencyContactFirstName,
                            EmergencyContactSurname = entity.EmergencyContactSurname,
                            EmergencyContactFullName = (entity.EmergencyContactFirstName != null ? entity.EmergencyContactFirstName + " " + entity.EmergencyContactSurname : null),
                            TenantId = tenantId,
                            IsImported = true,
                            PreferredCommunicationLanguage = entity.PreferredCommunicationLanguage,
                            WhatsAppNumber = whatsappNumberToImport,
                            ReasonForLeaving = entity.ReasonForLeaving,
                            ReasonForLeavingComments = entity.InactivityComments
                        };

                        //check language
                        if (entity.PreferredCommunicationLanguage != null)
                        {
                            var language = _staticLanguageRepo.GetAll().Where(x => x.Description == entity.PreferredCommunicationLanguage).OrderBy(x => x.Id).FirstOrDefault();
                            if (language != null)
                            {
                                newUser.PreferredCommunicationLanguage = language.Id.ToString();
                                newUser.LanguageId = language.Id;
                                newPractitioner.LanguageUsedInGroups = language.Id.ToString();
                            }
                        }
                        //check gender
                        if (entity.Gender != null)
                        {
                            var gender = _staticGenderRepo.GetAll().Where(x => x.Description == entity.Gender).OrderBy(x => x.Id).FirstOrDefault();
                            if (gender != null)
                            {
                                newUser.GenderId = gender.Id;
                            }
                        }
                        //check race
                        if (entity.EthnicGroup != null)
                        {
                            var race = _staticRaceRepo.GetAll().Where(x => x.Description == entity.EthnicGroup).OrderBy(x => x.Id).FirstOrDefault();
                            if (race != null)
                            {
                                newUser.RaceId = race.Id;
                            }
                        }

                        await _userManager.CreateAsync(newUser);

                        //Create siteaddress
                        bool insertedAddress = false;
                        if (entity.SiteAddress != null)
                        {
                            SiteAddress newEntityAddress = new SiteAddress();

                            newEntityAddress.Ward = entity.SiteAddress.Ward;
                            newEntityAddress.Name = entity.SiteAddress.Name;
                            siteName = entity.SiteAddress.Name;
                            newEntityAddress.PostalCode = entity.SiteAddress.PostalCode;
                            newEntityAddress.Municipality = entity.SiteAddress.Municipality;
                            newEntityAddress.Area = entity.SiteAddress.Area;
                            newEntityAddress.AddressLine1 = entity.SiteAddress.StreetAddress;
                            newEntityAddress.AddressLine2 = entity.SiteAddress.SharedFullAddress;
                            newEntityAddress.AddressLine3 = entity.SiteAddress.Area;
                            newEntityAddress.Longitude = entity.SiteAddress.Longitude;
                            newEntityAddress.Latitude = entity.SiteAddress.Latitude;

                            //check province
                            if (entity.SiteAddress.Province != null)
                            {
                                var staticProvinceRepo = _repositoryFactory.CreateGenericRepository<Province>(userContext: _uId);
                                var prov = staticProvinceRepo.GetAll().Where(x => x.Description == entity.SiteAddress.Province).FirstOrDefault();
                                if (prov != null)
                                {
                                    newEntityAddress.ProvinceId = prov.Id;
                                }
                            }
                            newEntityAddress.Id = siteAddressId;
                            newEntityAddress.UpdatedBy = _uId;
                            newEntityAddress.UpdatedDate = DateTime.Now;
                            _siteAddressRepo.Insert(newEntityAddress);

                            newPractitioner.SiteAddressId = siteAddressId;
                            insertedAddress = true;
                        }

                        //Mark Principal/FAA/Linekd Practitioner
                        if (!(bool)entity.IsPrincipal && entity.Principal != null)
                        {
                            string principalRemoteId = entity.Principal.Guid.ToString();
                            //find the principal if they have been mapped already, else flag to add principals at the end
                            List<IntegrationEntityMapping> mappedEntities = await this.GetMappedEntities();
                            if (mappedEntities.Count > 0)
                            {
                                var principalExistsCheck = mappedEntities.Where(x => x.RemoteId.Equals(principalRemoteId)).FirstOrDefault();
                                if (principalExistsCheck != null)
                                {
                                    newPractitioner.PrincipalHierarchy = Guid.Parse(principalExistsCheck.UserId);
                                    newPractitioner.DateLinked = DateTime.Now;
                                }
                                else
                                {
                                    //add note in mappingline to return and resolve
                                    mapperLine.Notes = "REMAP_PRINCIPAL_REMOTE_ID_" + principalRemoteId;
                                }
                            }
                            newPractitioner.IsFundaAppAdmin = false;
                            newPractitioner.IsPrincipal = false;
                            //newPractitioner.DateLinked = DateTime.Now;
                            //newPractitioner.DateAccepted = DateTime.Now; -- do not accept the link until business clears this - Practitioners need to approve the process

                            await _userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER);
                        }
                        else if (!(bool)entity.IsPrincipal && entity.Principal == null)
                        {
                            newPractitioner.IsFundaAppAdmin = true;
                            newPractitioner.IsPrincipal = false;

                            await _userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER);
                        }
                        else if ((bool)entity.IsPrincipal)
                        {
                            newPractitioner.IsPrincipal = true;
                            newPractitioner.IsFundaAppAdmin = true;

                            await _userManager.AddToRoleAsync(newUser, Roles.PRINCIPAL);
                        }


                        //insert the new Practitioner
                        try
                        {
                            _practitionerRepo.Insert(newPractitioner);
                            pracCreated = true;
                        }
                        catch (Exception ex)
                        {
                            //TODO: LOG ERROR AND HANDLE
                            RemoveImportedAndFlag(userId, true, false);
                        }

                        if (pracCreated)
                        {
                            //create classrooms and classroomgroups - only map for principals or FAAs
                            if ((bool)newPractitioner.IsPrincipal || (bool)newPractitioner.IsFundaAppAdmin)
                            {
                                Classroom pracClass = new Classroom()
                                {
                                    Id = Guid.NewGuid(),
                                    UserId = userId,
                                    IsActive = true,
                                    Name = siteName,
                                    IsPrinciple = true,
                                    NumberPractitioners = 1,
                                    Hierarchy = newPractitioner.Hierarchy,
                                    TenantId = tenantId,
                                    SiteAddressId = insertedAddress ? siteAddressId : null
                                };
                                _classroomGenericRepo.Insert(pracClass);

                                //create UNSURE classroomgroup to assign children to
                                ClassroomGroup pracUnsureClass = new ClassroomGroup()
                                {
                                    Id = Guid.NewGuid(),
                                    UserId = Guid.Parse(userId),
                                    IsActive = true,
                                    Name = "Unsure",
                                    TenantId = tenantId,
                                    Hierarchy = newPractitioner.Hierarchy,
                                    ProgrammeTypeId = programmeType.Id,
                                    ClassroomId = pracClass.Id
                                };
                                _classroomGroupGenericRepo.Insert(pracUnsureClass);
                            }

                            mapperLine.LocalEntity = SSIntegrationSettings.SSPractitioner;
                            mapperLine.RemoteEntity = SSIntegrationSettings.SLPractitioner;
                            mapperLine.LocalId = newPractitioner.Id.ToString();
                            mapperLine.RemoteId = entity.Guid;
                            mapperLine.UserId = userId;
                            mapperLine.UpdatedBy = _uId;
                            mapperLine.UpdatedDate = DateTime.Now;
                            mapperLine.IsComplete = true;
                            mapperLine.BeforeJSON = JsonSerializer.Serialize(entity);
                            //mapperLine.AfterJSON = JsonSerializer.Serialize(newPractitioner);
                            _mapperRepo.Insert(mapperLine);

                            return newPractitioner;
                        }
                    }
                    else
                    {
                        //TODO: CANNOT INSERT< LIST THE REMOTE FEATURES AND GUIDS AND MARK ERRORS AS CANNOT IMPORT FOR SENDING LIST TO SS

                        mapperLine.LocalEntity = SSIntegrationSettings.SSChild;
                        mapperLine.RemoteEntity = SSIntegrationSettings.SLChild;
                        mapperLine.LocalId = null;
                        mapperLine.RemoteId = entity.Guid;
                        mapperLine.UserId = null;
                        mapperLine.UpdatedBy = _uId;
                        mapperLine.UpdatedDate = DateTime.Now;
                        mapperLine.IsComplete = true;
                        mapperLine.BeforeJSON = JsonSerializer.Serialize(entity);
                        mapperLine.Notes = "FAILED INSERT - DATA MISSING";

                        //mapperLine.AfterJSON = JsonSerializer.Serialize(newPractitioner);
                        _mapperRepo.Insert(mapperLine);
                    }
                }
            }
            catch (Exception ex)
            {
                //TODO: LOG ERROR AND HANDLE
            }

            return null;
        }

        private async Task<Child> MapChildCaregiverOfFranchisee(MappedChild entity, Practitioner ownerPractitioner)
        {
            try
            {
                if (entity != null)
                {
                    IntegrationEntityMapping mapperLine = new IntegrationEntityMapping();

                    //Check on childs IdNumber as well as Surname
                    var existingUser = _userManager.Users.Where(x => x.IdNumber == entity.IdNumber && x.Surname == entity.Surname).OrderBy(x => x.Id).FirstOrDefault();

                    if (existingUser == null)
                    {
                        //basic checks to allow child to be imported
                        //
                        if (entity.CaregiverPopiaConsent == true && entity.Caregiver != null && entity.Gender != null && entity.Surname != null && entity.FirstName != null && entity.Caregiver.ContactNumber != null && (entity.BirthDate != null || entity.IdNumber != null))
                        {

                            bool childCreated = false;
                            var workflow = _staticWorkflowRepo.GetAll().Where(x => x.Description == "Active").OrderBy(x => x.Id).FirstOrDefault();
                            //create child user
                            string userId = Guid.NewGuid().ToString();

                            var newUser = new ApplicationUser
                            {
                                Id = userId.ToString(),
                                UserName = userId,//entity?.IdNumber,
                                IdNumber = entity.IdNumber,
                                IsSouthAfricanCitizen = (bool)entity.IsSouthAfricanCitizen,
                                //VerifiedByHomeAffairs = (bool)entity.IsSouthAfricanCitizen,
                                FirstName = entity.FirstName != null ? entity.FirstName.Trim() : entity.FirstName,
                                Surname = entity.Surname != null ? entity.Surname.Trim() : entity.Surname,
                                FullName = entity.FirstName + " " + entity.Surname,
                                ContactPreference = MessageTypeConstants.SMS,
                                IsActive = true,
                                TenantId = tenantId,
                                IsImported = true,
                            };

                            if (entity.BirthDate != null)
                            {
                                newUser.DateOfBirth = (DateTime)entity.BirthDate;
                            }

                            var newChild = new Child
                            {
                                Id = Guid.NewGuid(),
                                UserId = userId,
                                IsActive = true,
                                TenantId = tenantId,
                                Allergies = entity.AllergyType,
                                Disabilities = entity.DisabilityType,
                                WorkflowStatusId = workflow.Id
                            };

                            //check language
                            Guid? languageId = null;
                            if (entity.HomeLanguage != null)
                            {
                                var language = _staticLanguageRepo.GetAll().Where(x => x.Description == entity.HomeLanguage).OrderBy(x => x.Id).FirstOrDefault();
                                if (language != null)
                                {
                                    newUser.PreferredCommunicationLanguage = language.Id.ToString();
                                    newUser.LanguageId = language.Id;
                                    newChild.LanguageId = language.Id;
                                    languageId = language.Id;
                                }
                            }

                            //Check Gender
                            if (entity.Gender != null)
                            {
                                var sgender = _staticGenderRepo.GetAll().Where(x => x.Description.Contains(entity.Gender)).OrderBy(x => x.Id).FirstOrDefault();
                                if (sgender != null)
                                    newUser.GenderId = sgender.Id;
                            }
                            //Check Race
                            if (entity.EthnicGroup != null)
                            {
                                var srace = _staticRaceRepo.GetAll().Where(x => x.Description.Contains(entity.EthnicGroup)).OrderBy(x => x.Id).FirstOrDefault();
                                if (srace != null)
                                    newUser.RaceId = srace.Id;
                            }
                            else
                            {
                                var srace = _staticRaceRepo.GetAll().Where(x => x.Description.Contains("Other")).OrderBy(x => x.Id).FirstOrDefault();
                                if (srace != null)
                                    newUser.RaceId = srace.Id;
                            }

                            //create child record with caregiver details set
                            try
                            {
                                await _userManager.CreateAsync(newUser);
                                await _userManager.AddToRoleAsync(newUser, Roles.CHILD);
                                if (_childRepo.Insert(newChild) != null)
                                {
                                    if (entity.Caregiver != null)
                                    {
                                        //check language
                                        Guid? caregiverLanguage = null;
                                        if (entity.Caregiver.Language != null)
                                        {
                                            var language = _staticLanguageRepo.GetAll().Where(x => x.Description == entity.Caregiver.Language).OrderBy(x => x.Id).FirstOrDefault();
                                            if (language != null)
                                            {
                                                caregiverLanguage = language.Id;
                                            }
                                        }
                                        //Check relation
                                        Guid? relation = null;
                                        if (entity.Caregiver.RelationshipType != null)
                                        {
                                            var sRelation = _staticRelationRepo.GetAll().Where(x => x.Description.Contains(entity.Caregiver.RelationshipType)).OrderBy(x => x.Id).FirstOrDefault();
                                            if (sRelation != null)
                                                relation = sRelation.Id;
                                        }
                                        else
                                        {
                                            var sRelation = _staticRelationRepo.GetAll().Where(x => x.Description.Contains("Guardian")).OrderBy(x => x.Id).FirstOrDefault();
                                            if (sRelation != null)
                                                relation = sRelation.Id;
                                        }
                                        //Check education
                                        Guid? education = null;
                                        if (entity.Caregiver.HighestEducationLevel != null)
                                        {
                                            var sEducation = _staticEducationRepo.GetAll().Where(x => x.Description == entity.Caregiver.HighestEducationLevel).OrderBy(x => x.Id).FirstOrDefault();
                                            if (sEducation != null)
                                                education = sEducation.Id;
                                        }
                                        //save caregiver and update child with caregiver detail
                                        if (entity.Caregiver.FirstName != null)
                                        {
                                            //create caregiver record
                                            var newCaregiver = new Caregiver
                                            {
                                                Id = Guid.NewGuid(),
                                                IsActive = true,
                                                TenantId = tenantId,
                                                IdNumber = entity.Caregiver.IdNumber,
                                                FirstName = entity.Caregiver.FirstName,
                                                Surname = entity.Caregiver.Surname,
                                                FullName = entity.Caregiver.FirstName + " " + entity.Caregiver.Surname,
                                                PhoneNumber = entity.Caregiver.ContactNumber,
                                                EmergencyContactFirstName = entity.Caregiver.EmergencyContactFirstName,
                                                EmergencyContactSurname = entity.Caregiver.EmergencyContactSurname,
                                                EmergencyContactPhoneNumber = entity.Caregiver.EmergencyContactPhoneNumber,
                                                //JoinReferencePanel = entity.Caregiver.,
                                                //Contribution = false,
                                                AdditionalFirstName = entity.AlternativePickupFirstName,
                                                AdditionalSurname = entity.AlternativePickupSurname,
                                                AdditionalPhoneNumber = entity.AlternativePickupContactNumber,
                                                RelationId = relation,
                                                EducationId = education,
                                                LanguageId = caregiverLanguage
                                            };

                                            //Create caregiver siteaddress
                                            if (entity.Caregiver.HomeAddressLine1 != null)
                                            {
                                                SiteAddress newEntityAddress = new SiteAddress();

                                                newEntityAddress.AddressLine1 = entity.Caregiver.HomeAddressLine1 ?? string.Empty;
                                                newEntityAddress.AddressLine2 = entity.Caregiver.HomeAddressLine2 ?? string.Empty;
                                                newEntityAddress.AddressLine3 = entity.Caregiver?.HomeAddressLine3 ?? string.Empty;
                                                newEntityAddress.PostalCode = entity.Caregiver.HomeAddressPostalCode ?? string.Empty;

                                                var staticProvinceRepo = _repositoryFactory.CreateGenericRepository<Province>(userContext: _uId);
                                                //check province
                                                if (entity.Caregiver.Province != null)
                                                {
                                                    var prov = staticProvinceRepo.GetAll().Where(x => x.Description == entity.Caregiver.Province).FirstOrDefault();
                                                    if (prov != null)
                                                    {
                                                        newEntityAddress.ProvinceId = prov.Id;
                                                    }
                                                }
                                                newEntityAddress.Id = Guid.NewGuid();
                                                newEntityAddress.UpdatedBy = _uId;
                                                newEntityAddress.UpdatedDate = DateTime.Now;
                                                _siteAddressRepo.Insert(newEntityAddress);

                                                newCaregiver.SiteAddressId = newEntityAddress.Id;
                                            }

                                            _caregiverRepo.Insert(newCaregiver);
                                            newChild.CaregiverId = newCaregiver.Id;
                                        }
                                    }
                                    _childRepo.Update(newChild);
                                    childCreated = true;
                                }

                            }
                            catch (Exception ex)
                            {
                                //TODO: LOG ERROR AND HANDLE
                            }

                            if (childCreated)
                            {

                                //1) Grants
                                if (entity.GrantType != null)
                                {
                                    var sGrant = _staticGrantRepo.GetAll().Where(x => x.Description.Contains(entity.GrantType)).OrderBy(x => x.Id).FirstOrDefault();
                                    if (sGrant != null)
                                    {
                                        //insert new grant
                                        List<UserGrant> grants = new List<UserGrant>() { new UserGrant() { GrantId = sGrant.Id, TenantId = tenantId, UserId = userId } };
                                        foreach (var grant in grants)
                                        {
                                            // Added safety from removing items from the list should the insertion of new items fail
                                            try
                                            {
                                                _dbContext.UserGrants.AddRange(grant);
                                                _dbContext.SaveChanges();
                                            }
                                            catch (Exception e)
                                            {
                                                //TODO: LOG ERROR AND HANDLE
                                                return null;
                                            }
                                        }
                                    }
                                }
                                //2) Consent
                                if ((bool)entity.CaregiverPopiaConsent)
                                {
                                    try
                                    {
                                        UserConsent consentPopia = new UserConsent() { Id=Guid.NewGuid(), ConsentId = 171, ConsentType = "PersonalInformationAgreement", UserId = userId, CreatedUserId = _uId, TenantId = tenantId, IsActive = true, InsertedDate = DateTime.Now };
                                        _dbContext.UserConsents.Add(consentPopia);
                                        _dbContext.SaveChanges();
                                    }
                                    catch (Exception e)
                                    {
                                        //TODO: LOG ERROR AND HANDLE
                                        return null;
                                    }
                                }
                                if ((bool)entity.CaregiverPhotographyAndFilmingConsent) {

                                    try
                                    {
                                        UserConsent consentPhoto = new UserConsent() { Id = Guid.NewGuid(), ConsentId = 175, ConsentType = "PhotoPermissions", UserId = userId, CreatedUserId = _uId, TenantId = tenantId, IsActive = true, InsertedDate = DateTime.Now };
                                        _dbContext.UserConsents.Add(consentPhoto);
                                        _dbContext.SaveChanges();
                                    }
                                    catch (Exception e)
                                    {
                                        //TODO: LOG ERROR AND HANDLE
                                        return null;
                                    }
                                }

                                //ManageChildClassrooms();

                                mapperLine.LocalEntity = SSIntegrationSettings.SSChild;
                                mapperLine.RemoteEntity = SSIntegrationSettings.SLChild;
                                mapperLine.LocalId = newChild.Id.ToString();
                                mapperLine.RemoteId = entity.Guid;
                                mapperLine.UserId = userId;
                                mapperLine.UpdatedBy = _uId;
                                mapperLine.UpdatedDate = DateTime.Now;
                                mapperLine.IsComplete = true;
                                mapperLine.BeforeJSON = JsonSerializer.Serialize(entity);
                                //mapperLine.AfterJSON = JsonSerializer.Serialize(newPractitioner);
                                _mapperRepo.Insert(mapperLine);

                                return newChild;
                            }
                        }
                        else {
                            //TODO: CANNOT INSERT< LIST THE REMOTE FEATURES AND GUIDS AND MARK ERRORS AS CANNOT IMPORT FOR SENDING LIST TO SS
                            
                            mapperLine.LocalEntity = SSIntegrationSettings.SSChild;
                            mapperLine.RemoteEntity = SSIntegrationSettings.SLChild;
                            mapperLine.LocalId = null;
                            mapperLine.RemoteId = entity.Guid;
                            mapperLine.UserId = null;
                            mapperLine.UpdatedBy = _uId;
                            mapperLine.UpdatedDate = DateTime.Now;
                            mapperLine.IsComplete = true;
                            mapperLine.BeforeJSON = JsonSerializer.Serialize(entity);
                            mapperLine.Notes = "FAILED INSERT - DATA MISSING";

                            //mapperLine.AfterJSON = JsonSerializer.Serialize(newPractitioner);
                            _mapperRepo.Insert(mapperLine);
                        }
                    }
                }
                else return null;
            }
            catch (Exception ex)
            {
                //TODO: LOG ERROR AND HANDLE
                return null;
            }

            return null;
        }
       
        #endregion

        #region Local Updates

        private async Task<bool> UpdateEntityColumn(UpdateLocalEntity model)
        {
            //TODO: convert to reflection to simplify
            bool updatedEntity = false;
            try
            {

                switch (model.EntityType)
                {
                    case SSIntegrationSettings.SSCoach:
                        var coachRepo = _repositoryFactory.CreateGenericRepository<Coach>(userContext: _uId);
                        var coach = coachRepo.GetByUserId(model.Guid);
                        Type coachT = typeof(Coach);
                        foreach (var prop in coachT.GetProperties())
                        {
                            if (prop.Name == model.EntityColumn)
                            {
                                prop.SetValue(coach, model.EntityColumn);
                                updatedEntity = true;
                            }
                        }
                        if (updatedEntity)
                        {
                            coach.UpdatedBy = _uId;
                            coach.UpdatedDate = DateTime.Now;
                            coachRepo.Update(coach);
                        }
                        break;
                    case SSIntegrationSettings.SSPractitioner:
                        var practRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
                        var prac = practRepo.GetByUserId(model.Guid);
                        Type practT = typeof(Practitioner);
                        foreach (var prop in practT.GetProperties())
                        {
                            if (prop.Name == model.EntityColumn)
                            {
                                prop.SetValue(prac, model.EntityColumn);
                                updatedEntity = true;
                            }
                        }
                        if (updatedEntity)
                        {
                            prac.UpdatedBy = _uId;
                            prac.UpdatedDate = DateTime.Now;
                            practRepo.Update(prac);
                        }
                        break;
                    case SSIntegrationSettings.SSChild:
                        var childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);
                        var child = childRepo.GetByUserId(model.Guid);
                        Type childT = typeof(Child);
                        foreach (var prop in childT.GetProperties())
                        {
                            if (prop.Name == model.EntityColumn)
                            {
                                prop.SetValue(child, model.EntityColumn);
                                updatedEntity = true;
                            }
                        }
                        if (updatedEntity)
                        {
                            child.UpdatedBy = _uId;
                            child.UpdatedDate = DateTime.Now;
                            childRepo.Update(child);
                        }
                        break;
                    case SSIntegrationSettings.SSCaregiver:
                        var careRepo = _repositoryFactory.CreateGenericRepository<Caregiver>(userContext: _uId);
                        var caregiver = careRepo.GetById(Guid.Parse(model.Guid));
                        Type careT = typeof(Caregiver);
                        foreach (var prop in careT.GetProperties())
                        {
                            if (prop.Name == model.EntityColumn)
                            {
                                prop.SetValue(caregiver, model.EntityColumn);
                                updatedEntity = true;
                            }
                        }
                        if (updatedEntity)
                        {
                            caregiver.UpdatedBy = _uId;
                            caregiver.UpdatedDate = DateTime.Now;
                            careRepo.Update(caregiver);
                        }
                        break;
                    case SSIntegrationSettings.SSAddress:
                        var addressRepo = _repositoryFactory.CreateGenericRepository<SiteAddress>(userContext: _uId);
                        var entity = addressRepo.GetById(Guid.Parse(model.Guid));
                        Type t = typeof(SiteAddress);
                        foreach (var prop in t.GetProperties())
                        {
                            if (prop.Name == model.EntityColumn)
                            {
                                prop.SetValue(entity, model.EntityColumn);
                                updatedEntity = true;
                            }
                        }
                        if (updatedEntity)
                        {
                            entity.UpdatedBy = _uId;
                            entity.UpdatedDate = DateTime.Now;
                            addressRepo.Update(entity);
                        }
                        break;
                    default:
                        break;
                }
            }
            catch (Exception)
            {
                //TODO: LOG ERROR AND HANDLE
                throw;
            }

            return updatedEntity;
        }

        private async Task<bool> UpdateCoachEntity(MappedCoach model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            try
            {
                bool updatedEntity = false;
                bool updatedUser = false;
                var entityRepo = _repositoryFactory.CreateGenericRepository<Coach>(userContext: _uId);
                Coach localEntity = entityRepo.GetByUserId(model.localId);
                if (localEntity != null)
                {

                    //update entity properties
                    Type tC = typeof(Coach);
                    Type tMC = typeof(MappedCoach);

                    if (tC != null && tMC != null)
                    {
                        foreach (var updateProp in mappedProperties)
                        {
                            foreach (var prop in tC.GetProperties())
                            {
                                if (prop.Name == updateProp.LocalColumn.Trim())
                                {
                                    foreach (var mappedProp in tMC.GetProperties())
                                    {
                                        if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                        {
                                            if (mappedProp.GetValue(model, null) != null && mappedProp.GetValue(model, null) != prop.GetValue(localEntity, null))
                                            {
                                                if (updateProp.LocalColumn == "IsActive")
                                                {
                                                    //TODO: Kickoff Deactivation procedure
                                                }
                                                else
                                                {
                                                    prop.SetValue(localEntity, mappedProp.GetValue(model, null));
                                                    updatedEntity = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (updatedEntity)
                    {
                        localEntity.UpdatedBy = _uId;
                        localEntity.UpdatedDate = DateTime.Now;
                        entityRepo.Update(localEntity);

                    }
                    //Update user properties
                    var entityUser = await _userManager.FindByIdAsync(model.localId);
                    if (entityUser != null)
                    {
                        Type tU = typeof(ApplicationUser);
                        if (tU != null && tMC != null)
                        {
                            foreach (var updateProp in mappedProperties)
                            {
                                foreach (var prop in tU.GetProperties())
                                {
                                    if (prop.Name == updateProp.LocalColumn.Trim())
                                    {
                                        foreach (var mappedProp in tMC.GetProperties())
                                        {
                                            if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                            {
                                                if (mappedProp.GetValue(model, null) != null && mappedProp.GetValue(model, null) != prop.GetValue(entityUser, null))
                                                {
                                                    if (updateProp.LocalColumn == "IsActive")
                                                    {
                                                        //TODO: Kickoff Deactivation procedure
                                                    }
                                                    else
                                                    {
                                                        prop.SetValue(entityUser, mappedProp.GetValue(model, null));
                                                        updatedUser = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (updatedUser)
                        {
                            await _userManager.UpdateAsync(entityUser);
                        }
                    }
                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    IntegrationEntityMapping mapperLine = _mapperRepo.GetById(entityLine.Id);
                    mapperLine.UpdatedBy = _uId;
                    mapperLine.UpdatedDate = DateTime.Now;
                    mapperLine.IsComplete = true;
                    mapperLine.BeforeJSON = JsonSerializer.Serialize(model);
                    _mapperRepo.Update(mapperLine);
                }
            }
            catch (Exception)
            {
                //TODO: LOG ERROR AND HANDLE
                throw;
            }

            return retVal;
        }

        private async Task<bool> UpdatePractitionerEntity(MappedFranchisee model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            bool updatedEntity = false;
            bool updatedUser = false;
            bool updateAddress = false;
            try
            {
                var entityRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
                Practitioner localEntity = entityRepo.GetByUserId(model.localId);
                if (localEntity != null)
                {
                    if (model.SiteAddress != null)
                    {
                        Type tA = typeof(SiteAddress);
                        Type tMA = typeof(MappedAddress);
                        //update address properties
                        var addressRepo = _repositoryFactory.CreateGenericRepository<SiteAddress>(userContext: _uId);
                        if (localEntity.SiteAddress != null)
                        {

                            SiteAddress localEntityAddress = addressRepo.GetById((Guid)localEntity.SiteAddressId);
                            if (localEntityAddress != null)
                            {
                                //update entity address properties
                                if (tA != null && tMA != null)
                                {
                                    foreach (var updateProp in mappedProperties)
                                    {
                                        foreach (var prop in tA.GetProperties())
                                        {
                                            if (prop.Name == updateProp.LocalColumn.Trim())
                                            {
                                                foreach (var mappedProp in tMA.GetProperties())
                                                {
                                                    if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                                    {
                                                        if (mappedProp.GetValue(model.SiteAddress, null) != null && mappedProp.GetValue(model.SiteAddress, null) != prop.GetValue(localEntityAddress, null))
                                                        {
                                                            if (updateProp.LocalColumn == "IsActive")
                                                            {
                                                                //TODO: Kickoff Deactivation procedure
                                                            }
                                                            else
                                                            {
                                                                prop.SetValue(localEntityAddress, mappedProp.GetValue(model.SiteAddress, null));
                                                                updateAddress = true;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                //update entity properties
                                //foreach (var updateProp in mappedProperties)
                                //{
                                //    PropertyInfo propLocal = typeof(SiteAddress).GetProperty(updateProp.LocalColumn);
                                //    PropertyInfo propRemote = typeof(MappedAddress).GetProperty(updateProp.RemoteColumn);
                                //    if (propLocal != null && propRemote != null)
                                //    {
                                //        if (propLocal.GetValue(localEntityAddress, null) != propRemote.GetValue(model.SiteAddress, null))
                                //        {
                                //            propLocal.SetValue(localEntityAddress, propRemote.GetValue(model.SiteAddress, null));
                                //        }
                                //    }
                                //}
                                if (updateAddress)
                                {
                                    localEntityAddress.UpdatedBy = _uId;
                                    localEntityAddress.UpdatedDate = DateTime.Now;
                                    addressRepo.Update(localEntityAddress);
                                }
                            }
                        }
                        else //create address
                        {
                            SiteAddress newEntityAddress = new SiteAddress();
                            if (tA != null && tMA != null)
                            {
                                foreach (var updateProp in mappedProperties)
                                {
                                    foreach (var prop in tA.GetProperties())
                                    {
                                        if (prop.Name == updateProp.LocalColumn.Trim())
                                        {
                                            foreach (var mappedProp in tMA.GetProperties())
                                            {
                                                if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                                {
                                                    if (mappedProp.GetValue(model.SiteAddress, null) != null)
                                                    {
                                                        prop.SetValue(newEntityAddress, mappedProp.GetValue(model.SiteAddress, null));
                                                        updateAddress = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (updateAddress)
                            {
                                newEntityAddress.UpdatedBy = _uId;
                                newEntityAddress.UpdatedDate = DateTime.Now;
                                var addressId = addressRepo.Insert(newEntityAddress);

                                localEntity.SiteAddress = addressId;
                            }
                        }
                    }

                    //update entity properties
                    //update entity properties
                    Type tC = typeof(Practitioner);
                    Type tMF = typeof(MappedFranchisee);

                    if (tC != null && tMF != null)
                    {
                        foreach (var updateProp in mappedProperties)
                        {
                            foreach (var prop in tC.GetProperties())
                            {
                                if (prop.Name == updateProp.LocalColumn.Trim())
                                {
                                    foreach (var mappedProp in tMF.GetProperties())
                                    {
                                        if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                        {
                                            if (mappedProp.GetValue(model, null) != null && mappedProp.GetValue(model, null) != prop.GetValue(localEntity, null))
                                            {
                                                if (updateProp.LocalColumn == "IsActive")
                                                {
                                                    //TODO: Kickoff Deactivation procedure
                                                    /*
                                                     User, Hierarchy, shifting children and classes, If pricnipal demotion etc
                                                     */
                                                }
                                                else
                                                {
                                                    prop.SetValue(localEntity, mappedProp.GetValue(model, null));
                                                    updatedEntity = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (updatedEntity)
                    {
                        localEntity.UpdatedBy = _uId;
                        localEntity.UpdatedDate = DateTime.Now;
                        entityRepo.Update(localEntity);

                    }
                    //foreach (var updateProp in mappedProperties)
                    //{
                    //    PropertyInfo propLocal = typeof(Practitioner).GetProperty(updateProp.LocalColumn);
                    //    PropertyInfo propRemote = typeof(MappedFranchisee).GetProperty(updateProp.RemoteColumn);
                    //    if (propLocal != null && propRemote != null)
                    //    {
                    //        if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
                    //        {
                    //            if (updateProp.LocalColumn == "IsActive")
                    //            {
                    //                //TODO: Kickoff Deactivation procedure
                    //                /*
                    //                 User, Hierarchy, shifting children and classes, If pricnipal demotion etc
                    //                 */
                    //            }
                    //            else
                    //            {
                    //                propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                    //            }
                    //        }
                    //    }
                    //}
                    //localEntity.UpdatedBy = _uId;
                    //localEntity.UpdatedDate = DateTime.Now;
                    //entityRepo.Update(localEntity);

                    //Update user properties
                    var entityUser = await _userManager.FindByIdAsync(model.localId);
                    if (entityUser != null)
                    {
                        Type tU = typeof(ApplicationUser);
                        if (tU != null && tMF != null)
                        {
                            foreach (var updateProp in mappedProperties)
                            {
                                foreach (var prop in tU.GetProperties())
                                {
                                    if (prop.Name == updateProp.LocalColumn.Trim())
                                    {
                                        foreach (var mappedProp in tMF.GetProperties())
                                        {
                                            if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                            {
                                                if (mappedProp.GetValue(model, null) != null && mappedProp.GetValue(model, null) != prop.GetValue(entityUser, null))
                                                {
                                                    if (updateProp.LocalColumn == "IsActive")
                                                    {
                                                        //TODO: Kickoff Deactivation procedure
                                                    }
                                                    else
                                                    {
                                                        prop.SetValue(entityUser, mappedProp.GetValue(model, null));
                                                        updatedUser = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (updatedUser)
                        {
                            await _userManager.UpdateAsync(entityUser);
                        }
                    }


                    //TODO: classes management

                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    IntegrationEntityMapping mapperLine = _mapperRepo.GetById(entityLine.Id);
                    mapperLine.UpdatedBy = _uId;
                    mapperLine.UpdatedDate = DateTime.Now;
                    mapperLine.IsComplete = true;
                    mapperLine.BeforeJSON = JsonSerializer.Serialize(model);
                    _mapperRepo.Update(mapperLine);
                }

            }
            catch (Exception)
            {
                //TODO: LOG ERROR AND HANDLE
                throw;
            }

            return retVal;
        }

        private async Task<bool> UpdateChildEntity(MappedChild model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            bool updatedEntity = false;
            bool updatedUser = false;
            try
            {
                var entityRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);
                Child localEntity = entityRepo.GetByUserId(model.localId);
                if (localEntity != null)
                {
                    //update entity properties
                    Type tC = typeof(Child);
                    Type tMC = typeof(MappedChild);

                    if (tC != null && tMC != null)
                    {
                        foreach (var updateProp in mappedProperties)
                        {
                            foreach (var prop in tC.GetProperties())
                            {
                                if (prop.Name == updateProp.LocalColumn.Trim())
                                {
                                    foreach (var mappedProp in tMC.GetProperties())
                                    {
                                        if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                        {
                                            if (mappedProp.GetValue(model, null) != null && mappedProp.GetValue(model, null) != prop.GetValue(localEntity, null))
                                            {
                                                if (updateProp.LocalColumn == "IsActive")
                                                {
                                                    //TODO: Kickoff Deactivation procedure
                                                }
                                                else
                                                {
                                                    prop.SetValue(localEntity, mappedProp.GetValue(model, null));
                                                    updatedEntity = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (updatedEntity)
                    {
                        localEntity.UpdatedBy = _uId;
                        localEntity.UpdatedDate = DateTime.Now;
                        entityRepo.Update(localEntity);

                    }

                    ////update entity properties
                    //foreach (var updateProp in mappedProperties)
                    //{
                    //    PropertyInfo propLocal = typeof(Child).GetProperty(updateProp.LocalColumn);
                    //    PropertyInfo propRemote = typeof(MappedChild).GetProperty(updateProp.RemoteColumn);
                    //    if (propLocal != null && propRemote != null)
                    //    {
                    //        if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
                    //        {
                    //            if (updateProp.LocalColumn == "IsActive")
                    //            {
                    //                //TODO: Kickoff Deactivation procedure
                    //                /*
                    //                 Learner records, Hierarchy, User, Classrooms, Attendance
                    //                 */
                    //            }
                    //            else
                    //            {
                    //                propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                    //            }
                    //        }
                    //    }
                    //}
                    //localEntity.UpdatedBy = _uId;
                    //localEntity.UpdatedDate = DateTime.Now;
                    //entityRepo.Update(localEntity);

                    //Update user properties
                    var entityUser = await _userManager.FindByIdAsync(model.localId);
                    if (entityUser != null)
                    {
                        Type tU = typeof(ApplicationUser);
                        if (tU != null && tMC != null)
                        {
                            foreach (var updateProp in mappedProperties)
                            {
                                foreach (var prop in tU.GetProperties())
                                {
                                    if (prop.Name == updateProp.LocalColumn.Trim())
                                    {
                                        foreach (var mappedProp in tMC.GetProperties())
                                        {
                                            if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                            {
                                                if (mappedProp.GetValue(model, null) != null && mappedProp.GetValue(model, null) != prop.GetValue(entityUser, null))
                                                {
                                                    if (updateProp.LocalColumn == "IsActive")
                                                    {
                                                        //TODO: Kickoff Deactivation procedure
                                                        /*
                                                         Learner records, Hierarchy, User, Classrooms, Attendance
                                                         */
                                                    }
                                                    else
                                                    {
                                                        prop.SetValue(entityUser, mappedProp.GetValue(model, null));
                                                        updatedUser = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (updatedUser)
                        {
                            await _userManager.UpdateAsync(entityUser);
                        }
                        //foreach (var updateProp in mappedProperties)
                        //{
                        //    PropertyInfo propLocal = typeof(ApplicationUser).GetProperty(updateProp.LocalColumn);
                        //    PropertyInfo propRemote = typeof(MappedChild).GetProperty(updateProp.RemoteColumn);
                        //    if (propLocal != null && propRemote != null)
                        //    {
                        //        if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
                        //        {
                        //            if (updateProp.LocalColumn == "IsActive")
                        //            {
                        //                //TODO: Kickoff Deactivation procedure
                        //                /*
                        //                 Learner records, Hierarchy, User, Classrooms, Attendance
                        //                 */
                        //            }
                        //            else
                        //            {
                        //                propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                        //            }
                        //        }
                        //    }
                        //}
                        //await _userManager.UpdateAsync(entityUser);
                    }

                    //Update caregiver - caregiver is handled seperately - UpdateCaregiverEntity and data split off into 2 to handle both

                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    IntegrationEntityMapping mapperLine = _mapperRepo.GetById(entityLine.Id);
                    mapperLine.UpdatedBy = _uId;
                    mapperLine.UpdatedDate = DateTime.Now;
                    mapperLine.IsComplete = true;
                    mapperLine.BeforeJSON = JsonSerializer.Serialize(model);
                    _mapperRepo.Update(mapperLine);
                }

            }
            catch (Exception)
            {
                //TODO: LOG ERROR AND HANDLE
                throw;
            }

            return retVal;
        }

        private async Task<bool> UpdateCaregiverEntity(MappedCaregiver model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            bool updatedEntity = false;
            try
            {
                var entityRepo = _repositoryFactory.CreateGenericRepository<Caregiver>(userContext: _uId);
                Caregiver localEntity = entityRepo.GetById(Guid.Parse(model.localId));
                if (localEntity != null)
                {
                    //update entity properties
                    Type tC = typeof(Caregiver);
                    Type tMC = typeof(MappedCaregiver);

                    if (tC != null && tMC != null)
                    {
                        foreach (var updateProp in mappedProperties)
                        {
                            foreach (var prop in tC.GetProperties())
                            {
                                if (prop.Name == updateProp.LocalColumn.Trim())
                                {
                                    foreach (var mappedProp in tMC.GetProperties())
                                    {
                                        if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                        {
                                            if (mappedProp.GetValue(model, null) != null && mappedProp.GetValue(model, null) != prop.GetValue(localEntity, null))
                                            {
                                                if (updateProp.LocalColumn == "IsActive")
                                                {
                                                    //TODO: Kickoff Deactivation procedure
                                                }
                                                else
                                                {
                                                    prop.SetValue(localEntity, mappedProp.GetValue(model, null));
                                                    updatedEntity = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (updatedEntity)
                    {
                        localEntity.UpdatedBy = _uId;
                        localEntity.UpdatedDate = DateTime.Now;
                        entityRepo.Update(localEntity);

                    }
                    ////update entity properties
                    //foreach (var updateProp in mappedProperties)
                    //{
                    //    PropertyInfo propLocal = typeof(Caregiver).GetProperty(updateProp.LocalColumn);
                    //    PropertyInfo propRemote = typeof(MappedCaregiver).GetProperty(updateProp.RemoteColumn);
                    //    if (propLocal != null && propRemote != null)
                    //    {
                    //        if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
                    //        {
                    //            if (updateProp.LocalColumn == "IsActive")
                    //            {
                    //                //TODO: Kickoff Deactivation procedure
                    //            }
                    //            else
                    //            {
                    //                propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                    //            }
                    //        }
                    //    }
                    //}
                    //localEntity.UpdatedBy = _uId;
                    //localEntity.UpdatedDate = DateTime.Now;
                    //entityRepo.Update(localEntity);

                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    IntegrationEntityMapping mapperLine = _mapperRepo.GetById(entityLine.Id);
                    mapperLine.UpdatedBy = _uId;
                    mapperLine.UpdatedDate = DateTime.Now;
                    mapperLine.IsComplete = true;
                    mapperLine.BeforeJSON = JsonSerializer.Serialize(model);
                    _mapperRepo.Update(mapperLine);
                }

            }
            catch (Exception)
            {
                //TODO: LOG ERROR AND HANDLE
                throw;
            }

            return retVal;
        }

        private async Task<bool> UpdateSiteAddressEntity(MappedAddress model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            bool updatedEntity = false;
            try
            {
                var entityRepo = _repositoryFactory.CreateGenericRepository<SiteAddress>(userContext: _uId);
                SiteAddress localEntity = entityRepo.GetById(Guid.Parse(model.localId));
                if (localEntity != null)
                {
                    //update entity properties
                    Type tA = typeof(SiteAddress);
                    Type tMA = typeof(MappedAddress);

                    if (tA != null && tMA != null)
                    {
                        foreach (var updateProp in mappedProperties)
                        {
                            foreach (var prop in tA.GetProperties())
                            {
                                if (prop.Name == updateProp.LocalColumn.Trim())
                                {
                                    foreach (var mappedProp in tMA.GetProperties())
                                    {
                                        if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                        {
                                            if (mappedProp.GetValue(model, null) != null && mappedProp.GetValue(model, null) != prop.GetValue(localEntity, null))
                                            {
                                                if (updateProp.LocalColumn == "IsActive")
                                                {
                                                    //TODO: Kickoff Deactivation procedure
                                                }
                                                else
                                                {
                                                    prop.SetValue(localEntity, mappedProp.GetValue(model, null));
                                                    updatedEntity = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (updatedEntity)
                    {
                        localEntity.UpdatedBy = _uId;
                        localEntity.UpdatedDate = DateTime.Now;
                        entityRepo.Update(localEntity);

                    }

                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    IntegrationEntityMapping mapperLine = _mapperRepo.GetById(entityLine.Id);
                    mapperLine.UpdatedBy = _uId;
                    mapperLine.UpdatedDate = DateTime.Now;
                    mapperLine.IsComplete = true;
                    mapperLine.BeforeJSON = JsonSerializer.Serialize(model);
                    _mapperRepo.Update(mapperLine);
                }

            }
            catch (Exception)
            {
                //TODO: LOG ERROR AND HANDLE
                throw;
            }

            return retVal;
        }

        private async Task<bool> UpdateDocumentEntity(MappedDocument model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            bool updatedEntity = false;
            try
            {                
                Document localEntity = _docRepo.GetById(Guid.Parse(model.localId));
                if (localEntity != null)
                {
                    //update entity properties
                    Type tA = typeof(Document);
                    Type tMA = typeof(MappedDocument);

                    if (tA != null && tMA != null)
                    {
                        foreach (var updateProp in mappedProperties)
                        {
                            foreach (var prop in tA.GetProperties())
                            {
                                if (prop.Name == updateProp.LocalColumn.Trim())
                                {
                                    foreach (var mappedProp in tMA.GetProperties())
                                    {
                                        if (mappedProp.Name == updateProp.RemoteColumn.Trim())
                                        {
                                            if (mappedProp.GetValue(model, null) != null && mappedProp.GetValue(model, null) != prop.GetValue(localEntity, null))
                                            {
                                                if (updateProp.LocalColumn == "IsActive")
                                                {
                                                    //TODO: Kickoff Deactivation procedure
                                                }
                                                else
                                                {
                                                    prop.SetValue(localEntity, mappedProp.GetValue(model, null));
                                                    updatedEntity = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (updatedEntity)
                    {
                        localEntity.UpdatedBy = _uId;
                        localEntity.UpdatedDate = DateTime.Now;
                        _docRepo.Update(localEntity);

                    }
                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    IntegrationEntityMapping mapperLine = _mapperRepo.GetById(entityLine.Id);
                    mapperLine.UpdatedBy = _uId;
                    mapperLine.UpdatedDate = DateTime.Now;
                    mapperLine.IsComplete = true;
                    mapperLine.BeforeJSON = JsonSerializer.Serialize(model);
                    _mapperRepo.Update(mapperLine);
                }

            }
            catch (Exception)
            {
                //TODO: LOG ERROR AND HANDLE
                throw;
            }

            return retVal;
        }

        private async Task<bool> UpdateIncompletes(List<IntegrationEntityMapping> mappedEntities, List<IntegrationColumnMapping> mappedColumns, IntegrationEntityMapping coach)
        {
            //-------------------
            //3. - check all changes on known entities that is not marked complete
            //-------------------
            if (coach.IsComplete != true)
            {
                //entity may have been manually mapped for inclusion, pull all details and update
                string url = SSIntegrationSettings.SLCoach + SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", coach.RemoteId);
                var responseString = await GetAPIHandlerResponse(url, null);
                MappedCoach entity = JsonConvert.DeserializeObject<MappedCoach>(responseString);
                if (entity != null)
                {
                    entity.localId = coach.LocalId;
                    //update coach against mappedcoachproperties
                    await UpdateCoachEntity(entity, coach, mappedColumns.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSCoach)).ToList());
                }
            }

            //run through all mapped practitioners that is not complete
            foreach (var practitioner in mappedEntities.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSPractitioner)).ToList())
            {
                if (practitioner.IsComplete != true)
                {
                    //entity may have been manually mapped for inclusion, pull all details and update
                    string url = SSIntegrationSettings.SLPractitioner + SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", practitioner.RemoteId);
                    var responseString = await GetAPIHandlerResponse(url, null);
                    MappedFranchisee entity = JsonConvert.DeserializeObject<MappedFranchisee>(responseString);
                    if (entity != null)
                    {
                        entity.localId = practitioner.LocalId;
                        await UpdatePractitionerEntity(entity, practitioner, mappedColumns.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSPractitioner)).ToList());
                    }
                }
            }
            //run through all mapped children that is not complete
            foreach (var child in mappedEntities.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSChild)).ToList())
            {
                if (child.IsComplete != true)
                {
                    //entity may have been manually mapped for inclusion, pull all details and update
                    string url = SSIntegrationSettings.SLChild + SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", child.RemoteId);
                    var responseString = await GetAPIHandlerResponse(url, null);
                    MappedChild entity = JsonConvert.DeserializeObject<MappedChild>(responseString);
                    if (entity != null)
                    {
                        entity.localId = child.LocalId;
                        await UpdateChildEntity(entity, child, mappedColumns.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSChild)).ToList());
                    }
                }
            }
            //run through all mapped caregivers
            foreach (var caregiver in mappedEntities.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSCaregiver)).ToList())
            {
                if (caregiver.IsComplete != true)
                {
                    //entity may have been manually mapped for inclusion, pull all details and update
                    string url = SSIntegrationSettings.SLCaregiver + SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", caregiver.RemoteId);
                    var responseString = await GetAPIHandlerResponse(url, null);
                    MappedCaregiver entity = JsonConvert.DeserializeObject<MappedCaregiver>(responseString);
                    if (entity != null)
                    {
                        entity.localId = caregiver.LocalId;
                        await UpdateCaregiverEntity(entity, caregiver, mappedColumns.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSCaregiver)).ToList());
                    }
                }
            }
            //run through all mapped addresses that is not complete
            foreach (var address in mappedEntities.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSAddress)).ToList())
            {
                if (address.IsComplete != true)
                {
                    //entity may have been manually mapped for inclusion, pull all details and update
                    string url = SSIntegrationSettings.SLAddress + SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", address.RemoteId);
                    var responseString = await GetAPIHandlerResponse(url, null);
                    MappedAddress entity = JsonConvert.DeserializeObject<MappedAddress>(responseString);
                    if (entity != null)
                    {
                        entity.localId = address.LocalId;
                        await UpdateSiteAddressEntity(entity, address, mappedColumns.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSAddress)).ToList());
                    }
                }
            }
            //run through all mapped documents that is not complete
            foreach (var docs in mappedEntities.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSDocument)).ToList())
            {
                if (docs.IsComplete != true)
                {
                    //entity may have been manually mapped for inclusion, pull all details and update
                    string url = SSIntegrationSettings.SLDocument + SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", docs.RemoteId);
                    var responseString = await GetAPIHandlerResponse(url, null);
                    MappedDocument entity = JsonConvert.DeserializeObject<MappedDocument>(responseString);
                    if (entity != null)
                    {
                        entity.localId = docs.LocalId;
                        await UpdateDocumentEntity(entity, docs, mappedColumns.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSDocument)).ToList());
                    }
                }
            }
            /**/
            return true;
        }

        #endregion

        #region Undo Last transaction

        private async Task<bool> RemoveImportedAndFlag(string userId, bool isPrac = false, bool isChild = false)
        {

            return true;
        }


        #endregion

    }
}
