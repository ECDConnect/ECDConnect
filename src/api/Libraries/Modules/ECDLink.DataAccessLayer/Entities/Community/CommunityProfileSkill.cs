using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Community
{
    [Table(nameof(CommunityProfileSkill))]
    public class CommunityProfileSkill : CommunityProfileSkill<Guid>
    {
    }

    public class CommunityProfileSkill<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(CommunitySkillId))]
        public virtual CommunitySkill CommunitySkill { get; set; }
        public Guid CommunitySkillId { get; set; }

        [ForeignKey(nameof(CommunityProfileId))]
        public virtual CommunityProfile Profile { get; set; }
        public Guid CommunityProfileId { get; set; }
    }

    public interface CommunityProfileSkillJoin<TKey>
    {
        [ForeignKey(nameof(CommunityProfileSkillId))]
        public CommunityProfileSkill CommunityProfileSkill { get; set; }
        public TKey CommunityProfileSkillId { get; set; }
    }
    
}
