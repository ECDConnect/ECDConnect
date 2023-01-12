using ECDLink.PostgresTenancy.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(StatementsIncome))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsIncome : EntityBase
    {
        public string Notes { get; set; }

    }
}
