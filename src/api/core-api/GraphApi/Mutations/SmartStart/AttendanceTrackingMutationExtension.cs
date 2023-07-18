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
          List<TrackAttendanceModel> attendance
          )
        {
            System.Guid tenantId = TenantExecutionContext.Tenant.Id;
            var dbEntities = new List<Attendance>();

            if (attendance != null)
            {
                foreach (var attendanceElement in attendance)
                {
                    // Add Parent Record
                    dbEntities.Add(new Attendance
                    {
                        ClassroomProgrammeId = attendanceElement.ClassroomProgrammeId,
                        ParentRecordId = attendanceElement.ProgrammeOwnerId,
                        UserId = attendanceElement.ProgrammeOwnerId,
                        WeekOfYear = attendanceElement.AttendanceDate.GetWeekOfYear(),
                        MonthOfYear = attendanceElement.AttendanceDate.Month,
                        Year = attendanceElement.AttendanceDate.Year,
                        AttendanceDate = attendanceElement.AttendanceDate,
                        Attended = true,
                        TenantId = tenantId
                    });

                    foreach (var attendee in attendanceElement.Attendees)
                    {
                        dbEntities.Add(new Attendance
                        {
                            ClassroomProgrammeId = attendanceElement.ClassroomProgrammeId,
                            ParentRecordId = attendanceElement.ProgrammeOwnerId,
                            UserId = attendee.UserId,
                            WeekOfYear = attendanceElement.AttendanceDate.GetWeekOfYear(),
                            MonthOfYear = attendanceElement.AttendanceDate.Month,
                            Year = attendanceElement.AttendanceDate.Year,
                            AttendanceDate = attendanceElement.AttendanceDate,
                            Attended = attendee.Attended,
                            TenantId = tenantId
                        });
                    }
                }
                return await trackingRepository.TrackAttendance(dbEntities);
            }
            return false;
        }
    }
}
