using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input
{
    public class AddClinicMeetingInputModel
    {
        public Guid ClinicId { get; set; }
        public Guid TeamLeadUserId { get; set; }
        public DateTime MeetingDate { get; set; }
        public string PositiveStory { get; set; }
        public string ReportingIssue { get; set; }
        public int TotalSupportVisits { get; set; }
        public List<Guid> ParticipantsOptedOutIds { get; set; }
        public List<Guid> ParticipantsInFieldIds { get; set; }
    }
   
}
