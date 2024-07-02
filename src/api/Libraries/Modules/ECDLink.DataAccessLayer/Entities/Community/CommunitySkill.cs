using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Community
{
    [Table(nameof(CommunitySkill))]
    public class CommunitySkill : CommunitySkill<Guid>
    {
    }

    public class CommunitySkill<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageName { get; set; }
        public int Ordering { get; set; }
    }

    public interface CommunitySkillJoin<TKey>
    {
        [ForeignKey(nameof(CommunitySkillId))]
        public CommunitySkill CommunitySkill { get; set; }
        public TKey CommunitySkillId { get; set; }
    }
    
}
