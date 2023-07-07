using EcdLink.Api.CoreApi.GraphApi.Queries;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using static SmartStart.Integration.Constants;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System;
//using SmartStart.Integration.Models;
using SmartStart.Integration.Managers;
using SmartStart.Integration;
using System.Linq;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using ECDLink.AzureStorage.Blob;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using Microsoft.EntityFrameworkCore;
using static ECDLink.Core.SystemSettings.SettingGroups;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.PQA;
using ECDLink.DataAccessLayer.Entities.SmartSpaceVisit;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Tenancy.Context;
using ECDLink.DataAccessLayer.Entities.Documents;

using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Core.Extensions;
using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;

namespace EcdLink.Api.CoreApi.Services
{
    public class SmartStartIntegrationService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly ISystemSetting<IntegrationDelayOptions> _integrationDelay;
        private readonly ISystemSetting<IntegrationApiOptions> _options;
        private IHttpContextAccessor _contextAccessor;
        private string _uId;
        private UserManager<ApplicationUser> _userManager;
        //private PersonnelService _personnelService;
        private IGenericRepository<IntegrationAudit, Guid> _auditRepo;
        private IGenericRepository<IntegrationEntityMapping, Guid> _mapperRepo;
        private IGenericRepository<IntegrationColumnMapping, Guid> _columnmapperRepo;
        private IGenericRepository<SiteAddress, Guid> _siteAddressRepo;
        private AuthenticationDbContext _dbContext;
        private IGenericRepository<Classroom, Guid> _classroomGenericRepo;
        private IGenericRepository<ClassroomGroup, Guid> _classroomGroupGenericRepo;
        private IGenericRepository<ProgrammeType, Guid> _programmeTypeGenericRepo;
        private IGenericRepository<Language, Guid> _staticLanguageRepo;
        private IGenericRepository<Gender, Guid> _staticGenderRepo;
        private IGenericRepository<Race, Guid> _staticRaceRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerGenericRepo;
        private IGenericRepository<Child, Guid> _childRepo;
        private IGenericRepository<Child, Guid> _childGenericRepo;
        private IGenericRepository<Coach, Guid> _coachGenericRepo;
        //private IGenericRepository<Franchisor, Guid> _franchisorGenericRepo;
        private IGenericRepository<Caregiver, Guid> _caregiverRepo;
        private IGenericRepository<Relation, Guid> _staticRelationRepo;
        private IGenericRepository<Education, Guid> _staticEducationRepo;
        private IGenericRepository<Grant, Guid> _staticGrantRepo;
        private IGenericRepository<WorkflowStatus, Guid> _staticWorkflowRepo;
        private IGenericRepository<Document, Guid> _docRepo;
        private IGenericRepository<WorkflowStatus, Guid> _workflowRepo;
        private IGenericRepository<StatementsIncomeStatement, Guid> _statementsRepo;
        private IGenericRepository<Trainee, Guid> _traineeRepo;
        private IGenericRepository<Club, Guid> _clubRepo;
        private IGenericRepository<ClubMeeting, Guid> _clubMeetingRepo;
        private IGenericRepository<ClubMeetingRegister, Guid> _clubMeetingRegisterRepo;
        private IGenericRepository<SmartSpaceVisit, Guid> _smartSpaceVisitRepo;
        private IGenericRepository<PQA, Guid> _pqaRepo;

        private IntegrationLogManager _logManager;
        private IntegrationAPIManager _apiManager;
        //private ISchedulerService _schedulerService;
        private IFileService _fileService;
        private ECDLink.Core.Services.IncomeExpenseService _incomeManager;
        private IntegrationHelperManager _integrationHelperManager;
        private AttendanceTrackingRepository _attendanceTrackingRepository;

        private MappingMode _apiMode;
        private MappingMaskDataMode _maskMode;
        private readonly HierarchyEngine _hierarchyEngine;
        List<string> _errorsList = new List<string>();

