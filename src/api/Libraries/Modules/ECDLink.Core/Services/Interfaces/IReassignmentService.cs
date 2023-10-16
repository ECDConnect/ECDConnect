using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IReassignmentService
    {
        public void ReassignAbsentees();
        public void ExpireRelationshipLinks();

        public bool AddReassignmentForPractitioner(string uId,
            string fromUserId,
            string toUserId,
            string reason,
            DateTime startDate,
            string loggedByUser,
            string classroomGroup = null,
            bool permanentAssign = false,
            DateTime? endDate = null
            );
        public bool ReassignClassroomsFromHistory(string uId, string userId);

    }
}
