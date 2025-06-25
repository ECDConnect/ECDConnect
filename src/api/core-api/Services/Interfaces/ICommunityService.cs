using EcdLink.Api.CoreApi.GraphApi.Models.Community;
using ECDLink.DataAccessLayer.Entities.Community;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface ICommunityService
    {
        public List<SupportRatingModel> GetSupportRatings();
        public List<FeedbackTypeModel> GetFeedbackTypes();
        public List<CommunitySkillModel> GetCommunitySkills();
        public CoachFeedback SaveCoachFeedback(CoachFeedbackInputModel input);
        public CommunityProfileModel SaveCommunityProfile(CommunityProfileInputModel input);
        public CommunityProfileModel GetCommunityProfile(Guid userId);
        public List<CommunityConnectionModel> GetUsersToConnectWith(Guid userId, List<Guid> provinceIds = null, List<Guid> communitySkillIds = null, List<string> connectionTypes = null);
        public List<CommunityConnectionModel> GetOtherConnections(Guid userId, List<Guid> provinceIds = null, List<Guid> communitySkillIds = null);
        public CommunityProfileModel AcceptRejectCommunityRequests(AcceptRejectCommunityRequestsInputModel input);
        public bool DeleteCommunityProfile(Guid communityProfileId);
        public List<CommunityProfileConnection> SaveCommunityProfileConnections(List<CommunityConnectInputModel> input);
        public CommunityProfileConnection CancelCommunityRequest(CommunityConnectInputModel input);
        public bool UpdateClickedECDHeros(Guid userId);
    }
}