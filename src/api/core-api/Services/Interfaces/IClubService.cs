
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using System;
using System.Collections.Generic;

namespace ECDLink.Api.CoreApi.Services.Interfaces
{
    public interface IClubService
    {
        public PractitionerAttendance GetPractitionerAttendance(Guid practitionerId, DateTime date, string meetingType);
        public double GetClubAttendancePercForMonth(Guid clubId, DateTime date);
        public bool HasAttendanceRegisterForMonth(Guid clubId, DateTime date);
        public List<ClubMember> GetClubMembers(Guid clubId);
        public List<ClubMember> GetClubsMembers(Guid[] clubId);
        public List<CoachingClubBase> GetAllClubsForCoach(string userId);
        public List<LeagueClub> GetAllLeagues(string userId);
        public List<ClubLeader> GetLeadersForClub(Guid clubId);
        public ClubSupport GetSupportForClub(Guid clubId);
        public ClubMember GetClubForPractitioner(Guid practitionerId);
        public Club ChangeClubName(Guid clubId, string clubName);
        public bool IsClubLeader(Guid practitionerId);
        public bool IsClubSupport(Guid practitionerId);
        public ClubMeeting AddClubMeeting(ClubMeetingModel input, string meetingType);
        public ClubLeader AddNewClubLeader(Guid clubId, Guid practitionerId);
        public bool AddNewClubMembers(NewClubMember input);
        public bool MoveClubMembers(NewClubMember input);
        public bool AcceptNewClubLeaderRole(Guid clubId, Guid practitionerId, Guid clubSupportPractitionerId);
        public bool RejectNewClubLeaderRole(Guid clubId, Guid practitionerId);
        public bool ChangeClubSupportRole(Guid clubId, Guid practitionerId);
        public Club AddNewClub(NewClubInput input);
        public bool SaveWelcomeMessage(Guid clubId, Guid practitionerId, string welcomeMessage);
        public bool UpdateNewMemberStatus(Guid clubId, Guid practitionerId);
        public ActivityMeetRegular GetActivityMeetRegularDetails(Guid clubId, int month, int year);
        public ActivityBeCreative GetActivityBeCreativeDetails(Guid clubId);
        public ActivityHostFamilyDays GetActivityHostFamilyDetails(Guid clubId);
        public ActivityLeaveNoOneBehind GetActivityLeaveNoOneBehindDetails(Guid clubId);
        public ActivityChildAttendance GetActivityChildAttendance(Guid clubId);
        public ActivityChildProgress GetActivityChildProgress(Guid clubId);
        ClubModel GetClubForUser(string userId);
        IEnumerable<DetailClubModel> GetClubsForCoach(string coachUserId);
        DetailClubModel GetClubById(Guid clubId);
        public bool AddBeCreativeActivity(BeCreativeUpload input);
    }
}