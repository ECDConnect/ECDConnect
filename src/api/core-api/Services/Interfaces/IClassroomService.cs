using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IClassroomService
    {
        Classroom GetClassroomForUser(Guid userId);
        Classroom GetTrialPeriodClassroomForUser(Guid userId);
        List<ClassroomGroup> GetClassroomGroupsForUser(Guid userId);

        /// <summary>
        /// NOTE: This method is to be removed after some future refactoring
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        PrincipalClassroom GetClassroomDetailsForPractitioner(string userId);
    }
}