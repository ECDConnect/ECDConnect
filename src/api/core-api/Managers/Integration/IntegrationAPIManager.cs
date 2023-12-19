using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace EcdLink.Api.CoreApi.Managers.Integration;

public class IntegrationAPIManager
{
    public class APIHandleResponse
    {
        public bool Success;
        public string ResponseCode;
        public string ResponseString;
    }

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

    public async Task<APIHandleResponse> GetAPIHandlerResponse(string endpointUrl, string[] columns, List<IntegrationOptionConditionEntity> optionConditions = null, List<IntegrationOptionRelatedEntity> relatedConditions = null, bool showOptions = true, bool isPut = false, string postString = "")
    {
        var payload = "";
        string responseString = null;
        var isSuccess = false;
        string responseCode = "";

        try
        {
            using (SmartLinkClient)
            {
                if (SmartLinkClient != null)
                {
                    var apiEntity = new IntegrationOptionEntity() { AllColumns = (columns==null ? true : false), Columns = columns, Conditions = optionConditions, Related = relatedConditions };
                    var serializeOptions = new JsonSerializerOptions
                    {
                        WriteIndented = true,
                        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                    };
                    payload = JsonSerializer.Serialize(apiEntity, serializeOptions);
                    var content = showOptions ? new StringContent(payload, Encoding.UTF8, "application/json") : new StringContent(postString, Encoding.UTF8, "application/json");

                    var response = !isPut ? await SmartLinkClient.PostAsync(endpointUrl, content) : await SmartLinkClient.PutAsync(endpointUrl, content);
                    
                    responseCode = response.StatusCode.ToString();

                    using var responseStream = await response.Content.ReadAsStreamAsync();

                    responseString = await response.Content.ReadAsStringAsync();
                    isSuccess = responseCode == "OK" ? true : false;
                }
            }
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetAPIHandlerResponse > " + endpointUrl + " > " + postString);
        }
        finally
        {
             await _logManager.IntegrationLog(
                 $"SmartLink API GetAPIHandlerResponse ({endpointUrl}) {(isSuccess ? "Success" : "Error")} Error: {responseCode}. Request: {payload} Response: {responseString}", 
                 postString, 
                 null, 
                 isSuccess ? LogRelatedType.Log : LogRelatedType.Error, 
                 $"GetAPIHandlerResponse > {endpointUrl} > {postString}");            
        }

        return new APIHandleResponse
        {
            Success = responseCode == "OK" && !responseString.StartsWith("{\"ExceptionMessage\":\""),
            ResponseCode = responseCode,
            ResponseString = responseString
        };
    }

    #region Get API Entity

