using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

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
                var coachPractitioner = new CoachPractitioner
                {
                    Id = practitioner.Id,
                    UserId = practitioner.UserId,
                    ProgrammeType = practitioner.ProgrammeType
                };

                // let's make sure that the default visits are added when the smartSpace license is available
                var isAdded = visitManager.ValidateDefaultVisitsForPractitioner(practitioner.UserId);
                if (isAdded)
                {
                    coachPractitioner.timeline = personnelService.GetPractitionerTimeline(practitioner.UserId);
                }
                coachPractitioners.Add(coachPractitioner);
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
        public string GetCoachNameByUserId([Service] UserManager<ApplicationUser> userManager,
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
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);

            List<Child> children = new List<Child>();
            var dbRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = dbRepo.GetAll().Where(x => x.CoachHierarchy.HasValue).ToList();
            practitioners.Where(x => x.CoachHierarchy.Equals(userId)).ToList();
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
            practitioners.Where(x => x.CoachHierarchy.Equals(userId)).ToList();
            foreach (var practioner in practitioners)
            {
                List<Classroom> practitionerClasses = classRepo.GetAll().Where(x => x.UserId.Contains(practioner.UserId)).ToList();
                classrooms.AddRange(practitionerClasses);
            }
            return classrooms;
        }

        public List<ClassroomGroup> GetAllClassroomGroupsForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);

            var userIdGuid = new Guid(userId);

            List<ClassroomGroup> classrooms = new List<ClassroomGroup>();
            var dbRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = dbRepo.GetAll().Where(x => x.CoachHierarchy.Equals(userIdGuid)).ToList();
            foreach (var practioner in practitioners)
            {
                var practinionerUserIdGuid = new Guid(practioner.UserId);
                List<ClassroomGroup> practitionerClasses = classRepo.GetAll().Where(x => x.UserId.Equals(practinionerUserIdGuid)).ToList();
                classrooms.AddRange(practitionerClasses);
            }
            return classrooms;
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

            List<Club> allClubs = clubRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).OrderBy(x => x.Name).ToList();
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

        // TODO this is used on the coach redux store, but then not anywhere else. Investigate and remove
        public List<CoachingClubBase> GetAllClubsForCoach([Service] IClubService clubService, string userId)
        {
            return clubService.GetAllClubsForCoach(userId);
        }

        public List<ClubMember> GetClubsMembers([Service] IClubService clubService, Guid[] clubIds)
        {
            return clubService.GetClubsMembers(clubIds);
        }       
    }
}
