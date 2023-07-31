using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class ColumnChange : BasicMappedBaseEntity
    {
        public string ColumnSchemaName { get; set; }
        public DateTime DateTimeStamp { get; set; }
        public RecordChange RecordChange { get; set; }
        public string EntitySchemaName { get; set; }        
        public string Column { get; set; }
        public string NewValue { get; set; }
        public string Entity { get; set; }                
        public string Status { get; set; }
        public string RequestIndex { get; set; }
        public string HttpStatusCode { get; set; }
        public string Exception { get; set; }


    }
}
