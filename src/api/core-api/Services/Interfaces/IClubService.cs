
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using System;
using System.Collections.Generic;

namespace ECDLink.Api.CoreApi.Services.Interfaces
{
    public interface IClubService
    {
        public ClubMeeting AddCoachCircleMeeting(ClubMeetingModel input);
        public PractitionerAttendance GetPractitionerAttendance(Guid practitionerId, DateTime date, string meetingType);
        public double GetClubAttendanceForMonth(Guid clubId, DateTime date);
        public bool HasAttendanceRegisterForMonth(Guid clubId, DateTime date);
        public List<ClubMember> GetClubMembers(Guid clubId);
        public List<CoachingClub> GetAllClubsForCoach(string userId);
        public ClubLeader GetLeaderForClub(Guid clubId);
        public ClubSupport GetSupportForClub(Guid clubId);
        public Club ChangeClubName(Guid clubId, string clubName);
    }
}