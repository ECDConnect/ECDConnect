using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedDocument : BasicMappedBaseEntity
    {

        public string Name { get; set; }
        public string FinalRejectReasonOther { get; set; }
        public DateTime DocumentDate { get; set; }
        public string ValidationStatus { get; set; }
        public string FinalValidity { get; set; }
        public string FinalRejectReason { get; set; }
        public MappedFranchisee Franchisee { get; set; }
        public MappedChild Child { get; set; }
        public MappedDocumentType DocumentType { get; set; }
        public string Status { get; set; }

    }

    public class MappedDocumentType
    {

        public string Name { get; set; }
        public Guid Guid { get; set; }

    }
}
