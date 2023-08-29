using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface INotificationTasksService
    {
        //public void ReassignAbsentees();
        //public void ExpireRelationshipLinks();

        //public bool AddReassignmentForPractitioner(string uId,
        //    string fromUserId,
        //    string toUserId,
        //    string reason,
        //    DateTime startDate,
        //    string loggedByUser,
        //    string classroomGroup = null,
        //    bool permanentAssign = false
        //    );
        public void DailyUnassignedClassesNotification();

    }
}
