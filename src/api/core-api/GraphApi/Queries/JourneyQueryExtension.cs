using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class JourneyQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<JourneyTimeline> GetJourneyTimeline(
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            Guid userId)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var timeline = new List<JourneyTimeline>();
            var practitioner = dbContext.Practitioners.FirstOrDefault(x => x.UserId == userId && x.IsActive);

            // Registration
            timeline.Add(new JourneyTimeline()
            {
                Name = $"Registerd for {TenantExecutionContext.Tenant.ApplicationName}",
                DateCompleted = practitioner.StartDate.Value.ToString("dd MMMM yyyy"),
                IconName = "ArrowRightIcon",
                DateValue = practitioner.StartDate.Value
            });

            // Courses completed
            var courses = dbContext.UserTrainingCourses.Where(x => x.UserId == userId && x.IsActive && x.CompletedDate.Year == DateTime.Now.Year)
                                                        .OrderByDescending(x => x.CompletedDate)
                                                        .Select(x => new JourneyTimeline
                                                        {
                                                            Name = $"Course completed: {x.CourseName}",
                                                            DateCompleted = x.CompletedDate.ToString("dd MMMM yyyy"),
                                                            IconName = "AcademicCapIcon",
                                                            DateValue = x.CompletedDate
                                                        });
            if (courses.Any())
            {
                timeline.AddRange(courses);
            }                                           
            // Self-assessment completed
            var selfAssessments = dbContext.Visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_self_assessment && x.PractitionerId == practitioner.Id && x.IsActive)
                                                    .OrderByDescending(x => x.ActualVisitDate)
                                                    .Select(x => new JourneyTimeline
                                                    {
                                                        Name = "Self-assessment form completed",
                                                        DateCompleted = x.ActualVisitDate.Value.ToString("dd MMMM yyyy"),
                                                        IconName = "ArrowRightIcon",
                                                        DateValue = x.ActualVisitDate.Value
                                                    });;
            
            if (selfAssessments.Any())
            {
                timeline.AddRange(selfAssessments);
            }

            return timeline
                .OrderBy(x => x.DateValue)
                .ToList();
        }

    }
}
