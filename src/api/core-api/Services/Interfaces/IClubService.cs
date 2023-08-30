
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.DataAccessLayer.Entities.Clubs;
using System;
using System.Collections.Generic;

namespace ECDLink.Api.CoreApi.Services.Interfaces
{
    public interface IClubService
    {
        public ClubMeeting AddCoachCircleMeeting(ClubMeetingModel input);
        public double GetClubAttendanceForMonth(Guid clubId, DateTime date);
        public bool HasAttendanceRegisterForMonth(Guid clubId, DateTime date);
        public List<ClubMember> GetClubMembers(Guid clubId);
    }
}