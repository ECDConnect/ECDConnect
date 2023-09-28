using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services
{
    public class ClubService : IClubService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private readonly IGenericRepository<Club, Guid> _clubRepo;
        private readonly IGenericRepository<ClubMeeting, Guid> _clubMeetingRepo;
        private readonly IGenericRepository<ClubMeetingRegister, Guid> _clubMeetingRegisterRepo;
        private readonly IGenericRepository<MeetingType, Guid> _meetingTypeRepo;
        private readonly IGenericRepository<ClubMember, Guid> _clubMemberRepo;
        private readonly IGenericRepository<ClubLeader, Guid> _clubLeaderRepo;
        private readonly IGenericRepository<ClubSupport, Guid> _clubSupportRepo;
        private readonly IGenericRepository<Coach, Guid> _coachRepo;
        private readonly IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private readonly IGenericRepository<League, Guid> _leagueRepo;

        private readonly string _applicationUserId;


        INotificationService _notificationService;
        UserManager<ApplicationUser> _userManager;

        public ClubService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            [Service] UserManager<ApplicationUser> userManager
            )
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser()?.Id;

            _clubRepo = _repositoryFactory.CreateGenericRepository<Club>(userContext: _applicationUserId);
            _clubMeetingRepo = _repositoryFactory.CreateGenericRepository<ClubMeeting>(userContext: _applicationUserId);
            _clubMeetingRegisterRepo = _repositoryFactory.CreateGenericRepository<ClubMeetingRegister>(userContext: _applicationUserId);
            _meetingTypeRepo = _repositoryFactory.CreateGenericRepository<MeetingType>(userContext: _applicationUserId);
            _clubMemberRepo = _repositoryFactory.CreateGenericRepository<ClubMember>(userContext: _applicationUserId);
            _clubLeaderRepo = _repositoryFactory.CreateGenericRepository<ClubLeader>(userContext: _applicationUserId);
            _clubSupportRepo = _repositoryFactory.CreateGenericRepository<ClubSupport>(userContext: _applicationUserId);
            _coachRepo = _repositoryFactory.CreateGenericRepository<Coach>(userContext: _applicationUserId);
            _leagueRepo = _repositoryFactory.CreateGenericRepository<League>(userContext: _applicationUserId);
            _practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);

            _notificationService = notificationService;
            _userManager = userManager;
        }

        public ClubMeeting AddCoachCircleMeeting(ClubMeetingModel input)
        {
            Guid meetingTypeId = _meetingTypeRepo.GetAll().Where(x => x.Name == Constants.CoachingCircleSettings.meeting_type_coach_circle).Select(x => x.Id).FirstOrDefault();
            List<ClubMeetingRegister> participants = new List<ClubMeetingRegister>();

            // insert club meeting
            ClubMeeting clubMeeting = _clubMeetingRepo.Insert(new ClubMeeting
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.UtcNow,
                UpdatedBy = _applicationUserId,
                MeetingDate = input.MeetingDate,
                Name = input.Name,
                ClubId = input.ClubId,
                ContentValueId = input.ContentValueId,
                MeetingTypeId = meetingTypeId,
                MeetingNotes = input.MeetingNotes
            });
            
            // insert participants for club  meeting
            foreach (var participant in input.ClubMeetingParticipants)
            {
                participants.Add(new ClubMeetingRegister {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    InsertedDate = DateTime.UtcNow,
                    UpdatedBy = _applicationUserId,
                    PractitionerId = participant.PractitionerId,
                    Attended = participant.Attended,
                    ClubMeetingId = clubMeeting.Id
                });
            }
            _clubMeetingRegisterRepo.InsertMany(participants);
            return clubMeeting;
        }

        public bool IsClubLeader(Guid practitionerId)
        {
            ClubLeader clubLeader = _clubLeaderRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.IsActive == true && x.DateAccepted.HasValue).FirstOrDefault();
            return clubLeader == null? false: true;
        }

        public bool IsClubSupport(Guid practitionerId)
        {
            ClubSupport clubSupport = _clubSupportRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.IsActive == true && x.DateAccepted.HasValue).FirstOrDefault();
            return clubSupport == null ? false : true;
        }

        public List<ClubLeader> GetLeadersForClub(Guid clubId)
        {
            return _clubLeaderRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true).OrderBy(x => x.DateAssigned).ToList();
        }

        public ClubSupport GetSupportForClub(Guid clubId)
        {
            return _clubSupportRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true && x.DateAccepted.HasValue).FirstOrDefault();
        }

        public ClubMember GetClubForPractitioner(Guid practitionerId)
        {
            return _clubMemberRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.IsActive == true).FirstOrDefault();
        }

        public Coach GetCoachForClub(string userId)
        {
            return _coachRepo.GetByUserId(userId);
        }

        public PractitionerAttendance GetPractitionerAttendance(Guid practitionerId, DateTime date, string meetingType)
        {
            List<ClubMeetingRegister> practitionerAttendance = _clubMeetingRegisterRepo.GetAll().Where(x => x.PractitionerId == practitionerId &&
                                                                                                       x.ClubMeeting.MeetingDate.Value.Year == date.Year &&
                                                                                                       x.ClubMeeting.MeetingType.Name == meetingType)
                                                                                                    .OrderByDescending(x => x.ClubMeeting.MeetingDate).ToList();
            PractitionerAttendance attendance = new PractitionerAttendance();
            if (practitionerAttendance.Count > 0)
            {
                attendance.TotalMeetings = practitionerAttendance.Select(x => x.ClubMeeting.Id).Distinct().Count();
                attendance.TotalPresent = practitionerAttendance.Where(x => x.Attended == true).Count();
                attendance.PercAttended = (double)attendance.TotalPresent / (double)attendance.TotalMeetings * 100;
                if (attendance.TotalPresent > 0)
                {
                    attendance.AttendanceText = practitionerAttendance.GetItemByIndex(0).ClubMeeting.MeetingDate.Value.ToString();
                    // setting the color on parent from where this is called, because different rules are implemented for different meeting types
                    attendance.AttendanceColor = "";
                }
                attendance.MeetingRegister = practitionerAttendance;
            }

            return attendance;
        }

        public List<ClubMember> GetClubMembers(Guid clubId)
        {
            return _clubMemberRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true).ToList();
        }

        public double GetClubAttendanceForMonth(Guid clubId, DateTime date)
        {
            double attendance = 0.0;
            int totalMembers = _clubMemberRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true).Count();
            int totalAttended = _clubMeetingRegisterRepo.GetAll().Where(x => x.ClubMeeting.MeetingDate.Value.Year == date.Year &&
                                                                            x.ClubMeeting.MeetingDate.Value.Month == date.Month &&
                                                                            x.ClubMeeting.MeetingType.Name == Constants.ClubSettings.meeting_type_club_meeting &&
                                                                            x.IsActive == true && x.Attended == true).Count();

            if (totalMembers > 0) {
                attendance = ((double) totalAttended / (double) totalMembers) * 100;
            }
            
            return attendance;
        }

        public bool HasAttendanceRegisterForMonth(Guid clubId, DateTime date)
        {
            int totalRegister = _clubMeetingRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true &&
                                                                x.MeetingDate.Value.Year == date.Year &&
                                                                x.MeetingDate.Value.Month == date.Month &&
                                                                x.MeetingType.Name == Constants.ClubSettings.meeting_type_club_meeting &&
                                                                x.ClubMeetingRegister.Count > 0).Count();


            return totalRegister > 0;
        }

        public Club ChangeClubName(Guid clubId, string clubName)
        {
            Club club = _clubRepo.GetById(clubId);
            club.Name = clubName;
            return _clubRepo.Update(club);
        }

        public async Task<ClubLeader> AddNewClubLeader(Guid clubId, Guid practitionerId)
        {
            ClubLeader clubLeader = _clubLeaderRepo.Insert(
                new ClubLeader()
                {
                    Id = Guid.NewGuid(),
                    ClubId = clubId,
                    PractitionerId = practitionerId,
                    InsertedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow,
                    UpdatedBy = _applicationUserId,
                    DateAssigned = DateTime.UtcNow,
                    IsActive = true
                });

            // Add notification for new club leader assignment
            Practitioner practitioner = _practitionerRepo.GetById(practitionerId);
            Club club = _clubRepo.GetById(clubId);

            List<TagsReplacements> replacements = new List<TagsReplacements>
            {
                new TagsReplacements()
                {
                    FindValue = "ClubName",
                    ReplacementValue = club.Name
                }
            };

            var userToSend = await _userManager.FindByIdAsync(practitioner.UserId);
            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ClubLeaderRoleAssigned, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(31));

            // TODO: notifications to members
            return clubLeader;
        }

        public bool AddNewClubMembers(NewClubMember input)
        {
            List<ClubMember> members = new List<ClubMember>();
            foreach (var Id in input.PractitionerIds)
            {
                members.Add(new ClubMember
                {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    InsertedDate = DateTime.UtcNow,
                    DateClubJoined = DateTime.UtcNow,
                    UpdatedBy = _applicationUserId,
                    PractitionerId = new Guid(Id),
                    ClubId = new Guid(input.ClubId),
                    IsNewInClub = true
                });
            }
            _clubMemberRepo.InsertMany(members);

            // TODO: Add notification
            return true;
        }

        public bool MoveClubMembers(NewClubMember input)
        {
            ClubMember clubMember = new ClubMember();
            foreach (var Id in input.PractitionerIds)
            {
                clubMember = _clubMemberRepo.GetAll().Where(x => x.PractitionerId.ToString() == Id).FirstOrDefault();
                clubMember.IsNewInClub = true;
                clubMember.ClubId = new Guid(input.ClubId);
                clubMember.UpdatedBy = _applicationUserId;
                clubMember.UpdatedDate = DateTime.UtcNow;
                clubMember.DateClubJoined = DateTime.UtcNow;
                _clubMemberRepo.Update(clubMember);
            }

            // TODO: Add notification
            return true;
        }

        public ClubLeader AcceptNewClubLeaderRole(Guid clubId, Guid practitionerId)
        {
            List<ClubLeader> clubLeaders = _clubLeaderRepo.GetAll().Where(x => x.ClubId == clubId).OrderBy(x => x.InsertedDate).ToList();
            ClubLeader newClubLeader = clubLeaders.Where(x => x.ClubId == clubId && x.IsActive == true && x.PractitionerId == practitionerId && !x.DateAccepted.HasValue).FirstOrDefault();
            ClubLeader oldClubLeader = clubLeaders.Where(x => x.ClubId == clubId && x.IsActive == true && x.DateAccepted.HasValue).OrderBy(x => x.DateAccepted).FirstOrDefault();

            // Set new club leader
            newClubLeader.DateAccepted = DateTime.UtcNow;
            newClubLeader.UpdatedDate = DateTime.UtcNow;
            newClubLeader.UpdatedBy = _applicationUserId;
            _clubLeaderRepo.Update(newClubLeader);

            // Archive other club leader
            oldClubLeader.DateAccepted = DateTime.UtcNow;
            oldClubLeader.UpdatedDate = DateTime.UtcNow;
            oldClubLeader.UpdatedBy = _applicationUserId;
            oldClubLeader.IsActive = false;
            _clubLeaderRepo.Update(oldClubLeader);

            // TODO: Add notification

            return newClubLeader;
        }

        public Club AddNewClub(NewClubInput input)
        {
            Club newClub = new Club()
            {
                Id = Guid.NewGuid(),
                Name = input.Name,
                UserId = input.UserId,
                InsertedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                UpdatedBy = _applicationUserId,
                IsActive = true
            };
            Club club = _clubRepo.Insert(newClub);

            List<ClubMember> newMembers = new List<ClubMember>();
            if (input.NewClubMembers.Count > 0)
            {
                foreach (var Id in input.NewClubMembers)
                {
                    newMembers.Add(new ClubMember
                    {
                        Id = Guid.NewGuid(),
                        IsActive = true,
                        InsertedDate = DateTime.UtcNow,
                        UpdatedDate = DateTime.UtcNow,
                        UpdatedBy = _applicationUserId,
                        ClubId = club.Id,
                        PractitionerId = new Guid(Id),
                        IsNewInClub = true,
                        DateClubJoined = DateTime.UtcNow
                    });
                }
                _clubMemberRepo.InsertMany(newMembers);
            }

            if (input.TransferredClubMembers.Count > 0)
            {
                ClubMember clubMember = new ClubMember();
                foreach (var Id in input.TransferredClubMembers)
                {
                    clubMember = _clubMemberRepo.GetAll().Where(x => x.PractitionerId.ToString() == Id).FirstOrDefault();

                    clubMember.IsNewInClub = true;
                    clubMember.ClubId = club.Id;
                    clubMember.DateClubJoined = DateTime.UtcNow;
                    clubMember.UpdatedDate = DateTime.UtcNow;
                    clubMember.UpdatedBy = _applicationUserId;
                    _clubMemberRepo.Update(clubMember);
                }
             }

            return club;
        }

        public List<LeagueClub> GetAllLeagues(string userId)
        {
            List<LeagueClub> leagueClubs = new List<LeagueClub>();

            // Get all league ids in use - must be restricted
            List<Guid?> activeLeagueIds = _clubRepo.GetAll().Where(x => x.IsActive && x.LeagueId != null && x.UserId != null).Select(x => x.LeagueId).Distinct().ToList();
            
            // get leagues and order by purple, new stars and then rising stars
            List<League> leagues = _leagueRepo.GetAll().Where(x => activeLeagueIds.Contains(x.Id)).
                OrderBy(x => x.LeagueType.Name == Constants.ClubSettings.name_purple).
                ThenBy(x => x.LeagueType.Name == Constants.ClubSettings.name_new_stars).
                ThenBy(x => x.LeagueType.Name == Constants.ClubSettings.name_rising_stars).
                Distinct().
                ToList();

            LeagueClub leagueClub = new LeagueClub();
            LeagueClubDetail leagueClubDetail = new LeagueClubDetail();
            foreach (var item in leagues)
            {
                leagueClub = new LeagueClub();
                leagueClub.Id = item.Id;
                leagueClub.Name = item.Name;
                leagueClub.LeagueType = item.LeagueType;
                leagueClub.Clubs = new List<LeagueClubDetail>();

                List<Club> clubs = _clubRepo.GetAll().Where(x => x.LeagueId == item.Id && x.IsActive == true).ToList();
                foreach (var club in clubs) {
                    leagueClubDetail = new LeagueClubDetail();
                    leagueClubDetail.Id = club.Id;
                    leagueClubDetail.UserId = club.UserId;
                    leagueClubDetail.Name = club.Name;
                    leagueClubDetail.CoachName = "Coach: " + club.User.FullName;
                    if (club.User.Id == userId)
                    {
                        leagueClubDetail.CoachName = "Coach: You";
                    }
                    leagueClubDetail.Points = 0;
                    leagueClubDetail.ClubPosition = 0;
                    leagueClub.Clubs.Add(leagueClubDetail);
                 }

                leagueClubs.Add(leagueClub);
            }

            return leagueClubs;
        }

        public List<CoachingClubBase> GetAllClubsForCoach(string userId)
        {
            List<Club> clubs = _clubRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).OrderBy(x => x.Name).ToList();

            List<CoachingClubBase> result = new List<CoachingClubBase>();
            foreach (var club in clubs)
            {
                result.Add(
                    new CoachingClubBase()
                    {
                        Id = club.Id,
                        Name = club.Name,
                        UserId = club.UserId
                    }
                );
            }

            return result;
        }

        public List<CoachingClub> GetAllClubsDetailsForCoach(string userId, string clubId = null)
        {
            var secondaryText = "";
            var secondaryTextColor = "";
            int maxClubPoints = 2000;
            int totalClubPoints = 0;
            string leaguePosition = ""; // this is coming from SL integration - column missing on club at the moment
            DateTime today = DateTime.UtcNow;
            DateTime prevMonth = today.AddMonths(-1);

            List<Club> clubs = _clubRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).OrderBy(x => x.Name).ToList();
            if (clubId != null) //filter if we have a specific club to filter on
                clubs = clubs.Where(c => c.Id.ToString() == clubId).ToList();

            List<CoachingClub> result = new List<CoachingClub>();
            foreach (var club in clubs)
            {
                List<ClubMember> members = GetClubMembers(club.Id);
                double clubAttendance = GetClubAttendanceForMonth(club.Id, prevMonth);
                bool hasAttendanceRegister = HasAttendanceRegisterForMonth(club.Id, prevMonth);
                List <ClubLeader> clubLeaders = GetLeadersForClub(club.Id); // there can be 2 active club leaders.  One appointed and then a newly appointed one who has not accepted yet. 
                ClubSupport clubSupport = GetSupportForClub(club.Id);
                Coach coach = GetCoachForClub(club.UserId);
                
                ClubLeader activeClubLeader = clubLeaders.Where(x => x.IsActive == true && x.DateAccepted.HasValue).FirstOrDefault();

                // Secondary Text in Priority Desc Order

                // Priority 16 - Club not in league->show this if the club is not currently assigned to a league(acc.to SmartLink);
                // please note that all clubs begin the year ""not in a league"" and are only assigned to leagues from 1 April."
                // TODO: need to add cronjob to remove all clubs from leagues on 1 Jan
                if (club.LeagueId != null)
                {
                    secondaryText = Constants.ClubSettings.club_not_in_league;
                    secondaryTextColor = MetricsColorEnum.None.ToString();
                }

                // Priority 15 - Purple club->show if the club is a ""purple club""(acc.to SmartLink)
                if (club.LeagueId != null && club.League.LeagueType.Name == Constants.ClubSettings.name_purple)
                {
                    secondaryText = Constants.ClubSettings.club_purple;
                    secondaryTextColor = MetricsColorEnum.None.ToString();
                    maxClubPoints = 2200;
                }

                // Priority 14 - Top of the league! ->show this if the club has position #1 in the league they are in.
                // TODO: C1 next phase development for points engine

                // Priority 13 - X % club attendance in Nov(green)->show if the club's meeting attendance was 80% or more in the previous month;
                // X = the attendance % for the previous month; Nov = the previous month
                if (clubAttendance >= 80)
                {
                    secondaryText = clubAttendance + Constants.ClubSettings.club_attendance + prevMonth.Month;
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
                if (clubAttendance >= 60 && clubAttendance < 80)
                {
                    secondaryText = clubAttendance + Constants.ClubSettings.club_attendance + prevMonth.Month;
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
                if (clubAttendance < 60)
                {
                    secondaryText = clubAttendance + Constants.ClubSettings.club_attendance + prevMonth.Month;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                }

                // Priority 5 - Missing club meeting register->attendance register was not submitted for the previous month
                if (!hasAttendanceRegister)
                {
                    secondaryText = Constants.ClubSettings.missing_register;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                }

                // Priority 4 - Choose a new club leader->If a practitioner has been a club leader of the club for more than 6 months
                if (activeClubLeader != null)
                {
                    DateTime clubLeaderLengthDate = activeClubLeader.DateAccepted.Value.AddMonths(6);
                    if (clubLeaderLengthDate.Date >= today.Date)
                    {
                        secondaryText = Constants.ClubSettings.choose_club_leader;
                        secondaryTextColor = MetricsColorEnum.Error.ToString();
                    }
                }
                // Priority 3 - Too many club members -> show if there are more than 17 practitioners in the club(counting all practitioners in the club; NOT counting the coach)
                if (members.Count > 17)
                {
                    secondaryText = Constants.ClubSettings.too_many_club_members;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                }
                // Priority 2 - Not enough club members->show if there are less than 4 practitioners in the club(counting all practitioners in the club; NOT counting the coach)
                if (members.Count <= 4)
                {
                    secondaryText = Constants.ClubSettings.not_enough_club_members;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                }
                // Priority 1 - No club leader->IF the club does not have a club leader assigned
                if (activeClubLeader == null)
                {
                    secondaryText = Constants.ClubSettings.no_club_leader;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                }

                List<ClubMeeting> clubMeetings = new List<ClubMeeting>();
                List<ClubActivity> clubActivities = new List<ClubActivity>
                {
                    // tmp implementation until we get to the development of activities
                    new ClubActivity() { Name = "Meet regularly", Points = 100 },
                    new ClubActivity() { Name = "Be creative", Points = 80 },
                    new ClubActivity() { Name = "Host family days", Points = 120 },
                    new ClubActivity() { Name = "Leave no one behind", Points = 60 }
                };

                result.Add(
                    new CoachingClub()
                    {
                        Id = club.Id,
                        Name = club.Name,
                        UserId = club.UserId,
                        SecondaryText = secondaryText,
                        SecondaryTextColor = secondaryTextColor,
                        ClubLeaders = clubLeaders,
                        ClubSupport = clubSupport,
                        ClubMembers = members,
                        Coach = coach,
                        League = club.League,
                        MaxClubPoints = maxClubPoints,
                        TotalClubPoints = totalClubPoints,
                        LeaguePosition = leaguePosition,
                        ClubMeetings = clubMeetings,
                        ClubActivities = clubActivities,
                        ClickedClubTab = coach.ClickedClubTab.HasValue ? coach.ClickedClubTab : false                      
                    }
                );
            }

            return result;
        }


    }
}
