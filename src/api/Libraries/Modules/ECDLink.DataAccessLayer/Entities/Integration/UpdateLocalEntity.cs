using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class UpdateLocalEntity
    {
        public string Guid { get; set; }
        public string EntityType { get; set; }
        public string EntityColumn { get; set; }
        public string NewData { get; set; }
        public DateTime LastUpdatedDateTime { get; set; }

    }
}
