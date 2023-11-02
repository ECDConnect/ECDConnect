namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class DocumentModel
    {
        public string Reference { get; set; } // base64 string
        public string FileName { get; set; }
        public string UserId { get; set; }
        public string CreatedUserId { get; set; }

    }

    public class PdfDocumentHeader
    {
        public string UserId { get; set; }
        public string ReportType { get; set; }
        public string SiteAddress { get; set; }
        public string ClassName { get; set; }
        public string ProgrammeDays { get; set; }
        public string ProgrammeType { get; set; }
    }
}

