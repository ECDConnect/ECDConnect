using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Abstractrions.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

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


        private readonly string _uId;

        public ClubService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory
            )
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _uId = _contextAccessor.HttpContext.GetUser()?.Id;

            _clubRepo = _repositoryFactory.CreateGenericRepository<Club>(userContext: _uId);
            _clubMeetingRepo = _repositoryFactory.CreateGenericRepository<ClubMeeting>(userContext: _uId);
            _clubMeetingRegisterRepo = _repositoryFactory.CreateGenericRepository<ClubMeetingRegister>(userContext: _uId);
            _meetingTypeRepo = _repositoryFactory.CreateGenericRepository<MeetingType>(userContext: _uId);
            _clubMemberRepo = _repositoryFactory.CreateGenericRepository<ClubMember>(userContext: _uId);
            _clubLeaderRepo = _repositoryFactory.CreateGenericRepository<ClubLeader>(userContext: _uId);
            _clubSupportRepo = _repositoryFactory.CreateGenericRepository<ClubSupport>(userContext: _uId);
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
                InsertedDate = DateTime.Now,
                UpdatedBy = _uId,
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
                    InsertedDate = DateTime.Now,
                    UpdatedBy = _uId,
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

        public ClubLeader GetLeaderForClub(Guid clubId)
        {
            return _clubLeaderRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true && x.DateAccepted.HasValue).FirstOrDefault();
        }

        public ClubSupport GetSupportForClub(Guid clubId)
        {
            return _clubSupportRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true && x.DateAccepted.HasValue).FirstOrDefault();
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

        public List<CoachingClub> GetAllClubsForCoach(string userId)
        {
            var secondaryText = "";
            var secondaryTextColor = "";
            int maxClubPoints = 2000;
            int totalClubPoints = 0;
            string leaguePosition = ""; // this is coming from SL integration - column missing on club at the moment
            DateTime today = DateTime.UtcNow;
            DateTime prevMonth = today.AddMonths(-1);

            List<Club> clubs = _clubRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).OrderBy(x => x.Name).ToList();

            List<CoachingClub> result = new List<CoachingClub>();
            foreach (var club in clubs)
            {
                List<ClubMember> members = GetClubMembers(club.Id);
                double clubAttendance = GetClubAttendanceForMonth(club.Id, prevMonth);
                bool hasAttendanceRegister = HasAttendanceRegisterForMonth(club.Id, prevMonth);
                ClubLeader clubLeader = GetLeaderForClub(club.Id);
                ClubSupport clubSupport = GetSupportForClub(club.Id);

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
                if (clubLeader != null)
                {
                    DateTime clubLeaderLengthDate = clubLeader.DateAccepted.Value.AddMonths(6);
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
                if (clubLeader == null)
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
                        ClubLeader = clubLeader,
                        ClubSupport = clubSupport,
                        ClubMembers = members,
                        League = club.League,
                        MaxClubPoints = maxClubPoints,
                        TotalClubPoints = totalClubPoints,
                        LeaguePosition = leaguePosition
                    }
                );
            }

            return result;
        }


    }
}
