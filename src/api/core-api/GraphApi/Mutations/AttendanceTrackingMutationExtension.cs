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

            var callerUserId = contextAccessor.HttpContext.GetUser()?.Id ?? Guid.Empty;

            foreach (var attendanceElement in attendance)
            {
                if (!Guid.TryParse(attendanceElement.ProgrammeOwnerId, out var programmeOwnerId)
                    || programmeOwnerId == Guid.Empty)
                {
                    programmeOwnerId = callerUserId;
                }

                if (programmeOwnerId == Guid.Empty)
                {
                    throw new GraphQLException(
                        ErrorBuilder.New()
                            .SetMessage("Unable to save attendance.")
                            .SetCode("USER_ERROR")
                            .Build());
                }

                var programmeOwnerIdValue = programmeOwnerId.ToString();

                // Add Parent Record
                dbEntities.Add(new Attendance
                {
                    ClassroomProgrammeId = attendanceElement.ClassroomProgrammeId,
                    ParentRecordId = programmeOwnerIdValue,
                    UserId = programmeOwnerId,
                    WeekOfYear = attendanceElement.AttendanceDate.GetWeekOfYear(),
                    MonthOfYear = attendanceElement.AttendanceDate.Month,
                    Year = attendanceElement.AttendanceDate.Year,
                    AttendanceDate = attendanceElement.AttendanceDate.Date,
                    Attended = true,
                    TenantId = tenantId
                });

                foreach (var attendee in attendanceElement.Attendees)
                {
                    if (!Guid.TryParse(attendee.UserId, out var attendeeUserId)
                        || attendeeUserId == Guid.Empty)
                    {
                        throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage("Unable to save attendance.")
                                .SetCode("USER_ERROR")
                                .Build());
                    }

                    dbEntities.Add(new Attendance
                    {
                        ClassroomProgrammeId = attendanceElement.ClassroomProgrammeId,
                        ParentRecordId = programmeOwnerIdValue,
                        UserId = attendeeUserId,
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
