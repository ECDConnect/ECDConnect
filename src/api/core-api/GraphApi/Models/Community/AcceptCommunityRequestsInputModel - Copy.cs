using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class AcceptCommunityRequestsInputModel
    {
        public List<Guid> UserIdsToAccept { get; set; }
        public Guid UserIdAccepting { get; set; }
    }
}
