using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input
{
    public class AddBreastFeedingClubInputModel
    {
        public Guid HealthCareWorkerId { get; set; }
        public DateTime MeetingDate { get; set; }
        public bool ClientsAttendedConfirmed { get; set; }
        public List<Guid> Clients { get; set; }
    }
}
