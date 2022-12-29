using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Integration.IntegrationMapping
{
    [Table(nameof(IntegrationMapping))]
    public class IntegrationMapping : IntegrationMapping<Guid>
    {
    }

    public class IntegrationMapping<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string LocalEntity { get; set; }
        public string RemoteEntity { get; set; }
        public string LocalId { get; set; }
        public string RemoteId { get; set; }
        public string IntegrationSystem { get; set; } = "SmartLink";
        public DateTime LastUpdatedDate { get; set; } = DateTime.Now;
        public DateTime LastCheckedDate { get; set; } = DateTime.Now;
        public string BeforeJSON { get; set; }
        public string AfterJSON { get; set; }


        public string UserId { get; set; }
    }
}
