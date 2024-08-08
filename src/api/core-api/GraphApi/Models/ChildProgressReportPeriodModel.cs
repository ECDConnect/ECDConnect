using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ChildProgressReportPeriodModel
    {
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
