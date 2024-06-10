using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.PostgresTenancy.Entities
{
    [Table("Module")]
    public class Module
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string Description { get; set; }
    }
}
