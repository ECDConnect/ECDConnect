using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Community
{
    [Table(nameof(CommunityProfile))]
    [EntityPermission(PermissionGroups.USER)]
    public class CommunityProfile : CommunityProfile<Guid>
    {

    }

    public class CommunityProfile<TKey> : EntityBase<TKey>, ApplicationUserJoin
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
        public string AboutShort { get; set; }
        public string AboutLong { get; set; }
        public bool? ShareContactInfo { get; set; } = false;
        public bool? ShareEmail { get; set; } = false;
        public bool? SharePhoneNumber { get; set; } = false;
        public bool? ShareProfilePhoto { get; set; } = false;
        public bool? ShareProvince { get; set; } = false;
        public bool? ShareRole { get; set; }

        [ForeignKey(nameof(ProvinceId))]
        public virtual Province Province { get; set; }
        public Guid? ProvinceId { get; set; }
        public bool? ClickedECDHeros { get; set; } = false;
        public virtual ICollection<CommunityProfileSkill> ProfileSkills { get; set; }
    }

    public interface CommunityProfileJoin<TKey>
    {
        [ForeignKey(nameof(CommunityProfileId))]
        public CommunityProfile CommunityProfile { get; set; }
        public TKey CommunityProfileId { get; set; }
    }
    
}
