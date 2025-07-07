using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CommunityConnectInputModel
    {
        public Guid FromCommunityProfileId { get; set; }
        public Guid ToCommunityProfileId { get; set; }
    }
}
