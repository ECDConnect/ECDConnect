using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.PostgresTenancy.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    [Table(nameof(StatementsExpenses))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsExpenses : StatementsExpenses<Guid>
    {

    }
    public class StatementsExpenses<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    { 
        public string Notes { get; set; }

    }

    public interface StatementsExpensesJoin<TKey>
    {
        [ForeignKey(nameof(StatementsExpensesId))]
        public StatementsExpenses StatementsExpenses { get; set; }
        public TKey StatementsExpensesId { get; set; }
    }
}
