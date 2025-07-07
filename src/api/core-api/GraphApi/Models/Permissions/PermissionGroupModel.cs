using ECDLink.DataAccessLayer.Entities;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Permissions
{
    public class PermissionGroupModel
    {
        public string GroupName { get; set; }

        public IEnumerable<Permission> Permissions { get; set; }
    }
}
