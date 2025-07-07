using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    [Table(nameof(StatementsExpenses))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsExpenses : StatementsExpenses<Guid>
    {

    }
    public class StatementsExpenses<TKey> : EntityBase<TKey>, StatementsIncomeStatementJoin<Guid?>
         where TKey : IEquatable<TKey>
    { 
        public string Notes { get; set; }
        public string ExpenseTypeId { get; set; }
        public double Amount { get; set; }
        public string PhotoProof { get; set; }
        public DateTime DatePaid { get; set; }
        [GraphQLIgnore]
        [ForeignKey(nameof(StatementsIncomeStatementId))]
        public virtual StatementsIncomeStatement StatementsIncomeStatement { get; set; }
        public Guid? StatementsIncomeStatementId { get; set; }
    }

    public interface StatementsExpensesJoin<TKey>
    {
        [ForeignKey(nameof(StatementsExpensesId))]
        public StatementsExpenses StatementsExpenses { get; set; }
        public TKey StatementsExpensesId { get; set; }
    }
}
