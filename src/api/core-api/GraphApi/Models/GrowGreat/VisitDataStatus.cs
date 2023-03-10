using ECDLink.DataAccessLayer.Entities.Visits;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat {
    public class VisitDataStatusModel {
        public string Id { get; set; }
        public string VisitDataId { get; set; }
        public VisitData VisitData { get; set; }
        public string Comment { get; set; }
        public string Color { get; set; }
        public string Type { get; set; }
        public string IsCompleted { get; set; }
        public DateTime ReferralDateCompleted { get; set; }
        public string BackReferralCompleted { get; set; }
        public DateTime BackReferralDateCompleted { get; set; }

    }

    public class VisitDataStatusReferral {
        public virtual ICollection<VisitDataStatusModel> Referrals { get; set; }
    }

    public class Progress_VisitDataStatus {
        public string Score { get; set; }
        public virtual ICollection<VisitDataStatus> VisitDataStatus { get; set; }
    }

    public class VisitDataSummary {
        public string VisitSection { get; set; }
        public virtual ICollection<VisitDataStatus> VisitDataStatus { get; set; }
    }
}

