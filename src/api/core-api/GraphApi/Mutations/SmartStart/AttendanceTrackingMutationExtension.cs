using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class AttendanceTrackingMutationExtension
    {
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public async Task<bool> TrackAttendance(
          [Service] AttendanceTrackingRepository trackingRepository,
          TrackAttendanceModel attendance
          )
        {
            System.Guid tenantId = TenantExecutionContext.Tenant.Id;
            var dbEntities = new List<Attendance>();

            // Add Parent Record
            dbEntities.Add(new Attendance
            {
                ClassroomProgrammeId = attendance.ClassroomProgrammeId,
                ParentRecordId = attendance.ProgrammeOwnerId,
                UserId = attendance.ProgrammeOwnerId,
                WeekOfYear = attendance.AttendanceDate.GetWeekOfYear(),
                MonthOfYear = attendance.AttendanceDate.Month,
                Year = attendance.AttendanceDate.Year,
                AttendanceDate = attendance.AttendanceDate,
                Attended = true,
                TenantId = tenantId
            });

            foreach (var attendee in attendance.Attendees)
            {
                dbEntities.Add(new Attendance
                {
                    ClassroomProgrammeId = attendance.ClassroomProgrammeId,
                    ParentRecordId = attendance.ProgrammeOwnerId,
                    UserId = attendee.UserId,
                    WeekOfYear = attendance.AttendanceDate.GetWeekOfYear(),
                    MonthOfYear = attendance.AttendanceDate.Month,
                    Year = attendance.AttendanceDate.Year,
                    AttendanceDate = attendance.AttendanceDate,
                    Attended = attendee.Attended,
                    TenantId = tenantId
                });
            }

            return await trackingRepository.TrackAttendance(dbEntities);
        }
    }
}
