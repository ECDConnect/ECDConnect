using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Hierarchy.Entities
{
    [Table("UserHierarchy")]
    public class UserHierarchyEntity : EntityBase<Guid>
    {
        public Guid ParentId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        public string UserType { get; set; }

        public string NamedTypePath { get; set; }

        public string Hierarchy { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(Order = 2)]
        [GraphIgnoreInput]
        public int Key { get; set; }
    }
}
