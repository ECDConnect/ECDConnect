using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class BasicMappedBaseEntity
    {
        public string Guid { get; set; }
        public string localId { get; set; }
        public string localParentEntityId { get; set; }

    }
}
