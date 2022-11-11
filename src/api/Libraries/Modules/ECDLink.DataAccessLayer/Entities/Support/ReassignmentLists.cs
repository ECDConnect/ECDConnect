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
        public List<string> ClassroomGroupsReassigned { get; set; }
        public List<string> ClassProgrammesReassigned { get; set; }
        public List<string> ClassroomsReassigned { get; set; }
        public List<string> ChildrenReassignedUserIds { get; set; }
        public List<string> LearnersReassigned { get; set; }

    }
}
