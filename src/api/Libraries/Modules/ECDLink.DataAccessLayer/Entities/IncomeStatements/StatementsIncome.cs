using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    [Table(nameof(StatementsIncome))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsIncome : StatementsIncome<Guid>
    {

    }
    public class StatementsIncome<TKey> : EntityBase<TKey>, StatementsIncomeStatementJoin<Guid?>
         where TKey : IEquatable<TKey>
    {
        public string Notes { get; set; }
        public string? ContributionTypeId { get; set; }
        public string? PayTypeId { get; set; }
        public string? IncomeTypeId { get; set; }
        public double Amount { get; set; }
        public double AmountExpected { get; set; }
        public double ChildCoverAmount { get; set; }        
        public string Description { get; set; }
        public string PhotoProof { get; set; }
        public bool Submitted { get; set; }
        public string ChildUserId { get; set; }
        [GraphQLIgnore]
        [ForeignKey(nameof(StatementsIncomeStatementId))]
        public virtual StatementsIncomeStatement StatementsIncomeStatement { get; set; }
        public Guid? StatementsIncomeStatementId { get; set; }
        public Guid UserId { get; set; }
        public DateTime DateReceived { get; set; }
        public string? FeeTypeId { get; set; }
    }

    public interface StatementsIncomeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsIncomeId))]
        public StatementsIncome StatementsIncome { get; set; }
        public TKey StatementsIncomeId { get; set; }
    }
}
