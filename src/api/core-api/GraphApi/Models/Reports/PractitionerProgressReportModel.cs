namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class PractitionerProgressReportModel
    {
        public string UserId { get; set; }
        public int TotalChildren { get; set; }
        public int TotalReports { get; set; }
        public bool HasClassrooms { get; set; }
    }
}
