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
        public string ContributionType { get; set; }
        public string PayType { get; set; }
        public string IncomeType { get; set; }
        public decimal Amount { get; set; }
        public decimal AmountExpected { get; set; }
        public string Description { get; set; }
        public string PhotoProof { get; set; }
        public bool Submitted { get; set; }
        public string ChildUserId { get; set; }
        public string IncomeStatementId { get; set; }

    }

    public interface StatementsIncomeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsIncomeId))]
        public StatementsIncome StatementsIncome { get; set; }
        public TKey StatementsIncomeId { get; set; }
    }
}
