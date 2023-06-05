using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using static EcdLink.Api.CoreApi.Constants;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace EcdLink.Api.CoreApi.Managers.Integration
{
    public class IntegrationAPIManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private HttpClient _smartLinkClient;
        private readonly ISystemSetting<IntegrationApiOptions> _options;
        private IntegrationLogManager _logManager;

        public IntegrationAPIManager(
            IHttpContextAccessor contextAccessor, IGenericRepositoryFactory repoFactory, IntegrationLogManager logManager, ISystemSetting<IntegrationApiOptions> options)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _logManager = logManager;
            _options = options;
        }

        public HttpClient SmartLinkClient
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

        public async Task<string> GetAPIHandlerResponse(string endpointUrl, List<IntegrationOptionConditionEntity> optionConditions = null, List<IntegrationOptionRelatedEntity> relatedConditions = null, bool showOptions = true, bool isPut = false, string postString = "")
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
                        //var response = !isPut ? await SmartLinkClient.PostAsync(endpointUrl, content) : await SmartLinkClient.PutAsync(endpointUrl, content);
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
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetAPIHandlerResponse > " + endpointUrl + " > " + postString);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        #region Get API Entity

        public async Task<List<RecordChange>> GetRecordChangesBetweenDates(DateTime startDate, DateTime endDate)
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
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetRecordChangesBetweenDates > " + startDate + " " + endDate);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<ColumnChange>> GetColumnChangesBetweenDates(DateTime startDate, DateTime endDate)
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
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetColumnChangesBetweenDates > " + startDate + " " + endDate);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }


        public async Task<List<MappedCoach>> GetCoaches(string remoteFranchisorId)
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
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetCoaches > " + remoteFranchisorId);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<MappedFranchisee>> GetFranchiseesByCoach(string remoteCoachId)
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
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetFranchiseesByCoach > " + remoteCoachId);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<MappedFranchisee>> GetFranchiseesById(string remoteId)
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
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetFranchiseesById > " + remoteId);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<MappedTrainee>> GetTraineesByCoach(string remoteCoachId)
        {
            try
            {
                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Coach", Operator = "Equals", Value = remoteCoachId });

                //List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
                //relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "Fra", AllColumns = "True", Columns = "", JoinType = "Outer" });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SSTrainee + SSIntegrationSettings.QueryAll, optionConditions, null);
                return JsonConvert.DeserializeObject<List<MappedTrainee>>(responseString);

            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetTraineesByCoach > " + remoteCoachId);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<MappedTrainee>> GetTraineesById(string remoteId)
        {
            try
            {
                //List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
                //relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "SiteAddress", AllColumns = "True", Columns = "", JoinType = "Outer" });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLTrainee + SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", remoteId), null, null);

                var trainee = JsonConvert.DeserializeObject<MappedTrainee>(responseString);



                return new List<MappedTrainee> { trainee };

            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetTraineesById > " + remoteId);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<MappedChild>> GetChildren(string remoteFranchiseeId)
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
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetChildren > " + remoteFranchiseeId);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<MappedChild>> GetChildById(string remoteChildId)
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
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetChildById > " + remoteChildId);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<MappedCaregiver>> GetCareGiversByFranchisee(string remoteFranchiseeId)
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
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetCareGiversByFranchisee > " + remoteFranchiseeId);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<MappedDocument>> GetFranchiseeDocuments(string remoteFranchiseeId)
        {
            try
            {
                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = SSIntegrationSettings.SLPractitioner, Operator = "Equals", Value = remoteFranchiseeId });
                List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
                relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "DocumentType", AllColumns = "True", Columns = "" });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLDocument + SSIntegrationSettings.QueryAll, optionConditions, relatedConditions);
                return JsonConvert.DeserializeObject<List<MappedDocument>>(responseString);
            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetFranchiseeDocuments > " + remoteFranchiseeId);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        public async Task<List<MappedDocument>> GetChildDocuments(string remoteChildId)
        {
            try
            {
                List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = SSIntegrationSettings.SLChild, Operator = "Equals", Value = remoteChildId });
                List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
                relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "DocumentType", AllColumns = "False", Columns = "Name" });

                var responseString = await GetAPIHandlerResponse(SSIntegrationSettings.SLDocument + SSIntegrationSettings.QueryAll, optionConditions, relatedConditions);
                return JsonConvert.DeserializeObject<List<MappedDocument>>(responseString);
            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetChildDocuments > " + remoteChildId);
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }
        }

        #endregion
    }
}

