using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Visits
{
    public class BasicVisitModel
    {
        public Guid Id { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime PlannedVisitDate { get; set; }
        public DateTime? ActualVisitDate { get; set; }
        public bool Attended { get; set; }
        public bool IsCancelled { get; set; }
        public DateTime? StartedDate { get; set; }
        public string Risk { get; set; }
        public string Comment { get; set; }
        // TODO - we should probably remove this and have better FE sorting
        public DateTime? OrderDate { get; set; }
        public Guid? EventId { get; set; }
        public BasicVisitTypeModel VisitType { get; set; }
    }

    public class BasicVisitTypeModel
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public int Order { get; set; }
    }
}
