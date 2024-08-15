using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.DataAccessLayer.Entities.EventRecords;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class EventRecordModel
    {
        public Guid? EventRecordTypeId { get; set; }
        public EventRecordType EventRecordType { get; set; }
        public Guid? MotherId { get; set; }
        public MotherModel Mother { get; set; }
        public Guid? InfantId { get; set; }
        public InfantModel Infant { get; set; }
        public string Notes { get; set; }
        public string LinkedVisitId { get; set; }
        public bool? status { get; set; }
    }

    public class EventRecordTypeModel
    {
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string Description { get; set; }
        public string Type { get; set; } // mother or child
        public string ParentId { get; set; }
    }

}

