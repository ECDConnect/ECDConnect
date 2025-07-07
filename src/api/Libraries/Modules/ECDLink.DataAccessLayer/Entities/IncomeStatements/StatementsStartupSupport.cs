using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

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
        public double Amount { get; set; }
        public Guid? ProgrammeId { get; set; }
        public Guid? ChildUserId { get; set; }
        public Guid? UserId { get; set; }
    }

    public interface StatementsStartupSupportJoin<TKey>
    {
        [ForeignKey(nameof(StatementsStartupSupportId))]
        public StatementsStartupSupport StatementsStartupSupport { get; set; }
        public TKey StatementsStartupSupportId { get; set; }
    }
}
