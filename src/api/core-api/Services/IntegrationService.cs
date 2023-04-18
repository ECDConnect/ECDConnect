using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
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
using System.ComponentModel;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities;
using System.Reflection;
using Microsoft.AspNetCore.Identity;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;

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
        private IGenericRepository<IntegrationEntityMapping, Guid> _mapperRepo;


        public IntegrationService(
            IGenericRepositoryFactory repositoryFactory,
            ISystemSetting<IntegrationDelayOptions> integrationDelay,
            ISystemSetting<IntegrationApiOptions> options,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager)//, HttpClient httpClient
        {
            _repositoryFactory = repositoryFactory;
            _integrationDelay = integrationDelay;
            _options = options;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            _uId = _contextAccessor.HttpContext.GetUser().Id;
            //_smartLinkClient = httpClient;

            _mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
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

        private async Task<List<IntegrationEntityMapping>> GetMappedEntities(string entityType = null)
        {
            var request = new HttpRequestMessage();

            try
            {
                
                //var mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
                if (entityType != null)
                    return _mapperRepo.GetAll().Where(x => x.LocalEntity.Equals(entityType) && x.RemoteEntity != "").ToList();
                else
                    return _mapperRepo.GetAll().ToList();
            }
            catch (Exception e)
            {
                // TODO: Log error                
                throw new HttpRequestException("GetMappedEntities Error retrieving mapped " + entityType + ": " + e.Message);
            }
        }

        private async Task<List<IntegrationColumnMapping>> GetMappedColumns(string entityType = null)
        {
            var request = new HttpRequestMessage();

            try
            {
                
                var mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationColumnMapping>(userContext: _uId);
                if (entityType != null)
                    return mapperRepo.GetAll().Where(x => x.LocalEntity.Equals(entityType) && x.RemoteEntity != "").ToList();
                else
                    return mapperRepo.GetAll().ToList();
            }
            catch (Exception e)
            {
                // TODO: Log error                
                throw new HttpRequestException("GetMappedColumns Error retrieving mapped " + entityType + ": " + e.Message);
            }
        }

        private async Task<string> GetAPIHandlerResponse(string endpointUrl, List<IntegrationOptionConditionEntity> optionConditions = null, List<IntegrationOptionRelatedEntity> relatedConditions = null)
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
                        var content = new StringContent(payload, Encoding.UTF8, "application/json");//.Replace("\u0022", "\"")
                        var response = await SmartLinkClient.PostAsync(endpointUrl, content);

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
                // TODO: Log error                
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
                // TODO: Log error                
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
                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLColumnChange + SSIntegrationSettings.QueryAll, optionConditions, relatedConditions );
                return JsonConvert.DeserializeObject<List<ColumnChange>>(responseString);
            }
            catch (Exception e)
            {
                // TODO: Log error                
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
                // TODO: Log error                
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

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLPractitionerQueryAll, optionConditions, null);
                return JsonConvert.DeserializeObject<List<MappedFranchisee>>(responseString);

            }
            catch (Exception e)
            {
                // TODO: Log error                
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        private async Task<List<MappedChildCaregiver>> GetChildren(string remoteFranchiseeId)
        {
            try
            {
                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = SSIntegrationSettings.SLPractitioner, Operator = "Equals", Value = remoteFranchiseeId });

                List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
                relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "Caregiver", AllColumns = "True", Columns = ""});
                
                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLChild + SSIntegrationSettings.QueryAll, optionConditions, relatedConditions);
                return JsonConvert.DeserializeObject<List<MappedChildCaregiver>>(responseString);
            }
            catch (Exception e)
            {
                // TODO: Log error                
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        private async Task<List<MappedChildCaregiver>> GetCareGivers(string remoteFranchiseeId)
        {
            try
            {
                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = SSIntegrationSettings.SLPractitioner, Operator = "Equals", Value = remoteFranchiseeId });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLChild + SSIntegrationSettings.QueryAll, optionConditions, null);
                return JsonConvert.DeserializeObject<List<MappedChildCaregiver>>(responseString);
            }
            catch (Exception e)
            {
                // TODO: Log error                
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }


        #endregion

        #region Post API Entity


        #endregion


        #region Integration Points

        public async Task<bool> IntegrationByMappedCoach()
        {          
            bool returnOK = false;
            //-------------------
            //1 - check all changes on known entities
            //-------------------

            /*
             * 1) get all mapped coaches
            * 2) iterate through franchisees of each remote against what we have and create what we dont have and filyter down to child caregiver etc
            * 3) interate through franchisees we have and check any column/entity changes from SL and update what we have
            * 4) check all changes we had since last r an and push any changes for the entities we had updates to - inserts/updates
            */
 //           List<ColumnChange> changedColumns = await GetColumnChangesBetweenDates(DateTime.Now.AddDays(-10), DateTime.Now);
            //List<RecordChange> changedRecords = await GetRecordChangesBetweenDates(DateTime.Now.AddDays(-10), DateTime.Now);

            List<IntegrationEntityMapping> mappedEntities = await this.GetMappedEntities();
            List<IntegrationColumnMapping> mappedColumns = await this.GetMappedColumns();
            //List<IntegrationEntityMapping> mappedCoaches = await this.GetMappedEntities(SSIntegrationSettings.SSCoach);
            //List<IntegrationEntityMapping> mappedPractitioners = await GetMappedEntities(SSIntegrationSettings.SSPractitioner);
            //List<IntegrationEntityMapping> mappedChildren = await GetMappedEntities(SSIntegrationSettings.SSChild);
            //List<IntegrationEntityMapping> mappedCareGivers = await GetMappedEntities(SSIntegrationSettings.SSCaregiver);
            //List<IntegrationEntityMapping> mappedAddress = await GetMappedEntities(SSIntegrationSettings.SSAddress);

 /*           foreach (var change in changedColumns)
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
 */



                        
            foreach (var coach in mappedEntities.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSCoach)).ToList())
            {
                if (coach.IsComplete != true)
                {
                    //entity may have been manually mapped for inclusion, pull all details and update
                    string url = SSIntegrationSettings.SLCoach + SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", coach.RemoteId);
                    var responseString = await GetAPIHandlerResponse(url, null);
                    MappedCoach coachEntity = JsonConvert.DeserializeObject<MappedCoach>(responseString);
                    if (coachEntity != null)
                    {
                        coachEntity.localId = coach.LocalId;
                        //update coach against mappedcoachproperties
                        await UpdateCoachEntity(coachEntity, coach, mappedColumns.Where(x => x.LocalEntity.Equals(SSIntegrationSettings.SSCoach)).ToList());
                    }

                    //coach.IsComplete = true;
                }

                
                //12 - get recordchanges object and iterate through them to look at what we have and what changed and update accordingly
                //foreach (var mappedPractitioner in mappedPractitioners)
                //{



                //}



                //-------------------
                //2 - check all changes on known entities
                //-------------------
                //1) get all frannchisees and map them
                /*
                List<MappedFranchisee> remoteFranchisees = await GetFranchiseesByCoach(coach.RemoteId);
                //2) iterate through and check if we have it, 3) if not kick off process to create - 4) if we have it add to a new list of ids and move on with iteration. Point 12 will do iteration through changes by looking at recordchange object
                if (remoteFranchisees != null)
                {
                    foreach (var franchisee in remoteFranchisees)
                    {
                        if (franchisee != null)
                        {
                            if (mappedPractitioners.Where(x => x.LocalId.Equals(franchisee.Guid)) == null)
                            {

                                //create franchisee and map in our system
                                franchisee = await MapFranchisee(franchisee);

                                //get all elements underneath and map those too
                                //var remoteChild = .....
                                //child.localParentEntityId = franchisee.localId;
                                //var child = MapChildOfFranchisee(child)


                            }
                        }
                    }

                }

                */



            }

            return returnOK;
        }


        #endregion

        #region Local Creates

        private async Task<MappedFranchisee> MapFranchisee(MappedFranchisee entity)
        {
            if (entity != null)
            {
                //a) create franchisee, b) create children, c) create caregivers, d) create integration mapping, e) create documents, f) notes


                entity.localId = null;
                entity.localParentEntityId = null;


            }

            return entity;
        }

        private async Task<MappedChild> MapChildOfFranchisee(MappedChild entity)
        {
            if (entity != null)
            {
                //a) create franchisee, b) create children, c) create caregivers, d) create integration mapping, e) create documents, f) notes


                entity.localId = null;
                entity.localParentEntityId = null;
            }

            return entity;
        }

        private async Task<MappedCaregiver> MapCareGiverOfFranchisee(MappedCaregiver entity)
        {
            if (entity != null)
            {
                //a) create franchisee, b) create children, c) create caregivers, d) create integration mapping, e) create documents, f) notes


                entity.localId = null;
                entity.localParentEntityId = null;
            }

            return entity;
        }

        #endregion

        #region Local Updates

        private async Task<bool> UpdateEntityColumn(UpdateLocalEntity model)
        {
            bool retVal = false;
            //TODO: convert to reflection to simplify
            
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
                                prop.SetValue(coach, model.EntityColumn);
                        }
                        coach.UpdatedBy = _uId;
                        coach.UpdatedDate = DateTime.Now;
                        coachRepo.Update(coach);
                        retVal = true;
                        break;
                    case SSIntegrationSettings.SSPractitioner:
                        var practRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
                        var prac = practRepo.GetByUserId(model.Guid);
                        Type practT = typeof(Practitioner);
                        foreach (var prop in practT.GetProperties())
                        {
                            if (prop.Name == model.EntityColumn)
                                prop.SetValue(prac, model.EntityColumn);
                        }
                        prac.UpdatedBy = _uId;
                        prac.UpdatedDate = DateTime.Now;
                        practRepo.Update(prac);
                        retVal = true;
                        break;
                    case SSIntegrationSettings.SSChild:
                        var childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);
                        var child = childRepo.GetByUserId(model.Guid);
                        Type childT = typeof(Child);
                        foreach (var prop in childT.GetProperties())
                        {
                            if (prop.Name == model.EntityColumn)
                                prop.SetValue(child, model.EntityColumn);
                        }
                        child.UpdatedBy = _uId;
                        child.UpdatedDate = DateTime.Now;
                        childRepo.Update(child);
                        retVal = true;
                        break;
                    case SSIntegrationSettings.SSCaregiver:
                        var careRepo = _repositoryFactory.CreateGenericRepository<Caregiver>(userContext: _uId);
                        var caregiver = careRepo.GetById(Guid.Parse(model.Guid));
                        Type careT = typeof(Caregiver);
                        foreach (var prop in careT.GetProperties())
                        {
                            if (prop.Name == model.EntityColumn)
                                prop.SetValue(caregiver, model.EntityColumn);
                        }
                        caregiver.UpdatedBy = _uId;
                        caregiver.UpdatedDate = DateTime.Now;
                        careRepo.Update(caregiver);
                        retVal = true;
                        break;
                    case SSIntegrationSettings.SSAddress:
                        var addressRepo = _repositoryFactory.CreateGenericRepository<SiteAddress>(userContext: _uId);
                        var entity = addressRepo.GetById(Guid.Parse(model.Guid));
                        Type t = typeof(SiteAddress);
                        foreach (var prop in t.GetProperties())
                        {
                            if (prop.Name == model.EntityColumn)
                                prop.SetValue(entity, model.EntityColumn);
                        }
                        entity.UpdatedBy = _uId;
                        entity.UpdatedDate = DateTime.Now;
                        addressRepo.Update(entity);
                        retVal = true;
                        break;
                    default:
                        break;
                }
            }
            catch (Exception)
            {

                throw;
            }

            return retVal;
        }

        //private async Task<bool> UpdateEntityUser(MappedCoach model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        //{
        //    bool retVal = false;
        //    try
        //    {

        //    }
        //    catch (Exception)
        //    {

        //        throw;
        //    }

        //    return retVal;

        //}

        private async Task<bool> UpdateCoachEntity(MappedCoach model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            try
            {
                var entityRepo = _repositoryFactory.CreateGenericRepository<Coach>(userContext: _uId);
                Coach localEntity = entityRepo.GetByUserId(model.localId);
                if (localEntity != null) { 
                    //update entity properties
                    foreach (var updateProp in mappedProperties)
                    {
                        PropertyInfo propLocal = typeof(Coach).GetProperty(updateProp.LocalColumn);
                        PropertyInfo propRemote = typeof(MappedCoach).GetProperty(updateProp.RemoteColumn);
                        if (propLocal != null && propRemote != null)
                        {
                            if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
                            {
                                if (updateProp.LocalColumn == "IsActive")
                                {
                                    //TODO: Kickoff Deactivation procedure
                                }
                                else
                                {
                                    propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                                }
                            }
                        }
                    }
                    localEntity.UpdatedBy = _uId;
                    localEntity.UpdatedDate = DateTime.Now;
                    entityRepo.Update(localEntity);

                    //Update user properties
                    var entityUser = await _userManager.FindByIdAsync(model.localId);
                    if (entityUser != null)
                    {
                        foreach (var updateProp in mappedProperties)
                        {
                            PropertyInfo propLocal = typeof(ApplicationUser).GetProperty(updateProp.LocalColumn);
                            PropertyInfo propRemote = typeof(MappedCoach).GetProperty(updateProp.RemoteColumn);
                            if (propLocal != null && propRemote != null)
                            {
                                if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
                                {
                                    if (updateProp.LocalColumn == "IsActive")
                                    {
                                        //TODO: Kickoff Deactivation procedure
                                    }
                                    else
                                    {
                                        propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                                    }
                                }
                            }
                        }
                        await _userManager.UpdateAsync(entityUser);
                    }
                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    //var mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
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

                throw;
            }

            return retVal;
        }

        private async Task<bool> UpdatePractitionerEntity(MappedFranchisee model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            try
            {
                var entityRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
                Practitioner localEntity = entityRepo.GetByUserId(model.localId);
                if (localEntity != null)
                {
                    if (model.SiteAddress != null)
                    {
                        //update address properties
                        var addressRepo = _repositoryFactory.CreateGenericRepository<SiteAddress>(userContext: _uId);

                        if (localEntity.SiteAddress != null)
                        {
                            SiteAddress localEntityAddress = addressRepo.GetById((Guid)localEntity.SiteAddressId);
                            if (localEntityAddress != null)
                            {
                                //update entity properties
                                foreach (var updateProp in mappedProperties)
                                {
                                    PropertyInfo propLocal = typeof(SiteAddress).GetProperty(updateProp.LocalColumn);
                                    PropertyInfo propRemote = typeof(MappedAddress).GetProperty(updateProp.RemoteColumn);
                                    if (propLocal != null && propRemote != null)
                                    {
                                        if (propLocal.GetValue(localEntityAddress, null) != propRemote.GetValue(model.SiteAddress, null))
                                        {
                                            propLocal.SetValue(localEntityAddress, propRemote.GetValue(model.SiteAddress, null));
                                        }
                                    }
                                }
                                localEntityAddress.UpdatedBy = _uId;
                                localEntityAddress.UpdatedDate = DateTime.Now;
                                addressRepo.Update(localEntityAddress);
                            }
                        }
                        else //create address
                        {
                            SiteAddress newEntityAddress = new SiteAddress();
                            //create entity properties
                            foreach (var updateProp in mappedProperties)
                            {
                                PropertyInfo propLocal = typeof(SiteAddress).GetProperty(updateProp.LocalColumn);
                                PropertyInfo propRemote = typeof(MappedAddress).GetProperty(updateProp.RemoteColumn);
                                if (propLocal != null && propRemote != null)
                                {
                                    propLocal.SetValue(newEntityAddress, propRemote.GetValue(model.SiteAddress, null));
                                }
                            }
                            newEntityAddress.UpdatedBy = _uId;
                            newEntityAddress.UpdatedDate = DateTime.Now;
                            var addressId = addressRepo.Insert(newEntityAddress);

                            localEntity.SiteAddress = addressId;
                        }
                    }

                    //update entity properties
                    foreach (var updateProp in mappedProperties)
                    {
                        PropertyInfo propLocal = typeof(Practitioner).GetProperty(updateProp.LocalColumn);
                        PropertyInfo propRemote = typeof(MappedFranchisee).GetProperty(updateProp.RemoteColumn);
                        if (propLocal != null && propRemote != null)
                        {
                            if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
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
                                    propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                                }
                            }
                        }
                    }
                    localEntity.UpdatedBy = _uId;
                    localEntity.UpdatedDate = DateTime.Now;
                    entityRepo.Update(localEntity);

                    //Update user properties
                    var entityUser = await _userManager.FindByIdAsync(model.localId);
                    if (entityUser != null)
                    {
                        foreach (var updateProp in mappedProperties)
                        {
                            PropertyInfo propLocal = typeof(ApplicationUser).GetProperty(updateProp.LocalColumn);
                            PropertyInfo propRemote = typeof(MappedFranchisee).GetProperty(updateProp.RemoteColumn);
                            if (propLocal != null && propRemote != null)
                            {
                                if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
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
                                        propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                                    }
                                }
                            }
                        }
                        await _userManager.UpdateAsync(entityUser);
                    }


                    //TODO: classes management

                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    //var mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
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

                throw;
            }

            return retVal;
        }

        private async Task<bool> UpdateChildEntity(MappedChild model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            try
            {
                var entityRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);
                Child localEntity = entityRepo.GetByUserId(model.localId);
                if (localEntity != null)
                {
                    //update entity properties
                    foreach (var updateProp in mappedProperties)
                    {
                        PropertyInfo propLocal = typeof(Child).GetProperty(updateProp.LocalColumn);
                        PropertyInfo propRemote = typeof(MappedChild).GetProperty(updateProp.RemoteColumn);
                        if (propLocal != null && propRemote != null)
                        {
                            if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
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
                                    propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                                }
                            }
                        }
                    }
                    localEntity.UpdatedBy = _uId;
                    localEntity.UpdatedDate = DateTime.Now;
                    entityRepo.Update(localEntity);

                    //Update user properties
                    var entityUser = await _userManager.FindByIdAsync(model.localId);
                    if (entityUser != null)
                    {
                        foreach (var updateProp in mappedProperties)
                        {
                            PropertyInfo propLocal = typeof(ApplicationUser).GetProperty(updateProp.LocalColumn);
                            PropertyInfo propRemote = typeof(MappedChild).GetProperty(updateProp.RemoteColumn);
                            if (propLocal != null && propRemote != null)
                            {
                                if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
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
                                        propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                                    }
                                }
                            }
                        }
                        await _userManager.UpdateAsync(entityUser);
                    }

                    //Update caregiver - caregiver is handled seperately - UpdateCaregiverEntity and data split off into 2 to handle both

                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    //var mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
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

                throw;
            }

            return retVal;
        }

        private async Task<bool> UpdateCaregiverEntity(MappedCaregiver model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            try
            {
                var entityRepo = _repositoryFactory.CreateGenericRepository<Caregiver>(userContext: _uId);
                Caregiver localEntity = entityRepo.GetById(Guid.Parse(model.localId));
                if (localEntity != null)
                {
                    //update entity properties
                    foreach (var updateProp in mappedProperties)
                    {
                        PropertyInfo propLocal = typeof(Caregiver).GetProperty(updateProp.LocalColumn);
                        PropertyInfo propRemote = typeof(MappedCaregiver).GetProperty(updateProp.RemoteColumn);
                        if (propLocal != null && propRemote != null)
                        {
                            if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
                            {
                                if (updateProp.LocalColumn == "IsActive")
                                {
                                    //TODO: Kickoff Deactivation procedure
                                }
                                else
                                {
                                    propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                                }
                            }
                        }
                    }
                    localEntity.UpdatedBy = _uId;
                    localEntity.UpdatedDate = DateTime.Now;
                    entityRepo.Update(localEntity);

                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    //var mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
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

                throw;
            }

            return retVal;
        }

        private async Task<bool> UpdateSiteAddressEntity(MappedAddress model, IntegrationEntityMapping entityLine, List<IntegrationColumnMapping> mappedProperties)
        {
            bool retVal = false;
            try
            {
                var entityRepo = _repositoryFactory.CreateGenericRepository<SiteAddress>(userContext: _uId);
                SiteAddress localEntity = entityRepo.GetById(Guid.Parse(model.localId));
                if (localEntity != null)
                {
                    //update entity properties
                    foreach (var updateProp in mappedProperties)
                    {
                        PropertyInfo propLocal = typeof(SiteAddress).GetProperty(updateProp.LocalColumn);
                        PropertyInfo propRemote = typeof(MappedAddress).GetProperty(updateProp.RemoteColumn);
                        if (propLocal != null && propRemote != null)
                        {
                            if (propLocal.GetValue(localEntity, null) != propRemote.GetValue(model, null))
                            {
                                propLocal.SetValue(localEntity, propRemote.GetValue(model, null));
                            }
                        }
                    }
                    localEntity.UpdatedBy = _uId;
                    localEntity.UpdatedDate = DateTime.Now;
                    entityRepo.Update(localEntity);

                    retVal = true;

                    //mark mapped entity as complete and save the serialised object to IntegrationEntityMapping
                    //var mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
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

                throw;
            }

            return retVal;
        }
        #endregion
    }
}
