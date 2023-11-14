using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IReassignmentService
    {
        public void ReassignAbsentees();
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
            string absenteeId = null
            );
        public bool ReassignClassroomsFromHistory(string userId);

    }
}
