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
            var clubMeetingRepo = repoFactory.CreateRepository<ClubMeeting>(userContext: uId);

            List<Club> all_clubs = clubRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).OrderBy(x => x.Name).ToList();
            List<CircleClub> no_meetings = new List<CircleClub>();
            List<CircleClub> meetings = new List<CircleClub>();
            CircleClub _club = new CircleClub();

            foreach (var club in all_clubs)
            {
                // get all meetings for club for year
                List<ClubMeeting> _meetings = clubMeetingRepo.GetAll().Where(x => x.ClubId == club.Id &&
                                                                                x.IsActive == true &&
                                                                                x.MeetingDate.Value.Year == startDate.Year &&
                                                                                x.MeetingType.Name == Constants.CoachingCircleSettings.meeting_type_coach_circle).ToList();
                if (_meetings.Count == 0)
                {
                    _club = new CircleClub();
                    _club.Id = club.Id.ToString();
                    _club.Name = club.Name;
                    _club.ClubMeetings = _meetings;
                    no_meetings.Add(_club);
                } else
                {
                    _club = new CircleClub();
                    _club.Id = club.Id.ToString();
                    _club.Name = club.Name;
                    _club.ClubMeetings = _meetings;

                    ClubMeeting latest_meeting_inside_quarter = _meetings.Where(x => x.IsActive == true && x.MeetingDate.Value.Date >= startDate && x.MeetingDate.Value.Date <= endDate && x.MeetingType?.Name == Constants.CoachingCircleSettings.meeting_type_coach_circle).OrderByDescending(x => x.MeetingDate).FirstOrDefault();
                    ClubMeeting latest_meeting_outside_quarter = _meetings.Where(x => x.IsActive == true && x.MeetingDate.Value.Date < startDate && x.MeetingType?.Name == Constants.CoachingCircleSettings.meeting_type_coach_circle).OrderByDescending(x => x.MeetingDate).FirstOrDefault();

                    if (latest_meeting_inside_quarter != null)
                    {
                        _club.CCMeetingStatus = Constants.CoachingCircleSettings.circle_meetings_held + latest_meeting_inside_quarter.MeetingDate;
                        _club.CCMeetingStatusColor = MetricsColorEnum.Success.ToString();
                    }
                    else
                    {
                        if (latest_meeting_outside_quarter != null)
                        {
                            _club.CCMeetingStatus = Constants.CoachingCircleSettings.no_circle_meetings_held + latest_meeting_outside_quarter.MeetingDate;
                            _club.CCMeetingStatusColor = MetricsColorEnum.Error.ToString();
                        }
                    }
                    meetings.Add(_club);
                }
            }

            CircleTabClubs result = new CircleTabClubs();
            result.ClubsWithNoLinkedMeetings = no_meetings;
            result.ClubsWithLinkedMeetings = meetings;

            return result;
        }

        public List<CoachingClub> GetAllClubsForCoach(
            [Service] IClubService clubService,
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var clubRepo = repoFactory.CreateRepository<Club>(userContext: uId);
            var secondaryText = "";
            var secondaryTextColor = "";
            DateTime today = DateTime.UtcNow;
            DateTime prevMonth = today.AddMonths(-1);

            List<Club> clubs = clubRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).OrderBy(x => x.Name).ToList();

            List<CoachingClub> result = new List<CoachingClub>();
            foreach (var club in clubs)
            {
                List<ClubMember> _members = clubService.GetClubMembers(club.Id);
                double _clubAttendance = clubService.GetClubAttendanceForMonth(club.Id, prevMonth);
                bool _hasAttendanceRegister = clubService.HasAttendanceRegisterForMonth(club.Id, prevMonth);

                // Secondary Text in Priority Desc Order

                // Priority 16 - Club not in league->show this if the club is not currently assigned to a league(acc.to SmartLink);
                // please note that all clubs begin the year ""not in a league"" and are only assigned to leagues from 1 April."
                // TODO: need to add cronjob to remove all clubs from leagues on 1 Jan
                if (!club.LeagueId.HasValue)
                {
                    secondaryText = Constants.ClubSettings.club_not_in_league;
                    secondaryTextColor = MetricsColorEnum.None.ToString();
                }

                // Priority 15 - Purple club->show if the club is a ""purple club""(acc.to SmartLink)
                if (club.LeagueId.HasValue && club.League.Name == Constants.ClubSettings.name_purple)
                {
                    secondaryText = Constants.ClubSettings.club_purple;
                    secondaryTextColor = MetricsColorEnum.None.ToString();
                }

                // Priority 14 - Top of the league! ->show this if the club has position #1 in the league they are in.
                // TODO: C1 next phase development for points engine

                // Priority 13 - X % club attendance in Nov(green)->show if the club's meeting attendance was 80% or more in the previous month;
                // X = the attendance % for the previous month; Nov = the previous month
                if (_clubAttendance >= 80)
                {
                    secondaryText = _clubAttendance + Constants.ClubSettings.club_attendance + prevMonth.Month;
                    secondaryTextColor = MetricsColorEnum.Success.ToString();
                }

                // Priority 12 - X points earned in Nov(green)->show if the club earned 80 % or more of the monthly max points for the club (see club points tab for detail) ;
                // X = the number of points earned in the previous month; and Nov = the previous month(ONLY show for clubs that are currently in a league)
                // TODO: C1 next phase development for points engine

                // Priority 11 - New club -> show if the club was created within the past 3 months
                DateTime clubAge = club.InsertedDate.AddMonths(3);
                if (clubAge.Date <= today.Date)
                {
                    secondaryText = Constants.ClubSettings.new_club;
                    secondaryTextColor = MetricsColorEnum.Success.ToString();
                }

                // Priority 10 - X % club attendance in Nov(amber)->show if the club's meeting attendance was 60 to 79%, inclusive in the previous month;
                // X = the attendance % for the previous month; Nov = the previous month
                if (_clubAttendance >= 60 && _clubAttendance < 80)
                {
                    secondaryText = _clubAttendance + Constants.ClubSettings.club_attendance + prevMonth.Month;
                    secondaryTextColor = MetricsColorEnum.Warning.ToString();
                }

                // Priority 9 - X points earned in Nov(amber)->show if the club earned less than 80 % of the max points for the club (see club points tab for detail) ;
                // X = the number of points earned in the previous month; and Nov = the previous month(ONLY show for clubs that are currently in a league)
                // TODO: C1 next phase development for points engine

                // Priority 8 - 2 Jan, Attend club meeting->show if the coach has not attended a club meeting for the club in 3 months(we can pull attendance information from the calendar if/ when available)
                // (using information from Funda App only; NOT SmartLink)
                // TODO: After C3 development

                // Priority 7 - 30 Jan, Attend first club meeting -> show if there is an upcoming first club meeting is scheduled in Funda App for sometime within the next 30 day;
                // show if there has never previously been a club meeting hosted by this club; 30 Jan = the date the first meeting is scheduled for (is this possible ?
                // we can restrict this only to clubs that were created within Funda App; if the club was created and a meeting was scheduled for a future date; then this secondary text becomes relevant)
                // TODO: After C3 development

                // Priority 6 - X % club attendance in Nov(red)->show if the club's meeting attendance was less than 60% in the previous month
                // where X = if the previous month's the percentage of practitioners in the club who attended the meeting in the month; Nov = the previous month
                if (_clubAttendance < 60)
                {
                    secondaryText = _clubAttendance + Constants.ClubSettings.club_attendance + prevMonth.Month;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                }

                // Priority 5 - Missing club meeting register->attendance register was not submitted for the previous month
                if (!_hasAttendanceRegister)
                {
                    secondaryText = Constants.ClubSettings.missing_register;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                }

                // Priority 4 - Choose a new club leader->If a practitioner has been a club leader of the club for more than 6 months
                if (club.ClubLeader != null && club.ClubLeader.DateAccepted.HasValue)
                {
                    DateTime clubLeaderLengthDate  = club.ClubLeader.DateAccepted.Value.AddMonths(6);
                    if (clubLeaderLengthDate.Date >= today.Date)
                    {
                        secondaryText = Constants.ClubSettings.choose_club_leader;
                        secondaryTextColor = MetricsColorEnum.Error.ToString();
                    }
                }
                // Priority 3 - Too many club members -> show if there are more than 17 practitioners in the club(counting all practitioners in the club; NOT counting the coach)
                if (_members.Count > 17)
                {
                    secondaryText = Constants.ClubSettings.too_many_club_members;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                }
                // Priority 2 - Not enough club members->show if there are less than 4 practitioners in the club(counting all practitioners in the club; NOT counting the coach)
                if (_members.Count <= 4)
                {
                    secondaryText = Constants.ClubSettings.not_enough_club_members;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                }
                // Priority 1 - No club leader->IF the club does not have a club leader assigned
                if (club.ClubLeader == null)
                {
                    secondaryText = Constants.ClubSettings.no_club_leader;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                }

                result.Add(
                    new CoachingClub()
                    {
                        Id = club.Id,
                        Name = club.Name,
                        UserId = club.UserId,
                        SecondaryText = secondaryText,
                        SecondaryTextColor = secondaryTextColor,
                        ClubLeader = club.ClubLeader,
                        ClubSupport = club.ClubSupport
                    }
                );
            }

            return result;
        }


    }
}
