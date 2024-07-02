using ECDLink.DataAccessLayer.Entities.Community;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CommunityProfileModel: CommunityProfileBaseModel
    {
        public Guid? CoachUserId { get; set; }
        public string CoachName { get; set; }
        public bool? ClickedECDHeros { get; set; }
        public List<CommunityConnectionModel> AcceptedConnections { get; set; }
        public List<CommunityConnectionModel> PendingConnections { get; set; }

        public CommunityProfileModel(CommunityProfile profile, List<CommunityConnectionModel> acceptedConnections, List<CommunityConnectionModel> pendingConnections, List<string> userRoles)
            : base(profile, userRoles)
        {
            ClickedECDHeros = profile.ClickedECDHeros;
            AcceptedConnections = acceptedConnections;
            PendingConnections = pendingConnections;
            CoachUserId = profile.FromUser.coachObjectData != null ? profile.FromUser.coachObjectData.User.Id : null;
            CoachName = profile.FromUser.coachObjectData != null ? profile.FromUser.coachObjectData.User.FullName : "";
        }

        public CommunityProfileModel()
        {
        }
    }

    public class CommunityConnectionModel : CommunityProfileBaseModel
    {
        public CommunityConnectionModel(CommunityProfile profile, List<string> userRoles) :
            base(profile, userRoles)
        {
        }

        public CommunityConnectionModel()
        {
        }
    }
}
