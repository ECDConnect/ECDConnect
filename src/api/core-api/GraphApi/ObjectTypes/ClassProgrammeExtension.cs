using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.ObjectTypes
{
    [ExtendObjectType(typeof(ClassProgramme))]
    public class ClassProgrammeExtension
    {
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.View)]
        [UseFiltering]
        public IEnumerable<Attendance> GetAttendance(
          [Service] AttendanceTrackingRepository trackingRepository,
          [Service] IHttpContextAccessor httpContextAccessor,
          [Parent] ClassProgramme classProgramme)
        {
            var userId = httpContextAccessor.HttpContext.GetUser().Id;

            var attendance = trackingRepository.GetAllAttendancesByParentId(userId.ToString());

            return attendance.Where(x => x.ClassroomProgrammeId == classProgramme.Id);
        }
    }
}
