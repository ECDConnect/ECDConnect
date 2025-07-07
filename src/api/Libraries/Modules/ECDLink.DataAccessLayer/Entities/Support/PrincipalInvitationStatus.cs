using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.USER)]
    public class PrincipalInvitationStatus
    {
        public DateTime? LeavingDate { get; set; }
        public DateTime? AcceptedDate { get; set; }
        public DateTime? LinkedDate { get; set; }
        public bool Leaving { get; set; }
    }
}
