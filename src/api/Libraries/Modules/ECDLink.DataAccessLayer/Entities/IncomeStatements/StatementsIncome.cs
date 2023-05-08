using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
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
    public class StatementsIncome<TKey> : EntityBase<TKey>, ITrackableType
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
        public string? IncomeStatementId { get; set; }
        public string UserId { get; set; }
        public DateTime DateReceived { get; set; }
        public string? FeeTypeId { get; set; }
        //[GraphQLIgnore]
        //public bool AutoSubmitted { get; set; }

    }

    public interface StatementsIncomeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsIncomeId))]
        public StatementsIncome StatementsIncome { get; set; }
        public TKey StatementsIncomeId { get; set; }
    }
}
