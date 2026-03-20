using EcdLink.Api.CoreApi.GraphApi.Models.Input;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IChildService
    {
        List<Child> GetChildrenForClassroom(Guid classroomId);
        List<Child> GetChildrenForClassroomGroup(Guid classroomGroupId);
        Task UpdateChildAsync(UpdateChildAndCaregiverInput input);
        void RemoveChild(UpdateChildAndCaregiverInput input);

        void UpdateCaregiverGrants(Guid childUserId, List<Guid> grantIds, Guid tenantId);
        void UpdateChildLanguages(Guid childUserId, List<Guid> homeLanguageIds, Guid tenantId);
    }
}