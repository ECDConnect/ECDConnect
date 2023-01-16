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
    [Table(nameof(StatementsIncome))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsIncome : StatementsIncome<Guid>
    {

    }
    public class StatementsIncome<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Notes { get; set; }

    }

    public interface StatementsIncomeJoin<TKey>
    {
        [ForeignKey(nameof(StatementsIncomeId))]
        public StatementsIncome StatementsIncome { get; set; }
        public TKey StatementsIncomeId { get; set; }
    }
}
