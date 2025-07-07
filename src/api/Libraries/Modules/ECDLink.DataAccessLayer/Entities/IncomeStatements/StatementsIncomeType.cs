using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    [Table(nameof(StatementsIncomeType))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsIncomeType : StatementsIncomeType<Guid>
    {
    }

    public class StatementsIncomeType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
        public string Notes { get; set; }
    }

    public interface StatementsIncomeTypeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsIncomeTypeTypeId))]
        public StatementsIncomeType StatementsIncomeTypeType { get; set; }
        public TKey StatementsIncomeTypeTypeId { get; set; }
    }
}
