using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
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
        public List<Practitioner> GetAllPractitionersForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] PersonnelService personnelService,
            [Service] VisitManager visitManager,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var practitioners = dbRepo.GetAll().Where(x => x.IsActive && x.CoachHierarchy.HasValue && x.CoachHierarchy.Value == Guid.Parse(userId)).ToList();

            foreach (var practitioner in practitioners)
            {
                // let's make sure that the default visits are added when the smartSpace license is available
                var isAdded = visitManager.ValidateDefaultVisitsForPractitioner(practitioner.UserId);
                if (isAdded)
                {
                    practitioner.timeline = personnelService.GetPractitionerTimeline(practitioner.UserId);
                }
            }
            return practitioners;
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

            List<Club> all_clubs = clubRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).OrderBy(x => x.Name).ToList();
            List<Club> clubs_with_no_meetings = all_clubs.Where(x => x.UserId == userId && x.ClubMeetings.Count == 0 && x.IsActive == true).OrderBy(x => x.Name).ToList();
            List<Club> clubs_with_meetings = all_clubs.Where(x => x.UserId == userId && x.ClubMeetings.Count > 0 && x.IsActive == true).OrderBy(x => x.Name).ToList();

            // Setting secondary text for each club
            foreach (var club in clubs_with_meetings)
            {
                ClubMeeting latest_meeting_inside_quarter = club.ClubMeetings.Where(x => x.IsActive == true && x.MeetingDate.Value.Date >= startDate && x.MeetingDate.Value.Date <= endDate && x.MeetingType.Name ==  Constants.CoachingCircleSettings.meeting_type_coach_circle).OrderByDescending(x => x.MeetingDate).FirstOrDefault();
                ClubMeeting latest_meeting_outside_quarter = club.ClubMeetings.Where(x => x.IsActive == true && x.MeetingDate.Value.Date < startDate && x.MeetingType.Name == Constants.CoachingCircleSettings.meeting_type_coach_circle).OrderByDescending(x => x.MeetingDate).FirstOrDefault();

                if (latest_meeting_inside_quarter != null)
                {
                    club.CCMeetingStatus = Constants.CoachingCircleSettings.circle_meetings_held + latest_meeting_inside_quarter.MeetingDate;
                    club.CCMeetingStatusColor = MetricsColorEnum.Success.ToString();
                } 
                else
                {
                    if (latest_meeting_outside_quarter != null)
                    {
                        club.CCMeetingStatus = Constants.CoachingCircleSettings.no_circle_meetings_held + latest_meeting_outside_quarter.MeetingDate;
                        club.CCMeetingStatusColor = MetricsColorEnum.Error.ToString();
                    }
                }
            }

            CircleTabClubs result = new CircleTabClubs();
            result.ClubsWithNoLinkedMeetings = clubs_with_no_meetings;
            result.ClubsWithLinkedMeetings = clubs_with_meetings;

            return result;
        }

        public List<Club> GetAllClubsForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var clubRepo = repoFactory.CreateRepository<Club>(userContext: uId);
            return clubRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).OrderBy(x => x.Name).ToList();
        }


        }
}
