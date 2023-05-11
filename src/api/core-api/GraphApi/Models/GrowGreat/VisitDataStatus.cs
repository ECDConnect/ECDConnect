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
        public Boolean? IsCompleted { get; set; }
        public DateTime? ReferralDateCompleted { get; set; }
        public Boolean? BackReferralCompleted { get; set; }
        public DateTime? BackReferralDateCompleted { get; set; }
        public VisitBackReferral BackReferral { get; set; }

    }

    public class VisitDataStatusReferral {
        public virtual ICollection<VisitDataStatusModel> Referrals { get; set; }
    }

    public class Progress_VisitDataStatus {
        public string Score { get; set; }
        public string ScoreColor { get; set; }
        public string GrowComment { get; set; }
        public string GrowCommentColor { get; set; }
        public string Weight { get; set; }
        public string WeightColor { get; set; }
        public string WeightComment { get; set; }
        public string Length { get; set; }
        public string LengthColor { get; set; }
        public string LengthComment { get; set; }
        public string Muac { get; set; }
        public string MuacColor { get; set; }
        public string MuacComment { get; set; }
        public virtual ICollection<VisitDataStatus> VisitDataStatus { get; set; }
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


