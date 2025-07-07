using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users.Mapping
{
    public class UserGrant
    {
        public Guid? UserId { get; set; }

        [ForeignKey(nameof(GrantId))]
        public virtual Grant Grant { get; set; }

        public Guid GrantId { get; set; }
        public Guid TenantId { get; set; }
    }
}
