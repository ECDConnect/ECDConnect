using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class ResourceLinkHealthCheckModel
    {
        public int ContentId { get; set; }
        public string ContentType { get; set; }
        public string SectionType { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public string Status { get; set; }
        public string LastCheckStatus { get; set; }
        public int? LastStatusCode { get; set; }
        public string LastError { get; set; }
        public int ConsecutiveFailureCount { get; set; }
        public DateTime? LastCheckedDate { get; set; }
    }
}
