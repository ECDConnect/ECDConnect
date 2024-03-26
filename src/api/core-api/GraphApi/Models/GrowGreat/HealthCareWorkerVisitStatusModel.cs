using System;
using Microsoft.VisualBasic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class HealthCareWorkerVisitStatusModel
    {
        public int MotherVisitsCompletedThisMonth { get; set; }
        public int ChildVisitsCompletedThisMonth { get; set; }
        public int MotherVisitsCompletedThisYear { get; set; }
        public int ChildVisitsCompletedThisYear { get; set; }
        public int MotherOverDueVisits { get; set; }
        public int MotherDueVisits { get; set; }
        public int ChildDueVisits { get; set; }

        public DateTime? LastCompletedVisit { get; set;}
    }
}
