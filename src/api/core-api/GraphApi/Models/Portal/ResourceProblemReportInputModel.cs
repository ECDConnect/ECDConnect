namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class ResourceProblemReportInputModel
    {
        public int ContentId { get; set; }
        public string ProblemType { get; set; }
        public string AdditionalDetails { get; set; }
        public string DataFreeAtReport { get; set; }
        public string LinkAtReport { get; set; }
    }
}