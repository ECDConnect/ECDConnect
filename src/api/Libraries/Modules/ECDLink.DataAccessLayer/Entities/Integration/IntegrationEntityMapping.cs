using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping
{
    [Table(nameof(IntegrationEntityMapping))]
    public class IntegrationEntityMapping : IntegrationEntityMapping<Guid>
    {
    }

    public class IntegrationEntityMapping<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string LocalEntity { get; set; }
        public string RemoteEntity { get; set; }
        public string LocalId { get; set; }
        public string RemoteId { get; set; }
        public string IntegrationSystem { get; set; } = "Smartlink";
        public DateTime LastUpdatedDate { get; set; } = DateTime.Now;
        public DateTime LastCheckedDate { get; set; } = DateTime.Now;
        public string BeforeJSON { get; set; }
        public string AfterJSON { get; set; }
        public bool? IsComplete { get; set; }
        public string Notes { get; set; }
        public string EntityGrouping { get; set; }
        public Guid UserId { get; set; }
        public DateTime? LastIncomeSubmittedDate { get; set; }
        public DateTime? LastAttendanceSubmittedDate { get; set; }
    }
}
