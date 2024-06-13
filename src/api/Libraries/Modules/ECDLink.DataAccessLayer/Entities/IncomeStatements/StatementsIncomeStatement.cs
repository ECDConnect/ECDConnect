using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
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
        public Guid? UserId { get; set; }
        public virtual ICollection<StatementsIncome> IncomeItems { get; set; }
        public virtual ICollection<StatementsExpenses> ExpenseItems { get; set; }
        public bool ContactedByCoach { get; set; }
        public bool Downloaded { get; set; }
    }

    public interface StatementsIncomeStatementJoin<TKey>
    {
        [ForeignKey(nameof(StatementsIncomeStatementId))]
        public StatementsIncomeStatement StatementsIncomeStatement { get; set; }
        public TKey StatementsIncomeStatementId { get; set; }
    }
}
