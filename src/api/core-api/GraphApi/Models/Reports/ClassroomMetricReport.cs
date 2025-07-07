namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClassroomMetricReport
    {
        public string PractitionerId { get; set; }
        public int ChildCount { get; set; }
        public int AttendancePercentage { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int WeekOfYear { get; set; }
        public string ClassroomGroupId { get; set; }
        public string ClassroomId { get; set; }
    }
}
