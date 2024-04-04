using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class HCWSummary
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int TotalPregnantMoms { get; set; }
        public int TotalChildren { get; set; }

        public int TotalClientsVisited { get; set; }
        public int TotalFoldersOpened { get; set; }

        public int TotalVisitsMissed { get; set; }
        public int TotalPregnantMomsWithUrgentIssues { get; set; }
        public int TotalCaregiversAndChildrenWithUrgentIssues { get; set; }

        public int TotalVisitsOverdue { get; set; }
        public int TotalPregnantMomsWithIssues { get; set; }
        public int TotalCaregiversAndChildrenWithIssues { get; set; }

        public int TotalPregnantMomsWithNoIssues { get; set; }
        public int TotalChildrenWithNoIssues { get; set; }
    }
}
