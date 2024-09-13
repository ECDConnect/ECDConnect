using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Portal;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class CoachQueryExtension
    {
        public CoachQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<CoachPractitioner> GetAllPractitionersForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] PersonnelService personnelService,
            [Service] VisitManager visitManager,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var practitioners = dbRepo.GetAll().Where(x => x.IsActive && x.CoachHierarchy.HasValue && x.CoachHierarchy.Value == Guid.Parse(userId)).ToList();
            var coachPractitioners = new List<CoachPractitioner>();

            foreach (var practitioner in practitioners)
            {
                // validate default visits for smartSpace license
                visitManager.ValidateDefaultVisitsForPractitioner(practitioner.UserId.ToString(), practitioner.Id);

                coachPractitioners.Add(new CoachPractitioner
                {
                    Id = practitioner.Id,
                    UserId = practitioner.UserId.Value,
                    ProgrammeType = practitioner.ProgrammeType,
                    timeline = personnelService.GetPractitionerTimeline(practitioner.UserId.ToString())
                });
            }

            return coachPractitioners;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Coach GetCoachByCoachUserId(
            [Service] VisitManager visitManager,
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            Coach coach = dbRepo.GetByUserId(userId);

            List<Visit> visits = visitManager.GetVisitsForClient(userId, Constants.SSSettings.client_coach);

            coach.TraineeVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_trainee_visit).ToList();
            coach.PractitionerVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_practitioner_visit || x.VisitType.Name == Constants.SSSettings.visitType_practitioner_call).ToList();

            return coach;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Coach GetCoachByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            //this was used wrong in FE, so adjust to align with FE
            return GetCoachByPractitionerId(contextAccessor, repoFactory, userId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public string GetCoachNameByUserId([Service] ApplicationUserManager userManager,
        string userId)
        {
            var user = userManager.FindByIdAsync(userId).Result;
            return user != null ? user.FullName : null;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Coach GetCoachByPractitionerId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string practitionerId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);

            Practitioner pract = dbRepo.GetByUserId(practitionerId);
            if (pract != null && pract.CoachHierarchy.HasValue)
            {
                var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
                return coachRepo.GetByUserId(pract.CoachHierarchy.ToString());
            }
            else return null;
        }

        public List<Child> GetAllChildrenForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateGenericRepository<Child>();

            List<Child> children = new List<Child>();
            var dbRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = dbRepo.GetAll().Where(x => x.CoachHierarchy.HasValue && x.CoachHierarchy == Guid.Parse(userId)).ToList();
            foreach (var practioner in practitioners)
            {
                List<Child> practitionerChildren = childRepo.GetAll().Where(x => x.Hierarchy.Contains(practioner.Hierarchy)).ToList();
                children.AddRange(practitionerChildren);
            }
            return children;
        }

        public List<Classroom> GetAllClassroomsForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser()?.Id ?? throw new ArgumentNullException("User.Id"); ;
            
            var classRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);

            List<Classroom> classrooms = new List<Classroom>();
            var dbRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = dbRepo.GetAll().Where(x => x.CoachHierarchy.HasValue).ToList();
            practitioners.Where(x => x.CoachHierarchy == Guid.Parse(userId)).ToList();
            foreach (var practioner in practitioners)
            {
                List<Classroom> practitionerClasses = classRepo.GetAll().Where(x => x.UserId.ToString().Contains(practioner.UserId.ToString())).ToList();
                classrooms.AddRange(practitionerClasses);
            }
            return classrooms;
        }

        public List<ClassroomGroupModel> GetAllClassroomGroupsForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IClassroomService classroomService,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);

            var userIdGuid = new Guid(userId);

            List<ClassroomGroupModel> classrooms = new List<ClassroomGroupModel>();
            var dbRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = dbRepo.GetAll().Where(x => x.CoachHierarchy == userIdGuid).ToList();
            foreach (var practioner in practitioners)
            {
                var classroomGroups = classroomService.GetClassroomGroupsForUser(practioner.User.Id);
                if (classroomGroups == null)
                {
                    return null;
                }

                var practitionerClasses = classroomGroups.Select(x => new ClassroomGroupModel
                {
                    Id = x.Id,
                    ClassroomId = x.ClassroomId,
                    Name = x.Name,
                    UserId = x.UserId.Value,
                    Learners = x.Learners.Select(y => new BaseLearnerModel
                    {
                        LearnerId = y.Id,
                        ChildUserId = y.UserId.Value,
                        StartedAttendance = y.StartedAttendance,
                        StoppedAttendance = y.StoppedAttendance,
                        IsActive = y.IsActive,
                    }).ToList(),
                    ClassProgrammes = x.ClassProgrammes.Where(x => x.IsActive).ToList(),
                }).ToList();

                classrooms.AddRange(practitionerClasses);
            }
            return classrooms.DistinctBy(x => x.Id).ToList();
        }

        public CircleTabClubs GetAllCoachingCircleClubsForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId,
            DateTime startDate,
            DateTime endDate)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var clubRepo = repoFactory.CreateRepository<Club>(userContext: uId);
            var clubMeetingRepo = repoFactory.CreateRepository<ClubMeeting>(userContext: uId);

            List<Club> allClubs = clubRepo.GetAll().Where(x => x.UserId == Guid.Parse(userId) && x.IsActive == true).OrderBy(x => x.Name).ToList();
            List<CircleClub> noMeetings = new List<CircleClub>();
            List<CircleClub> haveMeetings = new List<CircleClub>();
            CircleClub circleClub = new CircleClub();

            foreach (var club in allClubs)
            {
                // get all meetings for club for year
                List<ClubMeeting> meetings = clubMeetingRepo.GetAll().Where(x => x.ClubId == club.Id &&
                                                                                x.IsActive == true &&
                                                                                x.MeetingDate.Value.Year == startDate.Year &&
                                                                                x.MeetingType.Name == Constants.CoachingCircleSettings.meeting_type_coach_circle).ToList();
                if (meetings.Count == 0)
                {
                    circleClub = new CircleClub();
                    circleClub.Id = club.Id.ToString();
                    circleClub.Name = club.Name;
                    circleClub.ClubMeetings = meetings;
                    noMeetings.Add(circleClub);
                } else
                {
                    circleClub = new CircleClub();
                    circleClub.Id = club.Id.ToString();
                    circleClub.Name = club.Name;
                    circleClub.ClubMeetings = meetings;

                    ClubMeeting latest_meeting_inside_quarter = meetings.Where(x => x.IsActive == true && x.MeetingDate.Value.Date >= startDate && x.MeetingDate.Value.Date <= endDate).OrderByDescending(x => x.MeetingDate).FirstOrDefault();
                    ClubMeeting latest_meeting_outside_quarter = meetings.Where(x => x.IsActive == true && x.MeetingDate.Value.Date < startDate).OrderByDescending(x => x.MeetingDate).FirstOrDefault();

                    if (latest_meeting_inside_quarter != null)
                    {
                        circleClub.CCMeetingStatus = Constants.CoachingCircleSettings.circle_meetings_held + latest_meeting_inside_quarter.MeetingDate;
                        circleClub.CCMeetingStatusColor = MetricsColorEnum.Success.ToString();
                        haveMeetings.Add(circleClub);
                    }
                    else
                    {
                        if (latest_meeting_outside_quarter != null)
                        {
                            circleClub.CCMeetingStatus = Constants.CoachingCircleSettings.no_circle_meetings_held + latest_meeting_outside_quarter.MeetingDate;
                            circleClub.CCMeetingStatusColor = MetricsColorEnum.Error.ToString();
                            noMeetings.Add(circleClub);
                        }
                    }
                   
                }
            }

            CircleTabClubs result = new CircleTabClubs();
            result.ClubsWithNoLinkedMeetings = noMeetings;
            result.ClubsWithLinkedMeetings = haveMeetings;

            return result;
        }

        public List<CoachingClubBase> GetAllClubsForCoachSimple([Service] IClubService clubService, string userId)
        {
            return clubService.GetAllClubsForCoachSimple(userId);
        }

        public List<ClubMember> GetClubsMembers([Service] IClubService clubService, Guid[] clubIds)
        {
            return clubService.GetClubsMembers(clubIds);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        [UseFiltering]
        [UseSorting]
        public List<PortalCoachModel> GetAllPortalCoaches(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            CancellationToken cancellationToken,
            PagedQueryInput pagingInput = null,
            string search = null,
            List<string> connectUsageSearch = null
            )
        {
            var uId = contextAccessor.HttpContext.GetUser()?.Id;
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var shortenUrlEntityRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: uId);
            var sixMonthsAgo = DateTime.Now.AddMonths(-6).GetStartOfMonth().Date;

            if (cancellationToken.IsCancellationRequested)
            {
                return null;
            }

            var coachQuery = coachRepo.GetAll(pagingInput);
            // General search term
            if (!string.IsNullOrWhiteSpace(search))
            {
                coachQuery = coachQuery
                    .Where(h =>
                        EF.Functions.ILike(h.User.FullName, $"%{search}%")
                        || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                        || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                        || EF.Functions.ILike(h.User.Email, $"%{search}%"));
            }
            
            var userIds = coachQuery.Select(x => x.UserId.Value).ToList();
            var invitations = shortenUrlEntityRepo.GetAll()
                .Where(x =>
                    userIds.Contains(x.UserId.Value)
                    && (x.MessageType == TemplateTypeConstants.Invitation)
                    && x.IsActive
                    && x.Clicked == 0)
                .Select(x => new { x.UserId, x.InsertedDate, x.NotificationResult })
                .OrderByDescending(x => x.InsertedDate)
                .GroupBy(x => x.UserId);


            var invitationDates = invitations.ToDictionary(x => x.Key, x => x.Last().InsertedDate);
            var invitationNotifications = invitations.ToDictionary(x => x.Key, x => x.Last().NotificationResult);

            var coachModels = coachQuery
                .Select(item => new PortalCoachModel
                {
                    Id = item.Id,
                    IsRegistered = (item.IsRegistered == null ? false : (bool)item.IsRegistered),
                    UserId = item.UserId,
                    InsertedDate = item.InsertedDate.Date,
                    User = new PortalCoachUserModel(item.User,
                                                    (item.IsRegistered == null ? false : (bool)item.IsRegistered),
                                                    invitationDates.ContainsKey(item.UserId) ? invitationDates[item.UserId] : null,
                                                    invitationNotifications.ContainsKey(item.UserId) ? invitationNotifications[item.UserId] : null)
                })
                .ToList();

            List<PortalCoachModel> filteredUsers = new List<PortalCoachModel>();
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_invitation_active))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_invitation_expired))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_past_6_months))
            {
                filteredUsers.AddRange(coachModels.Where(x =>
                    x.IsRegistered
                    && x.User.IsActive
                    && x.User.LastSeen.Date >= sixMonthsAgo));
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_over_6_months))
            {
                filteredUsers.AddRange(coachModels.Where(x =>
                    x.IsRegistered
                    && x.User.IsActive
                    && x.User.LastSeen.Date <= sixMonthsAgo));
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_removed))
            {
                filteredUsers.AddRange(coachModels.Where(x => x.User.IsActive == false).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_authentication))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_connection))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_insufficient_credits))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_opted_out))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            return connectUsageSearch.Any() ? filteredUsers.DistinctBy(x => x.Id).ToList() : coachModels;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<FileModel> CoachTemplateGenerator(
            [Service] IFileGenerationService fileService)
        {
            var fieldDefinitionSheet = $"Field Definition";
            var fieldDefinitionList = new List<List<string>>
            {
                new List<string> {"Column", "Type Description"},
                new List<string> {"Type of identification", "Text, (Must be: 'id' or 'passport')"},
                new List<string> {"ID number", "Number, (required if type of identification is 'id'; must be 13 digits)"},
                new List<string> {"Passport", "Text, (required if type of identification is 'passport')"},
                new List<string> {"First name", "Text, (required)"},
                new List<string> {"Surname", "Text, (required)"},
                new List<string> {"Cellphone number", "Number, (required, 9 or 10 digits)"},
            };

            var templateHeaderSheet = $"{TenantExecutionContext.Tenant.Modules.CoachRoleName} Template";
            var templateHeaders = new List<List<string>>()
            {
                new List<string> 
                {
                    "Type of identification",
                    "ID number",
                    "Passport",
                    "First name",
                    "Surname",
                    "Cellphone number"
                }
            };

            var spreadSheets = new Dictionary<string, List<List<string>>>() {
                { templateHeaderSheet, templateHeaders },
                { fieldDefinitionSheet, fieldDefinitionList }
            };

            var fileName = templateHeaderSheet.Replace(" ", "_");
            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }
    }
}
