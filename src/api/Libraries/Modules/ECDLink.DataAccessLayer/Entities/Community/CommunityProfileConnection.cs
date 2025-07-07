using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Community
{
    [Table(nameof(CommunityProfileConnection))]
    [EntityPermission(PermissionGroups.USER)]
    public class CommunityProfileConnection : CommunityProfileConnection<Guid>
    {
    }

    public class CommunityProfileConnection<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(FromCommunityProfileId))]
        public virtual CommunityProfile FromProfile { get; set; }
        public Guid FromCommunityProfileId { get; set; }

        [ForeignKey(nameof(ToCommunityProfileId))]
        public virtual CommunityProfile ToProfile { get; set; }
        public Guid ToCommunityProfileId { get; set; }
        public bool? InviteAccepted { get; set; }
    }

    public interface CommunityProfileConnectionJoin<TKey>
    {
        [ForeignKey(nameof(CommunityProfileConnectionId))]
        public CommunityProfileConnection CommunityProfileConnection { get; set; }
        public TKey CommunityProfileConnectionId { get; set; }
    }
    
}
