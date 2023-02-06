using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.PostgresTenancy.Entities.Base
{
    public abstract class EntityBase
    {
        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Column(Order = 97)]
        public DateTime InsertedDate { get; set; }

        [Column(Order = 98)]
        public DateTime UpdatedDate { get; set; }

        [Column(Order = 99)]
        public string UpdatedBy { get; set; }
    }
}
