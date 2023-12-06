using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Linq;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories;
using HotChocolate;
using Microsoft.AspNetCore.Identity;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using Microsoft.EntityFrameworkCore;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Tenancy.Context;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.Core.Extensions;
using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using EcdLink.Api.CoreApi.Managers.Integration;
using System.Net.Http;
using ECDLink.Core.Services;
using ECDLink.DataAccessLayer.Entities.DataIngestion;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.Core.Helpers;
using ECDLink.Security;
using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using JsonSerializer = System.Text.Json.JsonSerializer;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities.Visits;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.SmartStart.Services;
using Microsoft.Extensions.Logging;

namespace EcdLink.Api.CoreApi.Services;
public partial class SmartStartIntegrationService : IIntegrationService
{
    private readonly IGenericRepositoryFactory _repositoryFactory;
    private readonly ISystemSetting<IntegrationDelayOptions> _integrationDelay;
    private readonly ISystemSetting<IntegrationApiOptions> _options;
    private string _uId;
    private UserManager<ApplicationUser> _userManager;
    private IGenericRepository<IntegrationAudit, Guid> _auditRepo;
    private IGenericRepository<IntegrationEntityMapping, Guid> _mapperRepo;
    private IGenericRepository<IntegrationColumnMapping, Guid> _columnmapperRepo;
    private IGenericRepository<SiteAddress, Guid> _siteAddressRepo;
    private AuthenticationDbContext _dbContext;
    private IGenericRepository<Classroom, Guid> _classroomGenericRepo;
    private IGenericRepository<ClassroomGroup, Guid> _classroomGroupGenericRepo;
    private IGenericRepository<ProgrammeType, Guid> _programmeTypeGenericRepo;
    private IGenericRepository<ClassProgramme, Guid> _programmeRepo;
    private IGenericRepository<Language, Guid> _staticLanguageRepo;
    private IGenericRepository<Gender, Guid> _staticGenderRepo;
    private IGenericRepository<Race, Guid> _staticRaceRepo;
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
    private IGenericRepository<WorkflowStatus, Guid> _workflowRepo;
    private IGenericRepository<StatementsIncomeStatement, Guid> _statementsRepo;
    private IGenericRepository<Trainee, Guid> _traineeRepo;
    private IGenericRepository<Club, Guid> _clubRepo;
    private IGenericRepository<ClubMeeting, Guid> _clubMeetingRepo;
    private IGenericRepository<ClubMeetingRegister, Guid> _clubMeetingRegisterRepo;
    private IGenericRepository<Visit, Guid> _visitsRepo;
    private IGenericRepository<VisitType, Guid> _visitTypeRepo;
    private IGenericRepository<PQARating, Guid> _pqaRatingRepo;
    private IGenericRepository<License, Guid> _licenseRepo;
    private IGenericRepository<LicenseType, Guid> _licenseTypeRepo;

    IHolidayService<Holiday> _holidayService;
    private IntegrationLogManager _logManager;
    private IntegrationAPIManager _apiManager;
    private IFileService _fileService;
    private IIncomeExpenseService _incomeManager;
    private AttendanceService _attendanceService;
    private IntegrationHelperManager _integrationHelperManager;
    private AttendanceTrackingRepository _attendanceTrackingRepository;
    private Microsoft.Extensions.Logging.ILogger<SmartStartIntegrationService> _logger;

    private MappingMode _apiMode;
    private MappingMaskDataMode _maskMode;
    private readonly HierarchyEngine _hierarchyEngine;
    List<string> _errorsList = new List<string>();

    public static string password = "AQAAAAIAAYagAAAAEJNUUgR72EwSVzawlEHhBWYlj5UYqIh5efaxzQR8fcUSm7+3tRxBUuOpjkiiuVRPNw==";//"AQAAAAIAAYagAAAAEMsJuBqbYVml/ZCL4iKjPx8E7MgdBej7VYDmyM0JmGgUODifvGKiB4MhfiNO72w9Nw==";//ECDConnect123!
    public static string securityStamp = "BVLO5YGYXJX4ATJR7BSNWSONCFE6KVFE";//"7MLVEAR2UK2APFPOBGP4BPN7XJ4IJGQ6";
    public static string concurrencystamp = "aa105e23-cbc8-43d3-9d5a-30694524fe91";//"a7ce158a-30c5-4cfb-aee2-027c000b8df6";
    public Guid _tenantId = TenantExecutionContext.Tenant.Id;
    public List<IntegrationEntityMapping> _mappedEntities;
    public List<IntegrationColumnMapping> _mappedColumns;
    public List<IntegrationAudit> _audits;
    public VisitManager _visitManager;

    public DateTime _startTime = DateTime.Now;
    public static string scheduledTask = "SmartLinkIntegrationDataSync";
    private INotificationService _notificationService;

