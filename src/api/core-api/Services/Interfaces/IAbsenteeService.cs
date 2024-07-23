using System;
using System.Collections.Generic;
using ECDLink.DataAccessLayer.Entities.Users;

namespace ECDLink.Api.CoreApi.Services.Interfaces
{
    public interface IAbsenteeService
    {
        public Absentees AddAbsenteeForPractitioner(
            string practitionerId,
            string reassignedToPractitioner,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classroomGroupId = null,
            DateTime? absentDateEnd = null,
            bool isRoleAssign = false,
            string fromRole = null,
            string toRole = null,
            string roleAssignedToUser = null,
            Guid? practitionerRemovalHistory = null);


        List<AbsenteeDetail> GetAbsenteeByUser(string userId, DateTime? startDate = null, DateTime ? endDate = null);

        public Absentees EditAbsentee(
            string absenteeId,
            bool deleteAbsentee = false,
            string reassignedToPractitioner = null,
            string reason = null,
            DateTime? absentDate = null,
            DateTime? absentDateEnd = null,
            bool isRoleAssign = false,
            string roleAssignedToUser = null);

        public int GetAbsentDayCountForUser(Guid userId, DateTime startDate, DateTime endDate);
    }
}