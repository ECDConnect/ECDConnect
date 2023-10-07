using System;
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

    }
}