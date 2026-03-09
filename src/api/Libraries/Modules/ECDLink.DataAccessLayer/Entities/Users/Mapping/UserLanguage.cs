using System;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.DataAccessLayer.Entities.Base;

namespace ECDLink.DataAccessLayer.Entities.Users.Mapping
{
    [ECDLink.Security.Attributes.EntityPermission(ECDLink.Security.PermissionGroups.USER)]
    public class UserLanguage : EntityBase<Guid>
    {
        public Guid UserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        [ForeignKey(nameof(LanguageId))]
        public virtual Language Language { get; set; }
        public Guid LanguageId { get; set; }

    }
}
