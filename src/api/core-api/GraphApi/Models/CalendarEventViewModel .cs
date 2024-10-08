using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Calendar;
using ECDLink.DataAccessLayer.Entities.Visits;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class CalendarEventViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string EventType { get; set; }
        public Boolean AllDay { get; set; }
        public DateTime Start { get; set; }
        public string StartTime { get; set; }
        public DateTime End { get; set; }
        public string EndTime { get; set; }
        public string Description { get; set; }
        public string Action { get; set; }
        public bool IsActive { get; set; }
        public Guid? UserId { get; set; }
        public ApplicationUser User { get; set; }
        public Visit Visit { get; set; }
        public virtual ICollection<CalendarEventParticipant> Participants { get; set; }

        public CalendarEventViewModel(CalendarEvent calendarEvent)
        {
            Id = calendarEvent.Id.ToString();
            Name = calendarEvent.Name;
            EventType = calendarEvent.EventType;
            AllDay = calendarEvent.AllDay;
            Start = calendarEvent.Start;
            StartTime = calendarEvent.Start.Hour.ToString() + ":" + calendarEvent.Start.Minute.ToString();
            End = calendarEvent.End;
            EndTime = calendarEvent.End.Hour.ToString() + ":" + calendarEvent.End.Minute.ToString();
            Description = calendarEvent.Description;
            Action = calendarEvent.Action;
            IsActive = calendarEvent.IsActive;
            UserId = calendarEvent.UserId;
            User = calendarEvent.User;
            Visit = calendarEvent.Visit;
            Participants = calendarEvent.Participants;
        }
    }
    
}
