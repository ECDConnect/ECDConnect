using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.PostgresTenancy.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

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

    }

    public interface StatementsIncomeStatementJoin<TKey>
    {
        [ForeignKey(nameof(StatementsIncomeStatementId))]
        public StatementsIncomeStatement StatementsIncomeStatement { get; set; }
        public TKey StatementsIncomeStatementId { get; set; }
    }
}
