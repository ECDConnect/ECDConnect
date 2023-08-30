
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.DataAccessLayer.Entities.Clubs;

namespace ECDLink.Api.CoreApi.Services.Interfaces
{
    public interface IClubService
    {
        public ClubMeeting AddCoachCircleMeeting(ClubMeetingModel input);
    }
}