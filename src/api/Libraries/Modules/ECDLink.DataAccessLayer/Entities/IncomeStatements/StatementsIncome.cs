using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    [Table(nameof(StatementsIncome))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsIncome : StatementsIncome<Guid>
    {

    }
    public class StatementsIncome<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Notes { get; set; }

    }

    public interface StatementsIncomeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsIncomeId))]
        public StatementsIncome StatementsIncome { get; set; }
        public TKey StatementsIncomeId { get; set; }
    }
}
