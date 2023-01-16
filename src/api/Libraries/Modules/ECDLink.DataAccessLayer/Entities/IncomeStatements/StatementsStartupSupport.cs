using ECDLink.PostgresTenancy.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(StatementsStartupSupport))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsStartupSupport : EntityBase
    {
        public string Notes { get; set; }

    }
}
