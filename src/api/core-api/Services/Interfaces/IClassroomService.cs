using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IClassroomService
    {
        Classroom GetClassroomForUser(Guid userId);
        List<ClassroomGroup> GetClassroomGroupsForUser(Guid userId);
    }
}