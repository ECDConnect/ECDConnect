using System;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.DataAccessLayer.Entities.Base;

namespace ECDLink.DataAccessLayer.Entities.Users.Mapping
{
    [ECDLink.Security.Attributes.EntityPermission(ECDLink.Security.PermissionGroups.USER)]
    public class UserGrant : EntityBase<Guid>
    {
        public Guid? UserId { get; set; }

        [ForeignKey(nameof(GrantId))]
        public virtual Grant Grant { get; set; }

        public Guid GrantId { get; set; }

    }
}
