using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class AcceptRejectCommunityRequestsInputModel
    {
        public List<Guid> UserIdsToAccept { get; set; }
        public List<Guid> UserIdsToReject { get; set; }
        public Guid UserId { get; set; }
    }
}
