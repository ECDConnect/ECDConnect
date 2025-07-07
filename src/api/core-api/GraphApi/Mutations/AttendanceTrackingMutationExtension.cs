using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class AttendanceTrackingMutationExtension
    {
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public async Task<bool> TrackAttendance(
          [Service] AttendanceTrackingRepository trackingRepository,
          [Service] IPointsEngineService pointsEngineService,
          [Service] IHttpContextAccessor contextAccessor,
          List<TrackAttendanceModel> attendance
          )
        {
            var tenantId = TenantExecutionContext.Tenant.Id;
            var dbEntities = new List<Attendance>();

            if (attendance == null)
            {
                return false;
            }

            foreach (var attendanceElement in attendance)
            {
                // Add Parent Record
                dbEntities.Add(new Attendance
                {
                    ClassroomProgrammeId = attendanceElement.ClassroomProgrammeId,
                    ParentRecordId = attendanceElement.ProgrammeOwnerId,
                    UserId = Guid.Parse(attendanceElement.ProgrammeOwnerId),
                    WeekOfYear = attendanceElement.AttendanceDate.GetWeekOfYear(),
                    MonthOfYear = attendanceElement.AttendanceDate.Month,
                    Year = attendanceElement.AttendanceDate.Year,
                    AttendanceDate = attendanceElement.AttendanceDate.Date,
                    Attended = true,
                    TenantId = tenantId
                });

                foreach (var attendee in attendanceElement.Attendees)
                {
                    dbEntities.Add(new Attendance
                    {
                        ClassroomProgrammeId = attendanceElement.ClassroomProgrammeId,
                        ParentRecordId = attendanceElement.ProgrammeOwnerId,
                        UserId = Guid.Parse(attendee.UserId),
                        WeekOfYear = attendanceElement.AttendanceDate.GetWeekOfYear(),
                        MonthOfYear = attendanceElement.AttendanceDate.Month,
                        Year = attendanceElement.AttendanceDate.Year,
                        AttendanceDate = attendanceElement.AttendanceDate.Date,
                        Attended = attendee.Attended,
                        TenantId = tenantId
                    });
                }
            }

            var result = await trackingRepository.TrackAttendance(dbEntities);

            if (result == true)
            {
                var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
                pointsEngineService.CalculateChildAttendanceRegisterSaved(applicationUserId);
            }

            return result;
        }
    }
}
