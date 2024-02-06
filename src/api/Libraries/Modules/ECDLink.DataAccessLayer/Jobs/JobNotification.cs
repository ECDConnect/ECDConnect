using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Jobs
{
    [Table("JobNotification")]
    public class JobNotification : ApplicationUserJoin
    {
        [Key]
        [Column(Order = 1)]
        public Guid Id { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        public DateTime UserLastSeen { get; set; }

        public TemplateTypeEnum TemplateType { get; set; }

        public string Protocol { get; set; }
        public Guid? TenantId { get; set; }

        public DateTime? InsertedDate { get; set; }
    }
}
