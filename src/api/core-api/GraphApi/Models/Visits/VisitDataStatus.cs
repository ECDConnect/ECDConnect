using ECDLink.DataAccessLayer.Entities.Visits;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Visits {
    public class VisitDataStatusModel {
        public string Id { get; set; }
        public string VisitDataId { get; set; }
        public VisitData VisitData { get; set; }
        public string Comment { get; set; }
        public string Color { get; set; }
        public string Type { get; set; }
        public Boolean? IsCompleted { get; set; }
    }

    public class VisitDataSummary {
        public string VisitSection { get; set; }
        public virtual ICollection<VisitDataStatus> VisitDataStatus { get; set; }
    }

    public class ClientSummary
    {
        public string VisitName { get; set; }
        public int Order { get; set; }
        public virtual ICollection<VisitDataStatus> SummaryData { get; set; }
        public virtual ICollection<VisitDataStatus> DocumentData { get; set; }
    }

    public class ClientSummaryByPriority
    {
        public string AreaName { get; set; }
        public int Order { get; set; }
        public string Color { get; set; }
        public virtual ICollection<VisitDataStatus> SummaryData { get; set; }
        public virtual ICollection<VisitDataStatus> DocumentData { get; set; }
    }
}


