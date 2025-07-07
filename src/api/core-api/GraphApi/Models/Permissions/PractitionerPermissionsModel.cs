using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Permissions
{
    public class PractitionerPermissionModel
    {
        public PractitionerPermissionModel()
        {
        }

        public PractitionerPermissionModel(Permission permission)
        {
            Id = permission.Id;
            Name = permission.Name;
            NormalizedName = permission.NormalizedName;
            Grouping = permission.Grouping;
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string Grouping { get; set; }

    }
}
