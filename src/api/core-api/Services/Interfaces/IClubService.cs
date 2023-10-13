
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
        public double GetClubAttendanceForMonth(Guid clubId, DateTime date);
        public bool HasAttendanceRegisterForMonth(Guid clubId, DateTime date);
        public List<ClubMember> GetClubMembers(Guid clubId);
        public List<ClubMember> GetClubsMembers(Guid[] clubId);
        public List<CoachingClubBase> GetAllClubsForCoachSimple(string userId); 
        public List<CoachingClubBase> GetAllClubsForCoach(string userId);
        public List<CoachingClub> GetAllClubsDetailsForCoach(string userId, string clubId = null);
        public List<LeagueClub> GetAllLeagues(string userId);
        public List<ClubLeader> GetLeadersForClub(Guid clubId);
        public ClubSupport GetSupportForClub(Guid clubId);
        public ClubMember GetClubForPractitioner(Guid practitionerId);
        public Club ChangeClubName(Guid clubId, string clubName);
        public bool IsClubLeader(Guid practitionerId);
        public bool IsClubSupport(Guid practitionerId);
        public ClubMeeting AddCoachCircleMeeting(ClubMeetingModel input);
        public ClubLeader AddNewClubLeader(Guid clubId, Guid practitionerId);
        public bool AddNewClubMembers(NewClubMember input);
        public bool MoveClubMembers(NewClubMember input);
        public ClubLeader AcceptNewClubLeaderRole(Guid clubId, Guid practitionerId);
        public Club AddNewClub(NewClubInput input);
    }
}