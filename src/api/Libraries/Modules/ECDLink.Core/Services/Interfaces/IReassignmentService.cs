using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IReassignmentService
    {
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
            string roleAssignedToUser = null,
            string absenteeId = null
            );

        public bool EditReassignment(
            string fromUserId,
            string toUserId,
            string reason,
            DateTime startDate,
            bool isRoleAssign = false,
            string roleAssignedToUser = null,
            string absenteeId = null,
            bool deleteReassignment = false
            );
        public bool ReassignClassroomsFromHistory(string userId, string reassignmentId = null);

    }
}
