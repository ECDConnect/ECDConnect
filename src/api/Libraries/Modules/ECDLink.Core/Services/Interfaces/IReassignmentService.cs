using System;
using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IReassignmentService
    {
        //public void ProcessReassignments();
        public bool ReassignAbsentees();
        public void ExpireRelationshipLinks();

        public bool AddReassignmentForPractitioner(
            string fromUserId,
            string toUserId,
            string reason,
            DateTime startDate,
            string loggedByUser,
            string classroomGroup = null,
            bool permanentAssign = false,
            DateTime? endDate = null,
            bool isRoleAssign = false,
            string fromRole = null,
            string toRole = null,
            string absenteeId = null
            );
        public bool ReassignClassroomsFromHistory(string userId, string reassignmentId = null);

    }
}
