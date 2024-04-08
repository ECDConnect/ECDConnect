using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class PortalReferralModel
    {
        public Guid VisitId { get; set; }
        public Guid VisitDataStatusId { get; set; }
        public string Type { get; set; }
        public string Client { get; set; }
        public string HealthCareWorker { get; set; }
        public Guid HealthCareWorkerId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public bool IsCompleted { get; set; }
        public string Text { get; set; }
        public bool IsBackReferralCompleted { get; set; }
        public string HealthCareWorkerBackReferralNote { get; set; }
        public string AdminBackReferralNote { get; set; }
    }
}
