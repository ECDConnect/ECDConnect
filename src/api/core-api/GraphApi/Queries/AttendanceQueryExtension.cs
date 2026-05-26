using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Hierarchy;
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
using System.Threading.Tasks;

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

            var classroomGroups = classroomService.GetClassroomGroupsForUser(userId);

            if (classroomGroups == null)
            {
                return null;
            }

            var classroomGroupIds = classroomGroups.Select(x => x.Id).ToList();

            var attendance = trackingRepository.GetAllAttendances(classroomGroupIds)
                .Where(x => x.AttendanceDate.Date >= startDate.Date && x.AttendanceDate.Date <= endDate.Date);

            return attendance;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]

        /// <summary>
        /// This fetches stats around how the practitioner has taken attendance for their classroom groups
        /// </summary>
        /// <param name="report"></param>
        /// <param name="classroomId"></param>
        /// <param name="startMonth"></param>
        /// <param name="endMonth"></param>
        /// <returns></returns>
        public IEnumerable<MonthlyAttendanceReportModel> MonthlyAttendanceReport(
          [Service] MonthlyAttendanceReport report,
          [Service] IHttpContextAccessor httpContextAccessor,
          DateTime startMonth,
          DateTime endMonth)
        {
            var userId = httpContextAccessor.HttpContext.GetUser().Id;
            startMonth = startMonth.GetStartOfMonth();

            //if current month, do not project as per business rules and use current date as enddate - if its the 1st of the month and dates match, then add 1 day
            endMonth = endMonth.Month == DateTime.Now.Month
                ? DateTime.Now.GetEndOfDay()
                : endMonth.GetEndOfMonth().GetEndOfDay();


            var data = report.GenerateMonthlyAttendanceReport(userId.ToString(), startMonth, endMonth);

            return data;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<ChildAttendanceReportModel> ChildAttendanceReport(
          [Service] IHttpContextAccessor contextAccessor,
          [Service] HierarchyEngine engine,
          [Service] ChildAttendanceReport report,
          string userId,
          Guid classgroupId,
          DateTime startDate,
          DateTime endDate)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            if (!contextAccessor.HttpContext.IsInRole(new[] { Roles.COACH, Roles.PRINCIPAL, Roles.PRACTITIONER })
                 || !engine.UserInHierarchy(uId, Guid.Parse(userId), true))
            {
                throw new UnauthorizedAccessException("You do not have permission to retrieve this data.");
            }
            var startMonth = startDate.GetStartOfMonth();

            DateTime endMonth;
            if (endDate.Month == DateTime.Now.Month)
            {
                endMonth = startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1) : DateTime.Now;
            }
            else
            {
                endMonth = endDate.GetEndOfMonth();
            }

            return report.GetChildAttendance(classgroupId, userId, startMonth.Date, endMonth.GetEndOfDay());
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.View)]
        public async Task<ClassroomGroupChildAttendanceReportOverviewModel> ClassroomAttendanceOverviewReport(
            [Service] ChildAttendanceReport report,
            [Service] IHttpContextAccessor httpContextAccessor,
            DateTime startDate,
            DateTime endDate)
        {
            var userId = httpContextAccessor.HttpContext.GetUser().Id;
            var startMonth = startDate.GetStartOfMonth();

            DateTime endMonth;
            if (endDate.Month == DateTime.Now.Month)
            {
                endMonth = startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1) : DateTime.Now;
            }
            else
            {
                endMonth = endDate.GetEndOfMonth();
            }

            return report.GetClassroomAttendanceOverView(userId.ToString(), startMonth.Date, endMonth.GetEndOfDay());
        }
    }
}