        public static string password = "AQAAAAIAAYagAAAAEMsJuBqbYVml/ZCL4iKjPx8E7MgdBej7VYDmyM0JmGgUODifvGKiB4MhfiNO72w9Nw==";//ECDConnect123!
        public static string securityStamp = "7MLVEAR2UK2APFPOBGP4BPN7XJ4IJGQ6";
        public static string concurrencystamp = "a7ce158a-30c5-4cfb-aee2-027c000b8df6";
        public Guid tenantId = TenantExecutionContext.Tenant.Id;
        public List<IntegrationEntityMapping> _mappedEntities;
        public List<IntegrationColumnMapping> _mappedColumns;
        public List<IntegrationAudit> _audits;

        public DateTime _startTime = DateTime.Now;
        public static string scheduledTask = "SmartLinkIntegrationDataSync";


        public SmartStartIntegrationService(IGenericRepositoryFactory repositoryFactory,
        ISystemSetting<IntegrationDelayOptions> integrationDelay,
        ISystemSetting<IntegrationApiOptions> options,
        [Service] IHttpContextAccessor contextAccessor,
        [Service] UserManager<ApplicationUser> userManager,
        HierarchyEngine hierarchyEngine,
        //[Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
        //[Service] InvitationNotificationManager notificationManager,
         AuthenticationDbContext dbContext,
         //[Service] PersonnelService personnelService,
         IntegrationLogManager logManager,
         IntegrationAPIManager apiManager,
         IntegrationHelperManager integrationHelperManager,
         //[Service] ISchedulerService schedulerService,
         [Service] IFileService fileService,
         [Service] ECDLink.Core.Services.IncomeExpenseService incomeManager,
         [Service] AttendanceTrackingRepository attendanceTrackingRepository) {

            _repositoryFactory = repositoryFactory;
            _integrationDelay = integrationDelay;
            _options = options;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            _hierarchyEngine = hierarchyEngine;
            _dbContext = dbContext;
            //_personnelService = personnelService;
            //_schedulerService = schedulerService;
            _fileService = fileService;
            _incomeManager = incomeManager;
            _integrationHelperManager = integrationHelperManager;
            _logManager = logManager;
            _apiManager = apiManager;

            _uId = _hierarchyEngine.GetIntegrationUserId();
            Enum.TryParse(_options.Value.Mode, out _apiMode);
            Enum.TryParse(_options.Value.MaskDataMode, out _maskMode);

            //Generic static repos
            _mapperRepo = repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
            _columnmapperRepo = repositoryFactory.CreateGenericRepository<IntegrationColumnMapping>(userContext: _uId);
            _auditRepo = repositoryFactory.CreateGenericRepository<IntegrationAudit>(userContext: _uId);
            //_siteAddressRepo = repositoryFactory.CreateGenericRepository<SiteAddress>(userContext: _uId);

            //_classroomGenericRepo = repositoryFactory.CreateGenericRepository<Classroom>(userContext: _uId);
            //_classroomGroupGenericRepo = repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _uId);
            //_programmeTypeGenericRepo = repositoryFactory.CreateGenericRepository<ProgrammeType>(userContext: _uId);
            //_staticLanguageRepo = repositoryFactory.CreateGenericRepository<Language>(userContext: _uId);
            //_staticGenderRepo = repositoryFactory.CreateGenericRepository<Gender>(userContext: _uId);
            //_staticRaceRepo = repositoryFactory.CreateGenericRepository<Race>(userContext: _uId);
            _practitionerRepo = repositoryFactory.CreateRepository<Practitioner>(userContext: _uId);
            _practitionerGenericRepo = repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
            //_coachGenericRepo = repositoryFactory.CreateGenericRepository<Coach>(userContext: _uId);
            //_franchisorGenericRepo = repositoryFactory.CreateGenericRepository<Franchisor>(userContext: _uId);
            //_traineeRepo = repositoryFactory.CreateGenericRepository<Trainee>(userContext: _uId);

            _childRepo = repositoryFactory.CreateRepository<Child>(userContext: _uId);
            _childGenericRepo = repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);
            _caregiverRepo = repositoryFactory.CreateGenericRepository<Caregiver>(userContext: _uId);
            //_staticRelationRepo = repositoryFactory.CreateGenericRepository<Relation>(userContext: _uId);
            //_staticEducationRepo = repositoryFactory.CreateGenericRepository<Education>(userContext: _uId); ;
            //_staticGrantRepo = repositoryFactory.CreateGenericRepository<Grant>(userContext: _uId);
            //_staticWorkflowRepo = repositoryFactory.CreateGenericRepository<WorkflowStatus>(userContext: _uId);
            _docRepo = repositoryFactory.CreateGenericRepository<Document>(userContext: _uId);
            _workflowRepo = repositoryFactory.CreateGenericRepository<WorkflowStatus>(userContext: _uId);
            _statementsRepo = repositoryFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _uId);

            //_pqaRepo = _repositoryFactory.CreateGenericRepository<pqa>(userContext: _uId);
            _attendanceTrackingRepository = attendanceTrackingRepository;

        }


        public async Task<bool> IntegrationStatementsData()
        {
            bool isComplete = false;
            string statementsUrl = SSIntegrationSettings.SLIncomeStatementIncome + SSIntegrationSettings.CreateMultiple;

            IntegrationService service = new IntegrationService(_repositoryFactory, _integrationDelay, _options, _contextAccessor, _userManager, _hierarchyEngine, _dbContext, _logManager, _apiManager, _integrationHelperManager, _fileService);// _incomeManager, _attendanceTrackingRepository

            //TODO: change to run by entities that need sto have docs sent rather than waiting for docs to be picked up - what if autosubmit doesnt run
            var mappedDocTypes = await service.GetMappedGroupingEntities("DocumentType");
            var statementType = mappedDocTypes.Where(x => x.LocalEntity.Equals("IncomeStatementPDF")).FirstOrDefault();
            var _mappedEntities = await service.GetMappedEntities(SSIntegrationSettings.SSPractitioner);
            DateTime newIncomeStatementPeriod = DateTime.Now.GetStartOfPreviousMonth().AddDays(25).Date; //from the 25th of the previous month is open submission time
            List<IntegrationEntityMapping> statementsDueList = _mappedEntities.Where(x => (x.LastIncomeSubmittedDate == null || x.LastIncomeSubmittedDate <= newIncomeStatementPeriod)).ToList();
            /**/
            foreach (var prac in statementsDueList)
            {
                var statements = _docRepo.GetAll().Where(d => d.DocumentTypeId.ToString() == statementType.LocalId && string.Equals(d.UserId, prac.UserId) && d.Reference != null).ToList();//d.UserId.Equals("6fc08fe0-91fa-4a5d-91ad-24be9aaf02e6") &&
                if (statements.Count > 0)
                {
                    foreach (var statement in statements)
                    {
                        string remoteStatementId = "";
                        //get associated audit lines
                        List<IntegrationAudit> audits = await service.GetAudits("Document", statement.UserId, 30);
                        audits = audits.Where(x => x.Submitted == null && x.RelatedId == statement.Id.ToString()).ToList(); //filter audits where these docs have been created and in audit log as unsubmitted
                        //if (audits.Count > 0)
                        //{
                            //Write statements lines
                            string remoteDocId = await service.PushNewDocument(statement);

                            if (!string.IsNullOrEmpty(remoteDocId))
                            {
                                DateTime timePeriod = DateTime.Now;//.AddMonths(-1)
                                List<IncomeExpensePDFTableModel> statementData = new IncomeStatementsQueryExtension().GetStatementsIncomeExpensesPDFData(_incomeManager, prac.UserId, timePeriod.Year, timePeriod.Month);
                                double dStartupSupport = 0.0; double dFees = 0.0; double dDonations = 0.0; double dFundRaising = 0.0; double dOtherIncome = 0.0;
                                double dRent = 0.0; double dUtilities = 0.0; double dFood = 0.0; double dSalary = 0.0; double dTransport = 0.0; double dOtherExpenses = 0.0;
                                //calculate based on categories
                                foreach (var statementLine in statementData)
                                {
                                    foreach (var dataLine in statementLine.Data)
                                    {
                                        //TODO: add transport and wages and fundraising
                                        switch (statementLine.TableName)//dataLine.Type
                                    {
                                            case "Startup Support":
                                                dStartupSupport += dataLine.Amount;
                                                break;
                                            case "Rent":
                                                dRent += dataLine.Amount;
                                                break;
                                            case "Food":
                                                dFood += dataLine.Amount;
                                                break;
                                            case "Subcontractor Wages":
                                                dSalary += dataLine.Amount;
                                                break;
                                            case "Learning Materials":
                                            case "Maintenance":
                                                dOtherExpenses += dataLine.Amount;
                                                break;
                                            case "Utilities":
                                                dUtilities += dataLine.Amount;
                                                break;
                                            case "Preschool Fee":
                                                dFees += dataLine.Amount;
                                                break;
                                            case "Donation":
                                                dDonations += dataLine.Amount;
                                                break;
                                            case "DBE Subsidy":
                                                dDonations += dataLine.Amount;
                                                break;
                                            case "Other":
                                                if (statementLine.Type == "Income")
                                                    dOtherIncome += dataLine.Amount;
                                                else
                                                    dOtherExpenses += dataLine.Amount;
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }

                                StringBuilder jsonStatementString = new StringBuilder();
                                jsonStatementString.AppendLine("[{");
                                jsonStatementString.AppendLine("\"Month\":\"" + timePeriod.ToString("MMMM") + "\",");
                                jsonStatementString.AppendLine("\"Year\":\"" + timePeriod.Year + "\",");

                                jsonStatementString.AppendLine("\"StartupSupport\":" + dStartupSupport + ",");
                                jsonStatementString.AppendLine("\"Fees\":" + dFees + ",");
                                jsonStatementString.AppendLine("\"Donations\":" + dDonations + ",");
                                jsonStatementString.AppendLine("\"FundRaising\":" + dFundRaising + ",");
                                jsonStatementString.AppendLine("\"OtherIncome\":" + dOtherIncome + ",");
                                jsonStatementString.AppendLine("\"Rent\":" + dRent + ",");
                                jsonStatementString.AppendLine("\"Utilities\":" + dUtilities + ",");
                                jsonStatementString.AppendLine("\"Food\":" + dFood + ",");
                                jsonStatementString.AppendLine("\"Salary\":" + dSalary + ",");
                                jsonStatementString.AppendLine("\"Transport\":" + dTransport + ",");
                                jsonStatementString.AppendLine("\"OtherExpenses:\":" + dOtherExpenses + ",");
                                jsonStatementString.AppendLine("\"Franchisee\":{\"Guid\": \"" + prac.RemoteId + "\"},");
                                //jsonStatementString.AppendLine("\"Document\":{\"Guid\": \"" + remoteDocId + "\"}");
                                jsonStatementString.AppendLine("}]");
                                //[{"Month": "January","Year": "2023","StartupSupport": 10.0,"Fees": 0.0,"Donations": 10.0,"FundRaising": 10.0,"OtherIncome": 10.0,"Rent": 10.0,"Utilities": 10.0,"Food": 10.0,"Salary": 10.0,"Transport": 10.0,"OtherExpenses": 10.0,"Franchisee": {"Guid": "4778287e-073f-e711-80e0-005056815442"},"Document": {"Guid": "9c029379-3996-ec11-834e-00155dee5a05"}}]
                                try
                                {
                                    //now send to API call <entity type>/Multiple
                                    var responseString = await _apiManager.GetAPIHandlerResponse(statementsUrl, null, null, null, false, false, jsonStatementString.ToString());
                                    if (!string.IsNullOrEmpty(responseString))
                                    {
                                        var returnObj = (JArray)JsonConvert.DeserializeObject(responseString);
                                        if (returnObj != null)
                                        {
                                            remoteStatementId = returnObj.Count > 0 ? returnObj[0].ToString() : null;
                                        if (audits.Count > 0)
                                        {
                                            await _logManager.UpdateAuditSubmitted(audits);
                                        }

                                            //no need to insert entity mapping item for statements as long as document saved
                                            isComplete = true;
                                            //update entity to note its statements has been sent
                                            prac.LastIncomeSubmittedDate = DateTime.Now;
                                            _mapperRepo.Update(prac);

                                        }
                                        else //error empty response received
                                        {
                                            await _logManager.IntegrationLog("Data Push Fail: ", jsonStatementString.ToString() + " | " + responseString, null, LogRelatedType.Error, "IntegrationStatementsData > GetAPIHandlerResponse");
                                        }
                                    }
                                }
                                catch (Exception e)
                                {
                                    await _logManager.IntegrationLog("SmartLink API Error: " + e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationStatementsData > GetAPIHandlerResponse");
                                }
                            }
                        //}
                    }
                }
            }
            /**/

            return isComplete;
        }


        public async Task<bool> IntegrationAttendanceData()
        {
            bool isComplete = false;
            IntegrationService service = new IntegrationService(_repositoryFactory, _integrationDelay, _options, _contextAccessor, _userManager, _hierarchyEngine, _dbContext, _logManager, _apiManager, _integrationHelperManager, _fileService);// _incomeManager, _attendanceTrackingRepository
            //var mappedDocTypes = await GetMappedGroupingEntities("DocumentType");
            //var statementType = mappedDocTypes.Where(x => x.LocalEntity.Equals("IncomeStatementPDF")).FirstOrDefault();
            //var statements = _docRepo.GetAll().Where(d => d.UserId.Equals("6fc08fe0-91fa-4a5d-91ad-24be9aaf02e6") && d.DocumentTypeId.ToString() == statementType.LocalId).ToList();
            //get all mapped practitioners and iterate through them to submit attendance
            _mappedEntities = await service.GetMappedEntities();

            string attendanceUrl = SSIntegrationSettings.SLChildAttendanceRegister + SSIntegrationSettings.CreateMultiple;
            var attendancesDueList = _mappedEntities.Where(x => (x.LastAttendanceSubmittedDate == null || x.LastAttendanceSubmittedDate <= DateTime.Now.Date.AddDays(-7))).ToList();

            DateTime trackingWeekDate = DateTime.Now.AddDays(-7).StartOfWeek(DayOfWeek.Monday);
            DateTime followingWeekDate = DateTime.Now.StartOfWeek(DayOfWeek.Monday);
            
                foreach (var parent in attendancesDueList)
                {

                    IEnumerable<Attendance> attendanceData = new AttendanceQueryExtension().GetWeeklyAttendance(_attendanceTrackingRepository, _contextAccessor, parent.UserId, trackingWeekDate.Year, trackingWeekDate.Month, trackingWeekDate.GetWeekOfYear());
                    if (attendanceData.Any())
                    {
                        try
                        {
                            bool validAttendance = false;
                            string absent = "Absent";
                            string present = "Present";
                            StringBuilder jsonAttendanceString = new StringBuilder();
                            jsonAttendanceString.AppendLine("[");
                            //get list of children
                            List<string> children = attendanceData.Select(x => x.UserId).Distinct().ToList();
                            foreach (var child in children)
                            {
                                int daysPresent = 0 ;
                                string mondayPresent = absent;
                                string tuesdayPresent = absent;
                                string wednesdayPresent = absent;
                                string thursdayPresent = absent;
                                string fridayPresent = absent;
                                //must get mapped childrens details to get remote ID and if child has already been mapped, if not mapped, dont send 
                                var mappedChild = _mappedEntities.Where(x => string.Equals(x.UserId, child) && string.Equals(x.LocalEntity, SSIntegrationSettings.SSChild)).FirstOrDefault();
                                if (mappedChild != null) {

                                    var childAttendances = attendanceData.Where(x => string.Equals(x.UserId, child) && x.AttendanceDate < followingWeekDate).OrderBy(x => x.AttendanceDate).ToList();
                                    foreach (var attendance in childAttendances)
                                    {
                                        switch (attendance.AttendanceDate.ToString("dddd"))
                                        {
                                            case "Monday":
                                                if (attendance.Attended)
                                                {
                                                    mondayPresent = present;
                                                    daysPresent++;
                                                } else
                                                {
                                                    mondayPresent = absent;
                                                }
                                                break;
                                            case "Tuesday":
                                                if (attendance.Attended)
                                                {
                                                    tuesdayPresent = present;
                                                    daysPresent++;
                                                }
                                                else
                                                {
                                                    tuesdayPresent = absent;
                                                }
                                                break;
                                            case "Wednesday":
                                                if (attendance.Attended)
                                                {
                                                    wednesdayPresent = present;
                                                    daysPresent++;
                                                }
                                                else
                                                {
                                                    wednesdayPresent = absent;
                                                }
                                                break;
                                            case "Thursday":
                                                if (attendance.Attended)
                                                {
                                                    thursdayPresent = present;
                                                    daysPresent++;
                                                }
                                                else
                                                {
                                                    thursdayPresent = absent;
                                                }
                                                break;
                                            case "Friday":
                                                if (attendance.Attended)
                                                {
                                                    fridayPresent = present;
                                                    daysPresent++;
                                                }
                                                else
                                                {
                                                    fridayPresent = absent;
                                                }
                                                break;
                                        }
                                        validAttendance = true;
                                    }

        //[{"NumberOfDaysPresent": 1,"NumberOfDaysAbsent": 4,"StartDateOfWeek": "2023-02-06T22:00:00Z","Monday": "Present","Tuesday": "Absent","Wednesday": "Absent","Thursday": "Absent","Friday": "Absent","Franchisee": {"Guid": "2e884385-319d-eb11-8346-00155d326100"},"Child": {"Guid": "e3d2f84d-8614-ec11-834c-00155d326100"}}]


                                    jsonAttendanceString.AppendLine("{");
                                    jsonAttendanceString.AppendLine("\"StartDateOfWeek\":\"" + trackingWeekDate.StartOfWeek(DayOfWeek.Monday).ToString("yyyy-MM-ddT00:00:00Z") + "\",");
                                    jsonAttendanceString.AppendLine("\"NumberOfDaysPresent\":" + daysPresent + ",");
                                    jsonAttendanceString.AppendLine("\"NumberOfDaysAbsent\":" + (5 - daysPresent) + ",");
                                    jsonAttendanceString.AppendLine("\"Monday\":\"" + mondayPresent + "\",");
                                    jsonAttendanceString.AppendLine("\"Tuesday\":\"" + tuesdayPresent + "\",");
                                    jsonAttendanceString.AppendLine("\"Wednesday\":\"" + wednesdayPresent + "\",");
                                    jsonAttendanceString.AppendLine("\"Thursday\":\"" + thursdayPresent + "\",");
                                    jsonAttendanceString.AppendLine("\"Friday\":\"" + fridayPresent + "\",");
                                    jsonAttendanceString.AppendLine("\"Franchisee\":{\"Guid\": \"" + parent.RemoteId + "\"},");
                                    jsonAttendanceString.AppendLine("\"Child\":{\"Guid\": \"" + mappedChild.RemoteId + "\"}");
                                    jsonAttendanceString.AppendLine("},");
                                }
                            }
                            jsonAttendanceString.AppendLine("]");

                            try
                            {
                                if (validAttendance)
                                {
                                    //now send to API call <entity type>/Multiple
                                    var responseString = await _apiManager.GetAPIHandlerResponse(attendanceUrl, null, null, null, false, false, jsonAttendanceString.ToString());
                                    if (!string.IsNullOrEmpty(responseString))
                                    {
                                        var returnObj = (JArray)JsonConvert.DeserializeObject(responseString);
                                        if (returnObj != null)
                                        {
                                            var remoteStatementId = returnObj.Count > 0 ? returnObj[0].ToString() : null;
                                            isComplete = true;
                                            //mark mapped parent practitioner of last date attendance was sent
                                            parent.LastAttendanceSubmittedDate = DateTime.Now;
                                            _mapperRepo.Update(parent);
                                        }
                                        else //error empty response received
                                        {
                                            await _logManager.IntegrationLog("Data Push Fail: ", jsonAttendanceString.ToString() + " | " + responseString, null, LogRelatedType.Error, "IntegrationAttendanceData > GetAPIHandlerResponse");
                                        }
                                    }
                                }
                            }
                            catch (Exception e)
                            {
                                await _logManager.IntegrationLog("SmartLink API Error: " + e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationAttendanceData > GetAPIHandlerResponse");
                            }




                        }
                        catch (Exception e)
                        {
                            await _logManager.IntegrationLog("IntegrationAttendanceData Error: " + e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationAttendanceData > AttendanceTracking > " + parent.UserId + " Date: " + trackingWeekDate.ToString());
                        }
                    }
                }     
            
            return isComplete;
        }

    }
}
