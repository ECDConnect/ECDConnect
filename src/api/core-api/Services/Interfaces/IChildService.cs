using EcdLink.Api.CoreApi.GraphApi.Models.Input;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IChildService
    {
        List<Child> GetChildrenForClassroom(Guid classroomId);
        List<Child> GetChildrenForClassroomGroup(Guid classroomGroupId);
        void UpdateChild(UpdateChildAndCaregiverInput input);
    }
}