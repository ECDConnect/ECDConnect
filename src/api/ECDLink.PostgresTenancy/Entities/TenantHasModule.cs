using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.PostgresTenancy.Entities
{
    [Table("TenantHasModule")]
    public class TenantHasModule
    {
        public Guid TenantId { get; set; }

        public Guid ModuleId { get; set; }

        public virtual Module Module { get; set; }
    }
}
