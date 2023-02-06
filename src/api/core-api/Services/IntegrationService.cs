using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationMapping;
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

namespace ECDLink.Core.Services
{
    public class IntegrationService : IIntegrationService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly ISystemSetting<IntegrationDelayOptions> _integrationDelay;
        private readonly ISystemSetting<IntegrationApiOptions> _options;
        private HttpClient _smartLinkClient;
        private readonly string _serviceUrl;
        private IHttpContextAccessor _contextAccessor;

        public IntegrationService(
            IGenericRepositoryFactory repositoryFactory,
            ISystemSetting<IntegrationDelayOptions> integrationDelay,
            ISystemSetting<IntegrationApiOptions> options,
            [Service] IHttpContextAccessor contextAccessor)
        {
            _repositoryFactory = repositoryFactory;
            _integrationDelay = integrationDelay;
            _options = options;
            _contextAccessor = contextAccessor;
        }

        private HttpClient SmartLinkClient
        {
            get
            {
                if (_smartLinkClient == null)
                {
                    _smartLinkClient = new HttpClient();
                    var apiurl = _options.Value.Url;
                    var url = "";
                    _smartLinkClient.BaseAddress = new Uri("https://devwebservice.smartstart.org.za/api/v3/query/");
                    _smartLinkClient.DefaultRequestHeaders.Add("API-Key", _options.Value.Key);
                }

                return _smartLinkClient;
            }
        }

        public async Task<List<MappedCoach>> GetCoaches(string localFranchisorId)
        {
            var request = new HttpRequestMessage();

            try
            {
                var uId = _contextAccessor.HttpContext.GetUser().Id;
                IntegrationMapping franchisor = new IntegrationMapping();
                var mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationMapping>(userContext: uId);

                var FranchisorMapped = mapperRepo.GetAll().Where(x => x.LocalId == localFranchisorId).Where(y => y.RemoteEntity == "").FirstOrDefault();

                if (FranchisorMapped != null)
                {
                    using (SmartLinkClient)
                    {
                        List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                        optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                        optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Franchisor", Operator = "Equals", Value = FranchisorMapped.RemoteId });

                        var apiEntity = new IntegrationOptionEntity() { AllColumns = true, Conditions = optionConditions };

                        var payload = JsonSerializer.Serialize(apiEntity);
                        //{ "AllColumns":true,"Columns":null,"Related":null,"Conditions":[{ "Column":"Status","Operator":"Equals","Value":"Active"},{ "Column":"Franchisor","Operator":"Equals","Value":"7911a744-4584-e811-817d-0800274bb0e4"}]}
                        var content = new StringContent(payload, Encoding.UTF8, "application/json");

                        var response = await SmartLinkClient.PostAsync("Coach", content);

                        if (!response.IsSuccessStatusCode)
                        {
                            throw new HttpRequestException("SmartLink API Error: " + response.StatusCode);
                        }
                        using var responseStream = await response.Content.ReadAsStreamAsync();
                        var responseString = await response.Content.ReadAsStringAsync();
                        return JsonConvert.DeserializeObject<List<MappedCoach>>(responseString);
                    }
                }
                else return new List<MappedCoach>();
            }
            catch (Exception e)
            {
                // TODO: Log error                
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<MappedFranchisee>> GetFranchisees(string remoteCoachId)
        {
            var request = new HttpRequestMessage();

            try
            {
                var uId = _contextAccessor.HttpContext.GetUser().Id;
                IntegrationMapping franchisor = new IntegrationMapping();
                var mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationMapping>(userContext: uId);

                var FranchisorMapped = mapperRepo.GetAll().Where(x => x.LocalId == remoteCoachId).FirstOrDefault();

                if (FranchisorMapped != null)
                {
                    using (SmartLinkClient)
                    {
                        List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                        optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                        optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Coach", Operator = "Equals", Value = FranchisorMapped.RemoteId });

                        var apiEntity = new IntegrationOptionEntity() { AllColumns = true, Conditions = optionConditions };

                        var payload = JsonSerializer.Serialize(apiEntity);
                        //{ "AllColumns":true,"Columns":null,"Related":null,"Conditions":[{ "Column":"Status","Operator":"Equals","Value":"Active"},{ "Column":"Franchisor","Operator":"Equals","Value":"7911a744-4584-e811-817d-0800274bb0e4"}]}
                        var content = new StringContent(payload, Encoding.UTF8, "application/json");
                        var response = await SmartLinkClient.PostAsync("Franchisee", content);

                        if (!response.IsSuccessStatusCode)
                        {
                            throw new HttpRequestException("SmartLink API Error: " + response.StatusCode);
                        }
                        using var responseStream = await response.Content.ReadAsStreamAsync();
                        var responseString = await response.Content.ReadAsStringAsync();
                        return JsonConvert.DeserializeObject<List<MappedFranchisee>>(responseString);
                    }
                }
                else return new List<MappedFranchisee>();
            }
            catch (Exception e)
            {
                // TODO: Log error                
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }
        public async Task<List<MappedChildCaregiver>> GetChildren(string remoteFranchiseeId)
        {
            var request = new HttpRequestMessage();

            try
            {
                var uId = _contextAccessor.HttpContext.GetUser().Id;
                IntegrationMapping franchisor = new IntegrationMapping();
                var mapperRepo = _repositoryFactory.CreateGenericRepository<IntegrationMapping>(userContext: uId);

                var FranchisorMapped = mapperRepo.GetAll().Where(x => x.RemoteId == remoteFranchiseeId).FirstOrDefault();

                if (FranchisorMapped != null)
                {
                    using (SmartLinkClient)
                    {
                        List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                        optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                        optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Coach", Operator = "Equals", Value = FranchisorMapped.RemoteId });

                        var apiEntity = new IntegrationOptionEntity() { AllColumns = true, Conditions = optionConditions };

                        var payload = JsonSerializer.Serialize(apiEntity);
                        //{ "AllColumns":true,"Columns":null,"Related":null,"Conditions":[{ "Column":"Status","Operator":"Equals","Value":"Active"},{ "Column":"Franchisor","Operator":"Equals","Value":"7911a744-4584-e811-817d-0800274bb0e4"}]}
                        var content = new StringContent(payload, Encoding.UTF8, "application/json");
                        var response = await SmartLinkClient.PostAsync("Franchisee", content);

                        if (!response.IsSuccessStatusCode)
                        {
                            throw new HttpRequestException("SmartLink API Error: " + response.StatusCode);
                        }
                        using var responseStream = await response.Content.ReadAsStreamAsync();
                        var responseString = await response.Content.ReadAsStringAsync();
                        //TODO: fix this to be properly Child and Cregiver objects
                        return JsonConvert.DeserializeObject<List<MappedChildCaregiver>>(responseString);
                    }
                }
                else return new List<MappedChildCaregiver>();
            }
            catch (Exception e)
            {
                // TODO: Log error                
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }
    }
}
