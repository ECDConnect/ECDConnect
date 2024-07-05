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
        public List<CommunityConnectionModel> GetUsersToConnectWith(Guid? provinceId, Guid? communitySkillId, string connectionType, Guid userId);
        public CommunityProfileModel AcceptRejectCommunityRequests(AcceptRejectCommunityRequestsInputModel input);
        public bool DeleteCommunityProfile(Guid communityProfileId);
    }
}