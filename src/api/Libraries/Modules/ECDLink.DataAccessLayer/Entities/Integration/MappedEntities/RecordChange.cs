using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class RecordChange : BasicMappedBaseEntity
    {
        public string EntityName { get; set; }
        public string EntitySchemaName { get; set; }
        public string RecordGuid { get; set; }
        public string RelatedEntityGuid { get; set; }
        public string RelatedEntityType { get; set; }
        public SLChangeType ChangeType { get; set; }
        public DateTime DateTimeStamp { get; set; }
        public string Status { get; set; }
        public string RequestIndex { get; set; }
        public string HttpStatusCode { get; set; }
        public string Exception { get; set; }

    }
}
