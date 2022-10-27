using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Security
{
    [Table(nameof(AspNetUserTokens))]
    [EntityPermission(PermissionGroups.SYSTEM)]
    public class AspNetUserTokens
    {
        public string UserId { get; set; }
        public string LoginProvider { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public Guid TenantId { get; set; }
        public DateTime InsertedDate { get; set; }
    }
}
