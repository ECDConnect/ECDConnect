using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class UserPermissionModel
    {
        public UserPermissionModel()
        {
        }

        public UserPermissionModel(UserPermission userPermission)
        {
            Id = userPermission.Id;
            UserId = (Guid)userPermission.UserId;
            PermissionId = userPermission.PermissionId;
            IsActive = userPermission.IsActive;
            PermissionName = userPermission.Permission.Name;
            PermissionNormalizedName = userPermission.Permission.NormalizedName;
            PermissionGrouping = userPermission.Permission.Grouping;
        }

        public Guid Id { get; set; }
        public bool IsActive { get; set; }
        public Guid UserId { get; set; }
        public Guid PermissionId { get; set; }
        public string PermissionName { get; set; }
        public string PermissionNormalizedName { get; set; }
        public string PermissionGrouping { get; set; }

    }
}
