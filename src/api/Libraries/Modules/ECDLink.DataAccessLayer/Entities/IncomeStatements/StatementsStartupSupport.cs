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
    public class StatementsStartupSupport : StatementsStartupSupport<Guid>
    {

    }

    [Table(nameof(StatementsStartupSupport))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsStartupSupport<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Notes { get; set; }
        public string Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Decimal Amount { get; set; }
        public Guid ProgrammeId { get; set; }
    }

    public interface StatementsStartupSupportJoin<TKey>
    {
        [ForeignKey(nameof(StatementsStartupSupportId))]
        public StatementsStartupSupport StatementsStartupSupport { get; set; }
        public TKey StatementsStartupSupportId { get; set; }
    }
}
