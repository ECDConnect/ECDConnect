using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using IdentityServer4.Events;
using Microsoft.Azure.Documents;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class ReassignmentLists
    {
        public string[] ClassroomGroupsReassigned { get; set; }
        public string[] ClassProgrammesReassigned { get; set; }
        public string[] ClassroomsReassigned { get; set; }
        public string[] ChildrenReassignedUserIds { get; set; }
        public string[] LearnersReassigned { get; set; }

    }
}
