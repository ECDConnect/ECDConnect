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

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class AttendanceQueryExtension
    {
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.View)]
        [UseFiltering]
        public IEnumerable<Attendance> GetAttendance(
            [Service] AttendanceTrackingRepository trackingRepository,
            [Service] IHttpContextAccessor httpContextAccessor,
            int year,
            int? monthOfYear,
            int? weekOfYear)
        {
            var userId = httpContextAccessor.HttpContext.GetUser().Id;

            var attendance = trackingRepository.GetAllAttendancesByParentId(userId)
              .Where(x => x.Year == year);

            if (monthOfYear != null && monthOfYear > 0)
            {
                attendance = attendance.Where(x => x.MonthOfYear == monthOfYear);
            }

            if (weekOfYear != null)
            {
                attendance = attendance.Where(x => x.WeekOfYear == weekOfYear);
            }

            if (attendance == null)
            {
                return Enumerable.Empty<Attendance>().AsQueryable();
            }

            return attendance;
        }

        public IEnumerable<Attendance> GetWeeklyAttendance(
            [Service] AttendanceTrackingRepository trackingRepository,
            string userId,
            int year,
            int? monthOfYear,
            int? weekOfYear)
        {
            var attendance = trackingRepository.GetAllAttendancesByParentId(userId)
                .Where(x => x.Year == year);

            if (monthOfYear != null && monthOfYear > 0)
            {
                attendance = attendance.Where(x => x.MonthOfYear == monthOfYear);
            }

            if (weekOfYear != null)
            {
                attendance = attendance.Where(x => x.WeekOfYear == weekOfYear);
            }

            if (attendance == null)
            {
                return Enumerable.Empty<Attendance>().AsQueryable();
            }

            return attendance;
        }

        public IEnumerable<Attendance> GetDailyAttendance(
            [Service] AttendanceTrackingRepository trackingRepository,
            string userId,
            DateTime attendanceDate)
        {
            var attendance = trackingRepository.GetAllAttendancesByParentId(userId)
              .Where(x => x.Year == attendanceDate.Year);

            if (attendanceDate != null)
            {
                attendance = attendance.Where(x => x.AttendanceDate == attendanceDate);
            }

            if (attendance == null)
            {
                return Enumerable.Empty<Attendance>().AsQueryable();
            }

            return attendance;
        }


    }
}
