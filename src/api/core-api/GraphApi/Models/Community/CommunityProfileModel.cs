using ECDLink.DataAccessLayer.Entities.Community;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CommunityProfileModel: CommunityProfileBaseModel
    {
        public Guid? CoachUserId { get; set; }
        public string CoachName { get; set; }
        public bool? ClickedECDHeros { get; set; }
        public decimal? CompletenessPerc { get; set; }
        public string CompletenessPercColor { get; set; }
        public string CompletenessPercImage { get; set; }
        public List<CommunityConnectionModel> AcceptedConnections { get; set; }
        public List<CommunityConnectionModel> PendingConnectionsTo { get; set; }
        

        public CommunityProfileModel(CommunityProfile profile, 
                                     List<CommunityConnectionModel> acceptedConnections, 
                                     List<CommunityConnectionModel> pendingConnectionsTo, 
                                     List<string> userRoles,
                                     decimal completenessPerc,
                                     string completenessPercColor,
                                     string completenessPercImage)
            : base(profile, userRoles)
        {
            ClickedECDHeros = profile.ClickedECDHeros;
            AcceptedConnections = acceptedConnections;
            PendingConnectionsTo = pendingConnectionsTo;
            CoachUserId = profile.FromUser.coachObjectData != null ? profile.FromUser.coachObjectData.User.Id : null;
            CoachName = profile.FromUser.coachObjectData != null ? profile.FromUser.coachObjectData.User.FullName : "";
            CompletenessPerc = completenessPerc;
            CompletenessPercColor = completenessPercColor;
            CompletenessPercImage = completenessPercImage;
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
