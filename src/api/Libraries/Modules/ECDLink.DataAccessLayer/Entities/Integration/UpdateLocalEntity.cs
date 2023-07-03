using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class UpdateLocalEntity
    {
        public string Guid { get; set; }
        public string RelatedGuid { get; set; }
        public string EntityType { get; set; }
        public string RelatedEntityType { get; set; }
        public string EntityColumn { get; set; }
        public string NewData { get; set; }
        public DateTime LastUpdatedDateTime { get; set; }

    }

    public class RemoteChangesList
    {
        public List<UpdateLocalEntity> Inserts = new List<UpdateLocalEntity>();
        public List<UpdateLocalEntity> Deletes = new List<UpdateLocalEntity>();
        public List<UpdateLocalEntity> Updates = new List<UpdateLocalEntity>();


    }
}
