using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security.Attributes;
using ECDLink.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections;
using System.Collections.Generic;
using ECDLink.DataAccessLayer.Entities.Visits;

namespace ECDLink.DataAccessLayer.Entities.Calendar
{
    [Table(nameof(CalendarEvent))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class CalendarEvent : CalendarEvent<Guid>
    {
    }

    public class CalendarEvent<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string EventType { get; set; }
        public Boolean AllDay { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Description { get; set; }
        public string Action { get; set; }
        public virtual ICollection<CalendarEventParticipant> Participants { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
        public virtual Visit Visit { get; set; }
	}

    public interface CalendarEventJoin<TKey>
    {
        [ForeignKey(nameof(CalendarEventId))]
        public CalendarEvent CalendarEvent { get; set; }
        public TKey CalendarEventId { get; set; }
    }
}
