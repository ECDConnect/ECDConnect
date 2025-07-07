using ECDLink.DataAccessLayer.Entities.Base;
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
        public string Description { get; set; }
        public string PayTypeId { get; set; }
        public string IncomeTypeId { get; set; }
        public double Amount { get; set; }
        public string PhotoProof { get; set; }

        [ForeignKey(nameof(ChildUserId))]
        public virtual ApplicationUser ChildUser {  get; set; }
        public Guid? ChildUserId { get; set; }


        [GraphQLIgnore]
        [ForeignKey(nameof(StatementsIncomeStatementId))]
        public virtual StatementsIncomeStatement StatementsIncomeStatement { get; set; }
        public Guid? StatementsIncomeStatementId { get; set; }
        public DateTime DateReceived { get; set; }
        public int? NumberOfChildrenCovered { get; set; }
    }

    public interface StatementsIncomeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsIncomeId))]
        public StatementsIncome StatementsIncome { get; set; }
        public TKey StatementsIncomeId { get; set; }
    }
}
