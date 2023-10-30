using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedBaseEntity
    {
        public string Guid { get; set; }
        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string IdNumber { get; set; }
        public string Email { get; set; }
        public string Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public Owner Owner { get; set; }
        public string localId { get; set; }
        public string localUserId { get; set; }
        public string localParentEntityId { get; set; }
        public string localParentEntityUserId { get; set; }

    }
}
