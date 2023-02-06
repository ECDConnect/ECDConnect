using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    [Table(nameof(StatementsPayType))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsPayType : StatementsPayType<Guid>
    {
    }

    public class StatementsPayType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
        public string Notes { get; set; }
    }

    public interface StatementsPayTypeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsPayTypeId))]
        public StatementsPayType StatementsPayType { get; set; }
        public TKey StatementsPayTypeId { get; set; }
    }
}
