using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    [Table(nameof(StatementsFeeType))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsFeeType : StatementsFeeType<Guid>
    {
    }

    public class StatementsFeeType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
        public string Notes { get; set; }
    }

    public interface StatementsFeeTypeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsFeeTypeId))]
        public StatementsFeeType StatementsFeeType { get; set; }
        public TKey StatementsFeeTypeId { get; set; }
    }
}
