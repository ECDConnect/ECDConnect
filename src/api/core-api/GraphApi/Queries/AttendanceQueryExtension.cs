using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class AttendanceQueryExtension
    {
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.View)]
        [UseFiltering]
        public IEnumerable<Attendance> GetAttendance(
            [Service] AttendanceTrackingRepository trackingRepository,
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IClassroomService classroomService,
            DateTime startDate,
            DateTime endDate)
        {
            var userId = httpContextAccessor.HttpContext.GetUser().Id;

            var classroomGroupIds = classroomService.GetClassroomGroupsForUser(userId).Select(x => x.Id).ToList();

            var attendance = trackingRepository.GetAllAttendances(classroomGroupIds)
                .Where(x => x.AttendanceDate.Date >= startDate.Date && x.AttendanceDate.Date <= endDate.Date);

            return attendance;
        }
    }
}
