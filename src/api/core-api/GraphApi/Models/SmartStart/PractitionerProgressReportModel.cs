using ECDLink.DataAccessLayer.Entities.Reports;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.SmartStart
{
    public class PractitionerProgressReportModel
    {
        public string UserId { get; set; }
        public int TotalChildren { get; set; }
        public int TotalReports { get; set; }
        public bool HasClassrooms { get; set; }
    }
}
