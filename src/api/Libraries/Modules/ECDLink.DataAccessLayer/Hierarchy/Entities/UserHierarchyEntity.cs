using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Hierarchy.Entities
{
    [Table("UserHierarchy")]
    public class UserHierarchyEntity : EntityBase<Guid>
    {
        public string ParentId { get; set; }
        
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }

        public string UserType { get; set; }

        public string NamedTypePath { get; set; }

        public string Hierarchy { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(Order = 2)]
        [GraphIgnoreInput]
        public int Key { get; set; }
    }
}
