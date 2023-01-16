using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(SystemSetting))]
    [EntityPermission(PermissionGroups.SYSTEM)]
    public class SystemSetting : EntityBase<Guid>, ISetting
    {
        public string Grouping { get; set; }

        public string FullPath { get; set; }

        public string Name { get; set; }

        public string Value { get; set; }

        public bool? IsSystemValue { get; set; }
    }
}
