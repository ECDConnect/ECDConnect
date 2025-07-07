using ECDLink.Security;
using ECDLink.Security.Attributes;
using System.Collections.Generic;

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
