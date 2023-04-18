using ECDLink.DataAccessLayer.Entities.Visits;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class VisitModel
    {
        public DateTime PlannedVisitDate { get; set; }
        public DateTime ActualVisitDate { get; set; }
        public Guid? VisitTypeId { get; set; }
        public VisitType VisitType { get; set; }
        public Guid? MotherId { get; set; }
        public MotherModel Mother { get; set; }
        public Guid? InfantId { get; set; }
        public InfantModel Infant { get; set; }
        public string Risk { get; set; }  // high or normal
        public string Comment { get; set; }
        public bool Attended { get; set; }
    }
}

