using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.DataAccessLayer.Entities.Base;

namespace ECDLink.DataAccessLayer.Entities.Documents
{
    [Table(nameof(UserConsent))]
    [EntityPermission(PermissionGroups.USER)]
    public class UserConsent : EntityBase<Guid>
    {        
        public string ConsentType { get; set; }
        public int ConsentId { get; set; }
        public string UserId { get; set; }        
        public string CreatedUserId { get; set; }
    }
}
