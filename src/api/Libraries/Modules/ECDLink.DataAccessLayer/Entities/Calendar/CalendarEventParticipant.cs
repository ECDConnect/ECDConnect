using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security.Attributes;
using ECDLink.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using HotChocolate;

namespace ECDLink.DataAccessLayer.Entities.Calendar
{
    [Table(nameof(CalendarEventParticipant))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class CalendarEventParticipant : CalendarEventParticipant<Guid>
    {

    }

    public class CalendarEventParticipant<TKey> : EntityBase<TKey>, CalendarEventJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        [GraphQLIgnore]
        public TKey CalendarEventId { get; set; }
        [ForeignKey(nameof(CalendarEventId))]
        [GraphQLIgnore]
        public virtual CalendarEvent CalendarEvent { get; set; }
        [ForeignKey(nameof(ParticipantUserId))]
        public virtual ApplicationUser ParticipantUser { get; set; }
        public Guid? ParticipantUserId { get; set; }
        [ForeignKey(nameof(UserId))] 
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
    }

    public interface CalendarEventParticipantJoin<TKey>
    {
        [ForeignKey(nameof(CalendarEventParticipantId))]
        public CalendarEventParticipant CalendarEventParticipant { get; set; }
        public TKey CalendarEventParticipantId { get; set; }
    }
}
