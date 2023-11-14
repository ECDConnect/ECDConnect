using System;
using System.Collections.Generic;
using ECDLink.DataAccessLayer.Entities.Users;

namespace ECDLink.Api.CoreApi.Services.Interfaces
{
    public interface IAbsenteeService
    {
        public Absentees AddAbsenteeForPractitioner(
            string uId,
            string practitionerId,
            string reassignedToPractitioner,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classroomGroupId = null, // WHY IS THIS NULLABLE???
            DateTime? absentDateEnd = null,
            Guid? practitionerRemovalHistory = null);


        List<AbsenteeDetail> GetAbsenteeByUser(string userId, DateTime? startDate = null, DateTime ? endDate = null);

        public Absentees EditAbsentee(
            string absenteeId,
            bool deleteAbsentee = false,
            string reassignedToPractitioner = null,
            string reason = null,
            DateTime? absentDate = null,
            DateTime? absentDateEnd = null);

        public int GetAbsenteeCountByUser(string userId);
    }
}