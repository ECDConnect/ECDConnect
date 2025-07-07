using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Documents
{
    [Table(nameof(UserConsent))]
    [EntityPermission(PermissionGroups.USER)]
    public class UserConsent : EntityBase<Guid>
    {
        public string ConsentType { get; set; }
        public int ConsentId { get; set; }
        public Guid UserId { get; set; }
        public Guid? CreatedUserId { get; set; }
    }
}
