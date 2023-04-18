using ECDLink.DataAccessLayer.Entities.Visits;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat {
    public class VisitBackReferralModel {
        public string Id { get; set; }
        public string VisitDataStatusId { get; set; }
        public VisitDataStatus VisitDataStatus { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public string Comment { get; set; }
    }

}

