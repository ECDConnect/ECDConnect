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
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.Documents;
using NPOI.OpenXmlFormats.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using static ECDLink.Core.SystemSettings.SettingGroups;
using Document = ECDLink.DataAccessLayer.Entities.Documents.Document;

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
            [Service] AttendanceTrackingRepository attendanceRepo, 
            DateTime startMonth, 
            DateTime endMonth)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerRepo.GetAll().ToList(); //get all practitioners within userhierarchy
            
            List<ClassroomMetricReport> metrics = new List<ClassroomMetricReport>();
            foreach (var practitioner in practitioners)
            {
                var metric = this.GetClassAttendanceMetricsByUser(contextAccessor, repoFactory, attendanceRepo, practitioner.UserId, startMonth, endMonth);
                if (metric.Any())
                {
                    if (metric.FirstOrDefault().classroomGroupId.ToString() != "00000000-0000-0000-0000-000000000000")
                    {
                        metrics.AddRange(metric);
                    }
                }

            }
            return metrics;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<ClassroomMetricReport> GetClassAttendanceMetricsByUser([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] AttendanceTrackingRepository attendanceRepo, string userId, DateTime startMonth, DateTime endMonth)
        {
            DateTime reference = DateTime.Now;

            List<ClassroomMetricReport> metric = new List<ClassroomMetricReport>();
            var classRepo = repoFactory.CreateRepository<Classroom>(userContext: userId);
            var classGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: userId);
            var LearnerRepo = repoFactory.CreateRepository<Learner>(userContext: userId);

            var fromDate = (startMonth!=null? startMonth : new DateTime(reference.Year, reference.Month, 1));
            fromDate = fromDate.AddMonths(-1);
            var toDate = (endMonth!=null? endMonth:reference);//fromDate.GetEndOfMonth();///reference.AddDays(-1); //start of month - day is end of last month

            var classroomGroups = classGroupRepo.GetAll().Where(x => x.UserId.ToString().Contains(userId)).ToList();
            if (classroomGroups != null)
            {
                foreach (var group in classroomGroups)
                {
                    List<Learner> learners = LearnerRepo.GetAll().Where(x => x.ClassroomGroupId.ToString().Contains(group.Id.ToString())).ToList();
                    int childCount = learners.Count;
                    int month = fromDate.Month;
                    int year = fromDate.Year;
                    int weekOfYear = fromDate.GetWeekOfYear();

                    int attendancePercentage = 0;
                    List <Attendance> attendanceData = attendanceRepo.GetAllByDateRangeByClassroom(fromDate, toDate, group.Id, group.UserId.ToString());
                    if (attendanceData.Any())
                    {
                        var attendanceAttended = attendanceData.Where(x => x.Attended == true).Count();
                        var attendanceUnAttended = attendanceData.Where(x => x.Attended == false).Count();
                        if (attendanceUnAttended > 0)
                        attendancePercentage = (int)(childCount > 0 && attendanceAttended > 0 ? Math.Round((double)(attendanceAttended / (double)(attendanceAttended + attendanceUnAttended)) * 100) : 0);
                        //override month and year to attendance month and year
                        month = attendanceData.FirstOrDefault().MonthOfYear;
                        year = attendanceData.FirstOrDefault().Year;
                        weekOfYear = attendanceData.FirstOrDefault().WeekOfYear;
                    }
                    metric.Add(new ClassroomMetricReport() { childCount = childCount, attendancePercentage = attendancePercentage, classroomGroupId = group.Id.ToString(), classroomId = group.ClassroomId.ToString(), month = month, year = year, weekOfYear = weekOfYear, practitionerId = userId });                        
                }
            }

            return metric; 
        }


        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<ClassroomMetricReport> GetYearlyClassAttendanceMetricsByUser([Service] IHttpContextAccessor contextAccessor,
        [Service] IGenericRepositoryFactory repoFactory,
        [Service] AttendanceTrackingRepository attendanceRepo, string userId)
        {

            var uId = contextAccessor.HttpContext.GetUser().Id;

            DateTime reference = DateTime.Now;
            //var fromDate = new DateTime(reference.Year, reference.Month, 1);

            List<ClassroomMetricReport> metrics = new List<ClassroomMetricReport>();
            var classRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            var classes = classRepo.GetAll(); //get all classrooms assigned to user

            for (int idx = 1; idx <= 12; idx++)
            {
                var fromDate = new DateTime(reference.Year, reference.Month, 1);
                fromDate = fromDate.AddMonths(-idx);
                var toDate = reference.AddMonths(idx + 1).AddDays(-1); //todate is always start of the month, + 1 month - 1 day gives the last day of that month

                var attendaceRepo = attendanceRepo.GetAllByDateRange(fromDate, toDate);
                var attendanceAttended = attendaceRepo.Where(x => x.Attended).Count();
                var attendanceUnAttended = attendaceRepo.Where(x => !x.Attended).Count();

                foreach (var c in classes)
                {
                    //calculate attendance
                    var attendedVsAbsent = new List<MetricReportStatItem>();
                    attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Attended", Value = attendanceAttended.ToString() });
                    attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Absent", Value = attendanceUnAttended.ToString() });

                    var thisClass = new ClassroomMetricReport() { childCount = 4, attendancePercentage = 75, classroomId = c.Id.ToString(), month = fromDate.Month, year = fromDate.Year };
                    metrics.Add(thisClass);
                }
            }

            return metrics;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<NotificationDisplay> GetDisplayMetrics([Service] IHttpContextAccessor contextAccessor, 
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] IGenericRepositoryFactory repoFactory,
            string type)//, DateTime fromDate,DateTime toDate
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var notificationList = new List<NotificationDisplay>();

            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var absenteeRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);            
            //loop for last 12 months
            //for (int idx = 1; idx <= 12; idx++)
            //{
            DateTime reference = DateTime.Now;
                //fromDate = (fromDate!=null?fromDate : new DateTime(reference.Year, reference.Month, 1).AddMonths(-1));
                //fromDate = fromDate.AddMonths(-1);
                //toDate = (toDate != null ? toDate : reference.AddMonths(-idx).AddDays(-1);//decrement

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
                switch (type.ToLower())
                {
                    case "child":
                        
                        var children = childRepo.GetAll();
                        foreach (var user in children)
                        {
                            NotificationDisplay displayChild = new NotificationDisplay()
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

                            notificationList.Add(displayChild);
                        }
                        break;
                    case "practitioner": //practitioners and principals

                        var practitioners = practRepo.GetAll();
                        foreach (var user in practitioners)
                        {
                            //get absent days
                            //int daysAbsent = 0;
                            NotificationDisplay displayPracti = new NotificationDisplay()
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

                            notificationList.Add(displayPracti);
                        }
                    break;
                case "coach": //practitioners and principals
                    //var practitioners = practRepo.GetAll();
                    //foreach (var user in practitioners)
                    //{
                        //get absent days
                        int daysAbsent = 0;
                        NotificationDisplay displayCoach = new NotificationDisplay()
                        {
                            Subject = "0 days absent last month",
                            Icon = "greenicon",
                            Color = "green",
                            Message = "",
                            Notes = "",
                            UserId = Guid.Parse(uId),
                            UserType = "coach"
                        };
                        //var attendaceRepo = attendanceRepo.GetAllByDateRange(fromDate, toDate);

                        notificationList.Add(displayCoach);
                    //}
                    break;
                }
            //}



            return notificationList;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public PractitionerMetricReport GetOwnershipMetrics([Service] IHttpContextAccessor contextAccessor, [Service] IGenericRepositoryFactory repoFactory)
        {
            var practitionerMetricReport = new PractitionerMetricReport();
            practitionerMetricReport.AvgChildren = 0;
            practitionerMetricReport.CompletedProfiles = 0;
            practitionerMetricReport.OutstandingSyncs = 0; // TODO: ADD
            practitionerMetricReport.ProgramTypesData = new List<MetricReportStatItem>();
            practitionerMetricReport.StatusData = new List<MetricReportStatItem>();

            var userId = contextAccessor.HttpContext.GetUser().Id;

            //all user hierarchy related data
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
            practitionerMetricReport.AllChildren = allChildren.Where(x => x.IsActive).Count();
            practitionerMetricReport.AllClassrooms = allClassrooms.Where(x => x.IsActive).Count();
            practitionerMetricReport.AllClassroomGroups = allClassroomGroups.Where(x => x.IsActive).Count();

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

    }
}
