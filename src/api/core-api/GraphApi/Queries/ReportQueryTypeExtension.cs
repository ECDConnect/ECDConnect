using DotLiquid.Tags;
using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ReportQueryTypeExtension
    {
        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public PractitionerMetricReport GetPractitionerMetrics([Service] IHttpContextAccessor contextAccessor, [Service] IGenericRepositoryFactory repoFactory)
        {
            var practitionerMetricReport = new PractitionerMetricReport();
            practitionerMetricReport.AvgChildren = 0;
            practitionerMetricReport.CompletedProfiles = 0;            
            practitionerMetricReport.OutstandingSyncs = 0; // TODO: ADD
            practitionerMetricReport.ProgramTypesData = new List<MetricReportStatItem>();
            practitionerMetricReport.StatusData = new List<MetricReportStatItem>();

            var userId = contextAccessor.HttpContext.GetUser().Id;

            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: userId);
            var programmeTypeRepo = repoFactory.CreateRepository<ProgrammeType>(userContext: userId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: userId);
            var childRepo = repoFactory.CreateRepository<Child>(userContext: userId);

            var allClassrooms = classroomRepo.GetAll();
            var allProgrammeTypes = programmeTypeRepo.GetAll();
            var allChildren = childRepo.GetAll();
            var allPractitioners = practitionerRepo.GetAll();
            var allClassroomGroups = classroomGroupRepo.GetAll().ToList();

            var practitionerCount = allPractitioners.Where(x => x.IsActive).Count();
            var childCount = allChildren.Where(x => x.IsActive).Count();
            practitionerMetricReport.AvgChildren = practitionerCount > 0 && childCount > 0 ? childCount / practitionerCount : 0;
            practitionerMetricReport.CompletedProfiles = allClassrooms.Where(x => x.IsActive).Count();

            foreach (var programType in allProgrammeTypes)
            {
                var classroomGroupProgramTypeGroup = allClassroomGroups.Where(x => x.ProgrammeTypeId == programType.Id).GroupBy(x => x.ClassroomId);
                var classroomGroupProgramTypeGroupCount = classroomGroupProgramTypeGroup.Count();
                practitionerMetricReport.ProgramTypesData.Add(new MetricReportStatItem() { Name = programType.Description, Value = classroomGroupProgramTypeGroupCount.ToString() });
            }


            practitionerMetricReport.StatusData.Add(new MetricReportStatItem() { Name = "Active", Value = allPractitioners.Where(x => x.IsActive).Count().ToString() });
            practitionerMetricReport.StatusData.Add(new MetricReportStatItem() { Name = "InActive", Value = allPractitioners.Where(x => !x.IsActive).ToString() });


            return practitionerMetricReport;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public int GetPractitionerNewSignupMetric([Service] IHttpContextAccessor contextAccessor, [Service] IGenericRepositoryFactory repoFactory, DateTime fromDate, DateTime toDate)
        {
            var userId = contextAccessor.HttpContext.GetUser().Id;

            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            var allPractitioners = practitionerRepo.GetAll();            

            var practitionerCount = allPractitioners.Where(x => x.IsActive).Count();            
            var date = DateTime.Now.AddDays(-30);
            var newPractitioners = allPractitioners.Where(f => f.InsertedDate >= fromDate && f.InsertedDate < toDate).Count();        

            return newPractitioners;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public ChildrenMetricReport GetChildrenMetrics([Service] IHttpContextAccessor contextAccessor, 
            [Service] IGenericRepositoryFactory repoFactory, 
            [Service] AttendanceTrackingRepository attendanceRepo)
        {
            var userId = contextAccessor.HttpContext.GetUser().Id;

            var childrenMetricReport = new ChildrenMetricReport();
            childrenMetricReport.TotalChildren = 0;
            childrenMetricReport.TotalChildProgressReports = 0;
            childrenMetricReport.UnverifiedDocuments = 0;
            childrenMetricReport.StatusData = new List<MetricReportStatItem>();
            childrenMetricReport.ChildAttendacePerMonthData = new List<MetricReportStatItem>();            

            var startOfYear = DateTime.Now.GetStartOfYear();
            var endOfYear = DateTime.Now.GetEndOfYear();

            var attendaceRepo = attendanceRepo.GetAllByDateRange(startOfYear, endOfYear);
            var childRepo = repoFactory.CreateRepository<Child>(userContext: userId);
            var documentRepo = repoFactory.CreateRepository<Document>(userContext: userId);
            var workflowStatusRepo = repoFactory.CreateRepository<WorkflowStatus>(userContext: userId);
            var childProgressReportRepo = repoFactory.CreateRepository<ChildProgressReport>(userContext: userId);

            var allWorkflowStatus = workflowStatusRepo.GetAll();
            var allChildren = childRepo.GetAll().ToList();
            var allDocuments = documentRepo.GetAll();

            childrenMetricReport.TotalChildren = allChildren.Count();
            childrenMetricReport.TotalChildProgressReports = childProgressReportRepo.GetAll().Count();
            childrenMetricReport.UnverifiedDocuments = documentRepo.GetAll().Where(x => x.WorkflowStatus.EnumId == ECDLink.Abstractrions.Enums.WorkflowStatusEnum.DocumentPendingVerification).Count();

            // TODO: CREATE A CONSTANT ENUM FOR WORKSTATUS TYPES
            foreach (var workflowStatus in allWorkflowStatus.Where(x => x.WorkflowStatusType.Description == "Child"))
            {
                var childrenWithStatusCount = allChildren.Where(x => x.WorkflowStatusId == workflowStatus.Id).Count();
                childrenMetricReport.StatusData.Add(new MetricReportStatItem() { Name = workflowStatus.Description, Value = childrenWithStatusCount.ToString() });
            }

            for (int i = 0; i <= 11; i++)
            {
                var month = CultureInfo.CurrentCulture.DateTimeFormat.MonthNames[i];
                var attendanceCount = attendaceRepo.Where(x => x.AttendanceDate.Month == i).Count();
                childrenMetricReport.ChildAttendacePerMonthData.Add(new MetricReportStatItem() { Name = month, Value = attendanceCount.ToString() });
            }


            return childrenMetricReport;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<MetricReportStatItem> GetChildrenAttendedVsAbsentMetrics([Service] IHttpContextAccessor contextAccessor, 
            [Service] AttendanceTrackingRepository attendanceRepo, 
            DateTime fromDate,
            DateTime toDate)
        {
            var userId = contextAccessor.HttpContext.GetUser().Id;

            var attendedVsAbsent = new List<MetricReportStatItem>();

            var attendaceRepo = attendanceRepo.GetAllByDateRange(fromDate, toDate);

            var attendanceAttended = attendaceRepo.Where(x => x.Attended).Count();
            var attendanceUnAttended = attendaceRepo.Where(x => !x.Attended).Count();

            attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Attended", Value = attendanceAttended.ToString() });
            attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Absent", Value = attendanceUnAttended.ToString() });


            return attendedVsAbsent;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<ClassroomMetricReport> GetClassAttendanceMetrics([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
    [Service] AttendanceTrackingRepository attendanceRepo)
        {
            
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var attendedVsAbsent = new List<MetricReportStatItem>();

            DateTime reference = DateTime.Now;
            var fromDate = new DateTime(reference.Year, reference.Month, 1);
            var toDate = reference.AddMonths(1).AddDays(-1);
            var attendaceRepo = attendanceRepo.GetAllByDateRange(fromDate, toDate);

            var attendanceAttended = attendaceRepo.Where(x => x.Attended).Count();
            //var attendanceUnAttended = attendaceRepo.Where(x => !x.Attended).Count();

            attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Attended", Value = attendanceAttended.ToString() });
            //attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Absent", Value = attendanceUnAttended.ToString() });
            List<ClassroomMetricReport> metrics = new List<ClassroomMetricReport>();
            var classRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classes = classRepo.GetAll(); //get all classrooms assigned to user
            foreach (var c in classes)
            {
                var thisClass = new ClassroomMetricReport() { childCount = 4, attendancePercentage = 75, classroomId = c.Id };
                metrics.Add(thisClass);
            }
            //

            return metrics; 
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<NotificationDisplay> GetDisplayMetrics([Service] IHttpContextAccessor contextAccessor, 
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] IGenericRepositoryFactory repoFactory,
            string type,
            DateTime fromDate,
            DateTime toDate)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var notificationList = new List<NotificationDisplay>();


            //var attendanceAttended = attendaceRepo.Where(x => x.Attended).Count();
            //var attendanceUnAttended = attendaceRepo.Where(x => !x.Attended).Count();

            //attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Attended", Value = attendanceAttended.ToString() });
            //attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Absent", Value = attendanceUnAttended.ToString() });
            /*Do logic for weighting - loop through each user then
            1: Get all not registered
            2: Get all progress reports overdue
            3: Get all incomplete registers (for practitioners/principals)
            4: Get Days absent (for practitioners/principals)
            5: Get Child attendance for each

            Add weighting to each subject, and weigh up for each user what the messages are and use weighting to push the most relevant message up to the top, and assign colour, icon and Message to each
            return list to FE for each user
            */
            switch (type)
            {
                case "child":
                    var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
                    var children = childRepo.GetAll();
                    foreach (var user in children)
                    {
                        //get attendance





                        NotificationDisplay display = new NotificationDisplay()
                        {
                            Subject = "Child Information missing",
                            Icon = "redicon",
                            Color = "red",
                            Message = "",
                            Notes = "",
                            UserId = Guid.Parse(user.UserId),
                            UserType = "child"
                           
                        };
                        //var attendaceRepo = attendanceRepo.GetAllByDateRange(fromDate, toDate);

                        notificationList.Add(display);
                    }
                    break;
                case "practitioner": //practitioners and principals
                    var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
                    var practitioners = practRepo.GetAll();
                    foreach (var user in practitioners)
                    {
                        NotificationDisplay display = new NotificationDisplay()
                        {
                            Subject = "0 days absent last month",
                            Icon = "greenicon",
                            Color = "green",
                            Message = "",
                            Notes = "",
                            UserId = Guid.Parse(user.UserId),
                            UserType = "practitioner"
                        };
                        //var attendaceRepo = attendanceRepo.GetAllByDateRange(fromDate, toDate);

                        notificationList.Add(display);
                    }
                    break;
            }



            return notificationList;
        }
    }
}