    public SmartStartIntegrationService(
        IGenericRepositoryFactory repositoryFactory,
        ISystemSetting<IntegrationDelayOptions> integrationDelay,
        ISystemSetting<IntegrationApiOptions> options,
        [Service] UserManager<ApplicationUser> userManager,
        HierarchyEngine hierarchyEngine,
         AuthenticationDbContext dbContext,
         IntegrationLogManager logManager,
         IntegrationAPIManager apiManager,
         IntegrationHelperManager integrationHelperManager,
         [Service] IFileService fileService,
         [Service] IIncomeExpenseService incomeManager,
         [Service] AttendanceTrackingRepository attendanceTrackingRepository,
         IHolidayService<Holiday> holidayService,
         [Service] INotificationService notificationService,
         VisitManager visitManager,
         [Service] AttendanceService attendanceService,
         Microsoft.Extensions.Logging.ILogger<SmartStartIntegrationService> logger
        )
    {
        _logger = logger;
        _repositoryFactory = repositoryFactory;
        _integrationDelay = integrationDelay;
        _options = options;
        _userManager = userManager;
        _hierarchyEngine = hierarchyEngine;
        _dbContext = dbContext;
        _fileService = fileService;

        _integrationHelperManager = integrationHelperManager;
        _logManager = logManager;
        _apiManager = apiManager;
        _holidayService = holidayService;
        _notificationService = notificationService;

        if (Enum.TryParse(_options.Value.Mode, out _apiMode)) _apiMode = MappingMode.None;
        if (Enum.TryParse(_options.Value.MaskDataMode, out _maskMode)) _maskMode = MappingMaskDataMode.None;

        if (this.Enabled)
        {
            _uId = _hierarchyEngine.GetIntegrationUserId();
            //Generic static repos
            _mapperRepo = repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: _uId);
            _columnmapperRepo = repositoryFactory.CreateGenericRepository<IntegrationColumnMapping>(userContext: _uId);
            _auditRepo = repositoryFactory.CreateGenericRepository<IntegrationAudit>(userContext: _uId);
            _siteAddressRepo = repositoryFactory.CreateGenericRepository<SiteAddress>(userContext: _uId);

            _classroomGenericRepo = repositoryFactory.CreateGenericRepository<Classroom>(userContext: _uId);
            _classroomGroupGenericRepo = repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _uId);
            _programmeTypeGenericRepo = repositoryFactory.CreateGenericRepository<ProgrammeType>(userContext: _uId);
            _staticLanguageRepo = repositoryFactory.CreateGenericRepository<Language>(userContext: _uId);
            _staticGenderRepo = repositoryFactory.CreateGenericRepository<Gender>(userContext: _uId);
            _staticRaceRepo = repositoryFactory.CreateGenericRepository<Race>(userContext: _uId);
            _practitionerRepo = repositoryFactory.CreateRepository<Practitioner>(userContext: _uId);
            _practitionerGenericRepo = repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
            _coachGenericRepo = repositoryFactory.CreateRepository<Coach>(userContext: _uId);
            _franchisorGenericRepo = repositoryFactory.CreateRepository<Franchisor>(userContext: _uId);
            _traineeRepo = repositoryFactory.CreateGenericRepository<Trainee>(userContext: _uId);
            _programmeRepo = repositoryFactory.CreateGenericRepository<ClassProgramme>(userContext: _uId);
            _childRepo = repositoryFactory.CreateRepository<Child>(userContext: _uId);
            _childGenericRepo = repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);
            _caregiverRepo = repositoryFactory.CreateGenericRepository<Caregiver>(userContext: _uId);
            _staticRelationRepo = repositoryFactory.CreateGenericRepository<Relation>(userContext: _uId);
            _staticEducationRepo = repositoryFactory.CreateGenericRepository<Education>(userContext: _uId); ;
            _staticGrantRepo = repositoryFactory.CreateGenericRepository<Grant>(userContext: _uId);
            _staticWorkflowRepo = repositoryFactory.CreateGenericRepository<WorkflowStatus>(userContext: _uId);
            _docRepo = repositoryFactory.CreateGenericRepository<Document>(userContext: _uId);
            _workflowRepo = repositoryFactory.CreateGenericRepository<WorkflowStatus>(userContext: _uId);
            _statementsRepo = repositoryFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _uId);
            _visitsRepo = repositoryFactory.CreateGenericRepository<Visit>(userContext: _uId);
            _visitTypeRepo = repositoryFactory.CreateGenericRepository<VisitType>(userContext: _uId);
            _pqaRatingRepo = repositoryFactory.CreateGenericRepository<PQARating>(userContext: _uId);

            _licenseRepo = repositoryFactory.CreateGenericRepository<License>(userContext: _uId);
            _licenseTypeRepo = repositoryFactory.CreateGenericRepository<LicenseType>(userContext: _uId);
        }
        _attendanceTrackingRepository = attendanceTrackingRepository;
        _incomeManager = incomeManager;
        _visitManager = visitManager;
        _attendanceService = attendanceService;
    }

    public bool Enabled { get { return this._apiMode != MappingMode.None; } }

    #region Integration Points   

    public async Task<bool> IntegrationClubsData()
    {
        if (!this.Enabled) return true;

        //Get only this years data and check if we have the lines in t he tables, insert if not, dont save to entity mapping, we are just gathering dates and using the same GUID that SL has, so we dont  have to create new ones and theirs work fine, would avoid clashes and reusability to avoid extra columns
        _mappedEntities = await this.GetMappedEntities();
        _clubRepo = _repositoryFactory.CreateGenericRepository<Club>(userContext: _uId);
        _clubMeetingRepo = _repositoryFactory.CreateGenericRepository<ClubMeeting>(userContext: _uId);
        _clubMeetingRegisterRepo = _repositoryFactory.CreateGenericRepository<ClubMeetingRegister>(userContext: _uId);

        foreach (var coach in _mappedEntities.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSCoach)).ToList())
        {
            //Clubs Data
            var clubs = await _apiManager.GetClubsByCoach(coach.RemoteId);
            var existingClubs = _clubRepo.GetAll();
            foreach (var club in clubs)
            {
                try
                {
                    if (!existingClubs.Where(x => x.Id == Guid.Parse(club.Guid)).Any())
                        _clubRepo.Insert(new Club()
                        {
                            Id = Guid.Parse(club.Guid),//Guid.NewGuid(), 
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            Name = club.Name,
                            NumberOfMembers = club.NumberOfFranchisees,
                            TenantId = _tenantId
                        });
                }
                catch (Exception e)
                {
                    await _logManager.IntegrationLog("IntegrationClubsData Error: " + e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationClubsData > existingClubs");
                }
            }

            //Clubsmeeting Data
            var clubMeetings = await _apiManager.GetClubMeetingByCoach(coach.RemoteId);
            existingClubs = _clubRepo.GetAll(); //Reload all clubs
            var existingClubMeetings = _clubMeetingRepo.GetAll();
            try
            {
                foreach (var meeting in clubMeetings)
                {
                    if (meeting.Club != null)
                    {
                        if (existingClubs.Where(x => x.Id == Guid.Parse(meeting.Club.Guid)).Any())
                        {

                            if (!existingClubMeetings.Where(x => x.Id == Guid.Parse(meeting.Guid)).Any())
                                _clubMeetingRepo.Insert(new ClubMeeting()
                                {
                                    Id = Guid.Parse(meeting.Guid), //Guid.NewGuid()
                                    IsActive = true,
                                    InsertedDate = DateTime.Now,
                                    Name = meeting.Name,
                                    MeetingDate = meeting.MeetingDate,
                                    TenantId = _tenantId,
                                    ClubId = Guid.Parse(meeting.Club.Guid)

                                });
                        }
                    }
                }
            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog("IntegrationClubsData Error: " + e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationClubsData > existingClubMeetings");
            }

            //ClubsmeetingRegister Data
            var practitioners = _mappedEntities.Where(x => string.Equals(x.LocalEntity, Constants.SSIntegrationSettings.SSPractitioner) && x.IsActive == true).ToList();
            foreach (var prac in practitioners)
            {
                try
                {
                    var clubMeetingRegister = await _apiManager.GetClubMeetingRegisterByFranchisee(prac.RemoteId);
                    existingClubMeetings = _clubMeetingRepo.GetAll(); //reload all meetings
                    var existingClubMeetingRegisters = _clubMeetingRegisterRepo.GetAll();
                    foreach (var register in clubMeetingRegister)
                    {
                        if (register.ClubMeeting != null)
                        {
                            if (existingClubMeetings.Where(x => x.Id == Guid.Parse(register.ClubMeeting.Guid)).Any())
                            {
                                if (!existingClubMeetingRegisters.Where(x => x.Id == Guid.Parse(register.Guid)).Any())
                                    _clubMeetingRegisterRepo.Insert(new ClubMeetingRegister()
                                    {
                                        Id = Guid.Parse(register.Guid), //Guid.NewGuid(),
                                        IsActive = true,
                                        InsertedDate = DateTime.Now,
                                        Attended = register.Attended,
                                        PractitionerId = Guid.Parse(prac.UserId),
                                        ClubMeetingId = Guid.Parse(register.ClubMeeting.Guid),
                                        TenantId = _tenantId
                                    });
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    await _logManager.IntegrationLog("IntegrationClubsData Error: " + e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationClubsData > existingClubMeetingRegisters");
                }
            }
        }

        return true;
    }

    /// <summary>
    /// Pull past PQA data for practitioners, that were created on SmartLink and outside of the Funda app.
    /// 
    /// We can only set up the basic visit data, since they do not have the full Q&A data we would save. We are 
    /// just setting up enough data so we can show the details on the practitioners journey and to set up future 
    /// PQA visits if needed
    /// </summary>
    /// <returns></returns>
    public async Task<bool> PullPQAData(string franchiseeId = null)
    {
        if (!this.Enabled) return true;

        await _logManager.IntegrationLog($"PullPQAData Started at {DateTime.Now}", null, null, LogRelatedType.Log, "PullPQAData > GetPQAByFranchisee");
        int totalVisitsAdded = 0;
        int totalFollowUpVisitsAdded = 0;

        var success = true;
        var mappedPractitioners = await GetMappedEntities(Constants.SSIntegrationSettings.SSPractitioner, true);//await GetMappedEntitiesTestUsers(); //
        var mappedCoaches = await GetMappedEntities(Constants.SSIntegrationSettings.SSCoach);
        var coaches = _coachGenericRepo.GetAll().Where(x => mappedCoaches.Select(y => y.UserId).Contains(x.UserId)).ToList();
        var pqaVisit1TypeId = _visitTypeRepo.GetAll().First(x => x.Name == Constants.SSSettings.visitType_pqa_visit_1).Id;

        int maxScore = Constants.SSSettings.step2_total + Constants.SSSettings.step3_total + Constants.SSSettings.step4_total + Constants.SSSettings.step5_total +
                                Constants.SSSettings.step6_total + Constants.SSSettings.step7_total + Constants.SSSettings.step8_total;
        if (franchiseeId != null)
        {
            mappedPractitioners = mappedPractitioners.Where(x => string.Equals(x.RemoteId, franchiseeId)).ToList();
        }

        foreach (var practitioner in mappedPractitioners)
        {
            var practitionerId = Guid.Parse(practitioner.LocalId);
            try
            {
                // Need to get existing PQA visits and see if we have mapped this one before - DO WE ONLY NEED TO PULL OLD PQAS ONCE PER PRACTITIONER???
                var pqas = await _apiManager.GetPQAByFranchisee(practitioner.RemoteId);

                if (pqas == null || !pqas.Any())
                {
                    continue;
                }

                var existingVisits = _visitsRepo.GetAll().Where(x => x.IsActive && x.PractitionerId == practitionerId).ToList();


                // For any we haven't created, create a new visit
                var createdVisits = new List<Visit>();
                var createdRatings = new List<PQARating>();
                foreach (var slPQA in pqas.OrderBy(x => x.DateOfVisit))
                {
                    if (existingVisits.Any(x => x.Id == Guid.Parse(slPQA.Guid)))
                    {
                        continue; // We've already added this visit, just continue to next one
                    }

                    // Create visit
                    var mappedCoach = mappedCoaches.FirstOrDefault(x => x.RemoteId == slPQA.Coach.Guid);
                    var visit = new Visit()
                    {
                        Id = Guid.Parse(slPQA.Guid),
                        ActualVisitDate = slPQA.DateOfVisit,
                        CoachId = mappedCoach != null ? coaches.FirstOrDefault(x => x.UserId == mappedCoach.UserId)?.Id : null, // Coach might not be mapped yet
                        HasAnswerData = false,
                        VisitTypeId = pqaVisit1TypeId,
                        TenantId = _tenantId,
                        Attended = slPQA.StatusOutcome.ToLower() != "not done",
                        DueDate = slPQA.DateOfVisit,
                        PlannedVisitDate = slPQA.DateOfVisit,
                        PractitionerId = practitionerId,
                        Risk = Constants.GGSettings.normal_risk, // GG only field, but non nullable in the database
                    };

                    // Create rating
                    var pqaRating = new PQARating()
                    {
                        VisitId = visit.Id,
                        OverallRating = $"{slPQA.TotalScore}/{maxScore}",
                        OverallRatingColor = MapStatusOutcomeToRatingColour(slPQA.StatusOutcome),
                        OverallRatingStars = GetNumberOfStarsForPQA(slPQA.TotalScore, slPQA.StatusOutcome),
                        OverallScore = slPQA.TotalScore,
                        VisitName = Constants.SSSettings.visitType_pqa_visit_1,
                        TenantId = _tenantId
                    };

                    createdRatings.Add(pqaRating);
                    createdVisits.Add(visit);
                    totalVisitsAdded++;
                }
                _visitsRepo.InsertMany(createdVisits);
                _pqaRatingRepo.InsertMany(createdRatings);

                if (createdVisits.Any())
                {
                    // For the last visit we find (that isn't already added), run the logic to create a follow up pr reaccredication etc. Their next required visit
                    // color = color we got back from SL, practitioenr id = from the prac on the loop, linkedVisit = visit we just created and saved.
                    // Note - we will have to save all the previous visits before we call this as it pulls them and calculates based on that
                    var lastVisit = createdVisits.Last();
                    if (lastVisit.Attended)
                    {
                        totalFollowUpVisitsAdded++;
                        var newVisit = _visitManager.AddNextPQAOrFollowUpVisit(createdRatings.First(x => x.VisitId == lastVisit.Id).OverallRatingColor, practitionerId, lastVisit);
                    }
                }
            }
            catch (Exception e)
            {
                success = false;
                await _logManager.IntegrationLog($"PullPQAData Error: {e.Message}", e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PullPQAData > GetPQAByFranchisee");
            }
        }

        await _logManager.IntegrationLog($"PullPQAData completed at {DateTime.Now}", $"PQA visits added {totalVisitsAdded}, total next PQA or Follow-up visits added {totalFollowUpVisitsAdded}", null, LogRelatedType.Log, "PullPQAData > GetPQAByFranchisee");

        return success;
    }

    /// <summary>
    /// Pull past Smart Space Visits for practitioners, that were created on SmartLink and outside of the Funda app.
    /// 
    /// NOTE: This will only pull data for trainees
    /// </summary>
    /// <returns></returns>
    public async Task<bool> PullSmartSpaceVisitsData()
    {
        if (!this.Enabled) return true;

        // We currently don't need to create a smart space visit, and we can import the license data when importing the practitioner
        throw new NotImplementedException();
    }
    //{
    //    var success = true;
    //    var mappedTrainees = await GetMappedEntities(Constants.SSIntegrationSettings.SSTrainee); // TODO Why only trainees
    //    var smartSpaceVisitTypeId = _visitTypeRepo.GetAll().First(x => x.Name == Constants.SSSettings.smart_space_checklist).Id;

    //    foreach (var practitioner in mappedTrainees)
    //    {
    //        try
    //        {
    //            var smartSpaceVisits = await _apiManager.GetSmartSpaceVisitsByFranchiseeTrainee(practitioner.RemoteId);
    //            var existingVisits = _visitsRepo.GetAll().Where(x => string.Equals(x.TraineeId, practitioner.Id) && x.VisitTypeId == smartSpaceVisitTypeId).ToList(); //reload all meetings

    //            var createdVisits = new List<Visit>();
    //            foreach (var slVisit in smartSpaceVisits)
    //            {
    //                if (existingVisits.Any(x => x.Id == Guid.Parse(slVisit.Guid)))
    //                {
    //                    continue;
    //                }

    //                // Create visit
    //                var visit = new Visit()
    //                {
    //                    Id = Guid.Parse(slVisit.Guid),
    //                    ActualVisitDate = slVisit.DateOfVisit,
    //                    CoachId = Guid.Parse(slVisit.Coach.Guid),
    //                    HasAnswerData = false,
    //                    VisitTypeId = smartSpaceVisitTypeId,
    //                    TenantId = _tenantId,
    //                    Attended = true,
    //                    DueDate = slVisit.DateOfVisit,
    //                    PlannedVisitDate = slVisit.DateOfVisit,
    //                    TraineeId = practitioner.Id,                  
    //                };
    //                createdVisits.Add(visit);

    //                // Do I need to save license info ???
    //            }
    //            _visitsRepo.InsertMany(createdVisits);
    //        }
    //        catch (Exception e)
    //        {
    //            await _logManager.IntegrationLog("IntegrationPQASmartSpaceVisitsData Error: " + e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationPQASmartSpaceVisitsData > GetSmartSpaceVisitsByFranchiseeTrainee");
    //            success = false;
    //        }
    //    }

    //    return success;
    //}

    public async Task IntegrationStatementsData()
    {
        if (!this.Enabled) return;

        await _logManager.IntegrationLog($"IntegrationStatementsData Started at {DateTime.Now}", null, null, LogRelatedType.Log, "IntegrationStatementsData");

        int statementsSent = 0;
        var submitPeriod = IncomeExpenseService.GetStatementPeriod(); //from the 25th of the previous month is open submission time
                                                                      
        if (DateTime.Now.Date > submitPeriod.Start || DateTime.Now.Date < submitPeriod.End)//only run task daily withing submit window
        {
            ////[{"Month": "January","Year": "2023","StartupSupport": 10.0,"Fees": 0.0,"Donations": 10.0,"FundRaising": 10.0,"OtherIncome": 10.0,"Rent": 10.0,"Utilities": 10.0,"Food": 10.0,"Salary": 10.0,"Transport": 10.0,"OtherExpenses": 10.0,"Franchisee": {"Guid": "4778287e-073f-e711-80e0-005056815442"},"Document": {"Guid": "9c029379-3996-ec11-834e-00155dee5a05"}}]
            var statementsUrl = Constants.SSIntegrationSettings.SLIncomeStatementIncome + Constants.SSIntegrationSettings.CreateMultiple;            
            var mappedDocTypes = await GetMappedGroupingEntities("DocumentType");
            var statementType = mappedDocTypes.Where(x => x.LocalEntity.Equals("IncomeStatementPDF")).FirstOrDefault();
            var _mappedEntities = await GetMappedEntities(Constants.SSIntegrationSettings.SSPractitioner);

            var allAudits = await GetAudits("Document", null, 30); //Get all document audits for last 30 days, we should find the latest in there

            var practitionersWithDueStatements = _mappedEntities.Where(x => (x.LastIncomeSubmittedDate == null || x.LastIncomeSubmittedDate <= submitPeriod.Start) ).ToList();
            foreach (var prac in practitionersWithDueStatements)
            {
                // TODO - This call should never return multiple
                var submittedStatements = _incomeManager.GetAllStatementsIncomeStatement(prac.UserId, submitPeriod.Start.Year, submitPeriod.Start.Month);
                if (submittedStatements.Any())
                {
                    foreach (var statement in submittedStatements)
                    {
                        if (!statement.IncomeItems.Any() && !statement.ExpenseItems.Any())
                        {
                            // No actual data on the statement, just continue to the next one
                            continue;
                        }

                        int[] validmonths = { statement.Month, statement.Month + 1 };
                        Document statementDoc = null;

                        // I'm not sure how this logic works, is it possible for there to be a document if we haven't marked it on the statement already???
                        if (statement.RelatedDocumentId != null)
                        {
                            var docs = _docRepo.GetAll().Where(d => d.DocumentTypeId.ToString() == statementType.LocalId && d.Reference != null && d.Id.ToString() == statement.RelatedDocumentId).ToList();
                            if (docs.Any())
                            {
                                statementDoc = docs.FirstOrDefault();
                            }
                            else
                            {
                                //get the latest one created
                                statementDoc = _docRepo.GetAll().Where(d => d.DocumentTypeId.ToString() == statementType.LocalId && string.Equals(d.UserId, prac.UserId) && d.Reference != null && validmonths.Contains(d.InsertedDate.Month)).OrderByDescending(d => d.InsertedDate).FirstOrDefault();
                            }
                        }
                        else
                        {
                            statementDoc = _docRepo.GetAll().Where(d => d.DocumentTypeId.ToString() == statementType.LocalId && string.Equals(d.UserId, prac.UserId) && d.Reference != null && validmonths.Contains(d.InsertedDate.Month)).OrderByDescending(d => d.InsertedDate).FirstOrDefault();
                        }

                        //if doc is still null here and its a valid statement, generate it and redo this
                        if (statementDoc == null)
                        {
                            statementDoc = _incomeManager.CreateIncomeStatementPDFDocument(statement.UserId, statement);
                        }

                        // TODO - Update this to use the income and expense items from the statement fetched above
                        var statementLines = _incomeManager.GetStatementLinesToReport(prac.UserId, submitPeriod.Start.Year, submitPeriod.Start.Month);

                        double dStartupSupport = 0.0; double dFees = 0.0; double dDonations = 0.0; double dFundRaising = 0.0; double dOtherIncome = 0.0;
                        double dRent = 0.0; double dUtilities = 0.0; double dFood = 0.0; double dSalary = 0.0; double dTransport = 0.0; double dOtherExpenses = 0.0;

                        //calculate based on categories
                        foreach (var statementLine in statementLines)
                        {
                            switch (statementLine.StatementLine)
                            {
                                case "Startup Support":
                                    dStartupSupport += statementLine.Value;
                                    break;
                                case "Rent":
                                    dRent += statementLine.Value;
                                    break;
                                case "Food":
                                    dFood += statementLine.Value;
                                    break;
                                case "Subcontractor Wages":
                                    dSalary += statementLine.Value;
                                    break;
                                case "Learning Materials":
                                case "Maintenance":
                                    dOtherExpenses += statementLine.Value;
                                    break;
                                case "Utilities":
                                    dUtilities += statementLine.Value;
                                    break;
                                case "Preschool Fee":
                                    dFees += statementLine.Value;
                                    break;
                                case "Donation":
                                case "DBE Subsidy":
                                    dDonations += statementLine.Value;
                                    break;
                                case "Other":
                                    if (statementLine.StatementType == "Income")
                                        dOtherIncome += statementLine.Value;
                                    else
                                        dOtherExpenses += statementLine.Value;
                                    break;
                                default:
                                    break;
                            }
                        }

                        StringBuilder jsonStatementString = new StringBuilder();
                        jsonStatementString.AppendLine("[{");
                        jsonStatementString.AppendLine("\"Month\":\"" + submitPeriod.Start.ToString("MMMM") + "\",");
                        jsonStatementString.AppendLine("\"Year\":\"" + submitPeriod.Start.Year + "\",");

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
                        jsonStatementString.AppendLine("\"OtherExpenses\":" + dOtherExpenses + ",");
                        jsonStatementString.AppendLine("\"Franchisee\":{\"Guid\": \"" + prac.RemoteId + "\"},");
                        jsonStatementString.AppendLine("}]");

                        try
                        {
                            string remoteStatementId = "";
                            string remoteDocId = "";

                            // SEND THE STATEMENT FIRST
                            //now send to API call <entity type>/Multiple
                            var apiResponse = await _apiManager.GetAPIHandlerResponse(statementsUrl, null, null, null, false, false, jsonStatementString.ToString());
                            if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                            {
                                var returnObj = JsonConvert.DeserializeObject<List<PostResponse>>(apiResponse.ResponseString);
                                if (returnObj != null)
                                {
                                    if (returnObj[0].Guid != null)
                                    {
                                        remoteStatementId = returnObj.Count() > 0 ? returnObj[0].Guid.ToString() : null;                                        

                                        //update entity to note its statements has been sent
                                        prac.LastIncomeSubmittedDate = DateTime.Now;
                                        _mapperRepo.Update(prac);

                                        statementsSent++;
                                    }
                                    else
                                    {
                                        await _logManager.IntegrationLog("Data Push Fail: " + apiResponse.ResponseString, jsonStatementString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "IntegrationStatementsData > GetAPIHandlerResponse");
                                    }
                                }
                                else //error empty response received
                                {
                                    await _logManager.IntegrationLog("Data Push Fail: " + apiResponse.ResponseString, jsonStatementString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "IntegrationStatementsData > GetAPIHandlerResponse");
                                }
                            }

                            // SEND THE DOCUMENT SECOND
                            // So long as the month of the document date matches the statement month, SmartStart will link them automatically
                            if (statementDoc != null)
                            {
                                //save the doc id back to the balancesheet record for future ref
                                statement.RelatedDocumentId = statementDoc.Id.ToString();
                                _statementsRepo.Update(statement);

                                var docaudits = allAudits.Where(x => x.Submitted == null && string.Equals(x.RelatedId, statementDoc.Id.ToString())).ToList(); //filter audits where these docs have been created and in audit log as unsubmitted                                               
                                remoteDocId = await PushNewDocument(statementDoc, submitPeriod.Start); // Pass in a fixed date so its in the correct month, otherwise SmartStart will think its for the next month and create a blank statement

                                if (docaudits != null)
                                {
                                    await _logManager.UpdateAuditSubmitted(docaudits);
                                }
                            }
                        }
                        catch (Exception e)
                        {
                            await _logManager.IntegrationLog("SmartLink API Error: " + e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationStatementsData > GetAPIHandlerResponse > Remote ID : " + prac.RemoteId);
                        }
                    }
                }
            }
        }
        await _logManager.IntegrationLog($"IntegrationStatementsData Completed at {DateTime.Now}", $"statements sent {statementsSent}", null, LogRelatedType.Log, "IntegrationStatementsData");
    }

    public async Task<bool> IntegrationMonthlyAttendanceData()
    {
        if (!this.Enabled) return true;

        await _logManager.IntegrationLog($"IntegrationAttendanceData Started at {DateTime.Now}", null, null, LogRelatedType.Log, "IntegrationAttendanceData");
        int attendancesSent = 0;
        bool isComplete = false;
        DateTime startPeriod = DateTime.Now.GetStartOfMonth();
        _mappedEntities = await GetMappedEntities();
        string attendanceUrl = Constants.SSIntegrationSettings.SLChildAttendanceRegister + Constants.SSIntegrationSettings.CreateMultiple;
        var attendancesDueList = _mappedEntities.Where(x => string.Equals(x.LocalEntity, Constants.SSIntegrationSettings.SSPractitioner) && (x.LastAttendanceSubmittedDate == null || x.LastAttendanceSubmittedDate <= startPeriod)).ToList();

        var mappedDocTypes = await GetMappedGroupingEntities("DocumentType");
        var statementType = mappedDocTypes.Where(x => x.LocalEntity.Equals("AttendancePDF")).FirstOrDefault();

        //var allRequiredAttendance =
        //    (
        //        from classroomGroupData in classroomGroupRepo.GetAll().Where(x => x.Name != "Unsure" && x.IsActive.Equals(true) && x.UserId != null) //do not count the default unsurae classes                    
        //        join entityData in entityRepo.GetAll().Where(p => p.IsActive.Equals(true) && p.LastAttendanceSubmittedDate <= startPeriod && p.LocalEntity.Equals("Practitioner")) on classroomGroupData.UserId.ToString() equals entityData.UserId
        //        join learnerData in learnerRepo.GetAll().Where(l => l.StoppedAttendance == null && l.StartedAttendance <= startPeriod && l.IsActive == true) on classroomGroupData.Id equals learnerData.ClassroomGroupId
        //        select new { classroomGroupData, entityData }
        //    ).OrderByDescending(y => y.classroomGroupData.InsertedDate).ToList();
        //foreach (var requiredAttendance in allRequiredAttendance)
        //{
        //    var docs = docRepo.GetAll().Where(d => d.UserId.Equals(requiredAttendance.entityData.UserId) && d.DocumentTypeId.Equals(attendancePDF.Id)).ToList();
        //    //TODO: finish gathering docs and sending to SL


        //}


        return isComplete;
    }

    public async Task<bool> IntegrationUpdates()
    {
        if (!this.Enabled) return true;

        await _logManager.IntegrationLog($"IntegrationUpdates Started at {DateTime.Now}", null, null, LogRelatedType.Log, "IntegrationUpdates");
        int historyDays = 2; //TODO: change this to look for last successfull run and do incremental calls to SL only, the overlap is extra data and gets mostly discarded anyways, plus making the payloads bigger, more room for error
        bool returnOK = false;
        RemoteChangesList changedColumns = await _apiManager.GetMappedColumnChangesBetweenDates(DateTime.Now.AddDays(historyDays * -1), DateTime.Now);
        _mappedEntities = await GetMappedEntities(null, true, true);
        _mappedColumns = await GetMappedColumns();
       
        if (changedColumns != null)
        {
            //run all inserts
            foreach (var change in changedColumns.Inserts)
            {
                IntegrationEntityMapping mappedEntity = _mappedEntities.Where(x => x.RemoteId == change.Guid && x.RemoteEntity.Equals(change.EntityType)).FirstOrDefault();
                if (mappedEntity == null)
                {
                    mappedEntity = await UpdateInsertNewEntity(change);
                }
            }
            //run all deactivates
            foreach (var change in changedColumns.Deletes)
            {
                IntegrationEntityMapping mappedEntity = _mappedEntities.Where(x => x.RemoteId == change.Guid && x.RemoteEntity.Equals(change.EntityType)).FirstOrDefault();
                if (mappedEntity == null)
                {
                    //TODO
                }
            }
            _mappedEntities = await GetMappedEntities(null, true); //reload the lists to include the latest changes
                                                                   //run all updates, that arent in the insert list either
            foreach (var change in changedColumns.Updates)
            {
                IntegrationEntityMapping mappedEntity = _mappedEntities.Where(x => x.RemoteId == change.Guid && x.RemoteEntity.Equals(change.EntityType)).FirstOrDefault();
                if (mappedEntity != null)
                {
                    await UpdateEntityColumn(change, mappedEntity);
                }
            }
        }

        if (_apiMode == MappingMode.Push || _apiMode == MappingMode.PushPull) //Only allow data pushing when api mode has been set
        {
            List<SL_Ingestion_User_Update> ids = _dbContext.SL_Ingestion_Users_Update.ToList();
            if (ids.Count > 0)
            {
                foreach (var item in ids)
                {
                    //Deletes
                    await PushDeletes(item.Id.ToString(), historyDays);
                    //Inserts
                    await PushInserts(item.Id.ToString(), historyDays);
                    //Updates & Deactivates
                    await PushUpdates(item.Id.ToString(), historyDays);
                    returnOK = true;
                }
            }
            else
            {
                //Deletes
                await PushDeletes();
                //Inserts
                await PushInserts(null, historyDays);
                //Updates & Deactivates
                await PushUpdates(null, historyDays);
                returnOK = true;
            }
        }
        await _logManager.IntegrationLog($"IntegrationUpdates Completed at {DateTime.Now}", null, null, LogRelatedType.Log, "IntegrationUpdates");
        return returnOK;
    }

    public async Task AutoSubmitStatements()
    {
        if (!this.Enabled) return;

        await _logManager.IntegrationLog($"AutoSubmitStatements started at {DateTime.Now}", null, null, LogRelatedType.Log, "AutoSubmitStatements");

        try
        {
            var pracsDueSubmits = _incomeManager.GetUnsubmittedStatements();

            foreach (var pracData in pracsDueSubmits)
            {
                DateTime duePeriod = pracData.Value;
                _incomeManager.AutoSubmitStatement(pracData.Key, duePeriod.Year, duePeriod.Month);
            }
        }
        catch (Exception ex)
        {
            await _logManager.IntegrationLog($"AutoSubmitStatements ERROR at {DateTime.Now}", ex.Message, null, LogRelatedType.Log, "AutoSubmitStatements");
        }

        await _logManager.IntegrationLog($"AutoSubmitStatements Completed at {DateTime.Now}", null, null, LogRelatedType.Log, "AutoSubmitStatements");
    }

    public async Task<bool> IntegrationByTrainees()
    {
        if (!this.Enabled) return true;

        _mappedEntities = await GetMappedEntities();
        foreach (var coach in _mappedEntities.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSCoach)).ToList())
        {
            List<MappedTrainee> remoteTrainees = await _apiManager.GetTraineesByCoach(coach.RemoteId, true); //pull trainees only - if switched to false, it will bring paid of trainee and its practitioner
            if (remoteTrainees.Any())
            {
                foreach (var trainee in remoteTrainees)
                {
                    trainee.localParentEntityUserId = coach.UserId;
                    trainee.localParentEntityId = coach.Id.ToString();
                    await MapTrainee(trainee);
                }
            }
        }

        return true;
    }

    public async Task<bool> IntegrationByFranchisees()
    {
        if (!this.Enabled) return true;

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



    public async Task<bool> IntegrationByMappedCoach(string franchiseeId = null, string coachId = null)
    {
        if (!this.Enabled) return true;

        bool returnOK = false;
        await _logManager.IntegrationLog($"IntegrationByMappedCoach Started at {DateTime.Now}", null, null, LogRelatedType.Log, "IntegrationByMappedCoach");
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
            await _logManager.IntegrationLog($"IntegrationByMappedCoach Started at {DateTime.Now}", null, null, LogRelatedType.Log, "IntegrationByMappedCoach");

            if (_apiMode == MappingMode.Pull || _apiMode == MappingMode.PushPull)
            {
                _mappedEntities = await this.GetMappedEntities(null, true);

                _mappedColumns = await this.GetMappedColumns();

                //await IntegrationUpdates();
                //-------------------
                //3. Iterate through all known coaches to get information below hierarchy
                //-------------------
                var mappedCoaches = _mappedEntities.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSCoach)).ToList();
                if (coachId!=null)
                {
                    mappedCoaches = mappedCoaches.Where(c => string.Equals(c.UserId, coachId)).ToList();
                }
                foreach (var coach in mappedCoaches)
                {
                    //-------------------
                    //4. - check all changes on known entities that is not marked complete
                    //-------------------
                    //UpdateIncompletes(mappedEntities, mappedColumns, coach);

                    //-------------------
                    //5. - get all data from API and discard whats complete and known to SS
                    //-------------------
                    //5.1) get all frannchisees and map them                
                    List<MappedFranchisee> remoteFranchisees = (franchiseeId != null ? await _apiManager.GetFranchiseesById(franchiseeId) : await _apiManager.GetFranchiseesByCoach(coach.RemoteId));
                    //5.2) iterate through and check if we have it, 3) if not kick off process to create - 4) if we have it add to a new list of ids and move on with iteration. Point 12 will do iteration through changes by looking at recordchange object

                    if (remoteFranchisees != null)
                    {
                        //order all to load principals first
                        //remoteFranchisees = remoteFranchisees.OrderBy(x => (x.IsPrincipal.HasValue ? x.IsPrincipal == true : null)).ToList();
                        try
                        {
                            foreach (var franchisee in remoteFranchisees)
                            {
                                try
                                {

                                    if (franchisee != null)
                                    {
                                        Practitioner newPractitioner = null;
                                        if (_mappedEntities.Where(x => x.RemoteId.Equals(franchisee.Guid) && x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSPractitioner)).Count() == 0)
                                        {
                                            //Create franchisee and map in SS system
                                            franchisee.localParentEntityId = coach.LocalId;
                                            newPractitioner = await MapFranchisee(franchisee);

                                            //send notification to coach
                                            var userToSend = await _userManager.FindByIdAsync(coach.UserId);
                                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachNewPractitionersLinked, DateTime.Now, userToSend, null, MessageStatusConstants.Green, null, DateTime.Now.AddDays(7));
                                        }
                                        else
                                        {
                                            var localPractitioner = _mappedEntities.Where(x => x.RemoteId.Equals(franchisee.Guid) && x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSPractitioner)).FirstOrDefault();
                                            newPractitioner = _practitionerGenericRepo.GetByUserId(localPractitioner.UserId);
                                        }

                                        if (newPractitioner != null)
                                        {
                                            totalFranchiseesAddedToSS++;
                                            //get all elements underneath and map those too

                                            //1. Children
                                            List<MappedChild> remoteChildren = await _apiManager.GetChildren(franchisee.Guid);
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

                                                            remoteChild.localId = newChild.Id.ToString();
                                                            remoteChild.localUserId = newChild.UserId;
                                                            remoteChild.localParentEntityId = newPractitioner.Id.ToString();
                                                            remoteChild.localParentEntityUserId = newPractitioner.UserId;
                                                        }
                                                    }
                                                }

                                                //realign hirarchy and learners to Unsure classgroups
                                                await AlignChildHierarchy(newPractitioner, newChildren);
                                                await AlignChildClassgroupToUnsure(newPractitioner, newChildren);
                                            }
                                            //2. Franchisee Documents
                                            List<MappedDocument> newDocuments = await _apiManager.GetFranchiseeDocuments(franchisee.Guid);
                                            if (newDocuments.Any())
                                            {
                                                List<Document> docsLoaded = await MapFranchiseeChildDocuments(newDocuments, remoteChildren, newPractitioner);
                                            }
                                        }
                                    }
                                    //pull pqa data for this franchisee
                                    await PullPQAData(franchisee.Guid);
                                }
                                catch (Exception e)
                                {
                                    await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationByMappedCoach > " + Newtonsoft.Json.JsonConvert.SerializeObject(remoteFranchisees));
                                }

                            }
                            //Map up principals that could not be mapped (when the principal mapped to hasnt been imported yet
                            await MatchPrincipals();
                        }
                        catch (Exception e)
                        {
                            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationByMappedCoach > " + Newtonsoft.Json.JsonConvert.SerializeObject(remoteFranchisees));
                        }
                        returnOK = true;
                    }

                    //Pull Trainees
                    List<MappedTrainee> remoteTrainees = await _apiManager.GetTraineesByCoach(coach.RemoteId, true); //pull trainees only - if switched to false, it will bring paid of trainee and its practitioner
                    if (remoteTrainees.Any())
                    {
                        foreach (var trainee in remoteTrainees)
                        {
                            trainee.localParentEntityUserId = coach.UserId;
                            trainee.localParentEntityId = coach.Id.ToString();
                            await MapTrainee(trainee);
                        }
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
            string runResults = "Franchisees Added: " + totalFranchiseesAddedToSS.ToString() + " Children Added: " + totalChildrenAddedToSS.ToString() + " Errors: " + String.Join("|", _errorsList.ToArray());
            scheduledRun.Results = runResults;
            scheduledRun.EndTime = DateTime.Now;
            scheduledRun.StartTime = startTime;
            scheduledRun.UpdatedDate = DateTime.Now;
            scheduledRun.UpdatedBy = _uId;
            schedulerRepo.Update(scheduledRun);

            await _logManager.IntegrationLog($"IntegrationByMappedCoach completed at {DateTime.Now}", runResults, null, LogRelatedType.TaskRun, "IntegrationByMappedCoach");

        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationByMappedCoach > " + franchiseeId);
        }
        await _logManager.IntegrationLog($"IntegrationByMappedCoach Completed at {DateTime.Now}", null, null, LogRelatedType.Log, "IntegrationByMappedCoach");
        return returnOK;
    }


    public async Task<bool> IntegrationByNewCoach(string remoteCoachId)
    {
        if (!this.Enabled) return true;

        _mappedEntities = await GetMappedEntities();
        var mappedCoach = _mappedEntities.Where(c => string.Equals(c.RemoteId, remoteCoachId) && c.LocalEntity == Constants.SSIntegrationSettings.SSCoach).FirstOrDefault();
        if (mappedCoach == null)
        {
            List<MappedCoach> remoteCoaches = await _apiManager.GetCoachesAll(remoteCoachId);
            if (remoteCoaches != null && remoteCoaches.Any())
            {
                foreach (var coach in remoteCoaches)
                {

                    //check if teh franchisor is mapped already, otehrwise start there first
                    var franchisor = _mappedEntities.Where(x => x.RemoteId.Equals(coach.Franchisor.Guid) && x.LocalEntity == Constants.SSIntegrationSettings.SSFranchisor).FirstOrDefault();


                    if (franchisor != null)
                    {
                        coach.localParentEntityUserId = franchisor.UserId;
                        coach.localParentEntityId = franchisor.LocalId;
                    }
                    else
                    {
                        var mappedFranchisor = await _apiManager.GetFranchisorById(coach.Franchisor.Guid);
                        if (mappedFranchisor != null)
                        {
                            var newFranchisor = await MapFranchisor(mappedFranchisor);
                            coach.localParentEntityUserId = newFranchisor.UserId;
                            coach.localParentEntityId = newFranchisor.UserId;
                        }
                    }

                    if (mappedCoach == null)
                    {
                        Coach newCoach = await MapCoach(coach);
                        await IntegrationByMappedCoach(null, newCoach.UserId);
                    }
                    else
                    {
                        //run all its practitioners and trainees
                        await IntegrationByMappedCoach(null, mappedCoach.UserId);
                    }
                }
            }
        } else
        {
            await IntegrationByMappedCoach(null, mappedCoach.UserId);
        }

        return true;
    }
    #endregion

    #region Utilities

    public async Task<List<IntegrationAudit>> GetAudits(string entityType = null, string auditUserId = null, int historyDays = 2)
    {
        try
        {
            //get all audits - excludin what the admin user did, these are cerates and SL pulls driven by t he system - so to avoid sending back what we got from SL, ignore these changes
            var audits = _auditRepo.GetAll().Where(x => x.Submitted == null && x.UserId != _uId && x.InsertedDate >= _startTime.AddDays(historyDays * -1)).OrderBy(x => x.InsertedDate).ToList(); //order by oldest to newest -- x.UserId.Equals(auditUserId) &&
                                                                                                                                                                                                  //var audits = _auditRepo.GetAll().Where(x => x.InsertedDate >= _startTime.AddMinutes(-10) && x.Submitted == null).OrderByDescending(x => x.InsertedDate)..ToList(); //overlaps with 10 minutes of changes
            if (entityType != null)
                return audits.Where(x => x.Entity.Equals(entityType) && x.Entity != "").ToList();

            return audits;
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetAudits > " + entityType);
            throw new HttpRequestException("GetAudits Error retrieving mapped " + entityType + ": " + e.Message);
        }
    }

    public async Task<List<IntegrationEntityMapping>> GetMappedEntitiesTestUsers(string entityType = null)
    {
        try
        {
            List<IntegrationEntityMapping> list = new List<IntegrationEntityMapping>();
            List<SL_Ingestion_User_Update> ids = _dbContext.SL_Ingestion_Users_Update.ToList();
            var alllist = _mapperRepo.GetAll().ToList();//.Where(x => string.Equals(x.UserId, "bc9c910e-d7e5-4ee2-b07e-7d21a9b91a71"))
            foreach (var tester in ids)
            {
                if (tester.Id != null)
                {
                    list.Add(alllist.Where(x => x.UserId == tester.Id.ToString()).FirstOrDefault());
                }
            }

            return list;
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetMappedEntitiesTestUsers > " + entityType);
            throw new HttpRequestException("GetMappedEntitiesTestUsers Error retrieving mapped " + entityType + ": " + e.Message);
        }
    }

    public async Task<List<IntegrationEntityMapping>> GetMappedEntities(string entityType = null, bool getNew = false, bool excludeDocs = false)
    {
        List<IntegrationEntityMapping> entities = new List<IntegrationEntityMapping>();
        try
        {
            if (getNew)
            {
                if (entityType != null)
                {
                    entities = _mapperRepo.GetAll().Where(x => x.LocalEntity.Equals(entityType) && x.RemoteEntity != "" && x.LocalId != null).ToList();
                }
                else
                {
                    entities = _mapperRepo.GetAll().ToList();
                }
            }

            if (entityType != null)
            {
                if (_mappedEntities != null)
                    entities = _mappedEntities.Where(x => x.LocalEntity.Equals(entityType) && x.RemoteEntity != "" && x.LocalId != null).ToList();
                else
                    entities = _mapperRepo.GetAll().Where(x => x.LocalEntity.Equals(entityType) && x.RemoteEntity != "" && x.LocalId != null).ToList();
            }
            else
            {
                if (_mappedEntities != null)
                    entities = _mappedEntities;
                else
                    entities = _mapperRepo.GetAll().ToList();
            }

            if (excludeDocs) //return everything except documents
                entities = entities.Where(x => x.LocalEntity != Constants.SSIntegrationSettings.SSDocument).ToList();
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetMappedEntities > " + entityType);
            throw new HttpRequestException("GetMappedEntities Error retrieving mapped " + entityType + ": " + e.Message);
        }
        return entities;
    }

    public async Task<List<IntegrationEntityMapping>> GetMappedGroupingEntities(string groupingType = null)
    {
        try
        {
            if (groupingType != null)
            {
                if (_mappedEntities != null)
                    return _mappedEntities.Where(x => x.EntityGrouping == groupingType && x.RemoteEntity != "" && x.LocalId != null).ToList();
                else
                    return _mapperRepo.GetAll().Where(x => x.EntityGrouping.Equals(groupingType) && x.RemoteEntity != "" && x.LocalId != null).ToList();
            }
            else
            {
                if (_mappedEntities != null)
                    return _mappedEntities;
                else
                    return _mapperRepo.GetAll().ToList();
            }
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetMappedGroupingEntities > " + groupingType);
            throw new HttpRequestException("GetMappedGroupingEntities Error retrieving mapped grouping " + groupingType + ": " + e.Message);
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
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "GetAudits > " + entityType);
            throw new HttpRequestException("GetMappedColumns Error retrieving mapped " + entityType + ": " + e.Message);
        }
    }

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
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "MatchPrincipals");
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
                        if (childHierarchy.NamedTypePath == "System.Child.")
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
                            updatedChild.Hierarchy = childNewHierarchy; // Why do we store a duplicate of the hierarchy on the child entry?
                            childRepo.Update(updatedChild);
                        }
                        else
                        {
                            // TODO: Might need to handle scenario of child moving to a different practitioner
                        }
                    }

                    //also align consent - CreatedByUserId must match the practitioner owning child
                    List<UserConsent> consents = _dbContext.UserConsents.Where(x => string.Equals(x.UserId, child.UserId) && string.Equals(x.CreatedUserId, _uId)).ToList();
                    if (consents.Count > 0)
                    {
                        foreach (var consent in consents)
                        {
                            consent.CreatedUserId = newPractitioner.UserId;
                            _dbContext.Update(consent);
                            _dbContext.SaveChanges();
                        }
                    }

                    returnOK = true;
                }
            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "AlignChildHierarchy");
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
                    var childToAlignUserIds = childrenToAlign.Select(c => c.UserId);
                    var existingLearners = learnerRepo.GetAll().Where(l => childToAlignUserIds.Contains(l.UserId) && l.IsActive == true);
                    var unsureClassroomGroup = classroomgroupRepo.GetAll().Where(x => x.UserId == Guid.Parse(newPractitioner.UserId) && x.Name == "Unsure").OrderBy(x => x.Id).FirstOrDefault();
                    foreach (var child in childrenToAlign)
                    {
                        if (child != null)
                        {
                            var existingLearner = existingLearners.Where(l => l.UserId == child.UserId).FirstOrDefault();
                            if (existingLearner == null)
                            {
                                Learner newLearner = new Learner()
                                {
                                    UserId = child.UserId,
                                    StartedAttendance = DateTime.Now,
                                    Hierarchy = newPractitioner.Hierarchy
                                };

                                if (unsureClassroomGroup != null)
                                {
                                    newLearner.ClassroomGroupId = unsureClassroomGroup.Id;
                                    learnerRepo.Insert(newLearner);

                                    returnOK = true;
                                }
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "AlignChildClassgroupToUnsure");
                }
            }
        }

        return returnOK;
    }

    private async Task<bool> RemoveImportedAndFlag(string userId, bool isPrac = false, bool isChild = false)
    {
        //TODO:

        return true;
    }

    private async Task<string> UpdateFullName(string oldValue, string newValue, string previousFullName)
    {
        return previousFullName.Replace(oldValue, newValue);
    }

    #endregion

    #region Local Creates


    private async Task<Practitioner> MapFranchisee(MappedFranchisee entity)
    {
        try
        {
            bool userExists = false;
            IntegrationEntityMapping mapperLine = new IntegrationEntityMapping();
            if (entity != null)
            {
                string validUserName = entity.IdNumber.Replace(" ", "-");//do not allow spaces in usernames
                //check if user exists but not linked to SL account already and update rather
                var createdUserCheck = await _userManager.FindByNameAsync(validUserName); //await _userManager.FindByIdAsync(entity.IdNumber);
                if (createdUserCheck != null)
                {
                    userExists = true;
                }

                if (!userExists)
                {
                    entity.IsPrincipal = entity.IsPrincipal.HasValue ? entity.IsPrincipal.Value : false;
                    //basic checks to allow child to be imported
                    if (entity.IdNumber != null && entity.FirstName != null && entity.Surname != null && entity.PersonalNumber != null)
                    {
                        string userId = Guid.NewGuid().ToString();
                        Guid siteAddressId = Guid.NewGuid();
                        //start creating the practitioner mapped

                        //NEW TODO: pull in trainee record as well and map the has StarterLicenceDate and HasStarterLicence and HasAttendedStartupTraining and others

                        //a) create franchisee, b) create children, c) create caregivers, d) create integration mapping, e) create documents, f) notes

                        var programmeTypeDesc = entity.ProgrammeType == "ECD Centre" ? "Preschool" : entity.ProgrammeType == "Full Week (Daymothers)" ? "Day Mother" : entity.ProgrammeType == "SmartStart ECD" ? "Preschool" : entity.ProgrammeType == "PlayGroup" ? "Preschool" : "Preschool";
                        var programmeType = _programmeTypeGenericRepo.GetAll().Where(x => x.Description.Equals(programmeTypeDesc)).OrderBy(x => x.Id).FirstOrDefault();
                        string siteName = "N/A";
                        bool pracCreated = false;

                        Guid newId = Guid.NewGuid();

                        var newPractitioner = new Practitioner
                        {
                            Id = newId,
                            UserId = userId,
                            CoachHierarchy = Guid.Parse(entity.localParentEntityId),
                            IsActive = true,
                            ProgrammeType = programmeTypeDesc,
                            IsClubOwner = entity.IsClubLeader,
                            AttendedBusinessSkills = entity.AttendedBusinessSkills,
                            AttendedChildProgress = entity.AttendedChildProgress,
                            MonthSinceFranchisee = int.Parse(entity.MonthsSinceFranchisee),
                            ConsentForPhoto = entity.ConsentForPhoto,
                            StipendType = entity.StipendType,
                            StartDate = (entity.StartDate != null ? Convert.ToDateTime(entity.StartDate).Date : null),
                            IsOnStipend = entity.StipendType != null && entity.StipendType != "None" ? true : false,
                            SetupTraineeInitiated = true                                                    
                        };

                        var newTrainee = new Trainee
                        {
                            Id = newId,
                            UserId = userId,
                            SmartSpaceLicenceDate = entity.StartDate,
                            IsActive = true,
                            CoachHierarchy = Guid.Parse(entity.localParentEntityId),
                            TraineeConvertedDate = entity.StartDate,
                            ConsolidationMeetingDate = entity.ConsolidationMeetingDate,
                            ChildrenAddedDate = entity.StartDate,
                            ProgrammeType = entity.ProgrammeType,
                            PractitionerId = newId,
                            AttendedStartUpTraining = true,
                            StarterLicenceReceived = true,
                            StarterLicenceDate = entity.StarterLicenceDate.HasValue ? entity.StarterLicenceDate : entity.StartDate
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
                        }
                        catch (Exception ex)
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
                            UserName = validUserName,
                            IdNumber = entity.IdNumber,
                            Email = (_maskMode == MappingMaskDataMode.MaskEmails || _maskMode == MappingMaskDataMode.MaskAll || _maskMode == MappingMaskDataMode.MaskEmailsAndNumbers ? _options.Value.MaskDataEmail : entity.EmailAddress),
                            IsSouthAfricanCitizen = (bool)entity.IsSouthAfricanCitizen,
                            VerifiedByHomeAffairs = (bool)entity.VerifiedByHomeAffairs,
                            DateOfBirth = Convert.ToDateTime(entity.BirthDate).Date,
                            FirstName = entity.FirstName != null ? entity.FirstName.Trim() : entity.FirstName,
                            Surname = entity.Surname != null ? entity.Surname.Trim() : entity.Surname,
                            FullName = entity.FirstName + " " + entity.Surname,
                            ContactPreference = MessageTypeConstants.SMS,
                            IsActive = true,
                            PasswordHash = password,
                            NextOfKinFirstName = entity.NextOfKinFirstName,
                            NextOfKinSurname = entity.NextOfKinSurname,
                            NextOfKinContactNumber = entity.NextOfKinContactNumber,
                            EmergencyContactFirstName = entity.NextOfKinFirstName,
                            EmergencyContactSurname = entity.NextOfKinSurname,
                            EmergencyContactFullName = entity.NextOfKinFirstName + " " + entity.NextOfKinSurname,
                            EmergencyContactPhoneNumber = entity.NextOfKinContactNumber,
                            TenantId = _tenantId,
                            IsImported = true,
                            //PreferredCommunicationLanguage = entity.PreferredCommunicationLanguage,
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

                        if (userExists)
                        {

                        }
                        else
                        {
                            await _userManager.CreateAsync(newUser);
                        }
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

                        //Mark Principal/FAA/Linked Practitioner
                        if (!(bool)entity.IsPrincipal && entity.Principal == null)
                        {
                            newPractitioner.IsFundaAppAdmin = true;
                            newPractitioner.IsPrincipal = false;

                            _logger.LogInformation("Roles: Add {0} to user {1} [SmartStartIntegrationService.MapFranchisee(1)]", Roles.PRACTITIONER, newUser.Id);
                            await _userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER);
                        }
                        else if (!(bool)entity.IsPrincipal && entity.Principal != null)
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

                            _logger.LogInformation("Roles: Add {0} to user {1} [SmartStartIntegrationService.MapFranchisee(2)]", Roles.PRACTITIONER, newUser.Id);
                            await _userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER);
                        }
                        else if ((bool)entity.IsPrincipal)
                        {
                            newPractitioner.IsPrincipal = true;
                            newPractitioner.IsFundaAppAdmin = false;

                            _logger.LogInformation("Roles: Add {0} to user {1} [SmartStartIntegrationService.MapFranchisee(3)]", Roles.PRINCIPAL, newUser.Id);
                            await _userManager.AddToRoleAsync(newUser, Roles.PRINCIPAL);
                        }


                        //insert the new Practitioner
                        try
                        {
                            _practitionerRepo.Insert(newPractitioner);
                            pracCreated = true;
                        }
                        catch (Exception e)
                        {
                            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "MapFranchisee > insert newPractitioner " + Newtonsoft.Json.JsonConvert.SerializeObject(newPractitioner));
                            await RemoveImportedAndFlag(userId, true, false);
                        }

                        if (pracCreated)
                        {
                            //map licenses
                            List<License> licenses = new List<License>();
                            var licenseTypes = _licenseTypeRepo.GetAll();
                            licenses.Add(
                               new License() { LicenseDate = (entity.StarterLicenceDate != null ? entity.StarterLicenceDate : entity.StartDate), LicenseTypeId = licenseTypes.Where(x => x.NormalizedName.Equals("Starter Licence")).Select(x => x.Id).FirstOrDefault(), IsActive = true, InsertedDate = DateTime.Now, UserId = newPractitioner.UserId, CollectedSSHandbook = false, CollectedSSPlaykit = false }
                            );
                            licenses.Add(
                               new License() { LicenseDate = (entity.StarterLicenceDate != null ? entity.StarterLicenceDate : entity.StartDate), LicenseTypeId = licenseTypes.Where(x => x.NormalizedName.Equals("Practice Licence")).Select(x => x.Id).FirstOrDefault(), IsActive = true, InsertedDate = DateTime.Now, UserId = newPractitioner.UserId, CollectedSSHandbook = false, CollectedSSPlaykit = false }
                            );
                            licenses.Add(
                               new License() { LicenseDate = (entity.StarterLicenceDate != null ? entity.StarterLicenceDate : entity.StartDate), LicenseTypeId = licenseTypes.Where(x => x.NormalizedName.Equals("SmartSpace Licence")).Select(x => x.Id).FirstOrDefault(), IsActive = true, InsertedDate = DateTime.Now, UserId = newPractitioner.UserId, CollectedSSHandbook = false, CollectedSSPlaykit = false }
                            );
                            _licenseRepo.InsertMany(licenses);

                            _traineeRepo.Insert(newTrainee);//create shell trainee record

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
                                    TenantId = _tenantId,
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
                                    TenantId = _tenantId,
                                    Hierarchy = newPractitioner.Hierarchy,
                                    ProgrammeTypeId = programmeType.Id,
                                    ClassroomId = pracClass.Id
                                };
                                _classroomGroupGenericRepo.Insert(pracUnsureClass);
                            }

                            mapperLine.LocalEntity = Constants.SSIntegrationSettings.SSPractitioner;
                            mapperLine.RemoteEntity = Constants.SSIntegrationSettings.SLPractitioner;
                            mapperLine.LocalId = newPractitioner.Id.ToString();
                            mapperLine.RemoteId = entity.Guid;
                            mapperLine.UserId = userId;
                            mapperLine.UpdatedBy = _uId;
                            mapperLine.UpdatedDate = DateTime.Now;
                            mapperLine.IsComplete = true;
                            mapperLine.BeforeJSON = JsonSerializer.Serialize(entity);
                            mapperLine.IsComplete = true;
                            //mapperLine.AfterJSON = JsonSerializer.Serialize(newPractitioner);
                            _mapperRepo.Insert(mapperLine);

                            return newPractitioner;
                        }
                    }
                }
                else
                {
                    var existingPrac = _practitionerGenericRepo.GetByUserId(createdUserCheck.Id);
                    if (existingPrac != null)
                    {

                        mapperLine.LocalEntity = Constants.SSIntegrationSettings.SSPractitioner;
                        mapperLine.RemoteEntity = Constants.SSIntegrationSettings.SLPractitioner;
                        mapperLine.LocalId = existingPrac.Id.ToString();
                        mapperLine.RemoteId = entity.Guid;
                        mapperLine.UserId = createdUserCheck.Id;
                        mapperLine.UpdatedBy = _uId;
                        mapperLine.UpdatedDate = DateTime.Now;
                        mapperLine.IsComplete = true;
                        mapperLine.BeforeJSON = JsonSerializer.Serialize(entity);
                        mapperLine.IsComplete = true;
                        //mapperLine.AfterJSON = JsonSerializer.Serialize(newPractitioner);
                        _mapperRepo.Insert(mapperLine);

                        return existingPrac;
                    }
                }
            }
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "MapFranchisee > " + Newtonsoft.Json.JsonConvert.SerializeObject(entity));
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
                            VerifiedByHomeAffairs = (bool)entity.IsSouthAfricanCitizen,
                            FirstName = entity.FirstName != null ? entity.FirstName.Trim() : entity.FirstName,
                            Surname = entity.Surname != null ? entity.Surname.Trim() : entity.Surname,
                            FullName = entity.FirstName + " " + entity.Surname,
                            ContactPreference = MessageTypeConstants.SMS,
                            IsActive = true,
                            TenantId = _tenantId,
                            IsImported = true,
                        };

                        if (entity.BirthDate != null)
                        {
                            newUser.DateOfBirth = Convert.ToDateTime(entity.BirthDate).Date;
                        }

                        var newChild = new Child
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            IsActive = true,
                            TenantId = _tenantId,
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
                                            TenantId = _tenantId,
                                            IdNumber = entity.Caregiver.IdNumber,
                                            FirstName = entity.Caregiver.FirstName,
                                            Surname = entity.Caregiver.Surname,
                                            FullName = entity.Caregiver.FirstName + " " + entity.Caregiver.Surname,
                                            PhoneNumber = entity.Caregiver.ContactNumber,
                                            EmergencyContactFirstName = entity.Caregiver.EmergencyContactFirstName,
                                            EmergencyContactSurname = entity.Caregiver.EmergencyContactSurname,
                                            EmergencyContactPhoneNumber = entity.Caregiver.EmergencyContactPhoneNumber,
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
                        catch (Exception e)
                        {
                            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "MapChildCaregiverOfFranchisee > " + Newtonsoft.Json.JsonConvert.SerializeObject(entity));
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
                                    List<UserGrant> grants = new List<UserGrant>() { new UserGrant() { GrantId = sGrant.Id, TenantId = _tenantId, UserId = userId } };
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
                                    UserConsent consentPopia = new UserConsent() { Id = Guid.NewGuid(), ConsentId = 171, ConsentType = "PersonalInformationAgreement", UserId = userId, CreatedUserId = _uId, TenantId = _tenantId, IsActive = true, InsertedDate = DateTime.Now };
                                    _dbContext.UserConsents.Add(consentPopia);
                                    _dbContext.SaveChanges();
                                }
                                catch (Exception e)
                                {
                                    //TODO: LOG ERROR AND HANDLE
                                    return null;
                                }
                            }
                            if ((bool)entity.CaregiverPhotographyAndFilmingConsent)
                            {

                                try
                                {
                                    UserConsent consentPhoto = new UserConsent() { Id = Guid.NewGuid(), ConsentId = 175, ConsentType = "PhotoPermissions", UserId = userId, CreatedUserId = _uId, TenantId = _tenantId, IsActive = true, InsertedDate = DateTime.Now };
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

                            mapperLine.LocalEntity = Constants.SSIntegrationSettings.SSChild;
                            mapperLine.RemoteEntity = Constants.SSIntegrationSettings.SLChild;
                            mapperLine.LocalId = newChild.Id.ToString();
                            mapperLine.RemoteId = entity.Guid;
                            mapperLine.UserId = userId;
                            mapperLine.UpdatedBy = _uId;
                            mapperLine.UpdatedDate = DateTime.Now;
                            mapperLine.IsComplete = true;
                            mapperLine.BeforeJSON = JsonSerializer.Serialize(entity);
                            mapperLine.IsComplete = true;
                            //mapperLine.AfterJSON = JsonSerializer.Serialize(newPractitioner);
                            _mapperRepo.Insert(mapperLine);

                            return newChild;
                        }
                    }
                }
                else { return _childRepo.GetByUserId(existingUser.Id.ToString()); }
            }
            else return null;
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "MapChildCaregiverOfFranchisee > " + Newtonsoft.Json.JsonConvert.SerializeObject(entity));
            return null;
        }

        return null;
    }

    private async Task<List<Document>> MapFranchiseeChildDocuments(List<MappedDocument> docs, List<MappedChild> children, Practitioner ownerPractitioner)
    {
        List<Document> ssDocuments = new List<Document>();
        try
        {
            var docTypes = _mappedEntities.Where(x => x.EntityGrouping == "DocumentType").ToList(); //Get SL mapped document types
            foreach (var doc in docs)
            {
                Child docChild = null;

                if (doc.Child != null)
                {
                    MappedChild docForChild = children.Where(x => x.Guid.Equals(doc.Child.Guid)).FirstOrDefault();
                    if (docForChild != null)
                    {
                        docChild = _childGenericRepo.GetByUserId(docForChild.localUserId);
                    }
                }

                await MapDocuments(doc, docChild, ownerPractitioner);
            }
        }
        catch (Exception e)
        {

        }

        return ssDocuments;
    }

    private async Task<List<Document>> MapDocuments(MappedDocument doc, Child child, Practitioner ownerPractitioner)
    {
        List<Document> ssDocuments = new List<Document>();
        try
        {
            var docTypes = _mappedEntities.Where(x => x.EntityGrouping == "DocumentType").ToList(); //Get SL mapped document types

            Document newDoc = new Document()
            {
                Name = doc.Name,
                InsertedDate = doc.DocumentDate,
                UpdatedDate = doc.DocumentDate,
                CreatedUserId = ownerPractitioner.UserId,
                Hierarchy = ownerPractitioner.Hierarchy
            };

            if (child != null)
            {
                newDoc.UserId = child.UserId;
            }
            else
            {
                newDoc.UserId = ownerPractitioner.UserId;
            }

            //status - validity -- check if valid/Invalid and set status according
            /* FinalValidity - Invalid, Valid, Pending */
            newDoc.IsActive = true;

            //doc type
            /* SL API - Proof of Account, Attendance Register, Income Statement, Franchisee Agreement,Child Registration Form,Monthly Attendance Register, Child Birth Certificate   {{RouteStart}}DocumentType/Query */
            if (doc.DocumentType != null)
            {
                var docType = docTypes.Where(d => d.RemoteEntity.Equals(doc.DocumentType.Name)).FirstOrDefault();
                if (docType != null)
                {
                    newDoc.DocumentTypeId = Guid.Parse(docType.LocalId);
                }
            }

            //workflowstatus
            /* ValidationStatus - Pending Check,Waiting for Document,Pending Moderation, Complete (Moderated) */
            var wfPending = _workflowRepo.GetAll().Where(w => w.Description.Equals("Pending Verification")).FirstOrDefault();
            if (doc.ValidationStatus != null)
            {
                string workflow = "";
                switch (doc.ValidationStatus)
                {
                    case "Waiting for Document":
                        workflow = "Pending Upload";
                        break;
                    case "Pending Moderation":
                        workflow = "Pending";
                        break;
                    case "Complete (Moderated)":
                        workflow = "Active";
                        break;
                    default:
                        workflow = "Pending Verification";
                        break;
                }

                var wf = _workflowRepo.GetAll().Where(w => w.Description.Equals(workflow)).FirstOrDefault();
                if (wf != null)
                {
                    newDoc.WorkflowStatusId = wf.Id;
                }
                else
                {
                    newDoc.WorkflowStatusId = wfPending.Id;
                }
            }
            else
            {
                newDoc.WorkflowStatusId = wfPending.Id;
            }

            Document childDoc = _docRepo.Insert(newDoc);
            ssDocuments.Add(childDoc);

            IntegrationEntityMapping mapperLine = new IntegrationEntityMapping();
            mapperLine.LocalEntity = Constants.SSIntegrationSettings.SSDocument;
            mapperLine.RemoteEntity = Constants.SSIntegrationSettings.SLDocument;
            mapperLine.LocalId = newDoc.Id.ToString();
            mapperLine.RemoteId = doc.Guid;
            mapperLine.UserId = newDoc.UserId;
            mapperLine.UpdatedBy = _uId;
            mapperLine.UpdatedDate = DateTime.Now;
            mapperLine.IsComplete = true;
            mapperLine.BeforeJSON = JsonSerializer.Serialize(doc);
            mapperLine.IsComplete = true;
            _mapperRepo.Insert(mapperLine);
        }
        catch (Exception e)
        {

        }

        return ssDocuments;
    }

    private async Task<Trainee> MapTrainee(MappedTrainee entity, Practitioner existingPractitioner = null)
    {
        try
        {
            IntegrationEntityMapping mapperLine = new IntegrationEntityMapping();
            if (entity != null)
            {
                //check if it exists already before importing

                //_mappedEntities = await GetMappedEntities();//Constants.SSIntegrationSettings.SSTrainee

                if (!_mappedEntities.Where(x => string.Equals(x.RemoteId, entity.Guid) && string.Equals(x.RemoteEntity, Constants.SSIntegrationSettings.SLTrainee)).Any())
                {
                    //entity.IsPrincipal = entity.IsPrincipal.HasValue ? entity.IsPrincipal.Value : false;
                    ////basic checks to allow trainee to be imported
                    if (entity.IdNumber != null && entity.FirstName != null && entity.Surname != null)
                    {
                        string userId = (existingPractitioner == null ? Guid.NewGuid().ToString() : existingPractitioner.UserId);
                        Guid traineePracId = Guid.NewGuid();

                        var programmeTypeDesc = entity.ProgrammeType == "ECD Centre" ? "Preschool" : entity.ProgrammeType == "Full Week (Daymothers)" ? "Day Mother" : entity.ProgrammeType == "SmartStart ECD" ? "Preschool" : entity.ProgrammeType == "PlayGroup" ? "Preschool" : "Preschool";
                        var programmeType = _programmeTypeGenericRepo.GetAll().Where(x => x.Description.Equals(programmeTypeDesc)).OrderBy(x => x.Id).FirstOrDefault();
                        string siteName = "N/A";
                        bool pracCreated = false;


                        Practitioner newPractitioner = null;
                        if (existingPractitioner == null)
                        {
                            newPractitioner = new Practitioner
                            {
                                Id = traineePracId,
                                UserId = userId,
                                CoachHierarchy = Guid.Parse(entity.localParentEntityUserId),
                                IsActive = true,
                                ProgrammeType = programmeTypeDesc,
                                ConsentForPhoto = entity.HasGivenPhotoConsent,
                                StipendType = entity.StipendType,
                                //IsClubOwner = entity.IsClubLeader,
                                IsTrainee = true,
                                //AttendedBusinessSkills = entity.AttendedBusinessSkills,
                                //AttendedChildProgress = entity.AttendedChildProgress,
                                //MonthSinceFranchisee = int.Parse(entity.MonthsSinceFranchisee),
                                //StartDate = (entity.StartDate != null ? Convert.ToDateTime(entity.StartDate).Date : null),
                                IsOnStipend = entity.StipendType != null ? true : false,
                            };
                        }
                        else
                        {
                            newPractitioner = existingPractitioner;
                        }

                        var newTrainee = new Trainee
                        {
                            Id = existingPractitioner == null ? traineePracId : existingPractitioner.Id,
                            UserId = userId,
                            SiteArea = entity.SiteArea,
                            StarterLicenceReceived = entity.HasStarterLicence,
                            PractitionerId = existingPractitioner == null ? traineePracId : existingPractitioner.Id,
                            ConsolidationMeetingDate = entity.ConsolidationMeetingDate,
                            ScheduledConsolidationMeetingDate = entity.ConsolidationMeetingDate,
                            Progress = 0,
                            ProgrammeType = programmeTypeDesc,
                            PlayKitReceived = entity.HasReceivedPlaykit,
                            AdminFileReceived = entity.HasReceivedAdminFile,
                            SmartSpaceVisitPassed = entity.HasPassedSmartSpaceVisit,
                            AttendedStartUpTraining = entity.HasAttendedStartupTraining,
                            IsSmartSpaceVisitValidated = entity.IsSmartSpaceVisitValidated,
                            IsAdminFileAndPlaykitValidated = (entity.IsAdminFileAndPlaykitValidated != "Yes" ? false : true),
                            HomeAddressLine1 = entity.HomeAddressLine1,
                            HomeAddressLine2 = entity.HomeAddressLine2,
                            HomeAddressLine3 = entity.HomeAddressLine3,
                            HomeAddressPostalCode = entity.HomeAddressPostalCode,
                            StarterLicenceDate = entity.StarterLicenceDate,
                            FranchiseeAgreementAcceptedDate = entity.FranchiseeAgreementAcceptedDate,
                            SmartSpaceLicenceDate = entity.SmartSpaceLicenceDate,
                            StipendType = entity.StipendType,
                            IsOnStipend = entity.StipendType != null ? true : false,
                            CoachHierarchy = Guid.Parse(entity.localParentEntityUserId),
                            //PreferredCommunicationLanguage = entity.PreferredCommunicationLanguage
                            //HighestEducationLevel = entity.HighestEducationLevel,
                            //StartDate
                            //ChildrenAddedDate
                            //TraineeConvertedDate
                            //LinkedPrincipalHierarchy
                            //SiteVisitsCompleted
                            //ChildProgressTraining
                            //HaveCommunitySupport
                            //CommunitySupportGained
                        };

                        //    //check phone number is valid
                        //string numberToImport = null;
                        //try
                        //{
                        //    var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(entity.PersonalNumber);
                        //    if (!string.Equals(normalizePhoneNumber, entity.PersonalNumber))
                        //    {
                        //        numberToImport = normalizePhoneNumber;
                        //    }
                        //}
                        //catch (Exception ex)
                        //{
                        //    //if phone number cant be used, ignore it
                        //}
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

                        ApplicationUser newUser = await _userManager.FindByNameAsync(entity.IdNumber);
                        if (newUser == null)
                        {
                            if (existingPractitioner == null)
                            {
                                newUser = new ApplicationUser
                                {
                                    Id = userId.ToString(),
                                    PhoneNumber = (_maskMode == MappingMaskDataMode.MaskNumbers || _maskMode == MappingMaskDataMode.MaskAll || _maskMode == MappingMaskDataMode.MaskEmailsAndNumbers ? _options.Value.MaskDataNumber : whatsappNumberToImport),
                                    UserName = entity.IdNumber,
                                    IdNumber = entity.IdNumber,
                                    //Email = (_maskMode == MappingMaskDataMode.MaskEmails || _maskMode == MappingMaskDataMode.MaskAll || _maskMode == MappingMaskDataMode.MaskEmailsAndNumbers ? _options.Value.MaskDataEmail : entity.EmailAddress),
                                    //IsSouthAfricanCitizen = (bool)entity.IsSouthAfricanCitizen,
                                    //VerifiedByHomeAffairs = (bool)entity.VerifiedByHomeAffairs,
                                    //DateOfBirth = Convert.ToDateTime(entity.BirthDate).Date,
                                    FirstName = entity.FirstName != null ? entity.FirstName.Trim() : entity.FirstName,
                                    Surname = entity.Surname != null ? entity.Surname.Trim() : entity.Surname,
                                    FullName = entity.FirstName + " " + entity.Surname,
                                    ContactPreference = MessageTypeConstants.SMS,
                                    IsActive = true,
                                    PasswordHash = password,
                                    //NextOfKinFirstName = entity.NextOfKinFirstName,
                                    //NextOfKinSurname = entity.NextOfKinSurname,
                                    //NextOfKinContactNumber = entity.NextOfKinContactNumber,
                                    //EmergencyContactFirstName = entity.NextOfKinFirstName,
                                    //EmergencyContactSurname = entity.NextOfKinSurname,
                                    //EmergencyContactFullName = entity.NextOfKinFirstName + " " + entity.NextOfKinSurname,
                                    //EmergencyContactPhoneNumber = entity.NextOfKinContactNumber,
                                    TenantId = _tenantId,
                                    IsImported = true,
                                    //PreferredCommunicationLanguage = entity.PreferredCommunicationLanguage,
                                    WhatsAppNumber = whatsappNumberToImport,
                                    //ReasonForLeaving = entity.ReasonForLeaving,
                                    //ReasonForLeavingComments = entity.InactivityComments
                                };


                                //    //check language
                                if (entity.PreferredCommunicationLanguage != null)
                                {
                                    var language = _staticLanguageRepo.GetAll().Where(x => x.Description == entity.PreferredCommunicationLanguage).OrderBy(x => x.Id).FirstOrDefault();
                                    if (language != null)
                                    {
                                        newUser.PreferredCommunicationLanguage = language.Id.ToString();
                                        newUser.LanguageId = language.Id;
                                        newPractitioner.LanguageUsedInGroups = language.Id.ToString();
                                        newTrainee.PreferredCommunicationLanguage = language.Id.ToString();
                                    }
                                }
                                if (entity.HighestEducationLevel != null)
                                {
                                    var education = _staticEducationRepo.GetAll().Where(x => x.Description == entity.HighestEducationLevel).OrderBy(x => x.Id).FirstOrDefault();
                                    if (education != null)
                                    {
                                        newTrainee.HighestEducationLevel = education.Id.ToString();
                                    }
                                }
                                //    //check gender
                                //    if (entity.Gender != null)
                                //    {
                                //        var gender = _staticGenderRepo.GetAll().Where(x => x.Description == entity.Gender).OrderBy(x => x.Id).FirstOrDefault();
                                //        if (gender != null)
                                //        {
                                //            newUser.GenderId = gender.Id;
                                //        }
                                //    }
                                //    //check race
                                //    if (entity.EthnicGroup != null)
                                //    {
                                //        var race = _staticRaceRepo.GetAll().Where(x => x.Description == entity.EthnicGroup).OrderBy(x => x.Id).FirstOrDefault();
                                //        if (race != null)
                                //        {
                                //            newUser.RaceId = race.Id;
                                //        }
                                //    }

                                var userCreatedResult = await _userManager.CreateAsync(newUser);
                                if (userCreatedResult.Succeeded)
                                {
                                    _logger.LogInformation("Roles: Add {0} to user {1} [SmartStartIntegrationService.MapTrainee(1)]", Roles.PRACTITIONER, newUser.Id);
                                    await _userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER);
                                    pracCreated = true;
                                }
                                else
                                {
                                    pracCreated = false;
                                }
                            }
                            else
                            {
                                newUser = existingPractitioner.User;
                            }

                            //    //insert the new Practitioner
                            try
                            {
                                _traineeRepo.Insert(newTrainee);
                                if (pracCreated)
                                {
                                    //map licenses
                                    List<License> licenses = new List<License>();
                                    var licenseTypes = _licenseTypeRepo.GetAll();
                                    licenses.Add(
                                       new License() { LicenseDate = (entity.StarterLicenceDate != null ? entity.StarterLicenceDate : entity.StartDate), LicenseTypeId = licenseTypes.Where(x => x.NormalizedName.Equals("Starter Licence")).Select(x => x.Id).FirstOrDefault(), IsActive = true, InsertedDate = DateTime.Now, UserId = newTrainee.UserId, CollectedSSHandbook = false, CollectedSSPlaykit = false }
                                    );
                                    if (entity.SmartSpaceLicenceDate != null)
                                    {
                                        licenses.Add(
                                           new License() { LicenseDate = (entity.SmartSpaceLicenceDate != null ? entity.SmartSpaceLicenceDate : entity.StartDate), LicenseTypeId = licenseTypes.Where(x => x.NormalizedName.Equals("SmartSpace Licence")).Select(x => x.Id).FirstOrDefault(), IsActive = true, InsertedDate = DateTime.Now, UserId = newTrainee.UserId, CollectedSSHandbook = false, CollectedSSPlaykit = false }
                                        );
                                    }
                                    _licenseRepo.InsertMany(licenses);
                                }

                                if (existingPractitioner == null)
                                {
                                    _practitionerRepo.Insert(newPractitioner);
                                }
                                //notify trainee to stary journey
                                await _notificationService.SendNotificationAsync("Trainee", TemplateTypeConstants.StartTraineeJourney, DateTime.Now, newTrainee.User);

                                pracCreated = true;
                            }
                            catch (Exception e)
                            {
                                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "MapTrainee > insert trainee & practitioner " + Newtonsoft.Json.JsonConvert.SerializeObject(newPractitioner));
                                await RemoveImportedAndFlag(userId, true, false);
                            }

                            if (pracCreated)
                            {
                                //create classrooms and classroomgroups - only map for principals or FAAs
                                //if ((bool)newPractitioner.IsPrincipal || (bool)newPractitioner.IsFundaAppAdmin)
                                //{
                                Classroom pracClass = new Classroom()
                                {
                                    Id = Guid.NewGuid(),
                                    UserId = userId,
                                    IsActive = true,
                                    Name = siteName,
                                    IsPrinciple = true,
                                    NumberPractitioners = 1,
                                    Hierarchy = newPractitioner.Hierarchy,
                                    TenantId = _tenantId,
                                    //SiteAddressId = insertedAddress ? siteAddressId : null
                                };
                                _classroomGenericRepo.Insert(pracClass);

                                //create UNSURE classroomgroup to assign children to
                                ClassroomGroup pracUnsureClass = new ClassroomGroup()
                                {
                                    Id = Guid.NewGuid(),
                                    UserId = Guid.Parse(userId),
                                    IsActive = true,
                                    Name = "Unsure",
                                    TenantId = _tenantId,
                                    Hierarchy = newPractitioner.Hierarchy,
                                    ProgrammeTypeId = programmeType.Id,
                                    ClassroomId = pracClass.Id
                                };
                                _classroomGroupGenericRepo.Insert(pracUnsureClass);
                                //}

                                mapperLine.LocalEntity = Constants.SSIntegrationSettings.SSTrainee;
                                mapperLine.RemoteEntity = Constants.SSIntegrationSettings.SLTrainee;
                                mapperLine.LocalId = newTrainee.Id.ToString();
                                mapperLine.RemoteId = entity.Guid;
                                mapperLine.UserId = userId;
                                mapperLine.UpdatedBy = _uId;
                                mapperLine.UpdatedDate = DateTime.Now;
                                mapperLine.IsComplete = true;
                                mapperLine.BeforeJSON = JsonSerializer.Serialize(entity);
                                mapperLine.IsComplete = true;
                                //mapperLine.AfterJSON = JsonSerializer.Serialize(newPractitioner);
                                _mapperRepo.Insert(mapperLine);

                                return newTrainee;
                            }
                        }
                    }
                }
            }
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "MapTrainee > " + Newtonsoft.Json.JsonConvert.SerializeObject(entity));
        }

        return null;
    }

    private async Task<Franchisor> MapFranchisor(MappedFranchisor entity)
    {
        Franchisor franchisor = new Franchisor();
        try
        {
            if (entity.Name != null)
            {
                Guid userId = Guid.Parse(entity.Guid); //Guid.NewGuid();

                string whatsappNumberToImport = null;
                try
                {
                    var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(entity.ContactNumber);
                    if (!string.Equals(normalizePhoneNumber, entity.ContactNumber))
                    {
                        whatsappNumberToImport = normalizePhoneNumber;
                    }
                }
                catch (Exception ex)
                {
                    //if phone number cant be used, ignore it
                }


                ApplicationUser newUser = await _userManager.FindByNameAsync(userId.ToString());
                if (newUser == null)
                {

                    newUser = new ApplicationUser
                    {
                        Id = userId.ToString(),
                        PhoneNumber = whatsappNumberToImport,
                        UserName = userId.ToString(),
                        //IdNumber = entity.IdNumber,
                        Email = entity.EmailAddress,
                        FirstName = entity.Name,
                        Surname = entity.ContactPerson,
                        FullName = entity.Name,
                        ContactPreference = MessageTypeConstants.SMS,
                        IsActive = true,
                        EmergencyContactFullName = entity.ContactPerson,
                        EmergencyContactPhoneNumber = entity.ContactNumber,
                        TenantId = _tenantId,
                        IsImported = true,
                        WhatsAppNumber = whatsappNumberToImport,
                    };
                    var userCreatedResult = await _userManager.CreateAsync(newUser);
                    if (userCreatedResult.Succeeded)
                    {
                        _logger.LogInformation("Roles: Add {0} to user {1} [SmartStartIntegrationService.MapFranchisor(1)]", Roles.FRANCHISOR, newUser.Id);
                        await _userManager.AddToRoleAsync(newUser, Roles.FRANCHISOR);
                    }

                    franchisor = new Franchisor
                    {
                        Id = userId,
                        AreaOfOperation = entity.Name,
                        StartDate = entity.CreatedOn,
                        IsActive = true,
                        ContactPerson = entity.ContactPerson,
                        ContactPersonNumber = entity.ContactNumber,
                    };
                    _franchisorGenericRepo.Insert(franchisor);

                    IntegrationEntityMapping mapperLine = new IntegrationEntityMapping();
                    mapperLine.LocalEntity = Constants.SSIntegrationSettings.SSFranchisor;
                    mapperLine.RemoteEntity = Constants.SSIntegrationSettings.SLFranchisor;
                    mapperLine.LocalId = franchisor.Id.ToString();
                    mapperLine.RemoteId = entity.Guid;
                    mapperLine.UserId = userId.ToString();
                    mapperLine.UpdatedBy = _uId;
                    mapperLine.UpdatedDate = DateTime.Now;
                    mapperLine.IsComplete = true;
                    mapperLine.BeforeJSON = JsonSerializer.Serialize(entity);
                    mapperLine.IsComplete = true;
                    //mapperLine.AfterJSON = JsonSerializer.Serialize(newPractitioner);
                    _mapperRepo.Insert(mapperLine);
                }

            }
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "MapTrainee > " + Newtonsoft.Json.JsonConvert.SerializeObject(entity));
        }

        return franchisor;
    }

    private async Task<Coach> MapCoach(MappedCoach entity)
    {
        Coach coach = new Coach();
        try
        {
            if (entity.FirstName != null)
            {
                Guid userId = Guid.Parse(entity.Guid); //Guid.NewGuid();

                string whatsappNumberToImport = null;
                try
                {
                    var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(entity.ContactNumber);
                    if (!string.Equals(normalizePhoneNumber, entity.ContactNumber))
                    {
                        whatsappNumberToImport = normalizePhoneNumber;
                    }
                }
                catch (Exception ex)
                {
                    //if phone number cant be used, ignore it
                }

                ApplicationUser newUser = await _userManager.FindByNameAsync(entity.IdNumber);
                if (newUser == null)
                {

                    newUser = new ApplicationUser
                    {
                        Id = userId.ToString(),
                        PhoneNumber = whatsappNumberToImport,
                        UserName = entity.IdNumber != null ? entity.IdNumber : userId.ToString(),
                        IdNumber = entity.IdNumber,
                        Email = entity.Email,
                        FirstName = entity.FirstName,
                        Surname = entity.Surname,
                        FullName = entity.FirstName + " " + entity.Surname,
                        ContactPreference = MessageTypeConstants.SMS,
                        IsActive = true,
                        EmergencyContactFirstName = entity.EmergencyContactFirstName,
                        EmergencyContactSurname = entity.EmergencyContactSurname,
                        EmergencyContactFullName = entity.EmergencyContactFirstName,
                        EmergencyContactPhoneNumber = entity.ContactNumber,
                        TenantId = _tenantId,
                        IsImported = true,
                        WhatsAppNumber = whatsappNumberToImport,
                    };
                    var userCreatedResult = await _userManager.CreateAsync(newUser);
                    if (userCreatedResult.Succeeded)
                    {
                        _logger.LogInformation("Roles: Add {0} to user {1} [SmartStartIntegrationService.MapCoach(1)]", Roles.COACH, newUser.Id);
                        await _userManager.AddToRoleAsync(newUser, Roles.COACH);
                    }

                    //check address

                    coach = new Coach
                    {
                        Id = userId,
                        AreaOfOperation = entity.AreaOfOperation,
                        StartDate = entity.CreatedOn,
                        IsActive = true,
                        UserId = userId.ToString(),
                        SecondaryAreaOfOperation = entity.SecondaryAreaOfOperation,
                    };
                    _coachGenericRepo.Insert(coach);

                    IntegrationEntityMapping mapperLine = new IntegrationEntityMapping();
                    mapperLine.LocalEntity = Constants.SSIntegrationSettings.SSCoach;
                    mapperLine.RemoteEntity = Constants.SSIntegrationSettings.SLCoach;
                    mapperLine.LocalId = coach.Id.ToString();
                    mapperLine.RemoteId = entity.Guid;
                    mapperLine.UserId = userId.ToString();
                    mapperLine.UpdatedBy = _uId;
                    mapperLine.UpdatedDate = DateTime.Now;
                    mapperLine.IsComplete = true;
                    mapperLine.BeforeJSON = JsonSerializer.Serialize(entity);
                    mapperLine.IsComplete = true;
                    //mapperLine.AfterJSON = JsonSerializer.Serialize(newPractitioner);
                    _mapperRepo.Insert(mapperLine);
                } else
                {
                    coach = _coachGenericRepo.GetById(userId);
                }

            }
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "MapTrainee > " + Newtonsoft.Json.JsonConvert.SerializeObject(entity));
        }

        return coach;
    }
    #endregion

    #region Local Updates

    private async Task<IntegrationEntityMapping> UpdateInsertNewEntity(UpdateLocalEntity model)
    {
        IntegrationEntityMapping newEntity = null;
        try
        {
            //make sure to exclude any system related updates and do not log
            //var localColumnChange = _mappedColumns.Where(c => c.RemoteColumn.Equals(model.EntityColumn) && c.RemoteEntity.Equals(model.EntityType)).FirstOrDefault();
            //if (localColumnChange != null)
            //{ //if its not mapped we arent interested in this change
            //var pracs = await GetMappedEntities(Constants.SSIntegrationSettings.SSPractitioner);
            switch (model.EntityType)
            {
                case Constants.SSIntegrationSettings.SLCaregiver:
                    //caregiver is associated with a child, their details will be pulled in via a child record - so ignore
                    break;
                case Constants.SSIntegrationSettings.SLChild:
                    //map child and caregiver
                    MappedChild child = await _apiManager.GetChildById(model.Guid);
                    if (child != null)
                    {
                        //get childs parent
                        var parentEntity = _mappedEntities.Where(x => string.Equals(x.RemoteId, child.Franchisee.Guid) && string.Equals(x.LocalEntity, Constants.SSIntegrationSettings.SSPractitioner)).FirstOrDefault();
                        if (parentEntity != null)
                        {
                            Practitioner parentPrac = _practitionerGenericRepo.GetByUserId(parentEntity.UserId);
                            if (parentPrac != null)
                            {
                                var entity = await MapChildCaregiverOfFranchisee(child, parentPrac);

                                //Remap hierarchy and unsure classes
                                //realign hirarchy and learners to Unsure classgroups
                                List<Child> newChild = new List<Child>();
                                newChild.Add(entity);
                                await AlignChildHierarchy(parentPrac, newChild);
                                await AlignChildClassgroupToUnsure(parentPrac, newChild);

                                List<MappedDocument> newDocuments = await _apiManager.GetFranchiseeDocuments(parentEntity.RemoteId);
                                if (newDocuments.Any())
                                {
                                    List<Document> docsLoaded = await MapFranchiseeChildDocuments(newDocuments, new List<MappedChild>() { child }, parentPrac);
                                }
                            }
                        }
                    }
                    break;
                case Constants.SSIntegrationSettings.SLDocument:
                    //TODO:
                    MappedDocument doc = await _apiManager.GetDocumentsById(model.Guid);
                    if (doc != null)
                    {
                        //get document alignment with child and franchisee
                        var docParentEntity = _mappedEntities.Where(x => string.Equals(x.RemoteId, model.RelatedGuid) && string.Equals(x.LocalEntity, Constants.SSIntegrationSettings.SSPractitioner)).FirstOrDefault();
                        if (docParentEntity != null)
                        {
                            var practitionerOwner = _practitionerGenericRepo.GetByUserId(docParentEntity.UserId);
                            Child docChild = null;
                            if (doc.Child != null)
                            {
                                var mappedChildren = await GetMappedEntities(Constants.SSIntegrationSettings.SSChild);
                                var mappedChild = mappedChildren.Where(x => string.Equals(x.RemoteId, doc.Child.Guid)).FirstOrDefault();
                                if (mappedChild != null)
                                {
                                    docChild = _childGenericRepo.GetByUserId(mappedChild.UserId);
                                }
                            }
                            //check if the child exists if a child is related to the doc
                            var entity = await MapDocuments(doc, docChild, practitionerOwner);
                        }
                    }
                    break;
                case Constants.SSIntegrationSettings.SLAddress:
                    //TODO:
                    MappedAddress address = await _apiManager.GetAddressById(model.Guid);

                    break;
                case Constants.SSIntegrationSettings.SLTrainee:
                    //TODO:
                    MappedTrainee trainee = await _apiManager.GetTraineesById(model.Guid);
                    break;

            }

            //}
            return newEntity;
        }
        catch (Exception e)
        {

            await _logManager.IntegrationLog(e.Message + " - Remote Insert: " + model.Guid + ", Column: " + model.EntityColumn + ", Data: " + model.NewData, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "UpdateInsertNewEntity");
            return newEntity;
        }
    }

    private async Task<bool> UpdateEntityColumn(UpdateLocalEntity model, IntegrationEntityMapping mappedEntity)
    {
        bool updatedEntity = false;
        try
        {
            //make sure to exclude any system related updates and do not log
            var localColumnChange = _mappedColumns.Where(c => c.RemoteColumn.Equals(model.EntityColumn) && c.RemoteEntity.Equals(model.EntityType)).FirstOrDefault();
            if (localColumnChange != null)
            { //if its not mapped we arent interested in this change
                switch (localColumnChange.LocalEntity)
                {
                    case "ApplicationUser":
                        var entityUser = await _userManager.FindByIdAsync(mappedEntity.UserId);
                        if (entityUser != null)
                        {
                            Type userT = typeof(ApplicationUser);
                            foreach (var prop in userT.GetProperties())
                            {
                                if (prop.Name == localColumnChange.LocalColumn)
                                {
                                    string newData = model.NewData;
                                    //if (model.LastUpdatedDateTime >= entityUser.UpdatedDate)
                                    //{
                                    string currentValue = prop.GetValue(entityUser, null) != null ? prop.GetValue(entityUser, null).ToString() : "";

                                    if (localColumnChange.RemapToString) {
                                        if (localColumnChange.RemapEntity != null && !string.IsNullOrEmpty(newData))
                                        {
                                            newData = await _integrationHelperManager.RemapStaticStringToGuid(localColumnChange.RemapEntity, model.NewData);
                                        }
                                    }    
                                    if (currentValue != newData)
                                    {
                                        //if the name is changed, remember to update the fullname as well
                                        if (prop.Name == "FirstName" || prop.Name == "SurName")
                                        {
                                            prop.SetValue(entityUser, newData);
                                            if (entityUser.FullName != null)
                                                entityUser.FullName = await UpdateFullName(currentValue, model.NewData, entityUser.FullName);
                                            else
                                                entityUser.FullName = model.NewData;
                                        }
                                        else
                                        {
                                            prop.SetValue(entityUser, model.NewData);
                                        }

                                        updatedEntity = true;
                                    }
                                    //}
                                }
                            }
                            if (updatedEntity)
                            {
                                await _userManager.UpdateAsync(entityUser);
                            }
                        }
                        break;
                    case Constants.SSIntegrationSettings.SSCoach:
                        var coach = _coachGenericRepo.GetByUserId(mappedEntity.UserId);
                        if (coach != null)
                        {
                            Type coachT = typeof(Coach);
                            foreach (var prop in coachT.GetProperties())
                            {
                                if (prop.Name == model.EntityColumn)
                                {
                                    if (model.LastUpdatedDateTime >= coach.UpdatedDate)
                                    {
                                        string newData = model.NewData;
                                        string currentValue = prop.GetValue(coach, null) != null ? prop.GetValue(coach, null).ToString() : "";
                                        if (localColumnChange.RemapToString) {
                                            if (localColumnChange.RemapEntity != null && !string.IsNullOrEmpty(newData))
                                            {
                                                newData = await _integrationHelperManager.RemapStaticStringToGuid(localColumnChange.RemapEntity, model.NewData);
                                            }
                                        }
                                        prop.SetValue(coach, model.EntityColumn);
                                        if (currentValue != newData)
                                        {
                                            prop.SetValue(coach, newData);
                                            updatedEntity = true;
                                        }
                                    }
                                }
                            }
                            if (updatedEntity)
                            {
                                coach.UpdatedBy = _uId;
                                coach.UpdatedDate = DateTime.Now;
                                _coachGenericRepo.Update(coach);
                            }
                        }
                        break;
                    case Constants.SSIntegrationSettings.SSPractitioner:
                        var prac = _practitionerGenericRepo.GetByUserId(mappedEntity.UserId);
                        if (prac != null)
                        {
                            Type practT = typeof(Practitioner);
                            foreach (var prop in practT.GetProperties())
                            {
                                if (prop.Name == localColumnChange.LocalColumn)
                                {
                                    if (model.LastUpdatedDateTime >= prac.UpdatedDate)
                                    {
                                        string newData = model.NewData;
                                        string currentValue = prop.GetValue(prac, null) != null ? prop.GetValue(prac, null).ToString() : "";
                                        if (localColumnChange.RemapToString) {
                                            if (localColumnChange.RemapEntity != null && !string.IsNullOrEmpty(newData))
                                            {
                                                newData = await _integrationHelperManager.RemapStaticStringToGuid(localColumnChange.RemapEntity, model.NewData);
                                            }
                                        }    
                                        if (currentValue != newData)
                                        {
                                            prop.SetValue(prac, newData);
                                            updatedEntity = true;
                                        }
                                    }
                                }
                            }
                            if (updatedEntity)
                            {
                                prac.UpdatedBy = _uId;
                                prac.UpdatedDate = DateTime.Now;
                                _practitionerGenericRepo.Update(prac);
                            }
                        }
                        break;
                    case Constants.SSIntegrationSettings.SSChild:
                        var child = _childGenericRepo.GetByUserId(mappedEntity.UserId);
                        Type childT = typeof(Child);
                        if (child != null)
                        {
                            foreach (var prop in childT.GetProperties())
                            {
                                if (prop.Name == localColumnChange.LocalColumn)
                                {
                                    if (model.LastUpdatedDateTime >= child.UpdatedDate)
                                    {
                                        string newData = model.NewData;
                                        string currentValue = prop.GetValue(child, null) != null ? prop.GetValue(child, null).ToString() : "";

                                        if (localColumnChange.RemapToString) {
                                            if (localColumnChange.RemapEntity != null && !string.IsNullOrEmpty(newData))
                                            {
                                                newData = await _integrationHelperManager.RemapStaticStringToGuid(localColumnChange.RemapEntity, model.NewData);
                                            }
                                        }    
                                        if (currentValue != newData)
                                        {
                                            prop.SetValue(child, newData);
                                            updatedEntity = true;
                                        }
                                    }
                                }
                            }
                            if (updatedEntity)
                            {
                                child.UpdatedBy = _uId;
                                child.UpdatedDate = DateTime.Now;
                                _childGenericRepo.Update(child);
                            }
                        }
                        break;
                    case Constants.SSIntegrationSettings.SSCaregiver:
                        var caregiver = _caregiverRepo.GetById(Guid.Parse(mappedEntity.LocalId));
                        if (caregiver == null)
                        {
                            //it depends on teh entity grouping for child, it may be that the child needs updating but the record of the caregiver - like emergency contact number, so get child and reload its caregiver
                            var cgchild = _childGenericRepo.GetByUserId(mappedEntity.UserId);
                            if (cgchild != null)
                            {
                                if (cgchild.Caregiver != null)
                                    caregiver = cgchild.Caregiver;
                            }
                        }
                        if (caregiver != null)
                        {
                            Type careT = typeof(Caregiver);
                            foreach (var prop in careT.GetProperties())
                            {
                                if (prop.Name == localColumnChange.LocalColumn)
                                {
                                    if (model.LastUpdatedDateTime >= caregiver.UpdatedDate)
                                    {
                                        string newData = model.NewData;
                                        string currentValue = prop.GetValue(caregiver, null) != null ? prop.GetValue(caregiver, null).ToString() : "";

                                         if (localColumnChange.RemapToString) {
                                            if (localColumnChange.RemapEntity != null && !string.IsNullOrEmpty(newData))
                                            {
                                                newData = await _integrationHelperManager.RemapStaticStringToGuid(localColumnChange.RemapEntity, model.NewData);
                                            }
                                        }

                                        if (currentValue != newData)
                                        {
                                            if (prop.Name == "FirstName" || prop.Name == "SurName")
                                            {
                                                prop.SetValue(caregiver, newData);
                                                caregiver.FullName = await UpdateFullName(currentValue, model.NewData, caregiver.FullName);
                                            }
                                            else
                                            {
                                                prop.SetValue(caregiver, newData);
                                            }
                                            updatedEntity = true;
                                        }
                                    }
                                }
                            }
                            if (updatedEntity)
                            {
                                caregiver.UpdatedBy = _uId;
                                caregiver.UpdatedDate = DateTime.Now;
                                _caregiverRepo.Update(caregiver);
                            }
                        }
                        break;
                    case Constants.SSIntegrationSettings.SSAddress:
                        //TODO:
                        var address = _siteAddressRepo.GetById(Guid.Parse(mappedEntity.LocalId));
                        if (address != null)
                        {
                            Type addressT = typeof(SiteAddress);
                            foreach (var prop in addressT.GetProperties())
                            {
                                if (prop.Name == localColumnChange.LocalColumn)
                                {
                                    if (model.LastUpdatedDateTime >= address.UpdatedDate)
                                    {
                                        string newData = model.NewData;

                                        string currentValue = prop.GetValue(address, null) != null ? prop.GetValue(address, null).ToString() : "";

                                         if (localColumnChange.RemapToString) {
                                            if (localColumnChange.RemapEntity != null && !string.IsNullOrEmpty(newData))
                                            {
                                                newData = await _integrationHelperManager.RemapStaticStringToGuid(localColumnChange.RemapEntity, model.NewData);
                                            }
                                        }
                                        if (currentValue != newData)
                                        {
                                            prop.SetValue(address, model.NewData);
                                            updatedEntity = true;
                                        }
                                    }
                                }
                            }
                            if (updatedEntity)
                            {
                                address.UpdatedBy = _uId;
                                address.UpdatedDate = DateTime.Now;
                                _siteAddressRepo.Update(address);
                            }
                        }
                        break;
                    case Constants.SSIntegrationSettings.SSDocument:
                        var doc = _docRepo.GetById(Guid.Parse(mappedEntity.LocalId));
                        if (doc != null)
                        {
                            Type docT = typeof(Document);
                            foreach (var prop in docT.GetProperties())
                            {
                                if (prop.Name == localColumnChange.LocalColumn)
                                {
                                    if (model.LastUpdatedDateTime >= doc.UpdatedDate)
                                    {
                                        string newData = model.NewData;
                                        string currentValue = prop.GetValue(doc, null) != null ? prop.GetValue(doc, null).ToString() : "";

                                        if (localColumnChange.RemapToString) {
                                            if (localColumnChange.RemapEntity != null && !string.IsNullOrEmpty(newData))
                                            {
                                                newData = await _integrationHelperManager.RemapStaticStringToGuid(localColumnChange.RemapEntity, model.NewData);
                                            }
                                        }

                                        if (currentValue != newData)
                                        {
                                            prop.SetValue(doc, newData);
                                            updatedEntity = true;
                                        }
                                    }
                                }
                            }
                            if (updatedEntity)
                            {
                                doc.UpdatedBy = _uId;
                                doc.UpdatedDate = DateTime.Now;
                                _docRepo.Update(doc);
                            }
                        }
                        break;
                    //case Constants.SSIntegrationSettings.SSClassroom:
                    //    break;
                    default:
                        break;
                }
            }
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message + " - Remote Change: " + model.Guid + ", Column: " + model.EntityColumn + ", Data: " + model.NewData, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "UpdateEntityColumn");
        }

        return updatedEntity;
    }



    #endregion

    #region Post API Entity

    private async Task<bool> PushUpdates(string auditUserId = null, int historyDays = 2)
    {
        //1) Get list of entities and their types
        //2) Iterate through these and group updates for same entity (Practitioner + associated ApplicationUser pairs)
        //3) Build up JSON for the endpoint with blocks for each individual entity based on mapped columns only, any other changes is irrelevant
        //4) Add remote guid
        //5) Send it to the /Multiple endpoint
        //6) Move to next entity type thats mapped and has properties - Child, Franchisor, Coach


        /*
        1) get all audits
        2) get all entities in related to
        3) map related to to existing entitymapped items - users
        4) if it maps to an SL user with remote id then bundle it all together based on entity column grouping
        4.1) if a user, get the grouping and use the entities in that group with the updates
        4.2) if its a document or a class, use according related entity id and endpoint to push updates
        5) update and update audits
        6) move on
        */

        _audits = await GetAudits(null, auditUserId, historyDays);
        var updates = _audits.Where(x => x.ChangeType.Equals("Update") && x.Submitted == null).ToList();

        List<IntegrationAudit> completedList = new List<IntegrationAudit>();
        List<IntegrationEntityMapping> completedEntityList = new List<IntegrationEntityMapping>();
        try
        {

            //var joinsData = (from a in _dbContext.IntegrationAudits join b in _dbContext.IntegrationEntityMappings on a.RelatedId equals b.LocalId where a.Submitted == null select new { a, b }).ToList();
            //List<IntegrationEntityMapping> changedEntityList = _mappedEntities.Join(_audits, a => a.RemoteId, a) //_mappedEntities.Where(x => _audits.Select(b => b.RelatedId).Contains(x.LocalId)).ToList();
            var changedEntityList = (from entity in _mappedEntities
                                     join audit in _audits
                                     on entity.LocalId equals audit.RelatedId
                                     select new { entity, audit }).ToList();

            //some changes may be user specific only, pick those up as well, but ApplicationUser and Entities relate to different ids in audits
            var changedUsersList = (from entity in _mappedEntities
                                    join audit in _audits
                                    on entity.UserId equals audit.RelatedId
                                    select new { entity, audit }).ToList();

            if (changedUsersList.Any())
                changedEntityList.AddRange(changedUsersList);

            if (changedEntityList.Any())
            {
                foreach (var entityToUpdate in changedEntityList)
                {
                    if (!completedList.Contains(entityToUpdate.audit) && !completedEntityList.Contains(entityToUpdate.entity))
                    {
                        string url = "";
                        StringBuilder jsonString = new StringBuilder();
                        jsonString.AppendLine("[");
                        bool validUpdate = false;
                        var mappedEntity = entityToUpdate.entity;
                        if (mappedEntity != null) //if we have this entity mapped to remote?
                        {
                            string localEntity = mappedEntity.LocalEntity;
                            string remoteEntity = mappedEntity.RemoteEntity;

                            url = remoteEntity + Constants.SSIntegrationSettings.UpdateMultiple;
                            jsonString.AppendLine("{");

                            //get all changes for this entity and group and build JSON
                            var associatedChanges = (localEntity == Constants.SSIntegrationSettings.SSPractitioner || localEntity == Constants.SSIntegrationSettings.SSChild ||
                                                    localEntity == Constants.SSIntegrationSettings.SSCoach || localEntity == Constants.SSIntegrationSettings.SSFranchisor ?
                                                        changedEntityList.Where(x => (string.Equals(x.audit.Entity, localEntity) || string.Equals(x.audit.Entity, "ApplicationUser")) && string.Equals(x.audit.RelatedId, entityToUpdate.audit.RelatedId)).OrderBy(y => y.audit.InsertedDate).DistinctBy(y => y.audit.Property).ToList() :
                                                        changedEntityList.Where(x => string.Equals(x.audit.Entity, localEntity) && string.Equals(x.audit.RelatedId, entityToUpdate.audit.RelatedId)).OrderBy(y => y.audit.InsertedDate).DistinctBy(y => y.audit.Property).ToList());
                            //var allChanges = updates.Where(x => x.Entity.Equals(updatedEntityType) && x.RelatedId.Equals(entityToUpdate)).OrderByDescending(y => y.InsertedDate).DistinctBy(y => y.Property).ToList();
                            //var associatedChanges = null;
                            //if (localEntity == Constants.SSIntegrationSettings.SSPractitioner || localEntity == Constants.SSIntegrationSettings.SSChild || localEntity == Constants.SSIntegrationSettings.SSCoach || localEntity == Constants.SSIntegrationSettings.SSFranchisor)
                            //{
                            //    associatedChanges = changedEntityList.Where(x => (x.audit.Entity.Equals(localEntity) || x.audit.Entity.Equals("ApplicationUser"))).OrderByDescending(y => y.audit.InsertedDate).DistinctBy(y => y.audit.Property).ToList();
                            //} else
                            //{
                            //    associatedChanges = changedEntityList.Where(x => x.audit.Entity.Equals(localEntity)).OrderByDescending(y => y.audit.InsertedDate).DistinctBy(y => y.audit.Property).ToList();
                            //}


                            if (associatedChanges.Count() > 0)
                            {
                                jsonString.AppendLine("\"Guid\":\"" + mappedEntity.RemoteId + "\","); //add entity GUID first and changes to follow
                                foreach (var changeLine in associatedChanges)
                                {
                                    if (changeLine.audit.Property == "IsActive" && changeLine.audit.ValueAfter == "False")
                                    {
                                        //process deactivates first seperately
                                        //call delete with the deactivates
                                        await DeleteEntity(changeLine.entity);
                                        //break out of this loop
                                        //remove all antries for this entity from the run
                                        break;
                                    }

                                    var mappedColumnLine = _mappedColumns.Where(x => x.EntityGrouping.Equals(localEntity) && x.LocalColumn.Equals(changeLine.audit.Property) && x.IsActive == true).FirstOrDefault(); //x.LocalEntity.Equals(localEntity) && 
                                    if (mappedColumnLine != null)
                                    {
                                        if (mappedColumnLine.UpdateDirection == UpdateDirection.Both.ToString() || mappedColumnLine.UpdateDirection == UpdateDirection.SSToSL.ToString()) //only update mapped columns configured to update
                                        {
                                            if (changeLine.audit.Property == "IsActive") //special logic for deactivating
                                            {
                                                //TODO: complete status change logic
                                            }

                                            string valueToSend = changeLine.audit.ValueAfter;

                                            //When columns need remapping between systems - get mappedcolumn from columnmapping and remap values that SL expects - like language, SS use Guids, SL requires string
                                            if (mappedColumnLine.RemapToString)
                                            {
                                                if (mappedColumnLine.RemapEntity != null && !string.IsNullOrEmpty(valueToSend))
                                                {
                                                    valueToSend = await _integrationHelperManager.RemapStaticToString(mappedColumnLine.RemapEntity, valueToSend);
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
                                                        if (valueToSend.Length <= (int)mappedColumnLine.ColumnValidationLimit)
                                                        {
                                                            jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + valueToSend + "\",");
                                                        }
                                                        else
                                                        {
                                                            jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + valueToSend.Substring(0, (int)mappedColumnLine.ColumnValidationLimit) + "\",");
                                                        }
                                                        break;
                                                }
                                                validUpdate = true;
                                            }
                                            //jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + valueToSend + "\",");
                                        }
                                    }

                                    //remove entry from audits list as we have processed it here and sending
                                    completedList.Add(changeLine.audit);
                                    updates.Remove(changeLine.audit);
                                }
                            }
                            jsonString.AppendLine("}");
                        }

                        jsonString.AppendLine("]");
                        IntegrationAPIManager.APIHandleResponse apiResponse = null;
                        try
                        {

                            if (validUpdate)
                            {
                                //now send to API call <entity type>/Multiple
                                apiResponse = await _apiManager.GetAPIHandlerResponse(url, null, null, null, false, true, jsonString.ToString());
                                if (apiResponse != null)
                                {
                                    if (!apiResponse.Success)
                                    {
                                        await _logManager.IntegrationLog("Data Push Fail: ", jsonString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "PushUpdates > GetAPIHandlerResponse");
                                    }
                                    else
                                    {
                                        await _logManager.UpdateAuditSubmitted(completedList);
                                        completedEntityList.Add(entityToUpdate.entity);
                                        await _logManager.IntegrationLog("Data Push Success: ", jsonString.ToString(), null, LogRelatedType.Log, "PushUpdates > GetAPIHandlerResponse");
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
                            await _logManager.IntegrationLog("SmartLink API Error: " + e.Message + " - " + apiResponse.ResponseString, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushUpdates > GetAPIHandlerResponse");
                            //throw new HttpRequestException("SmartLink API Error: " + e.Message);
                        }
                    }
                }
            }
        }
        catch (Exception e)
        {
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushUpdates");
            throw new HttpRequestException("SmartLink API Error: " + e.Message);
        }

        return true;
    }

    private async Task<bool> PushDeletes(string auditUserId = null, int historyDays = 2)
    {
        _audits = await GetAudits(null, auditUserId);
        var deletes = _audits.Where(x => x.ChangeType.Equals("Delete") && x.Submitted == null).ToList();

        foreach (var delete in deletes)
        {
            var entity = _mappedEntities.Where(x => x.LocalId == delete.RelatedId).FirstOrDefault();

            await DeleteEntity(entity);
        }

        return true;
    }

    private async Task<bool> DeleteEntity(IntegrationEntityMapping entityToDelete)
    {
        //TODO: Complete

        return true;
    }


    private async Task<bool> PushInserts(string auditUserId = null, int historyDays = 2)
    {
        bool isComplete = false;
        _audits = await GetAudits(null, auditUserId, historyDays);
        var inserts = _audits.Where(x => x.ChangeType.Equals("Insert") && x.Submitted == null).ToList();
        List<IntegrationAudit> completedAudits = new List<IntegrationAudit>();

        //Child user entities push with caregivers, finish first
        var childrenInserted = inserts.Where(a => string.Equals(a.Entity,"Child"));
        foreach (var childAudit in childrenInserted)
        {
            var newChild = _childGenericRepo.GetById(Guid.Parse(childAudit.RelatedId));
            if (newChild != null && newChild.CaregiverId != null) //only pick children up that has valid caregivers at the time of running due to the consent
            {
                //final check if the child hasnt already been created to avoid duplicates
                var existingChild = _mappedEntities.Where(x => x.UserId == newChild.UserId && x.LocalEntity.Equals("Child")).FirstOrDefault();
                if (existingChild == null)
                {
                    //find the franchisee owning this child and retrieve its remote id and pass in for SL update
                    var practitioner = GetPractitionerForChild(newChild.UserId);
                    if (practitioner != null)
                    {
                        //get remoteId
                        var mappedPractitioner = _mappedEntities.Where(x => x.UserId == practitioner.UserId && x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSPractitioner)).FirstOrDefault();

                        if (mappedPractitioner != null)
                        {
                            if (!string.IsNullOrEmpty(mappedPractitioner.RemoteId))
                            {
                                string remoteChildEntityId = await PushNewChild(newChild, mappedPractitioner.RemoteId);
                                //write back that these have been processed
                                if (newChild.CaregiverId != null) //if no caregiver has been created at this point, dont fail, it iwll be picked up next time
                                {
                                    List<IntegrationAudit> caregiverAudits = _audits.Where(a => a.Entity.Equals(Constants.SSIntegrationSettings.SSCaregiver) && a.RelatedId.ToString() == newChild.CaregiverId.ToString()).ToList();
                                    if (caregiverAudits != null)
                                    {
                                        completedAudits.AddRange(caregiverAudits);
                                        foreach (var cgAudits in caregiverAudits)
                                        {
                                            //remove from overhanging audit lines
                                            _audits.Remove(cgAudits);
                                        }
                                    }
                                }
                                var childAudits = _audits.Where(a => (a.Entity.Equals("Child") && a.RelatedId.ToString() == newChild.Id.ToString()) || (a.Entity.Equals("ApplicationUser") && a.RelatedId.ToString() == newChild.UserId.ToString())).ToList();
                                if (childAudits != null)
                                {
                                    completedAudits.AddRange(childAudits);
                                    foreach (var cAudits in childAudits)
                                    {
                                        //remove from overhanging audit lines
                                        _audits.Remove(cAudits);
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    //if child exists mark insert data to be marked as subitted
                    var childAudits = _audits.Where(a => (a.Entity.Equals("Child") && a.RelatedId.ToString() == newChild.Id.ToString()) || (a.Entity.Equals("ApplicationUser") && a.RelatedId.ToString() == newChild.UserId.ToString())).ToList();
                    if (childAudits != null)
                    {
                        completedAudits.AddRange(childAudits);
                        foreach (var cAudits in childAudits)
                        {
                            //remove from overhanging audit lines
                            _audits.Remove(cAudits);
                        }
                    }
                }
            }
        }

        //removed as caregivers coming in later means the child is not valid until caregiver is in system and consent can be sent
        ////refresh audit entries
        //_audits = await GetAudits(null, auditUserId, historyDays);
        //var updatedInserts = _audits.Where(x => x.ChangeType.Equals("Insert") && x.Submitted == null).ToList();
        ////any caregivers created/updated thats not part of the initial inserts that got missed due to timing
        //var caregiversInserted = updatedInserts.Where(a => string.Equals(a.Entity, Constants.SSIntegrationSettings.SSCaregiver));
        //foreach (var caregiverAudit in caregiversInserted)
        //{
        //    //check if the link has already been made in the mapping, ie sent to SL, if not create  the SL JSON make the link and update the child and then audits
        //    Caregiver newCG = _caregiverRepo.GetById(Guid.Parse(caregiverAudit.RelatedId));
        //    var existingCaregiver = _mappedEntities.Where(x => x.LocalId == newCG.Id.ToString() && string.Equals(x.LocalEntity,Constants.SSIntegrationSettings.SSCaregiver)).FirstOrDefault();
        //    if (existingCaregiver != null)
        //    {
        //        //checked that everything is set and update the logs
        //        List<IntegrationAudit> caregiverAudits = _audits.Where(a => string.Equals(a.Entity,Constants.SSIntegrationSettings.SSCaregiver) && a.RelatedId.ToString() == existingCaregiver.LocalId.ToString()).ToList();
        //        if (caregiverAudits != null)
        //        {
        //            completedAudits.AddRange(caregiverAudits);
        //            foreach (var cgAudits in caregiverAudits)
        //            {
        //                //remove from overhanging audit lines
        //                _audits.Remove(cgAudits);
        //            }
        //        }
        //    } else
        //    {
        //        List<IntegrationAudit> caregiverAudits = _audits.Where(a => a.Entity.Equals(Constants.SSIntegrationSettings.SSCaregiver) && a.RelatedId.ToString() == newCG.Id.ToString()).ToList();
        //        //map caregiver and create SL link and update child
        //        string remoteCaregiverEntityId = await PushNewCaregiverUpdateChild(newCG);
        //        if (!string.IsNullOrWhiteSpace(remoteCaregiverEntityId))
        //        {
        //            completedAudits.AddRange(caregiverAudits);
        //            foreach (var cgAudits in caregiverAudits)
        //            {
        //                //remove from overhanging audit lines
        //                _audits.Remove(cgAudits);
        //            }
        //        }
        //    }
        //}


        //insert documents
        var docsInserted = inserts.Where(a => a.Entity.Equals(Constants.SSIntegrationSettings.SSDocument));
        foreach (var docAudit in docsInserted)
        {
            //TODO: Complete
            Document newDoc = _docRepo.GetById(Guid.Parse(docAudit.RelatedId));
            var existingDoc = _mappedEntities.Where(x => x.LocalId == newDoc.Id.ToString() && x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSDocument)).FirstOrDefault();
            if (existingDoc == null)
            {
                string remoteId = await PushNewDocument(newDoc);
            }
            List<IntegrationAudit> allDocAudits = _auditRepo.GetAll().Where(x => x.Entity.Equals(Constants.SSIntegrationSettings.SSDocument) && x.RelatedId == docAudit.RelatedId && x.Submitted == null).ToList();
            if (allDocAudits.Any())
                completedAudits.AddRange(allDocAudits);
        }

        //Attendance
        //PushAttendance(); -- monthly push
        //Income Statements
        //PushStatements(); -- monthly push
        //Push ClassRoom - Ignore
        //Push ClassroomGroup - Ignore

        //mark all audit entries as done before next step
        await _logManager.UpdateAuditSubmitted(completedAudits);

        return isComplete;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="newDoc"></param>
    /// <param name="documentDate">Optional specific date to upload with the document. This is so we can send a date with the correct month to SmartStart for statements</param>
    /// <returns></returns>
    public async Task<string> PushNewDocument(Document newDoc, DateTime? documentDate = null)
    {
        // TODO - this is pulling every mapped entity from the DB every time we send a document, and stores it in a private field on the class
        _mappedEntities = await GetMappedEntities();
        var mappedDocEntities = await GetMappedEntities(Constants.SSIntegrationSettings.SSDocument);
        string docRemoteId = "";
        IntegrationAPIManager.APIHandleResponse apiResponse = null;
        if (newDoc != null)
        {
            string noteRemoteId = "";
            IntegrationEntityMapping? docTypeMapped = null;
            try
            {
                StringBuilder jsonDocString = new StringBuilder();
                string docUrl = "";

                var mappedDocTypes = await GetMappedGroupingEntities("DocumentType");
                docTypeMapped = mappedDocTypes.Where(x => string.Equals(x.LocalId, newDoc.DocumentTypeId.ToString())).FirstOrDefault();

                docUrl = Constants.SSIntegrationSettings.SLDocument + Constants.SSIntegrationSettings.CreateMultiple;
                var existingDoc = _mappedEntities.Where(x => string.Equals(x.LocalId, newDoc.Id.ToString()) && string.Equals(x.LocalEntity, "Document")).FirstOrDefault();
                if (existingDoc == null)
                {
                    //pull from new list here as child mightve just been added
                    var mappedUser = _mapperRepo.GetAll().Where(m => m.UserId.Equals(newDoc.UserId) && (m.LocalEntity == "Child" || m.LocalEntity == "Practitioner" || m.LocalEntity == "Coach")).FirstOrDefault();

                    if (mappedUser != null && docTypeMapped != null)
                    {
                        /*
                        {{RouteStart}}Document/Multiple - [{"DocumentDate": "2023-06-06T07:10:46.441Z","Franchisee": {"Guid": "3cfe0328-17ef-ed11-8354-00155dee5a05"},"DocumentType": {"Guid": "7f1c1f22-a925-ec11-834e-00155dee5a05"},"ValidationStatus": "Creating"}]
                        */
                        jsonDocString.AppendLine("[{");
                        jsonDocString.AppendLine("\"DocumentDate\":\"" + (documentDate ?? newDoc.InsertedDate).ToString("yyyy-MM-ddT00:00:00Z") + "\",");

                        if (mappedUser.LocalEntity == "Child" || mappedUser.LocalEntity == "Caregiver")
                        {
                            //its a child doc loaded so retrieve childs paarent franchisee user id
                            var parentUserId = _hierarchyEngine.GetUserParentUserId(mappedUser.UserId);
                            if (!string.IsNullOrEmpty(parentUserId))
                            {
                                var parentUser = _mappedEntities.Where(p => p.UserId == parentUserId).FirstOrDefault();
                                if (parentUser != null)
                                {
                                    jsonDocString.AppendLine("\"Franchisee\":{\"Guid\": \"" + parentUser.RemoteId + "\"},");
                                }
                            }
                            jsonDocString.AppendLine("\"Child\":{\"Guid\": \"" + mappedUser.RemoteId + "\"},");
                        }
                        else if (mappedUser.LocalEntity == "Practitioner")
                        {
                            jsonDocString.AppendLine("\"Franchisee\":{\"Guid\": \"" + mappedUser.RemoteId + "\"},");
                        }
                        jsonDocString.AppendLine("\"DocumentType\":{\"Guid\": \"" + docTypeMapped.RemoteId + "\"},");
                        jsonDocString.AppendLine("\"ValidationStatus\":\"Creating\"");
                        jsonDocString.AppendLine("}]");
                        //create doc
                        try
                        {
                            //now send to API call <entity type>/Multiple
                            apiResponse = await _apiManager.GetAPIHandlerResponse(docUrl, null, null, null, false, false, jsonDocString.ToString());
                            if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                            {
                                var returnObj = JsonConvert.DeserializeObject<List<PostResponse>>(apiResponse.ResponseString);
                                if (returnObj != null)
                                {
                                    docRemoteId = returnObj.Count() > 0 && returnObj[0].Guid != null ? returnObj[0].Guid.ToString() : null;
                                }
                                else //error empty response received
                                {
                                    await _logManager.IntegrationLog("Doc not created", jsonDocString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "PushUpdates > GetAPIHandlerResponse");
                                }
                            }
                        }
                        catch (Exception e)
                        {
                            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushNewChild > GetAPIHandlerResponse");
                        }

                        if (!string.IsNullOrEmpty(docRemoteId))
                        {
                            string noteUrl = Constants.SSIntegrationSettings.SLNote + Constants.SSIntegrationSettings.CreateMultiple;
                            //push note to SL
                            /*
                            { { RouteStart} }
                            Note / Multiple
                            [{"FileName": "index.png","MimeType": "image/jpeg","Description": "Profile","DocumentBody" : "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEBISFRAVFxcTFhYYFRAXFxUVFhUWFhYVFxYYHSghGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi0lICUtLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBEQACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAAAQIDBAUGB//EADkQAAEDAgQDBgQFAwQDAAAAAAEAAhEDIQQSMUEFUWEGEyJxgZEyscHhFEKh0fBSYpIHI3LxQ4LC/8QAGwEBAAMBAQEBAAAAAAAAAAAAAAECAwQFBgf/xAAyEQACAgEDAgQEBQQDAQAAAAAAAQIRAwQSITFBBRNRYSJxgZEyobHB8BQVUuEGQtEj/9oADAMBAAIRAxEAPwDq1+YH0QIBUAKAKgBACAEAIAQAgEQApAiAY9XUXV9iGyFwVkVGKSAQkaVIBCAQAgBACAEAIAQCIBFIBLAIAUgEAoSwNLQrKToijSaJMSJOixxYZZZVEvKSj1ALJqnTLCqACAIUCxYQiwhBYQgsIQWEILEUkggEQCtbOugEnyC7NDpXqcygvm/kZZcmyNlKpjJJAaA3Tr7819rDRYI4/LUVR5jyTb3WIx2x9Pv1XzHifh/9NLdH8L/L2O7Dm3rnqOIXlm40hSQIpAiAEAIAQAgFQAgBAIUAkIAUgRACkAgBAIVJBdrUzYt+Jpkf9rLDl8ue4vJbkaWKwRa3OYuASOu66tTjWR74dznjmUeGVGXEjRee00bqcX0FhQWBACAEIBACAEAFCRIQCFSBuJdlpkwTJ25AX+a+o/4/jqM517HDqnbSMljwXG/hC+kRylzDw+Y1Cx1OnjnxSxy7iEtsrQoK+Cy45Y5uEuqPUi01aAhUJGkKQNQCKQCAEAIBUAKACkCIAQAQpA1SgCAEAIBCpKs1YXGbGxg6oqsLHiSB7hdeDInGpdjiyw2vgyjhu4JabMdpcW6FVyqXVFFRPBi4j0usmn3RZOugOpggGIVKXToXWSSGmgNio7WiyyvuNFAzA1VbL+YhjqZGxW60+Vq1F/Zk+ZH1GwsiyaYISIgAoCN1QTG63xYMmXiEWyspKPUtYgNaA12rQZHnEj5L7nQaZ6fBGD69/mzy8uTfJsza7qWWC0wIgNGh89D5LvRlyUuGYpjaoDHEiYMxr6WUotTZPXxTRXdT5ta8esj/AOV8t43o3v8AOj07ndp58bWTL546RCpFjSFIGqQCARACAVQAQCKQCARAKEAhUgRACkAhAikGtC4jQs4GrldfQ2S65M8itGnxCj3lMgAz6LuhLdC0jjapnKNq1Q4hziXN2IKrNKjRVRapYl5sfJYSVdGTSLLK5Non5KjdLkbSVtXp7KHLimhtD8Q4uyztZfdaDN5unhJen6HJONPkmdTnz5j6jdU1fh2HUr4lT9V1EZyj0K+Jq5LvYY5gFw/TRfP5fBNRGXw019jeOdFDE8QYy7mODee0Hedk/smqdcL7krUmbR4m6vVbSpgsYSQX72Fi3a9v1Xp6bwGMZXllfsistVKuDqcNgGtg6keXv5r3seCOOKjBUjjlkcuWRY7CZvE34/mNDPoVpRG4xe1DX0abW0bk+EmJudwOam6Jjy+TG4Rw2u2oHVB4Z1AEgc4U7jSyTieHJdXql3iY1obHJuQs9zPusMsFNNPoy6dJUXOFYvvGAky7dfFa3TPBka7djuhPci4uMuNKkDSpAikCISCAVQAKkCIAKARAEoAJUpARSLBSLElCBCpBsLhLgosG1wqtmbB1HyXXppf9TkzRp2YnaZj2OD2iBvGv3W8oJ8MziyKjUDoMg23t8lxzVGhOzyICzkixPTcItos2nYsjr0JALdQf03X0HgWsccjwSfD6fMyyxTVmkNLaL6w5GRvZLT12SKIZz/EaLnOY1/57BtzAG87HVXIRp4ThdNjg+NBA/tO5HuVJDZo4vF0aUB9RjXci4Aqs82PH+J0QoSfRDqNem6HNc0tnUEETykWnorQywmri7IcZLqMxbREjUCZVmEylXxlPJJI0nZQOTlKuPZWc5gEidBoqsumO4MH06hb3fgdptHNeB41poyh5jdUdeGfY6Lu+gXyO46LG9wOSnexbGuwg2VlkY3ERwfVXUyd4yphHBaWW3ohdSI2Sydw2FJNghIiAQoLElSLBSLEJUkCSpIEKAEAitQNsELzqo0FhAS4arkcCPXyUxlTsrOO5UaPFcE2qzSTFjK9K4yimjg5TOUoAsJbm0uFllinybRfBoU63Pl6LkcF2LUWMwNgIlZkkjTHobq+Kfl5FNdiGrRoUXh0Afw8l95odbHU49y69ziyQ2lus1oAG5K9CjCzn+I0f9xjuRcPK0/sqsuhvaTG91hc4PiJDW/8AI/YH2WWfLsxuSI6O2eeuxEnM4yTck6nzXzkt0m2+pLzKjvuxJp1GHY6EbOHIjcLbw/TT83em0cWTVVKrMztFxt+FqOoBrqmZpdTdLYy5g3K7fMJNt462+ic3FtM68W3LBTi+GcnheC47EGa2IbSoHQNEvI8pge/7K0aoS6necH4VQwzA2nc7vcZJPMnmrcFBnELAuaZcLz5bLDUYo5sbhLozXG6YvD+Iiq0QRI1HI8l+f6vRz082mjvjJMvBcZYjr4ljPjexs/1OA+avDHOf4U38hT6kgCrbXBUfUFuq083gEYpyFpCa7kMjdRHRbRp9iU2VajaUxmEreGnnP8KZducVbQx2F5FXWizP/qV85DThHKf6LN/iT50Rn4Y81qvD8/8AiR58Rr6YGpVv7bn/AMSv9REMreZT+3aj/EeehrnUwJLii8Pz/wCJHnor/jKV7n2Vv7bqP8R56GMxrCbNdHlqtI+FZu5Hnod+Mb/SVp/acvqR5xvFm+6+XTO8JjX32+ymr6AdCqDY4ZUDmFro8Py2XfppJxp9jjzRqV+pznHOGup1O9aZadeYW8opx4KRfZhSfItpA+8LgkueTSyz1No2WTXYvY4uAk6AXkqEm+CTj8T2iqPdNN5YybRYkTYu/ZfQ6fG9NGo9e7/Y4MmojLodZ2dxdWoJqHOzmA0Ob1BA+crfDrdVv9UcstTBEXEnPdiKWHzECXPc5tszWhuXy+KCF7m/fR04pRlDfEzv9QMBUGGL2kmnTe2oRckasmTtD59FTNjco0Z5/ix8dTzM44rkWms817lwdH2b466mbEhe/wCGaWCXJ4nimLNNrYaWAwxxmINQzlb4Z5xFvmqa3a9RJR7Uj6DwnBPT6KEJ9eX92dLiaJaMoaIGpuY8o3WDdHd1IaNUtIiSBrfRFIOIvGKgyOOp2F7/ALqWxFHCYLib6WKaGlpDuegJXBrdPDNCmdeKO50W+0n+oYpHu2BxqD4g0sDGnlm1JXn4PBsU427+tHY3DDOmrRznCu0rK9VhxNA1qpdDQ4gU2GbHLFz1K6M2inji1hntXsuWXWV6r4apdker4bE1DHwmeTgYXirwtSdbr+REtMoq26+g+pi3A5YuLGeapPw3HF1b4LQ0qauxpxx3AHqrYvD8V8sh6WvcgDgSZeZ9wvSxYcUOnBo4NJVEdw+gDUl2kQJESd12aJxUpJvkw18ZbFtXBvsptFoXppI8dsiNK/RTtRFiGh0U0Bj8ACFNCylVwN7qKJsp1cByv9EJsqPpZHfDI6QgJy2YgAIBv4UdUoG2vzE9kEsDcsae232U3fUFvhlaHgaTYhbYZbZmWaNxLPHaGZkfrK9B2uxyI5fBOjwk+IaHmubLHk1TLzH3M7rmlGiyKHafE5MLWgmS1zWwDOYtMLp0GPdqIfNX9yJpuLrrTPLGcRPNfWvScnzdZEdj2P7SmmCJt1XseH+HxaPC8Ry6iEvgNzs/izWxbqoMhjcrj/zNgP8AH9E1+FYskVH0/c9v/j6y/wBNN5e8uPsdFxPirTTfTyyXAtiJBkbrnfQ9lLk8sxvYPFQH0w2/5bx5iJI8j7rNS9jTysdlzgnYDFuP+65rG8wZPyC6IaicVUSPLwx56npfCeEUsMwU2j13nmfNY2o9SsrkJxao3IRoI23USyKhCDsqcMdmHwknnAVIZLLzhRk9o6zB4Br+Yzp0hatiEWzz/GYUVHlw1kFpmAIOs8lnL4kzoxvZJSuid3YahVBqMrukmfE3M2oSTmIIjKJ5rz14g43GSquh6j0cW01zfU0sP2RwtGKhZBZEnOS1xts7T7qj1c8zUIlljjp05t1+37GzgOMMa8NbmZOgeIPkZs705K+TRZtPeSFOPs7+/p9aMIa7Dqqxz4k+zVfb1+jZptdJMm5XnXfJ3baVI5NmNxRqmm1xc7MRBa2IBiTawX209B4fHTLNOO1Unau+f3+h8Fj8R8SeqeGEtzTappVw/wAkdAab2tBeWl++WY9JXyGSWNz/APnddr6n2+BZdi82r710Gu4kKYZVdMZrx/cDqOXVa6HnN9zPXqsNL2NXD8cZUjLMeRXuJnzzRfp4mQllS7SdKsCyxoQgY+ggK/4QShJUxOHZsFRssiJuFbCJktC/hhyVrIsevzA9kEAsIQOpgSJ0kK0HUkRLoWuNVGCk/MSGNAOcSYBnWLkW1Xt4Fvi9vKRxbWzG4dg5zZxcnWxa4RYiOfMLly+3JKLFTCFtoMHb9iudoumUcc57WkgZgNWxcjey20yhHNFyRLfB51xnsdVA77CtL6Drho+KnzbH5gDYRdfZwz8WUjDG+H1M/heAxBdkp0qhebZcjv1JsPVduDxFY+hd6TA1clZ6JhsJUwOHfSdm74M755a0kucW3awkQSIygdJ3WOfNPNPdJUZQxwd7fsi32RwGIdR73FA5Xw9gcP8Acym/jDbA30H2ScZUYXFM7DD1fDBYSNIAMc99VKKMjdiGN1GU6Qf0UPaSrMzHYsl4a2BvK55vmkbxXHI4YXvNiR5fVVUXIs5KJcdhRTZ10tqt4w2mTk5M4TtBRGaGSXHadPb9Ss5HTBcclbGcJp08I8vMkgSRMASL9ATZZz1M8LXlfi/T+djow6OGoe3L+H7WybgkdzTpsBDQ28iNzZeNqJynkcpPk9nHihijUeEuiE4+0ig69oke4P0Xb4PKtZjv+cM83xuO/Q5Pkn9mjA4PjqrSGtZ3gkeCPls3zX1niui00sbyZJbX6+vs/U+O8I12qhlWLFHevT090+x2RZBsYPLUeS+DfD4P0OLbXJHSqUqLnEgBzzJd9OnkunLq8uWEccnxFUl/O5yYvD8WLJPJBcydtldtfvRiDNgCwdPDP1VNOqywvu1+prq1twSr0f6EvY9rcURTqXfREu/uAtPuvoJeHS0uo3L8Ek2vb2PnMfii1em2y/HFpP39zosZwZonJDbWgLY57MY4h1N0Okj/AIwgNPB4+VQtRtUKwKtZUs6oQNe1AUsVSVJI0iQ12ReJKqyVyUzUf1Hqq2y9IsL83PTBQAQAgHOqSxzDdpaRFt9F3aHU+Tk+L8L4ZnOCfQZhG920NbpyNx+qw8+alaZLxxfUtsrt3t+o9tlvDVr/ALIxlgfYKmEDvh9wQY9F0x8rLwjL4olE4J9P4BLSZIG/O2xXZhzZMXwvlfmvoWUovqamAqMgZbRqPCPQ2XuYc0XFNGU07H9o8EyvRiYIIdLSNBqPIiR6ruck0Ywcoy4JKVZj2DL8MAWdAtbZTuTK00Q1Mo2Bvm/M7QWOsLNtIsrZU4hjwBAu7WIbbrGqzlkNFEg4Xw/Mc7nSTc+ECfLkrY0nyRJtHQtytEAQFtwjPlmXxKoXWCzk7N4Kjna+HayLS/ruP5svO1Wq8v4Y9T0dNp3k+KXQZVYcS19M6ZSHMs0R/VHLr9lxqU8juL+favf5HdUcNX9H1+nzMbhOF7kvo1HZnH4XX8TdRHUb9VXKlJ2jo8xySLGIompTe1x106abeiabK8GaOVK6MtXgWowyxN1uVDuGYOnRADRrck6k9VrrNdm1U9+T6Lsjn0Xh+HR43DEvm31YmPxjaeXNZpOWdhaQT06qmm0s9RuUOqV16/I01Gsx6ba8nRur7J9r9iHjdHPSMai6xi6kdidrgwOzHEiKhpu0fcHmQI+WX2K6s+JxprqmVUo5IWnxR13+n+AdRbUrVfCagDWg6loJJdHUx7L6/wAQ1EJbYx7H574dpZ490pdzqqjs2ggLz0z0WUcbhg5u8q1EWYGXu3arN8F0zX4djVFktG5Srypsq0SseosUK5oUhEFSnZVZZMpvpifusy4xfm56gIAQAgBACASUA5ryLgqSGky1TxIdZ0ev7rohqckPdGMsKJXtaenL/sfVd2PxBLrx+hjsa6EVdlQMIaZ11/depj1zrh8FaTfJBg8LTYwC4/qixJ1Jt6r0oaqDXUhxb6CVSwg5XEi4PiOif1EJdAoNCYDBNeZGg3Ovor43vE+EalSqxlt+S6HNR4M4xb5HUhm1JE6BQpWWaK/EcU2kIbGfU8gObuixz51D4Y9f092dGnwObt9P1OQbiHVqhdcsbYdBOp5SSfdeJlk5u+tfz8z6BQjix13Zb7qHteM4vEt18gmK7T5r26mMmnBx4+pc49g24iiO6gVWeNrzA8YBmmSNZAMnQa7L1ZTx5I7F9X7+nu/U87DvxZN0vt7evt7HP8N4i17ZaRmu1wtIOhBHuvPcZw5o9O4SdWOxoMWWRtDkyeMEPoPG4h3sR9JXr+C5lHVwT78fkzxfHtM5aObXan9n/wCWZXCuLFje7qGaegO7enl8l7XivgyzXmw8S7rs/wDf6ngeDeOvA1hz8w7P0/1+ha4FgGU6mbwuuXNLoOUk7fP3Xjw1DzZLnFJ9Pt+59JLT+ThrHJtPn789ux6Pw5nhBcczje111nlSL1Bk320C1iYSCrTstEUOd4xTIvkkjfkqSXBaLMXB4ktNysDU6XB4oEC6myC/SxIGqXQotU60qVKyKFc611LCKrqqzstRWlfnB6oSgCUASgCUASgBACAEBJSrlvlySirimXKNUG4MHl9lKbXTgykq6krr2LQRzC6oarJHryU2oo1uGNN2OLZ22XXj1cG7uiVKS68kT3VKI+EkAbCfUle1p9RFrhlWlIq4bHMJD5zQZnn5AnXqV2KSXLJ2PojYq8Qp02y8kPdADTYyQS0X0FirPNCN2+f5Xy6Foaec38K4XX+dzkOIValWcxytnSDBPVwJk+a8jLKUurpfzq+eT3sEcePorf5/bjj5EuBwjmCSBBtNiPQrJxlFX29SMuWM3SLLgZBBAIuCen1SF3adVyZcVTV2WcA8udfZj4AgAeA6AWW2KTlK36S+XQxzRjGPHqv1OQ4zwdlHiIqRFGpAPIV2tAP+Vz5tK9b+vcNLPTLtS+nf8+PqefHw5ZdVDVfN/Xt+X6G7Ww0ixXinsxnRmcTwIbmZmBBEEjQyPut4PycqlF3TTDrPicZKk00zhTNN5pvsRbzX6LpdTHPjU49GfmGs0k9PkcH1X8s3ezjyHQ5pNPUO2BnSd18/41iwQyrImtz6r9z6f/jufUZMUsTT2Lo329v50PVMBSkNdcCBZc8VfJrlVNo0gyy1RzSGReCbLRFGZfFKBIMAeqMI4LjdUteDBnrFo8lzT4ZvEkwPEzIiVSy9G1QxogEmFFijbw9YwCLqyfoVfuTEyLqb9SCA1GbkT5fdU3xJpiSvzw9QJQBKAJQBKAJQBKAEAkoAlAJmU0CzRxsfF7j9lCVdCkoF1tQOg2PUaeylyvqjKqHTplP7fqtItrmDIr1InURrGV39TbH15rtxa/PjVN8Erjp+ZhY7gTiJY/vHZi45zDjaInQrT+rjkVXz7nqYddGL+KNKq46EeJe6m4FwLHOaM0ixcLGdjoD6rreWmpRfVK/n0NMajki0naTdfIqYfjzXVH0YDXC1gIcBfbRelm0mSGljqI1tklfFNfz1R5mHWY8mqlpne6L+af8APcsGoCvJvk9bbQra5YQ5uo9Qt8e6DUl1M5KMk4yKvFsKa1FwHxnxNP8AeLg+6rjk4zt/U0g6a9BOFYjvKLHH4iBI5HcHrKvkjtlRWXUp8RJhZnRjRzVTCTUzvpufMD4XOHoNF6WPW544Vixypfn9zmn4XpcuZ5skbb9en2/9Jn8Vg5Sx4aNPA4ADnMWCwWKcnuu/rydvlxgtqo7vshxbvW5Cbt2m5HzXsYJboHzmtxbJs6x9luecxpw833WiM2NczYqyKnM9oeBNqCS4NOx2Hms547NISo4aphn0qmS5MwI35LklFp0dEWmrOu4TwSo4AvBG91eOKT6lZZF2N3D8PIEStFiM3OydmCvBlSsUSN7LQwFP+lW8qPoV3MxJX5oe0EoAlALKASUASgCUASgAlTQElKASgEKkCMqlplphTRDSZew2PabO8J6aKNlclJRZbJJF7jVFJ16laQVCI0urtwa9yFYj6UiLFp2IkexUxU48xZKlXPcycRwOiSS1ppuOpZcHzaV0LWZOIz5SOrFqZwd8O/Vc/f8A9MzE8JrtuzLVHSzv8T9Ct8eog+jp+52w1eGfEvh/T7lV9TLapLSLwQQbc52XZHJZZw4uPJWfxZ1SKeCb3hdPj/8AG2NZP5j0C08l7vi49u7JgoqO6RucD4WWQC6XuaXyRGZ8H4R5rbFDdkVf42vf5fU5M+bh/P8AIs8Tw9OmxrcsvdExBM2nxGctzsFpmhjxY4wr4n1r/wB7c9kUwTnkm5Xwunp9u5mV6QktyvjT4mmTvYt5rnlsUttP7/6OuEpNbrX2/wBlLF8LAcTTuW6gWI58w4bK1OEn5buuvr/svHLvjWRVfT+dip2ewZoV21GEls3aWi8wJkdOi69JqlaizDW4HODZ6dM3XqnzskOlaJmTEMhWKso4ynmRhFDheFZ30ub44sSG2jWIUUupZt0b4aAhABqAVlNSCXIEIOUlfmJ7gIAlAEoAQAgBAIgBACkAgElANcpBC5XQJcPjX09Dbkf5ZKsq4pmnhMdTeIJh3I/RVcFXxFGmuhZLJtsR1SndLoVAvixFxZWU/wDJcirGClImwO6bVLkN9iHE4dtQFjwypTOzgHA+6mM5Y5fBJotGTjyuGUaPB6dIjuZpxcNHiZ7G49CumGvnGe6a5R0/1U5R2z5X2ZrU63h8bWuLfEC0HUaW1C9zD4rgyQ+KrXK7c/z3ORw+L4W1fW/QoNxTS5kQCSCbDUuM+I3mVC1Kc4Vxf7v16nV5TUZfzt6dCvReTUZcnxCZ5zdZ4p7skee6NckUscuOzKYku5EnXlKzjJ7kdDraGOrspue948AJgNMHWBA5rbenlaS7voUjflrnt3NjszjHPpxUADpkXmW7esL3MVqKTPE1LTm3FG13ZK2RyMkFOBCuVK9aiBdAZeKo+IPZ8bdPLcFCUWsHjxUHIixBix5IQXc6AfnUgXMVAOWX5me2CAEAIAQCIAlAEoAlAJKkCSgAlAIgI3BWQI3K6BEVZAtYbij2WmW9dR5FQ4enBVwTNbC8Rpv3vuDr6Qs2mn8XQzcWuhO4g6fS4WblfQV6izl8vIyrp1wyKsY13MiR02S7fUkZEmRMDp+qq0utEdEMqski2Y8yII9dVpCeTG7jImORohrGqHS18cg5rdfMD6Lth4pmi7f7G0XjaqS+zZVrY6q106DX4QfSQD7rtWvnO5QkdGPDhlGuv1M/tLj3VazKOYZYFUCBvYC17EEL1cWR5Ztt8dun89jmlBY4cdejOg4ZQaGtIsRBXopHmylydBTdIC1TMWOcFJUp4ioDZTYozHuy2/hCEnOcUxn4es2p+Vxyu015+3yWOTJ5bVl4x3I16XHWEWIUPOiVjY6p2jpgXdFuio9SkT5REe1VIfm9rqv9XEnymQyvgT1AlBYSgFlAJKCwlAEoAlAEoAQCSpASgEJQCOUgjKsCMhWQIyFYEbgrJgmpY6o2wMjrdVlijLsRtRbo8Xb+ZpB6XH7rJ6d9mQ4k/wCPY7/yADlLh89VV45rsVoe3Gf0lvv9JUKLRFCMxQ2AP85yo2vuKIzxFgPic0H/ANbfqrrFN9EKIKvGaEwalMeoV1psvVRYszcTiMEX94Xt7yAM2c2HSPNd+myavHJcOi2TK5xps3cA8tgZgWkWPTaF9ZCVo8+SN/huJkZSbhaxZnJF17lpZQyOIVBIB5qGyUitiKk2hWIOI7bNeHNLj4J257fzquDXJ0mjfA0cxU4o7RttlwJS7s3Kj8Q9x1PP3U0iRBWdzTbEHqy+TOsEIBCQQAgBSAUAEAKaAkoBCUAiAFIEQDSpA0qQMIVgMIUgjc1WTBG5qsmCB7FdMUV6jFqmQValNaqRBVqU1qpEUVn01opFWiF1JXUitG9wnjbmANfeN/kFrDM4mcoHRYHtHTNVhmASfb+QuqOrW5Gbx8HYfiWuaHNII5hehHIpK0c7i0UsTRFTUfuOqsnZHQycZiTSs46mx+hVrIo5Ltdjw5oZqdT0C4NXlTqCOjDHucj3a47NxQxRYHZEsUepr5Q6gQAgBACAEAIAQCKbAiARACkCIAQDSpA2FIEIQCFqkDS1TYGOYrJgicxWTBC+mrpgrPpLRSIK76K1UiCB9BXUyGiJ2HV1MiiM4dW3kUJ3JU7yKNjgfHKmHBbGZhvE6HmFti1MsfQpLGpHV4btDSNPMHhp0IPNejj1uOrbOd4XZhce4rRqscyc0jaRB1kKuTXwr4eSY4X3OMfT6k+dyuFzt2zdKlQzu03AMimwGRLB6avlzpBACAEAIAQAgBACkCQgEIUgQhAJCAFIEQDSFIEUgRAIpQEIUgYWpYGFismCN1JWUgROoq6kQRuoKymQRuoKymBhw6neRRGaCtvFEbqCspkURPpK6kRRC6krqRBC6mr7iCN1NWUhQzu1O4ig7tNwPRl84dAIAQAgFhAEIAhAEIAIQCQgEhABCkDYU2BISwJCkCQgEIUgbCASFIEU2BIQDSFIGkKQNIUgYWqxA0tUgYWqbIGlqmwMdTVkyCJ9JWUgQuoq6kQQPorRSIoidRV1IgjNJTuAd0m4HdLwjYWFAFhACAEAqAFABACkAgEIQCQgAhAIQpAhCkDcqWBIUgaQpAkKQNIQCEKQIQlgTKrAYWqQMIUkDSFIGFSQJCkDSFIGkKQNLVNkET6aupAhexXTKsiNNXsCd2lkH//Z","Subject": "Profile","IsDocument": true,"Regarding" : {"Entity" : "Document","Guid" : "580dc89d-7304-ee11-8354-00155dee5a05"}}]
                            */
                            string b64File = "";
                            string mimeType = "image/jpeg";
                            try
                            {
                                string extension = await _fileService.GetFileExtensionFromUrl(newDoc.Reference);
                                mimeType = await _fileService.GetMimeType(extension);
                                b64File = await _fileService.GetFileAsBase64Async(newDoc.Reference);
                            }
                            catch (Exception e)
                            {
                                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushNewChild > GetAPIHandlerResponse");
                            }

                            StringBuilder jsonNoteString = new StringBuilder();
                            jsonNoteString.AppendLine("[{");
                            jsonNoteString.AppendLine("\"FileName\":\"" + newDoc.Name + "\",");
                            jsonNoteString.AppendLine("\"MimeType\":\"" + mimeType + "\",");
                            jsonNoteString.AppendLine("\"Description\":\"" + docTypeMapped.RemoteEntity + "\",");
                            jsonNoteString.AppendLine("\"DocumentBody\":\"" + b64File + "\",");
                            jsonNoteString.AppendLine("\"Subject\":\"" + docTypeMapped.RemoteEntity + "\",");
                            jsonNoteString.AppendLine("\"IsDocument\":true,");
                            jsonNoteString.AppendLine("\"Regarding\":{\"Entity\": \"Document\",\"Guid\": \"" + docRemoteId + "\"}");
                            jsonNoteString.AppendLine("}]");

                            //create doc
                            try
                            {
                                //now send to API call <entity type>/Multiple
                                apiResponse = await _apiManager.GetAPIHandlerResponse(noteUrl, null, null, null, false, false, jsonNoteString.ToString());
                                if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                                {
                                    var returnObj = JsonConvert.DeserializeObject<List<PostResponse>>(apiResponse.ResponseString);
                                    if (returnObj != null)
                                    {
                                        if (returnObj[0].Guid != null)
                                        {
                                            noteRemoteId = returnObj.Count() > 0 ? returnObj[0].Guid.ToString() : null;
                                            IntegrationEntityMapping cgMapping = new IntegrationEntityMapping();
                                            cgMapping.LocalEntity = Constants.SSIntegrationSettings.SSDocument;
                                            cgMapping.RemoteEntity = Constants.SSIntegrationSettings.SLDocument;
                                            cgMapping.LocalId = newDoc.Id.ToString();
                                            cgMapping.RemoteId = docRemoteId;
                                            //cgMapping.UserId = newDoc.UserId;
                                            cgMapping.UpdatedBy = _uId;
                                            cgMapping.UpdatedDate = DateTime.Now;
                                            cgMapping.IsComplete = true;
                                            cgMapping.BeforeJSON = jsonDocString.ToString() + " | " + jsonNoteString.ToString();
                                            _mapperRepo.Insert(cgMapping);
                                        }
                                    }
                                    else //error empty response received
                                    {
                                        await _logManager.IntegrationLog("Note not created", jsonNoteString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "PushUpdates > GetAPIHandlerResponse");
                                    }
                                }
                            }
                            catch (Exception e)
                            {
                                await _logManager.IntegrationLog(e.Message + " - " + apiResponse.ResponseString, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushNewDocument > GetAPIHandlerResponse");
                            }
                        }
                    }
                }
                else
                {
                    docRemoteId = existingDoc.RemoteId;
                }
            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog(e.Message + " - " + apiResponse.ResponseString, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushNewDocument > Overall");
            }
        }
        return docRemoteId;
    }

    private async Task<string> PushNewChild(Child newChild, string franchiseeRemoteId)
    {
        /*
         //1) use all insert lines - retrieve column mappings and create
        Find all children to insert, then get their caregivers and write the api call for caregivers
        Pluck thecaregiver out of the audits
        then write the child insert api call
         */
        string cgRemoteId = "";
        string childRemoteId = "";
        IntegrationAPIManager.APIHandleResponse apiResponse = null;
        if (newChild != null)
        {
            try
            {
                if (newChild.Caregiver != null)
                {
                    //insert caregiver and map
                    StringBuilder jsonCaregiverString = new StringBuilder();
                    string cgUrl = "";
                    var caregiverColumns = _mappedColumns.Where(c => c.EntityGrouping.Equals("Caregiver") && c.IsActive == true).ToList();

                    cgUrl = Constants.SSIntegrationSettings.SLCaregiver + Constants.SSIntegrationSettings.CreateMultiple;
                    jsonCaregiverString.AppendLine("[{");
                    if (caregiverColumns.Count() > 0 && newChild.Caregiver != null)
                    {
                        foreach (var changeLine in caregiverColumns)
                        {
                            try
                            {
                                if (!string.IsNullOrWhiteSpace(changeLine.LocalColumn))
                                {
                                    if (changeLine.UpdateDirection == UpdateDirection.Both.ToString() || changeLine.UpdateDirection == UpdateDirection.SSToSL.ToString()) //only update mapped columns configured to update
                                    {
                                        string valueToSend = "";
                                        switch (changeLine.LocalEntity)
                                        {
                                            case "SiteAddress":
                                                if (newChild.Caregiver.SiteAddress != null && typeof(SiteAddress).GetProperty(changeLine.LocalColumn.Trim()) != null)
                                                {
                                                    valueToSend = typeof(SiteAddress).GetProperty(changeLine.LocalColumn).GetValue(newChild.Caregiver.SiteAddress) != null ? typeof(SiteAddress).GetProperty(changeLine.LocalColumn).GetValue(newChild.Caregiver.SiteAddress).ToString() : null;
                                                }
                                                break;
                                            case "Caregiver":
                                                if (newChild.Caregiver != null && typeof(Caregiver).GetProperty(changeLine.LocalColumn.Trim()) != null)
                                                {
                                                    valueToSend = typeof(Caregiver).GetProperty(changeLine.LocalColumn.Trim()).GetValue(newChild.Caregiver) != null ? typeof(Caregiver).GetProperty(changeLine.LocalColumn.Trim()).GetValue(newChild.Caregiver).ToString() : null;
                                                }
                                                break;
                                        }
                                        //valueToSend = "";// typeof(changeObj).GetProperty(changeLine.LocalColumn).GetValue(newChild.Caregiver) != null ? typeof(obj).GetProperty(changeLine.LocalColumn).GetValue(newChild.Caregiver).ToString() : null;
                                        //When columns need remapping between systems - get mappedcolumn from columnmapping and remap values that SL expects - like language, SS use Guids, SL requires string
                                        if (changeLine.RemapToString)
                                        {
                                            if (changeLine.RemapEntity != null && !string.IsNullOrEmpty(valueToSend))
                                            {
                                                valueToSend = await _integrationHelperManager.RemapStaticToString(changeLine.RemapEntity, valueToSend);
                                            }
                                        }
                                        if (!string.IsNullOrEmpty(valueToSend))
                                        {
                                            switch (changeLine.EntityDataType)
                                            {
                                                case "bool":
                                                    jsonCaregiverString.AppendLine("\"" + changeLine.RemoteColumn + "\":" + bool.Parse(valueToSend) + ",");
                                                    break;
                                                case "integer":
                                                    jsonCaregiverString.AppendLine("\"" + changeLine.RemoteColumn + "\":" + int.Parse(valueToSend) + ",");
                                                    break;
                                                case "datetime":
                                                    jsonCaregiverString.AppendLine("\"" + changeLine.RemoteColumn + "\":\"" + DateTime.Parse(valueToSend).ToString("yyyy-MM-ddT00:00:00Z") + "\",");
                                                    break;
                                                 case "date":
                                                    jsonCaregiverString.AppendLine("\"" + changeLine.RemoteColumn + "\":\"" + DateTime.Parse(valueToSend).ToString("yyyy-MM-dd") + "\",");
                                                    break;    
                                                default:
                                                    if (valueToSend.Length <= (int)changeLine.ColumnValidationLimit)
                                                    {
                                                        jsonCaregiverString.AppendLine("\"" + changeLine.RemoteColumn + "\":\"" + valueToSend + "\",");
                                                    }
                                                    else
                                                    {
                                                       jsonCaregiverString.AppendLine("\"" + changeLine.RemoteColumn + "\":\"" + valueToSend.Substring(0, (int)changeLine.ColumnValidationLimit) + "\",");
                                                    }
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                            catch (Exception e)
                            {
                                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushUpdates > CreateCaregiver");
                            }
                        }

                        jsonCaregiverString.AppendLine("\"Franchisee\":{\"Guid\": \"" + franchiseeRemoteId + "\"}");
                    }
                    jsonCaregiverString.AppendLine("}");
                    jsonCaregiverString.AppendLine("]");
                    //create caregiver
                    try
                    {
                        //now send to API call <entity type>/Multiple
                        apiResponse = await _apiManager.GetAPIHandlerResponse(cgUrl, null, null, null, false, false, jsonCaregiverString.ToString());
                        if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                        {
                            var returnObj = JsonConvert.DeserializeObject<List<PostResponse>>(apiResponse.ResponseString);
                            if (returnObj != null)
                            {
                                cgRemoteId = returnObj.Count() > 0 ? returnObj[0].Guid.ToString() : null;
                                IntegrationEntityMapping cgMapping = new IntegrationEntityMapping();
                                cgMapping.LocalEntity = Constants.SSIntegrationSettings.SSCaregiver;
                                cgMapping.RemoteEntity = Constants.SSIntegrationSettings.SLCaregiver;
                                cgMapping.LocalId = newChild.CaregiverId.ToString();
                                cgMapping.RemoteId = cgRemoteId;
                                cgMapping.UserId = newChild.UserId;
                                cgMapping.UpdatedBy = _uId;
                                cgMapping.UpdatedDate = DateTime.Now;
                                cgMapping.IsComplete = true;
                                cgMapping.BeforeJSON = jsonCaregiverString.ToString();
                                _mapperRepo.Insert(cgMapping);
                            }
                            else //error empty response received
                            {
                                await _logManager.IntegrationLog("Caregiver not created", jsonCaregiverString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "PushUpdates > Create CHild");
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        await _logManager.IntegrationLog(e.Message + " - " + apiResponse.ResponseString, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushNewChild > CreateCaregiver > GetAPIHandlerResponse");
                    }

                }
                else
                {
                    await _logManager.IntegrationLog("Child Caregiver is null: Child Id :" + newChild.Id, "CareGiver is null", null, LogRelatedType.Error, "PushNewChild > Caregiver Is Null. ");
                }

                //create child and map
                StringBuilder jsonChildString = new StringBuilder();
                string childUrl = "";
                var childColumns = _mappedColumns.Where(c => c.EntityGrouping.Equals("Child") && c.IsActive == true).ToList();
                childUrl = Constants.SSIntegrationSettings.SLChild + Constants.SSIntegrationSettings.CreateMultiple;
                jsonChildString.AppendLine("[{");
                if (childColumns.Count() > 0)
                {
                    foreach (var changeLine in childColumns)
                    {
                        try
                        {

                            if (changeLine.UpdateDirection == UpdateDirection.Both.ToString() || changeLine.UpdateDirection == UpdateDirection.SSToSL.ToString()) //only update mapped columns configured to update
                            {
                                bool bAddConsents = false;
                                bool bAddGrants = false;
                                bool bAddClassroomGroup = false;
                                //string valueToSend = typeof(Child).GetProperty(changeLine.LocalColumn).GetValue(newChild) != null ? typeof(Child).GetProperty(changeLine.LocalColumn).GetValue(newChild).ToString() : null;
                                string valueToSend = "";
                                switch (changeLine.LocalEntity)
                                {
                                    case "ApplicationUser":
                                        if (typeof(ApplicationUser).GetProperty(changeLine.LocalColumn.Trim()) != null)
                                        {
                                            valueToSend = typeof(ApplicationUser).GetProperty(changeLine.LocalColumn).GetValue(newChild.User) != null ? typeof(ApplicationUser).GetProperty(changeLine.LocalColumn.Trim()).GetValue(newChild.User).ToString() : null;
                                        }
                                        break;
                                    case "Child":
                                        if (newChild != null && typeof(Child).GetProperty(changeLine.LocalColumn.Trim()) != null)
                                        {
                                            valueToSend = typeof(Child).GetProperty(changeLine.LocalColumn.Trim()).GetValue(newChild) != null ? typeof(Child).GetProperty(changeLine.LocalColumn.Trim()).GetValue(newChild).ToString() : null;
                                        }
                                        break;
                                    case "Caregiver":
                                        if (newChild.Caregiver != null && typeof(Caregiver).GetProperty(changeLine.LocalColumn.Trim()) != null)
                                        {
                                            valueToSend = typeof(Caregiver).GetProperty(changeLine.LocalColumn.Trim()).GetValue(newChild.Caregiver) != null ? typeof(Caregiver).GetProperty(changeLine.LocalColumn.Trim()).GetValue(newChild.Caregiver).ToString() : null;
                                        }
                                        break;
                                    case "UserConsent":
                                        bAddConsents = true;
                                        break;
                                    case "UserGrants":
                                        bAddGrants |= true;
                                        break;
                                    case "ClassroomGroup":
                                        bAddClassroomGroup = true;
                                        break;
                                    case "BoolMap":
                                        switch (changeLine.LocalColumn)
                                        {
                                            case "HasIdNumber":
                                                valueToSend = newChild.User.IdNumber != null ? "true" : "false";
                                                break;
                                            case "HasAllergy":
                                                valueToSend = string.IsNullOrWhiteSpace(newChild.Allergies) ? "false" : "true";
                                                break;
                                            case "HasDisability":
                                                valueToSend = string.IsNullOrWhiteSpace(newChild.Disabilities) ? "false" : "true";
                                                break;
                                        }
                                        break;
                                }
                                //When columns need remapping between systems - get mappedcolumn from columnmapping and remap values that SL expects - like language, SS use Guids, SL requires string
                                if (changeLine.RemapToString)
                                {
                                    if (changeLine.RemapEntity != null && !string.IsNullOrEmpty(valueToSend))
                                    {
                                        valueToSend = await _integrationHelperManager.RemapStaticToString(changeLine.RemapEntity, valueToSend);
                                    }
                                }
                                if (!string.IsNullOrEmpty(valueToSend) && !bAddConsents && !bAddGrants && !bAddClassroomGroup)
                                {
                                    switch (changeLine.EntityDataType)
                                    {
                                        case "bool":
                                            jsonChildString.AppendLine("\"" + changeLine.RemoteColumn + "\":" + bool.Parse(valueToSend) + ",");
                                            break;
                                        case "integer":
                                            jsonChildString.AppendLine("\"" + changeLine.RemoteColumn + "\":" + int.Parse(valueToSend) + ",");
                                            break;
                                        case "datetime":
                                            jsonChildString.AppendLine("\"" + changeLine.RemoteColumn + "\":\"" + DateTime.Parse(valueToSend).ToString("yyyy-MM-ddT00:00:00Z") + "\",");
                                            break;
                                        case "date":
                                            jsonChildString.AppendLine("\"" + changeLine.RemoteColumn + "\":\"" + DateTime.Parse(valueToSend).ToString("yyyy-MM-dd") + "\",");
                                            break;
                                        default:
                                            jsonChildString.AppendLine("\"" + changeLine.RemoteColumn + "\":\"" + valueToSend + "\",");
                                            break;
                                    }
                                }
                                else if (bAddConsents)
                                {
                                    var userConsents = _dbContext.UserConsents.Where(x => x.UserId == newChild.UserId).Select(x => x.ConsentType).ToList();
                                    //PersonalInformationAgreement PhotoPermissions
                                    foreach (var item in userConsents)
                                    {
                                        switch (item)
                                        {
                                            case "PersonalInformationAgreement":
                                                jsonChildString.AppendLine("\"CaregiverPopiaConsent\":\"true\",");
                                                break;
                                            case "PhotoPermissions":
                                                jsonChildString.AppendLine("\"CaregiverPhotographyAndFilmingConsent\":\"true\",");
                                                break;
                                                //case "ConsentAgreement":
                                                //case "IndemnityAgreement":
                                                //case "CommitmentAgreement":
                                                //    jsonChildString.AppendLine("\"Consent\":\"true\",");
                                                //    break;
                                        }
                                    }
                                }
                                else if (bAddGrants)
                                {
                                    var userGrants = _dbContext.UserGrants.Include(ug => ug.Grant).Where(x => x.UserId == newChild.UserId).Distinct().ToList();
                                    foreach (var item in userGrants)
                                    {
                                        jsonChildString.AppendLine("\"GrantType\":\"" + valueToSend + "\",");
                                    }
                                }
                                else if (bAddClassroomGroup)
                                {
                                    //not sending playgroupgroups at the moment
                                }
                            }
                        }
                        catch (Exception e)
                        {
                            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushUpdates > CreateCaregiver");
                        }
                    }
                    if (!string.IsNullOrEmpty(cgRemoteId))
                        jsonChildString.AppendLine("\"Caregiver\":{\"Guid\": \"" + cgRemoteId + "\"},");
                    jsonChildString.AppendLine("\"Franchisee\":{\"Guid\": \"" + franchiseeRemoteId + "\"}");
                }
                jsonChildString.AppendLine("}");
                jsonChildString.AppendLine("]");
                //create child

                try
                {
                    //now send to API call <entity type>/Multiple
                    apiResponse = await _apiManager.GetAPIHandlerResponse(childUrl, null, null, null, false, false, jsonChildString.ToString());
                    if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                    {
                        var returnObj = JsonConvert.DeserializeObject<List<PostResponse>>(apiResponse.ResponseString);
                        if (returnObj != null)
                        {
                            childRemoteId = returnObj.Count() > 0 ? returnObj[0].Guid.ToString() : null;
                            if (!string.IsNullOrEmpty(childRemoteId))
                            {
                                IntegrationEntityMapping childMapping = new IntegrationEntityMapping();
                                childMapping.LocalEntity = Constants.SSIntegrationSettings.SSChild;
                                childMapping.RemoteEntity = Constants.SSIntegrationSettings.SLChild;
                                childMapping.LocalId = newChild.Id.ToString();
                                childMapping.RemoteId = childRemoteId;
                                childMapping.UserId = newChild.UserId;
                                childMapping.UpdatedBy = _uId;
                                childMapping.UpdatedDate = DateTime.Now;
                                childMapping.IsComplete = true;
                                childMapping.BeforeJSON = jsonChildString.ToString();
                                _mapperRepo.Insert(childMapping);
                            }
                            else //error empty response received
                            {
                                await _logManager.IntegrationLog("Child not created", jsonChildString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "PushUpdates > Create CHild");
                            }
                        }
                        else //error empty response received
                        {
                            await _logManager.IntegrationLog("Child not created", jsonChildString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "PushUpdates > Create CHild");
                        }
                    }
                }
                catch (Exception e)
                {
                    await _logManager.IntegrationLog(e.Message + " - " + apiResponse.ResponseString, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushUpdates > GetAPIHandlerResponse");
                }
            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog(e.Message + " - " + apiResponse.ResponseString, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushUpdates > GetAPIHandlerResponse");
            }
        }
        return childRemoteId;
    }

    private async Task<string> PushNewCaregiverUpdateChild(Caregiver newCG)
    {
        string cgRemoteId = "";
        string childRemoteId = "";
        IntegrationEntityMapping mappedPractitioner = new IntegrationEntityMapping();
        IntegrationAPIManager.APIHandleResponse apiResponse = null;
        if (newCG != null)
        {
            //retrieve the child this CG is linked to
            Child cgChild = _childGenericRepo.GetAll().Where(x => x.CaregiverId != null && string.Equals(x.CaregiverId, newCG.Id)).FirstOrDefault();
            if (cgChild != null)
            {
                //retrieve teh mapped child
                IntegrationEntityMapping childMapping = _mappedEntities.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSChild) && x.UserId == cgChild.UserId).FirstOrDefault();
                if (childMapping != null)
                {
                    childRemoteId = childMapping.RemoteId;
                    try
                    {
                        var practitioner = GetPractitionerForChild(childMapping.UserId);
                        if (practitioner != null)
                        {
                            //get remoteId
                            mappedPractitioner = _mappedEntities.Where(x => x.UserId == practitioner.UserId && x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSPractitioner)).FirstOrDefault();

                            //insert caregiver and map
                            StringBuilder jsonCaregiverString = new StringBuilder();
                            string cgUrl = "";
                            var caregiverColumns = _mappedColumns.Where(c => c.EntityGrouping.Equals(Constants.SSIntegrationSettings.SSCaregiver) && c.IsActive == true).ToList();

                            cgUrl = Constants.SSIntegrationSettings.SLCaregiver + Constants.SSIntegrationSettings.CreateMultiple;
                            jsonCaregiverString.AppendLine("[{");
                            if (caregiverColumns.Count() > 0)
                            {
                                foreach (var changeLine in caregiverColumns)
                                {
                                    try
                                    {
                                        if (!string.IsNullOrWhiteSpace(changeLine.LocalColumn))
                                        {
                                            if (changeLine.UpdateDirection == UpdateDirection.Both.ToString() || changeLine.UpdateDirection == UpdateDirection.SSToSL.ToString()) //only update mapped columns configured to update
                                            {
                                                string valueToSend = "";
                                                switch (changeLine.LocalEntity)
                                                {
                                                    case "SiteAddress":
                                                        if (newCG.SiteAddress != null && typeof(SiteAddress).GetProperty(changeLine.LocalColumn.Trim()) != null)
                                                        {
                                                            valueToSend = typeof(SiteAddress).GetProperty(changeLine.LocalColumn).GetValue(newCG.SiteAddress) != null ? typeof(SiteAddress).GetProperty(changeLine.LocalColumn).GetValue(newCG.SiteAddress).ToString() : null;
                                                        }
                                                        break;
                                                    case "Caregiver":
                                                        if (typeof(Caregiver).GetProperty(changeLine.LocalColumn.Trim()) != null)
                                                        {
                                                            valueToSend = typeof(Caregiver).GetProperty(changeLine.LocalColumn.Trim()).GetValue(newCG) != null ? typeof(Caregiver).GetProperty(changeLine.LocalColumn.Trim()).GetValue(newCG).ToString() : null;
                                                        }
                                                        break;
                                                }
                                                if (changeLine.RemapToString)
                                                {
                                                    if (changeLine.RemapEntity != null && !string.IsNullOrEmpty(valueToSend))
                                                    {
                                                        valueToSend = await _integrationHelperManager.RemapStaticToString(changeLine.RemapEntity, valueToSend);
                                                    }
                                                }
                                                if (!string.IsNullOrEmpty(valueToSend))
                                                {
                                                    switch (changeLine.EntityDataType)
                                                    {
                                                        case "bool":
                                                            jsonCaregiverString.AppendLine("\"" + changeLine.RemoteColumn + "\":" + bool.Parse(valueToSend) + ",");
                                                            break;
                                                        case "integer":
                                                            jsonCaregiverString.AppendLine("\"" + changeLine.RemoteColumn + "\":" + int.Parse(valueToSend) + ",");
                                                            break;
                                                        case "datetime":
                                                            jsonCaregiverString.AppendLine("\"" + changeLine.RemoteColumn + "\":\"" + DateTime.Parse(valueToSend).ToString("yyyy-MM-ddT00:00:00Z") + "\",");
                                                            break;
                                                        default:
                                                            jsonCaregiverString.AppendLine("\"" + changeLine.RemoteColumn + "\":\"" + valueToSend + "\",");
                                                            break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    catch (Exception e)
                                    {
                                        await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushInserts > PushNewCaregiverUpdateChild");
                                    }
                                }

                                jsonCaregiverString.AppendLine("\"Franchisee\":{\"Guid\": \"" + mappedPractitioner.RemoteId + "\"}");
                            }
                            jsonCaregiverString.AppendLine("}");
                            jsonCaregiverString.AppendLine("]");
                            //create caregiver
                            try
                            {
                                //now send to API call <entity type>/Multiple
                                apiResponse = await _apiManager.GetAPIHandlerResponse(cgUrl, null, null, null, false, false, jsonCaregiverString.ToString());
                                if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                                {
                                    var returnObj = JsonConvert.DeserializeObject<List<PostResponse>>(apiResponse.ResponseString);
                                    if (returnObj != null)
                                    {
                                        cgRemoteId = returnObj.Count() > 0 ? returnObj[0].Guid.ToString() : null;
                                        IntegrationEntityMapping cgMapping = new IntegrationEntityMapping();
                                        cgMapping.LocalEntity = Constants.SSIntegrationSettings.SSCaregiver;
                                        cgMapping.RemoteEntity = Constants.SSIntegrationSettings.SLCaregiver;
                                        cgMapping.LocalId = newCG.ToString();
                                        cgMapping.RemoteId = cgRemoteId;
                                        //cgMapping.UserId = newChild.UserId;
                                        cgMapping.UpdatedBy = _uId;
                                        cgMapping.UpdatedDate = DateTime.Now;
                                        cgMapping.IsComplete = true;
                                        cgMapping.BeforeJSON = jsonCaregiverString.ToString();
                                        _mapperRepo.Insert(cgMapping);
                                    }
                                    else //error empty response received
                                    {
                                        await _logManager.IntegrationLog("Caregiver not created", jsonCaregiverString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "PushNewCaregiverUpdateChild > Create Caregiver");
                                    }
                                }
                            }
                            catch (Exception e)
                            {
                                await _logManager.IntegrationLog(e.Message + " - " + apiResponse.ResponseString, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushNewCaregiverUpdateChild > CreateCaregiver > GetAPIHandlerResponse");
                            }

                            //update the child and map
                            StringBuilder jsonChildString = new StringBuilder();
                            string childUrl = "";
                            childUrl = Constants.SSIntegrationSettings.SLChild + Constants.SSIntegrationSettings.UpdateMultiple;
                            jsonChildString.AppendLine("[{");
                            jsonChildString.AppendLine("\"Guid\": \"" + childMapping.RemoteId + "\",");
                            if (!string.IsNullOrEmpty(cgRemoteId))
                                jsonChildString.AppendLine("\"Caregiver\":{\"Guid\": \"" + cgRemoteId + "\"},");

                            jsonChildString.AppendLine("}");
                            jsonChildString.AppendLine("]");
                            //update child
                            try
                            {
                                //now send to API call <entity type>/Multiple
                                apiResponse = await _apiManager.GetAPIHandlerResponse(childUrl, null, null, null, false, false, jsonChildString.ToString());
                                if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                                {
                                    var returnObj = JsonConvert.DeserializeObject<List<PostResponse>>(apiResponse.ResponseString);
                                    if (returnObj != null)
                                    {
                                        childRemoteId = returnObj.Count() > 0 ? returnObj[0].Guid.ToString() : null;
                                    }
                                    else //error empty response received
                                    {
                                        await _logManager.IntegrationLog("Child not updated", jsonChildString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "PushInserts > Update Child");
                                    }
                                }
                            }
                            catch (Exception e)
                            {
                                await _logManager.IntegrationLog(e.Message + " - " + apiResponse.ResponseString, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushInserts > Update Child > GetAPIHandlerResponse");
                            }
                        }

                    }
                    catch (Exception e)
                    {
                        await _logManager.IntegrationLog(e.Message + " - " + apiResponse.ResponseString, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushInserts > Update Child > GetAPIHandlerResponse");
                    }

                } else
                {
                    //child doesnt exist yet or didnt map properly, and needs remapping
                    await _logManager.IntegrationLog("Caregiver not created, child doesnt exist for caregiver no mapping exist" + cgChild.UserId.ToString(), cgChild.UserId.ToString(), null, LogRelatedType.Error, "PushInserts > Create Caregiver > Missing Child mapping in mappings");
                    await _logManager.IntegrationLog("Caregiver not created, child doesnt exist for caregiver" + newCG.Id.ToString(), newCG.Id.ToString(), null, LogRelatedType.Error, "PushInserts > Create Caregiver");
                }
            } else
            {
                //end child check, if no child exists for this caregiver then dont need to send to SL, but a caregiver shouldnt exist without a child, so a different issue
                await _logManager.IntegrationLog("Caregiver not created, child doesnt exist for caregiver" + newCG.Id.ToString(), newCG.Id.ToString() , null, LogRelatedType.Error, "PushInserts > Create Caregiver");
            }
        }
        return cgRemoteId;
    }

    public Practitioner GetPractitionerForChild(string childUserId)
    {
        if (childUserId != null)
        {
            var parentUserId = _hierarchyEngine.GetUserParentUserId(childUserId);
            return _practitionerGenericRepo.GetByUserId(parentUserId);
        }
        else return null;
    }

    #endregion

    #region Decommisioned Code

    private async Task<bool> IntegrationAttendanceDataDecommissioned()
    {
        await _logManager.IntegrationLog($"IntegrationAttendanceData Started at {DateTime.Now}", null, null, LogRelatedType.Log, "IntegrationAttendanceData");
        int attendancesSent = 0;
        bool isComplete = false;

        _mappedEntities = await GetMappedEntities();
        int trackingDays = 2;
        string attendanceUrl = Constants.SSIntegrationSettings.SLChildAttendanceRegister + Constants.SSIntegrationSettings.CreateMultiple;
        var attendancesDueList = _mappedEntities.Where(x => string.Equals(x.LocalEntity, Constants.SSIntegrationSettings.SSPractitioner) && (x.LastAttendanceSubmittedDate == null || x.LastAttendanceSubmittedDate <= DateTime.Now.Date.AddDays(-trackingDays))).ToList();

        DateTime trackingWeekDate = DateTime.Now.AddDays(-trackingDays).StartOfWeek(DayOfWeek.Monday);
        DateTime followingWeekDate = DateTime.Now.StartOfWeek(DayOfWeek.Monday);

        foreach (var parent in attendancesDueList)
        {
            IEnumerable<Attendance> attendanceData = new AttendanceQueryExtension().GetWeeklyAttendance(_attendanceTrackingRepository, parent.UserId, trackingWeekDate.Year, trackingWeekDate.Month, trackingWeekDate.GetWeekOfYear());
            var holidays = _holidayService.GetHolidays(trackingWeekDate, followingWeekDate, "en-za").ToList();//get holidays to determine which days are falling on holidays
            if (attendanceData.Any())
            {
                try
                {
                    bool validAttendance = false;
                    string absent = "Absent";
                    string nosession = "No Session";
                    string unknown = "Unknown";
                    string present = "Present";
                    string pholiday = "Public Holiday";
                    StringBuilder jsonAttendanceString = new StringBuilder();
                    jsonAttendanceString.AppendLine("[");
                    //get list of children
                    List<string> children = attendanceData.Select(x => x.UserId).Distinct().ToList();
                    foreach (var child in children)
                    {
                        int daysPresent = 0;
                        int daysAbsent = 0;
                        //set everything to nosession and override as teh days are iterated through - whether absent or present or a holiday
                        string mondayPresent = unknown;
                        string tuesdayPresent = unknown;
                        string wednesdayPresent = unknown;
                        string thursdayPresent = unknown;
                        string fridayPresent = unknown;
                        string defaultState = unknown;
                        //must get mapped childrens details to get remote ID and if child has already been mapped, if not mapped, dont send 
                        var mappedChild = _mappedEntities.Where(x => string.Equals(x.UserId, child) && string.Equals(x.LocalEntity, Constants.SSIntegrationSettings.SSChild)).FirstOrDefault();
                        if (mappedChild != null)
                        {
                            var childAttendances = attendanceData.Where(x => string.Equals(x.UserId, child) && x.AttendanceDate < followingWeekDate).OrderBy(x => x.AttendanceDate).ToList();
                            //mark public holidays off first
                            if (holidays.Count > 0)
                            {
                                foreach (var publicholiday in holidays)
                                {
                                    switch (publicholiday.Day.ToString("dddd"))
                                    {
                                        case "Monday":
                                            mondayPresent = pholiday;
                                            break;
                                        case "Tuesday":
                                            tuesdayPresent = pholiday;
                                            break;
                                        case "Wednesday":
                                            wednesdayPresent = pholiday;
                                            break;
                                        case "Thursday":
                                            thursdayPresent = pholiday;
                                            break;
                                        case "Friday":
                                            fridayPresent = pholiday;
                                            break;

                                    }
                                }
                            }
                            foreach (var attendance in childAttendances)
                            {
                                switch (attendance.AttendanceDate.ToString("dddd"))
                                {
                                    case "Monday":
                                        if (attendance.Attended)
                                        {
                                            mondayPresent = present;
                                            daysPresent++;
                                        }
                                        else if (!attendance.Attended)
                                        {
                                            daysAbsent++;
                                            mondayPresent = absent;
                                        }
                                        break;
                                    case "Tuesday":
                                        if (attendance.Attended)
                                        {
                                            tuesdayPresent = present;
                                            daysPresent++;
                                        }
                                        else if (!attendance.Attended)
                                        {
                                            daysAbsent++;
                                            tuesdayPresent = absent;
                                        }
                                        break;
                                    case "Wednesday":
                                        if (attendance.Attended)
                                        {
                                            wednesdayPresent = present;
                                            daysPresent++;
                                        }
                                        else if (!attendance.Attended)
                                        {
                                            daysAbsent++;
                                            wednesdayPresent = absent;
                                        }
                                        break;
                                    case "Thursday":
                                        if (attendance.Attended)
                                        {
                                            thursdayPresent = present;
                                            daysPresent++;
                                        }
                                        else if (!attendance.Attended)
                                        {
                                            daysAbsent++;
                                            thursdayPresent = absent;
                                        }
                                        break;
                                    case "Friday":
                                        if (attendance.Attended)
                                        {
                                            fridayPresent = present;
                                            daysPresent++;
                                        }
                                        else if (!attendance.Attended)
                                        {
                                            daysAbsent++;
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
                            jsonAttendanceString.AppendLine("\"NumberOfDaysAbsent\":" + daysAbsent + ",");
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
                            var apiResponse = await _apiManager.GetAPIHandlerResponse(attendanceUrl, null, null, null, false, false, jsonAttendanceString.ToString());
                            if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                            {
                                var returnObj = JsonConvert.DeserializeObject<List<PostResponse>>(apiResponse.ResponseString);
                                if (returnObj != null)
                                {
                                    var remoteStatementId = returnObj.Count() > 0 ? returnObj[0].Guid.ToString() : null;
                                    isComplete = true;
                                    //mark mapped parent practitioner of last date attendance was sent
                                    parent.LastAttendanceSubmittedDate = DateTime.Now;
                                    _mapperRepo.Update(parent);

                                    attendancesSent++;
                                }
                                else //error empty response received
                                {
                                    await _logManager.IntegrationLog("Data Push Fail: " + apiResponse.ResponseString, jsonAttendanceString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "IntegrationAttendanceData > GetAPIHandlerResponse");
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
        await _logManager.IntegrationLog($"IntegrationAttendanceData Completed at {DateTime.Now}", $"Attendances sent {attendancesSent}", null, LogRelatedType.Log, "IntegrationAttendanceData");
        return isComplete;
    }

    //private async Task<bool> UpdateAuditSubmitted(List<IntegrationAudit> completedAudits)
    //{
    //    if (!completedAudits.Any())
    //        return false;
    //    else
    //    {
    //        foreach (var audit in completedAudits)
    //        {
    //            var auditRow = _auditRepo.GetById(audit.Id);
    //            if (auditRow != null)
    //            {
    //                auditRow.UpdatedDate = DateTime.Now;
    //                auditRow.UpdatedBy = _uId;
    //                auditRow.Submitted = DateTime.Now;

    //                _auditRepo.Update(auditRow);
    //            }
    //        }

    //        return true;
    //    }
    //}

    private async Task<bool> PushUpdatesOld()
    {
        //DECOMMISIONED

        //1) Get list of entities and their types
        //2) Iterate through these and group updates for same entity (Practitioner + associated ApplicationUser pairs)
        //3) Build up JSON for the endpoint with blocks for each individual entity based on mapped columns only, any other changes is irrelevant
        //4) Add remote guid
        //5) Send it to the /Multiple endpoint
        //6) Move to next entity type thats mapped and has properties - Child, Franchisor, Coach                     

        _audits = await GetAudits();
        var updates = _audits.Where(x => x.ChangeType.Equals("Update") && x.Submitted == null).ToList();

        List<IntegrationEntityMapping> entities = _mappedEntities.Where(x => x.LocalId != null && x.RemoteId != null).ToList();

        //audits = audits.Where(x => x.RelatedId.Equals("ad8796d4-9f6e-42e3-9bff-2a59e074eaab")).ToList();//audits.Where(x => x.Entity.Equals("ApplicationUser") || x.Entity.Equals("Practitioner")).ToList();

        var entityTypeList = updates.Where(x => x.Submitted == null).Select(x => x.Entity).ToList(); //retrieve audit line sthat havent already been submitted

        Dictionary<string, string> entitypes = new Dictionary<string, string>();
        List<IntegrationAudit> completedList = new List<IntegrationAudit>();

        foreach (var updatedEntityType in entityTypeList)
        {
            try
            {

                StringBuilder jsonString = new StringBuilder();
                var entityIdList = updates.Where(x => x.Entity.Equals(updatedEntityType)).Select(y => y.RelatedId).Distinct().ToList();

                if (entityIdList.Any() && entities.Any())
                {
                    string url = "";
                    jsonString.AppendLine("[");
                    foreach (var entityToUpdate in entityIdList)
                    {
                        var mappedEntity = entities.Where(x => x.UserId == entityToUpdate).FirstOrDefault();// && x.LocalEntity.Equals(updatedEntityType)
                        if (mappedEntity != null) //if we have this entity mapped to remote?
                        {
                            string localEntity = mappedEntity.LocalEntity;
                            string remoteEntity = mappedEntity.RemoteEntity;

                            url = remoteEntity + Constants.SSIntegrationSettings.UpdateMultiple;
                            jsonString.AppendLine("{");
                            //get all changes for this entity and group and build JSON
                            var allChanges = updates.Where(x => x.Entity.Equals(updatedEntityType) && x.RelatedId.Equals(entityToUpdate)).OrderByDescending(y => y.InsertedDate).DistinctBy(y => y.Property).ToList();
                            if (updatedEntityType.Equals("ApplicationUser"))
                            {
                                //add possible additional entity changes in too - If ApplicationUser, there may be additional Practitioner/Child/Coach/Franchisor changes associated, also check address, principal
                                var entityChanges = updates.Where(x => x.Entity.Equals(mappedEntity.LocalEntity) && x.RelatedId.Equals(entityToUpdate)).OrderByDescending(y => y.InsertedDate).DistinctBy(y => y.Property).ToList();
                                if (entityChanges.Any())
                                {
                                    allChanges.AddRange(entityChanges);
                                }
                            }
                            if (allChanges.Count() > 0)
                            {
                                jsonString.AppendLine("\"Guid\":\"" + mappedEntity.RemoteId + "\","); //add entity GUID first and changes to follow
                                foreach (var changeLine in allChanges)
                                {
                                    var mappedColumnLine = _mappedColumns.Where(x => x.LocalEntity.Equals(updatedEntityType) && x.EntityGrouping.Equals(localEntity) && x.LocalColumn.Equals(changeLine.Property) && x.IsActive == true).FirstOrDefault();
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
                                                    valueToSend = await _integrationHelperManager.RemapStaticToString(mappedColumnLine.RemapEntity, valueToSend);
                                                }
                                            }
                                            switch (mappedColumnLine.EntityDataType)
                                            {
                                                case "bool":
                                                    jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":" + bool.Parse(valueToSend) + ",");
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
                                                    if (valueToSend.Length <= (int)mappedColumnLine.ColumnValidationLimit)
                                                    {
                                                       jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + valueToSend + "\",");
                                                    }
                                                    else
                                                    {
                                                       jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + valueToSend.Substring(0, (int)mappedColumnLine.ColumnValidationLimit) + "\",");
                                                    }
                                                    break;
                                            }
                                            //jsonString.AppendLine("\"" + mappedColumnLine.RemoteColumn + "\":\"" + valueToSend + "\",");
                                        }
                                    }
                                    //remove entry from audits list as we have processed it here and sending
                                    completedList.Add(changeLine);

                                    updates.Remove(changeLine);
                                }
                            }
                            jsonString.AppendLine("},");
                        }
                    }
                    jsonString.AppendLine("]");
                    try
                    {
                        //now send to API call <entity type>/Multiple
                        var apiResponse = await _apiManager.GetAPIHandlerResponse(url, null, null, null, false, true, jsonString.ToString());
                        if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                        {
                            if (apiResponse.Success) //success
                            {
                                //mark entries as submitted
                                await _logManager.UpdateAuditSubmitted(completedList);
                            }
                            else //error
                            {
                                await _logManager.IntegrationLog("Data push failed ", jsonString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "PushUpdates > Create CHild");
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushUpdates > GetAPIHandlerResponse");
                        throw new HttpRequestException("SmartLink API Error: " + e.Message);
                    }
                }

            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushUpdates");
                throw new HttpRequestException("SmartLink API Error: " + e.Message);
            }

        }

        return true;
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
        catch (Exception e)
        {
            //TODO: LOG ERROR AND HANDLE
            await _logManager.IntegrationLog(e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "UpdateDocumentEntity");
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
            string url = Constants.SSIntegrationSettings.SLCoach + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", coach.RemoteId);
            var apiResponse = await _apiManager.GetAPIHandlerResponse(url, null);
            MappedCoach entity = JsonConvert.DeserializeObject<MappedCoach>(apiResponse.ResponseString);
            if (entity != null)
            {
                entity.localId = coach.LocalId;
                //update coach against mappedcoachproperties
                await UpdateCoachEntity(entity, coach, mappedColumns.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSCoach)).ToList());
            }
        }

        //run through all mapped practitioners that is not complete
        foreach (var practitioner in mappedEntities.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSPractitioner)).ToList())
        {
            if (practitioner.IsComplete != true)
            {
                //entity may have been manually mapped for inclusion, pull all details and update
                string url = Constants.SSIntegrationSettings.SLPractitioner + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", practitioner.RemoteId);
                var apiResponse = await _apiManager.GetAPIHandlerResponse(url, null);
                MappedFranchisee entity = JsonConvert.DeserializeObject<MappedFranchisee>(apiResponse.ResponseString);
                if (entity != null)
                {
                    entity.localId = practitioner.LocalId;
                    await UpdatePractitionerEntity(entity, practitioner, mappedColumns.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSPractitioner)).ToList());
                }
            }
        }
        //run through all mapped children that is not complete
        foreach (var child in mappedEntities.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSChild)).ToList())
        {
            if (child.IsComplete != true)
            {
                //entity may have been manually mapped for inclusion, pull all details and update
                string url = Constants.SSIntegrationSettings.SLChild + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", child.RemoteId);
                var apiResponse = await _apiManager.GetAPIHandlerResponse(url, null);
                MappedChild entity = JsonConvert.DeserializeObject<MappedChild>(apiResponse.ResponseString);
                if (entity != null)
                {
                    entity.localId = child.LocalId;
                    await UpdateChildEntity(entity, child, mappedColumns.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSChild)).ToList());
                }
            }
        }
        //run through all mapped caregivers
        foreach (var caregiver in mappedEntities.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSCaregiver)).ToList())
        {
            if (caregiver.IsComplete != true)
            {
                //entity may have been manually mapped for inclusion, pull all details and update
                string url = Constants.SSIntegrationSettings.SLCaregiver + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", caregiver.RemoteId);
                var apiResponse = await _apiManager.GetAPIHandlerResponse(url, null);
                MappedCaregiver entity = JsonConvert.DeserializeObject<MappedCaregiver>(apiResponse.ResponseString);
                if (entity != null)
                {
                    entity.localId = caregiver.LocalId;
                    await UpdateCaregiverEntity(entity, caregiver, mappedColumns.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSCaregiver)).ToList());
                }
            }
        }
        //run through all mapped addresses that is not complete
        foreach (var address in mappedEntities.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSAddress)).ToList())
        {
            if (address.IsComplete != true)
            {
                //entity may have been manually mapped for inclusion, pull all details and update
                string url = Constants.SSIntegrationSettings.SLAddress + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", address.RemoteId);
                var apiResponse = await _apiManager.GetAPIHandlerResponse(url, null);
                MappedAddress entity = JsonConvert.DeserializeObject<MappedAddress>(apiResponse.ResponseString);
                if (entity != null)
                {
                    entity.localId = address.LocalId;
                    await UpdateSiteAddressEntity(entity, address, mappedColumns.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSAddress)).ToList());
                }
            }
        }
        //run through all mapped documents that is not complete
        foreach (var docs in mappedEntities.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSDocument)).ToList())
        {
            if (docs.IsComplete != true)
            {
                //entity may have been manually mapped for inclusion, pull all details and update
                string url = Constants.SSIntegrationSettings.SLDocument + Constants.SSIntegrationSettings.QueryByGuid.Replace("{{Guid}}", docs.RemoteId);
                var apiResponse = await _apiManager.GetAPIHandlerResponse(url, null);
                MappedDocument entity = JsonConvert.DeserializeObject<MappedDocument>(apiResponse.ResponseString);
                if (entity != null)
                {
                    entity.localId = docs.LocalId;
                    await UpdateDocumentEntity(entity, docs, mappedColumns.Where(x => x.LocalEntity.Equals(Constants.SSIntegrationSettings.SSDocument)).ToList());
                }
            }
        }
        /**/
        return true;
    }

    #endregion

    #region helper methods

    private string MapStatusOutcomeToRatingColour(string statusOutcome)
    {
        switch (statusOutcome.ToLower())
        {
            case "green":
                return MetricsColorEnum.Success.ToString();
            case "orange":
                return MetricsColorEnum.Warning.ToString();
            case "red":
                return MetricsColorEnum.Error.ToString();
            case "not done":
            default:
                return MetricsColorEnum.None.ToString();
        }
    }

    private string GetNumberOfStarsForPQA(int score, string overallRatingColour)
    {
        if (score < 13 || overallRatingColour.ToLower() == "red")
        {
            return Constants.SSSettings.zero_stars;
        }

        if (score < 27)
        {
            return Constants.SSSettings.one_star;
        }

        if (score < 33 || overallRatingColour.ToLower() == "orange")
        {
            return Constants.SSSettings.two_stars;

        }

        if (score < 39)
        {
            return Constants.SSSettings.three_stars;
        }

        return Constants.SSSettings.four_stars;
    }

    #endregion
}
