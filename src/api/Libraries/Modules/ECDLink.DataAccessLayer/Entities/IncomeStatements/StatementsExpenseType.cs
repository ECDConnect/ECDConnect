using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    [Table(nameof(StatementsExpenseType))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsExpenseType : StatementsExpenseType<Guid>
    {
    }

    public class StatementsExpenseType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
        public string Notes { get; set; }
    }

    public interface StatementsExpenseTypeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsExpenseTypeId))]
        public StatementsExpenseType StatementsExpenseType { get; set; }
        public TKey StatementsExpenseTypeId { get; set; }
    }
}
