using ECDLink.Abstractrions.GraphQL.Attributes;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Base
{
    public abstract class EntityBase<TKey> where TKey : IEquatable<TKey>
    {
        //[Key]
        [Column(Order = 1)]
        public TKey Id { get; set; }

        [Column(Order = 96)]
        public bool IsActive { get; set; } = true;

        [Column(Order = 97)]
        [GraphIgnoreInput]
        public DateTime InsertedDate { get; set; } = DateTime.Now;

        [Column(Order = 98)]
        [GraphIgnoreInput]
        public DateTime UpdatedDate { get; set; } = DateTime.Now;

        [Column(Order = 99)]
        public string UpdatedBy { get; set; }

        [GraphQLIgnore]
        [Column(Order = 101)]
        public Guid? TenantId { get; set; }
    }
}
