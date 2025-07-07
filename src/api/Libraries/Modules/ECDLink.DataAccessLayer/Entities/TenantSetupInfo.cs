using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(TenantSetupInfo))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class TenantSetupInfo : TenantSetupInfo<Guid>
    {
    }

    public class TenantSetupInfo<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string OrganisationName { get; set; }
        public string SetupJsonData { get; set; }
    }

    public interface TenantSetupInfoJoin<TKey>
    {
        [ForeignKey(nameof(TenantSetupInfoId))]
        public TenantSetupInfo TenantSetupInfo { get; set; }
        public TKey TenantSetupInfoId { get; set; }
    }
}
