using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IInvitationReassignmentService
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
            bool permanentAssign = false
            );
        public bool ReassignClassroomsFromHistory(string uId, string userId);

    }
}
