using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class ProgressSummaryReportNotificationTask : INotificationTask
    {
        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private HierarchyEngine _hierarchyEngine;

        private readonly INotificationService _notificationService;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private IGenericRepository<ChildProgressReportPeriod, Guid> _childProgressReportPeriodRepo;
        private IGenericRepository<ChildProgressReport, Guid> _childProgressReportRepo;
        private IGenericRepository<UserPermission, Guid> _userPermissionRepo;
        private IGenericRepository<ClassroomGroup, Guid> _classroomGroupRepo;


        public ProgressSummaryReportNotificationTask(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);

            _notificationService = notificationService;
            _practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _childProgressReportPeriodRepo = _repoFactory.CreateGenericRepository<ChildProgressReportPeriod>(userContext: _applicationUserId);
            _childProgressReportRepo = _repoFactory.CreateGenericRepository<ChildProgressReport>(userContext: _applicationUserId);
            _userPermissionRepo = _repoFactory.CreateGenericRepository<UserPermission>(userContext: _applicationUserId);
            _classroomGroupRepo = _repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return true;
        }

        public async Task SendNotifications()
        {

            // "Trigger the day after the reporting ""end date"" as specified by the principal in W9.
            // For users who have permission to create progress reports:
            // -  ONLY SHOW IF less than 100% of the progress reports were created for all relevant children for a reporting period (for principal, all children at preschool; for practitioner, all children assigned to them)
            // For users who do NOT have permission to create reports:
            // - show if 1 or more reports created for children assigned to them.
            // Don't show if user has zero children assigned to them."

            var today = DateTime.Now.Date;
            var yesterday = today.AddDays(-1);
            var tomorrow = today.AddDays(1);
            var endOfNotification = today.AddDays(7);

            // get all active periods ending yesterday
            var allReportingEndingPeriods = _childProgressReportPeriodRepo
                                            .GetAll()
                                            .Where(x => x.IsActive && x.EndDate.Date == yesterday.Date)
                                            .Select(x => new {x.Id, x.ClassroomId, x.Classroom.User})
                                            .Distinct()
                                            .ToList();
                                                
            if (allReportingEndingPeriods.Count() > 0) 
            {
                var allPeriodIds = allReportingEndingPeriods.Select(x => x.Id).Distinct().ToList();
                var allClassroomIds = allReportingEndingPeriods.Select(x => x.ClassroomId).Distinct().ToList();
                var allClassroomRecords = allReportingEndingPeriods.Select(x => new { x.User, x.ClassroomId }).Distinct().ToList();

                // get all active linked reports to periods ending yesterday
                var allCompletedReports = _childProgressReportRepo
                                            .GetAll()
                                            .Where(x => x.IsActive && allPeriodIds.Contains(x.ChildProgressReportPeriodId) && x.DateCompleted.HasValue)
                                            .Select(x => new {x.User, x.ChildId, x.ChildProgressReportPeriodId})
                                            .Distinct()
                                            .ToList();
                    
                // when there are no completed reports linked to this period, then we create a notification for each principal who has linked classes and learners
                if (allCompletedReports.Count() == 0) 
                {
                    // var allClassroomGroups = _classroomGroupRepo.GetAll().Where(x => x.IsActive && allClassroomIds.Contains(x.ClassroomId)).Select(x => new {x.Id, x.ClassroomId, x.Learners}).ToList();

                    // if (allClassroomGroups.Count() > 0) 
                    // {

                    //     var replacements = new List<TagsReplacements>
                    //     {
                    //         new TagsReplacements()
                    //         {
                    //             FindValue = "TotalChildren",
                    //             ReplacementValue = "0"
                    //         }
                    //     };

                    //     foreach (var record in allClassroomRecords)
                    //     {
                    //         // only add the notification when there are linked classes and learners
                    //         var linkedClassLearners = allClassroomGroups.Where(x => x.ClassroomId == record.ClassroomId).SelectMany(x => x.Learners).ToList();
                    //         if (linkedClassLearners.Any()) 
                    //         {
                    //             var linkedChildProgressReportPeriodId = allReportingEndingPeriods.Where(x => x.ClassroomId == record.ClassroomId).Select(x => x.Id).FirstOrDefault();
                    //             await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ProgressSummaryReport, today.Date, record.User, "", MessageStatusConstants.Blue, replacements, endOfNotification,
                    //                                                     relatedEntities: new List<RelatedEntity> { new RelatedEntity(linkedChildProgressReportPeriodId, "ChildProgressReportPeriod") });
                    //         }
                    //     }
                    // }
                } 
                else 
                {
                    var tenant = TenantExecutionContext.Tenant;
                    var uniqueReportUsersIds = allCompletedReports.Select(x => x.User.Id).Distinct().ToList();
                    var practitioners = _practitionerRepo.GetAll().Where(x => x.IsActive && x.UserId.HasValue && uniqueReportUsersIds.Contains((Guid)x.UserId)).ToList();
                    var classes = _classroomGroupRepo.GetAll()
                                .Include(x => x.Learners
                                    .Where(y => y.IsActive 
                                        && (!y.StoppedAttendance.HasValue || y.StoppedAttendance > DateTime.Now)))
                                .Include(x => x.Classroom)
                                .Where(x =>
                                    x.IsActive
                                    && x.Classroom.IsActive
                                    && (uniqueReportUsersIds.Contains((Guid)x.Classroom.UserId) || uniqueReportUsersIds.Contains((Guid)x.UserId)))
                                .ToList();
                    var userPermissions = _userPermissionRepo.GetAll().Where(x => x.IsActive 
                                                && uniqueReportUsersIds.Contains((Guid)x.UserId) 
                                                && x.Permission.Name == Constants.PermissionNames.CreateProgressReports)
                                                .Select(x => x.UserId)
                                                .ToList();
                    
                    foreach (var practitioner in practitioners)
                    {
                        var practitionerPermission = userPermissions.Where(x => x == practitioner.UserId).FirstOrDefault();
                        var totalReportsComplete = allCompletedReports.Where(x => x.User.Id == practitioner.UserId).Select(x => x.ChildId).Distinct().Count();
                        var totalLearners = 0;
                        var linkedChildProgressReportPeriodId = allCompletedReports.Where(x => x.User.Id == practitioner.UserId).Select(x => x.ChildProgressReportPeriodId).FirstOrDefault();
                        var replacements = new List<TagsReplacements>
                                            {
                                                new TagsReplacements()
                                                {
                                                    FindValue = "TotalChildren",
                                                    ReplacementValue = totalReportsComplete.ToString()
                                                }
                                            };
                        
                        if (practitioner.IsPrincipalOrAdmin()) 
                        {
                            totalLearners = classes.Where(x => x.Classroom.UserId == practitioner.UserId).SelectMany(x => x.Learners).Distinct().Count();
                            if (totalLearners != 0 && totalLearners != totalReportsComplete) 
                            {
                                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ProgressSummaryReport, today.Date, practitioner.User, "", MessageStatusConstants.Blue, replacements, endOfNotification,
                                                                            relatedEntities: new List<RelatedEntity> { new RelatedEntity(linkedChildProgressReportPeriodId, "ChildProgressReportPeriod") });
                            }
                        } 
                        else 
                        {
                            var learners = classes.Where(x => x.UserId == practitioner.UserId).SelectMany(x => x.Learners).ToList();
                            totalLearners = learners.Count();
                            if (totalLearners != 0 && totalLearners != totalReportsComplete) 
                            {
                                if (practitionerPermission != null) 
                                {
                                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ProgressSummaryReport, today.Date, practitioner.User, "", MessageStatusConstants.Blue, replacements, endOfNotification,
                                                                                relatedEntities: new List<RelatedEntity> { new RelatedEntity(linkedChildProgressReportPeriodId, "ChildProgressReportPeriod") });
                                } 
                                else 
                                {
                                    var totalLinkedLearners = learners.Where(x => x.Hierarchy.StartsWith(practitioner.Hierarchy)).Count();
                                    if (totalLinkedLearners != 0)
                                    {
                                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ProgressSummaryReport, today.Date, practitioner.User, "", MessageStatusConstants.Blue, replacements, endOfNotification,
                                                                                relatedEntities: new List<RelatedEntity> { new RelatedEntity(linkedChildProgressReportPeriodId, "ChildProgressReportPeriod") });
                                    }


                                }
                            }
                        }
                    }
                }
            }

        }
    }
}
