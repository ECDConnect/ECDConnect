using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Licenses
{
    [Table(nameof(LicenseType))]
    public class LicenseType : LicenseType<Guid>
    {
    }

    public class LicenseType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string Description { get; set; }
    }

    public interface LicenseTypeJoin<TKey>
    {
        [ForeignKey(nameof(LicenseTypeId))]
        public LicenseType LicenseType { get; set; }
        public TKey LicenseTypeId { get; set; }
    }
}
