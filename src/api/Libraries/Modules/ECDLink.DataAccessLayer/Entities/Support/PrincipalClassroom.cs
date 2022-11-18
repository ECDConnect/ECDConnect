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
    public class PrincipalClassroom
    {
        public string PrincipalName { get; set; }

        public string ClassroomName { get; set; }

        public string ClassroomGroupName { get; set; }

        public string ClassroomId { get; set; }

        public string ClassroomGroupId { get; set; }

        public DateTime InsertedDate { get; set; }
    }
}
