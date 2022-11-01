using ECDLink.Abstractrions.GraphQL.Attributes;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.ContentManagement.Entities.Base
{
    public abstract class EntityBase
    {
        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [GraphIgnoreInput]
        public int Id { get; set; }

        [Column(Order = 97)]
        [GraphIgnoreInput]
        public DateTime InsertedDate { get; set; }

        [Column(Order = 98)]
        [GraphIgnoreInput]
        public DateTime UpdatedDate { get; set; }

        [Column(Order = 99)]
        public string UpdatedBy { get; set; }

        [GraphQLIgnore]
        [Column(Order = 101)]
        public Guid? TenantId { get; set; }
    }
}
