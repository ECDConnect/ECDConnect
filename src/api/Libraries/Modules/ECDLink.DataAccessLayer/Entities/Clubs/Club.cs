using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(Club))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Club : Club<Guid>
    {       
    }

    public class Club<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public int NumberOfMembers { get; set; }
        public string? UserId { get; set; }
        
        public virtual ICollection<ClubMeeting> ClubMeetings { get; set; }
        
        // Coaching Circle fields
        [NotMapped]
        public string CCMeetingStatus { get; set; } = "No coaching circles held yet";
        [NotMapped]
        public string CCMeetingStatusColor { get; set; } = MetricsColorEnum.Error.ToString();


    }

    public interface ClubJoin<TKey>
    {
        [ForeignKey(nameof(ClubId))]
        public Club Club { get; set; }
        public TKey ClubId { get; set; }
    }
}
