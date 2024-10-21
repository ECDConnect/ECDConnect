using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class CalendarEventModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string EventType { get; set; }
        public Boolean AllDay { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Description { get; set; }
        public string Action { get; set; }
        public virtual ICollection<CalendarEventParticipantModel> Participants { get; set; }
    }

    public class CalendarEventParticipantModel
    {
        public string Id { get; set; }
        public Guid ParticipantUserId { get; set; }
    }
}
