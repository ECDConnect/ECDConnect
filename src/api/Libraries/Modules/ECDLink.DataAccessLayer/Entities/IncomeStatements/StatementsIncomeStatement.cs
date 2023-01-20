using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    [Table(nameof(StatementsIncomeStatement))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsIncomeStatement : StatementsIncomeStatement<Guid>
    {

    }
    public class StatementsIncomeStatement<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Notes { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public bool Submitted { get; set; }
        public decimal IncomeTotal { get; set; }
        public decimal ExpenseTotal { get; set; }
        public decimal Balance { get; set; }
        public string Period { get; set; }


    }

    public interface StatementsIncomeStatementJoin<TKey>
    {
        [ForeignKey(nameof(StatementsIncomeStatementId))]
        public StatementsIncomeStatement StatementsIncomeStatement { get; set; }
        public TKey StatementsIncomeStatementId { get; set; }
    }
}