    public async Task<List<RecordChange>> GetRecordChangesBetweenDates(DateTime startDate, DateTime endDate)
    {
        try 
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "DateTimeStamp", Operator = "GreaterOrEqual", Value = startDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "DateTimeStamp", Operator = "LessOrEqual", Value = endDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") });
            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLRecordChange + Constants.SSIntegrationSettings.QueryAll,columns, optionConditions, null);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<List<RecordChange>>(apiResponse.ResponseString);
            } 
            else
            {
                 await _logManager.IntegrationLog("GetRecordChangesBetweenDates failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetRecordChangesBetweenDates > " + startDate + " " + endDate);
                 return null;
            }
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetRecordChangesBetweenDates > " + startDate + " " + endDate);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<List<ColumnChange>> GetColumnChangesBetweenDates(DateTime startDate, DateTime endDate)
    {
        var serializeOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };

        try
        {
            string[] columns = new[] { "Guid", "Column", "DateTimeStamp", "RecordChange", "NewValue", "Entity", "Status" };
            
            var relatedConditions = new List<IntegrationOptionRelatedEntity>
            {
                new IntegrationOptionRelatedEntity() 
                { 
                    RelatedBy = "RecordChange",
                    Columns = new[] { "EntityName", "RecordGuid", "RelatedEntityGuid", "ChangeType", "DateTimeStamp", "RelatedEntityType" }, 
                    Conditions = new IntegrationOptionConditionEntity()
                    {
                        Column = "EntityName", 
                        Operator = "In",
                        Value = new [] { "Franchisee","Child","Coach","Franchisor","Caregiver","Address","Document" }
                    }
                }
            };

            var optionConditions = new List<IntegrationOptionConditionEntity>
            {
                new IntegrationOptionConditionEntity() { Column = "DateTimeStamp", Operator = "GreaterOrEqual", Value = startDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") },
                new IntegrationOptionConditionEntity() { Column = "DateTimeStamp", Operator = "LessOrEqual", Value = endDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") }
            };

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLColumnChange + Constants.SSIntegrationSettings.QueryAll, columns, optionConditions, relatedConditions);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<List<ColumnChange>>(apiResponse.ResponseString);
            }
            else
            {
               await _logManager.IntegrationLog("GetColumnChangesBetweenDates failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetColumnChangesBetweenDates > " + startDate + " " + endDate);
               return null; 
            }
            
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, $"GetColumnChangesBetweenDates > {startDate} {endDate}");
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<RemoteChangesList> GetMappedColumnChangesBetweenDates(DateTime startDate, DateTime endDate)
    {
        try
        {
            var changes = new RemoteChangesList();
            var remoteLogs = await GetColumnChangesBetweenDates(startDate, endDate);
            string[] excludes = { "Caregiver" };
            if (remoteLogs != null)
            {
                foreach (var change in remoteLogs)
                {
                    var updateEntity = new UpdateLocalEntity()
                    {
                        Guid = change.RecordChange.RecordGuid,
                        RelatedGuid = change.RecordChange.RelatedEntityGuid,
                        RelatedEntityType = change.RecordChange.RelatedEntityType,  //related is always the parent
                        EntityColumn = change.Column,
                        EntityType = change.Entity,
                        LastUpdatedDateTime = change.DateTimeStamp,
                        NewData = change.NewValue
                    };
                    switch (change.RecordChange.ChangeType)
                    {
                        case SLChangeType.Delete:
                        case SLChangeType.Deactivate:
                            changes.Deletes.Add(updateEntity);
                            break;
                        case SLChangeType.Insert:
                        case SLChangeType.Create:
                            if (!changes.Inserts.Where(x => string.Equals(x.Guid, updateEntity.Guid) && string.Equals(x.EntityType, updateEntity.EntityType)).Any())
                            {  //do not insert inserts of the same kind and ids
                               //exclude any entities in the xclude list from being added, they are usually associated
                                if (!excludes.Contains(updateEntity.EntityType))
                                    changes.Inserts.Add(updateEntity);
                            }
                            break;
                        default:
                            changes.Updates.Add(updateEntity);
                            break;
                    }
                }
            }
             return changes;
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetColumnChangesBetweenDates > " + startDate + " " + endDate);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }


    public async Task<List<MappedCoach>> GetCoaches(string remoteFranchisorId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Franchisor", Operator = "Equals", Value = remoteFranchisorId });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLCoach + Constants.SSIntegrationSettings.QueryAll,columns, optionConditions, null);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<List<MappedCoach>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetCoaches failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetCoaches > " + remoteFranchisorId);
                return null;
            }    
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetCoaches > " + remoteFranchisorId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<List<MappedCoach>> GetCoachesAll(string remoteCoachId = null)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            if (remoteCoachId != null)
            {
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Guid", Operator = "Equals", Value = remoteCoachId });
            }

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLCoach + Constants.SSIntegrationSettings.QueryAll, columns, optionConditions, null);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<List<MappedCoach>>(apiResponse.ResponseString);
            }
            else 
            {
                await _logManager.IntegrationLog("GetCoachesAll failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetCoachesAll > " + remoteCoachId);
                return null;
            }   
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetCoachesAll > " + remoteCoachId);
            return null;
        }
    }

    public async Task<MappedFranchisor> GetFranchisorById(string remoteId)
    {
        try
        {
            string[] columns = null; 
            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            //relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "SiteAddress", AllColumns = "True", Columns = "", JoinType = "Outer" });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLFranchisor + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", remoteId), columns, null, relatedConditions);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<MappedFranchisor>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetFranchiseesById failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetFranchiseesById > " + remoteId);
                return null;
            }    

        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetFranchiseesById > " + remoteId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<List<MappedFranchisee>> GetFranchiseesByCoach(string remoteCoachId)
    {
        try
        {
            string[] columns = { "IdNumber", "FirstName", "Surname", "PersonalNumber", "WhatsAppNumber", "BirthDate", "CountryOfCitizenship", "EmailAddress", "EmergencyContactPhoneNumber", "EmergencyContactFirstName", "EmergencyContactSurname", "NextOfKinFirstName", "NextOfKinSurname", "NextOfKinContactNumber", "InactivityComments", "MonthsSinceFranchisee", "IsSouthAfricanCitizen", "VerifiedByHomeAffairs", "ConsentForPhoto", "IsPrincipal", "AttendedChildProgress", "AttendedBusinessSkills", "IsClubLeader", "StartDate", "InactiveDate", "Gender", "ProgrammeType", "EthnicGroup", "Province", "LanguageUsedInGroups", "ReasonForLeaving", "PreferredCommunicationLanguage", "StipendType", "Coach", "Principal", "SiteAddress", "Club", "LatestPQADate" };//"AttendedFirstAid",rn 
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Coach", Operator = "Equals", Value = remoteCoachId });

            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "SiteAddress", AllColumns = "True", Columns = null, JoinType = "Outer" });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLPractitionerQueryAll,columns, optionConditions, relatedConditions);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<List<MappedFranchisee>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetFranchiseesByCoach failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetFranchiseesByCoach > " + remoteCoachId);
                return null;
            }    

        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetFranchiseesByCoach > " + remoteCoachId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }


    public async Task<List<MappedFranchisee>> GetFranchiseesById(string remoteId)
    {
        try
        {
            string[] columns = { "IdNumber", "FirstName", "Surname", "PersonalNumber", "WhatsAppNumber", "BirthDate", "CountryOfCitizenship", "EmailAddress", "EmergencyContactPhoneNumber", "EmergencyContactFirstName", "EmergencyContactSurname", "NextOfKinFirstName", "NextOfKinSurname", "NextOfKinContactNumber", "InactivityComments", "MonthsSinceFranchisee", "IsSouthAfricanCitizen", "VerifiedByHomeAffairs", "ConsentForPhoto", "IsPrincipal", "AttendedChildProgress", "AttendedBusinessSkills", "IsClubLeader", "StartDate", "InactiveDate", "Gender", "ProgrammeType", "EthnicGroup", "Province", "LanguageUsedInGroups", "ReasonForLeaving", "PreferredCommunicationLanguage", "StipendType", "Coach", "Principal", "SiteAddress", "Club", "LatestPQADate" };//"AttendedFirstAid",rn 
            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "SiteAddress", AllColumns = "True", Columns = null, JoinType = "Outer" });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLPractitionerQueryByGuid.Replace("{{Guid}}", remoteId), columns, null, relatedConditions);

            if (apiResponse.Success) //success
            {
                   var franchisee = JsonConvert.DeserializeObject<MappedFranchisee>(apiResponse.ResponseString);
                   return new List<MappedFranchisee> { franchisee };
            }
            else
            {
                await _logManager.IntegrationLog("GetFranchiseesById failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetFranchiseesById > " + remoteId);
                return null;
            }    

        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetFranchiseesById > " + remoteId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<List<MappedTrainee>> GetTraineesByCoach(string remoteCoachId, bool traineesOnly = true)
    {
        try
        {
            string[] columns = null; 
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            if (traineesOnly)
            {
                optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "IsFranchisee", Operator = "Equals", Value = "False" });
            }
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Coach", Operator = "Equals", Value = remoteCoachId });

            //List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            //relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "Fra", AllColumns = "True", Columns = "", JoinType = "Outer" });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SSTrainee + Constants.SSIntegrationSettings.QueryAll,columns, optionConditions, null);

            if (apiResponse.Success) //success
            {
                 return JsonConvert.DeserializeObject<List<MappedTrainee>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetTraineesByCoach failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetTraineesByCoach > " + remoteCoachId);
                return null;
            }    
           

        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetTraineesByCoach > " + remoteCoachId);
            return null; 
        }
    }

    public async Task<MappedTrainee> GetTraineesById(string remoteId)
    {
        try
        {
            string[] columns = null;
            //List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            //relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "SiteAddress", AllColumns = "True", Columns = "", JoinType = "Outer" });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLTrainee + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", remoteId),columns, null, null);

            if (apiResponse.Success) //success
            {
                 return JsonConvert.DeserializeObject<MappedTrainee>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetTraineesById failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetTraineesById > " + remoteId);
                return null;
            }    
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetTraineesById > " + remoteId);
            return null; 
        }
    }

    public async Task<List<MappedChild>> GetChildren(string remoteFranchiseeId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = Constants.SSIntegrationSettings.SLPractitioner, Operator = "Equals", Value = remoteFranchiseeId });

            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "Caregiver", AllColumns = "True", Columns = null, JoinType = "Outer" });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLChild + Constants.SSIntegrationSettings.QueryAll,columns, optionConditions, relatedConditions);

            if (apiResponse.Success) //success
            {
               return JsonConvert.DeserializeObject<List<MappedChild>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetChildren failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetChildren > " + remoteFranchiseeId);
                return null;
            }    
           
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetChildren > " + remoteFranchiseeId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<MappedChild> GetChildById(string remoteChildId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "Caregiver", AllColumns = "True", Columns = null, JoinType = "Outer" });
            
            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLChild + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", remoteChildId),columns, null, relatedConditions);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<MappedChild>(apiResponse.ResponseString);
            }        
            else    
            {
                await _logManager.IntegrationLog("GetChildById failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetChildById > " + remoteChildId);
                return null; 
            }
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetChildById > " + remoteChildId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<List<MappedCaregiver>> GetCareGiversByFranchisee(string remoteFranchiseeId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = Constants.SSIntegrationSettings.SLPractitioner, Operator = "Equals", Value = remoteFranchiseeId });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLChild + Constants.SSIntegrationSettings.QueryAll, columns, optionConditions, null);

            if (apiResponse.Success) //success
            {
               return JsonConvert.DeserializeObject<List<MappedCaregiver>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetCareGiversByFranchisee failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetCareGiversByFranchisee > " + remoteFranchiseeId);
                return null;
            }   
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetCareGiversByFranchisee > " + remoteFranchiseeId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<List<MappedDocument>> GetFranchiseeDocuments(string remoteFranchiseeId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = Constants.SSIntegrationSettings.SLPractitioner, Operator = "Equals", Value = remoteFranchiseeId });
            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "DocumentType", AllColumns = "True", Columns = null });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLDocument + Constants.SSIntegrationSettings.QueryAll,columns, optionConditions, relatedConditions);

            if (apiResponse.Success) //success
            {
               return JsonConvert.DeserializeObject<List<MappedDocument>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetFranchiseeDocuments failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetFranchiseeDocuments > " + remoteFranchiseeId);
                return null;
            }   
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetFranchiseeDocuments > " + remoteFranchiseeId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<List<MappedDocument>> GetChildDocuments(string remoteChildId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = Constants.SSIntegrationSettings.SLChild, Operator = "Equals", Value = remoteChildId });
            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "DocumentType", AllColumns = "False", Columns = new[] { "Name" } });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLDocument + Constants.SSIntegrationSettings.QueryAll,columns, optionConditions, relatedConditions);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<List<MappedDocument>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetChildDocuments failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetChildDocuments > " + remoteChildId);
                return null;
            }  
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetChildDocuments > " + remoteChildId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<MappedDocument> GetDocumentsById(string remoteDocId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "DocumentType", AllColumns = "False", Columns = new[] { "Name" } });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLDocument + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", remoteDocId), columns, null, relatedConditions);

            if (apiResponse.Success) //success
            {
               return JsonConvert.DeserializeObject<MappedDocument>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GeDocumentsById failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GeDocumentsById > " + remoteDocId);
                return null;
            }     
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GeDocumentsById > " + remoteDocId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<List<MappedClub>> GetClubsByCoach(string remoteCoachId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Coach", Operator = "Equals", Value = remoteCoachId });

            //List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            //relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "Club", AllColumns = "True", Columns = "Coach", Operator = "Equals", Value = remoteCoachId });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SSClub + Constants.SSIntegrationSettings.QueryAll,columns, optionConditions, null);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<List<MappedClub>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetClubsByCoach failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetClubsByCoach > " + remoteCoachId);
                return null;
            }     
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetClubsByCoach > " + remoteCoachId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }
    public async Task<List<MappedClubMeeting>> GetClubMeetingByCoach(string remoteCoachId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "MeetingDate", Operator = "GreaterOrEqual", Value = DateTime.Now.GetStartOfYear().ToString("yyyy-MM-ddTHH:mm:ss.fffZ") });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "MeetingDate", Operator = "LessOrEqual", Value = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") });

            //this one is more advanced
            //List<IntegrationOptionRelatedConditionsEntity> relatedConditions = new List<IntegrationOptionRelatedConditionsEntity>();
            //relatedConditions.Add(new IntegrationOptionRelatedConditionsEntity() { RelatedBy = "Club", Conditions = new IntegrationOptionConditionEntity() { Column = "Coach", Operator = "Equals", Value = remoteCoachId } });

            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "Club",  Conditions = new IntegrationOptionConditionEntity() { Column = "Coach", Operator = "Equals", Value = remoteCoachId } });


            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLClubMeeting + Constants.SSIntegrationSettings.QueryAll, columns, optionConditions, relatedConditions);

            if (apiResponse.Success) //success
            {
               return JsonConvert.DeserializeObject<List<MappedClubMeeting>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetClubMeetingByCoach failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetClubMeetingByCoach > " + remoteCoachId);
                return null;
            }     
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetClubMeetingByCoach > " + remoteCoachId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<List<MappedClubMeetingRegister>> GetClubMeetingRegisterByFranchisee(string remoteFranchiseeId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Franchisee", Operator = "Equals", Value = remoteFranchiseeId });

            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "ClubMeeting", AllColumns = "True", Columns = null, Operator = "", Value = "", Conditions = new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active"  } });
            //this one is more advanced
            //List<IntegrationOptionRelatedConditionsEntity> relatedConditions = new List<IntegrationOptionRelatedConditionsEntity>();
            //relatedConditions.Add(new IntegrationOptionRelatedConditionsEntity() { RelatedBy = "ClubMeeting", Conditions = new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" } });


            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLClubMeetingRegister + Constants.SSIntegrationSettings.QueryAll, columns, optionConditions, relatedConditions);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<List<MappedClubMeetingRegister>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetClubMeetingRegisterByFranchisee failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetClubMeetingRegisterByFranchisee > " + remoteFranchiseeId);
                return null;
            }     
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetClubMeetingRegisterByFranchisee > " + remoteFranchiseeId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }
    public async Task<List<MappedClubMeetingRegister>> GetClubMeetingRegisterByCoach(string remoteCoachId)
    {
        try
        {
            string[] columns = null;
            List<IntegrationOptionConditionEntity> optionConditions = new List<IntegrationOptionConditionEntity>();
            optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" });
            //optionConditions.Add(new IntegrationOptionConditionEntity() { Column = "Coach", Operator = "Equals", Value = remoteCoachId });

            List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "Club", AllColumns = "True", Columns = new[] { "Coach" }, Operator = "Equals", Value = remoteCoachId });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLClubMeetingRegister + Constants.SSIntegrationSettings.QueryAll,columns, optionConditions, relatedConditions);

            if (apiResponse.Success) //success
            {
              return JsonConvert.DeserializeObject<List<MappedClubMeetingRegister>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetClubMeetingRegisterByCoach failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetClubMeetingRegisterByCoach > " + remoteCoachId);
                return null;
            }     
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetClubMeetingRegisterByCoach > " + remoteCoachId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }
    }

    public async Task<MappedAddress> GetAddressById(string remoteAddressId)
    {
        try
        {
            string[] columns = null;
            //List<IntegrationOptionRelatedEntity> relatedConditions = new List<IntegrationOptionRelatedEntity>();
            //relatedConditions.Add(new IntegrationOptionRelatedEntity() { RelatedBy = "DocumentType", AllColumns = "False", Columns = "Name" });

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLAddress + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", remoteAddressId), columns, null, null);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<MappedAddress>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetAddressById failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetAddressById > " + remoteAddressId);
                return null;
            }   
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetAddressById > " + remoteAddressId);
            return null; //throw new HttpRequestException("SmartLink API Error: " + e.Message);                
        }
    }

    public async Task<List<MappedPQA>> GetPQAByFranchisee(string remoteFranchiseeId)
    {
        try
        {
            var columns = new string[] 
            { 
                "DateOfVisit", 
                "StatusOutcome", 
                "Guid", 
                "Coach", 
                "StableAndNurturingScore",
                "StimulatingAndResourcedScore",
                "UseOfSmartStartRoutineScore",
                "InteractiveStoryTellingScore",
                "ChildOpportunitiesScore",
                "PositiveInteractionScore",
                "TotalScore"
            };

            var optionConditions = new List<IntegrationOptionConditionEntity>
            {
                new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" },
                new IntegrationOptionConditionEntity() { Column = "Franchisee", Operator = "Equals", Value = remoteFranchiseeId }
            };

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLPQA + Constants.SSIntegrationSettings.QueryAll, columns, optionConditions, null);

            if (apiResponse.Success) //success
            {
                return JsonConvert.DeserializeObject<List<MappedPQA>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetPQAByFranchisee failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetPQAByFranchisee > " + remoteFranchiseeId);
                return null;
            }   
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetPQAByFranchisee > " + remoteFranchiseeId);
            return null;
        }
    }

    public async Task<List<MappedSmartSpaceVisits>> GetSmartSpaceVisitsByFranchiseeTrainee(string remoteFranchiseeId)
    {
        try
        {
            string[] columns = { "DateOfVisit", "StatusOutcome", "Guid", "Coach" };
            var optionConditions = new List<IntegrationOptionConditionEntity>
            {
                new IntegrationOptionConditionEntity() { Column = "Status", Operator = "Equals", Value = "Active" },
                new IntegrationOptionConditionEntity() { Column = "Trainee", Operator = "Equals", Value = remoteFranchiseeId }
            };

            var apiResponse = await GetAPIHandlerResponse(Constants.SSIntegrationSettings.SLSmartSpaceVisit + Constants.SSIntegrationSettings.QueryAll, columns, optionConditions, null);

            if (apiResponse.Success) //success
            {
               return JsonConvert.DeserializeObject<List<MappedSmartSpaceVisits>>(apiResponse.ResponseString);
            }
            else
            {
                await _logManager.IntegrationLog("GetPQAByFranchisee failed ", " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "GetPQAByFranchisee > " + remoteFranchiseeId);
                return null;
            }   
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetPQAByFranchisee > " + remoteFranchiseeId);
            return null;
        }
    }

    #endregion
}

