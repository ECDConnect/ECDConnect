using ECDLink.DataAccessLayer.Entities.Community;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CommunityProfileModel: CommunityProfileBaseModel
    {
        public Guid? CoachUserId { get; set; }
        public string CoachName { get; set; }
        public string CoachPhoneNumber { get; set; }
        public bool? ClickedECDHeros { get; set; }
        public decimal? CompletenessPerc { get; set; }
        public string CompletenessPercColor { get; set; }
        public string CompletenessPercImage { get; set; }
        public List<CommunityConnectionModel> AcceptedConnections { get; set; }
        public List<CommunityConnectionModel> PendingConnections { get; set; }
        

        public CommunityProfileModel(CommunityProfile profile, 
                                     List<CommunityConnectionModel> acceptedConnections, 
                                     List<CommunityConnectionModel> pendingConnections, 
                                     List<string> userRoles,
                                     decimal completenessPerc,
                                     string completenessPercColor,
                                     string completenessPercImage)
            : base(profile, userRoles)
        {
            ClickedECDHeros = profile.ClickedECDHeros;
            AcceptedConnections = acceptedConnections;
            PendingConnections = pendingConnections;
            CoachUserId = profile.User.coachObjectData != null ? profile.User.coachObjectData.User.Id : null;
            CoachName = profile.User.coachObjectData != null ? profile.User.coachObjectData.User.FullName : "";
            CoachPhoneNumber = profile.User.coachObjectData != null ? profile.User.coachObjectData.User.PhoneNumber : "";
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
