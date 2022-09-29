using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class PractitionerUserAndNote
    {
        public ApplicationUser AppUser { get; set; }

        public string Note { get; set; }
    }
}
