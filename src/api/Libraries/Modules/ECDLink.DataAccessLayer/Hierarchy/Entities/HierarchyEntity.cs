using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Hierarchy.Entities
{
    [Table("Hierarchy")]
    public class HierarchyEntity : EntityBase<Guid>
    {
        public string Type { get; set; }

        public string SystemType { get; set; }

        public Guid ParentId { get; set; }
    }
}
