using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class JourneyTimeline
    {
        public string Name { get; set; }
        public string DateCompleted { get; set; }
        public string IconName { get; set; }
        public DateTime DateValue { get; set; }

    }
}
