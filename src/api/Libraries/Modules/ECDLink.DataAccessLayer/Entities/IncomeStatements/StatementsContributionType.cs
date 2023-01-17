using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    [Table(nameof(StatementsContributionType))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsContributionType : StatementsContributionType<Guid>
    {
    }

    public class StatementsContributionType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
        public string Notes { get; set; }
    }

    public interface StatementsContributionTypeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsContributionTypeId))]
        public StatementsContributionType StatementsContributionType { get; set; }
        public TKey StatementsContributionTypeId { get; set; }
    }
}
