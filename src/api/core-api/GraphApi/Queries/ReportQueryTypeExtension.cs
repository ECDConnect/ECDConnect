using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
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
            var classGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: userId);
            var LearnerRepo = repoFactory.CreateRepository<Learner>(userContext: userId);

            var fromDate = (startMonth != null ? startMonth : new DateTime(reference.Year, reference.Month, 1));
            fromDate = fromDate.AddMonths(-1);
            var toDate = endMonth;
            if (endMonth == null)
            {
                toDate = reference;
            }


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
                    List<Attendance> attendanceData = attendanceRepo.GetAllByDateRangeByClassroom(fromDate, toDate, group.Id, group.UserId.ToString());
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

            List<ClassroomMetricReport> metrics = new List<ClassroomMetricReport>();
            var classRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
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
            GenericQueryTypeExtension genericQueries = new GenericQueryTypeExtension();
            var notificationList = new List<NotificationDisplay>();

            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);

            //set basic dates to be last month and before last
            DateTime reference = DateTime.Now;
            DateTime fromDate = reference.GetStartOfPreviousMonth();
            DateTime toDate = reference.GetEndOfPreviousMonth();

            int avgClassDays = 20;

            DisplaySet weighting30 = new DisplaySet();
            DisplaySet weighting20 = new DisplaySet();
            DisplaySet weighting10 = new DisplaySet();

            /*Do logic for weighting - loop through each user then
            1: Get all not registered
            2: Get all progress reports overdue
            3: Get all incomplete registers (for practitioners/principals)
            4: Get Days absent (for practitioners/principals)
            5: Get Child attendance for each
            6: get all leavers - practitioners disputing association to principal
            7: get all no classes assigned
            8: 

            Add weighting to each subject, and weigh up for each user what the messages are and use weighting to push the most relevant message up to the top, and assign colour, icon and Message to each
            return list to FE for each user
            */
            type = type.ToLower();

            if (type == "child")
            {
                //child view from practitioner/principal/coach
                var children = childRepo.GetAll();
                foreach (var user in children)
                {
                    NotificationDisplay displayChild = new NotificationDisplay()
                    {
                        Subject = "Missing Attendance",
                        Icon = MetricsIconEnum.Error.ToString(),
                        Color = MetricsColorEnum.Error.ToString(),
                        Message = "",
                        Notes = "",
                        UserId = Guid.Parse(user.UserId),
                        UserType = "child"

                    };

                    notificationList.Add(displayChild);
                }
            }
            if (type == "practitioner" || type == "principal" || type == "coach")
            {  //practitioners and principals
                var practitioners = practRepo.GetAll().ToList();
                foreach (var user in practitioners)
                {
                    string finalMessageToDisplay = "";
                    string finalIcon = "";
                    string finalColor = "";
                    string finalNotes = "";
                    int priority = 8; //set the priority high and override as importance goes along
                    int weighting = 0;
                    int absentDays = 0;


                    //get absent days count 
                    if (type != "coach")
                    {
                        absentDays = genericQueries.GetAbsentees(contextAccessor, repoFactory, user.UserId, fromDate, toDate).Count();
                    }
                    else
                    {

                        //TODO - logic to calculate
                        weighting10.Icon = MetricsIconEnum.Warning.ToString();
                        weighting10.Color = MetricsColorEnum.Warning.ToString();
                        weighting10.Subject = 0 + " Children did not progress";
                        weighting10.Notes = "Improve child progress";
                        priority = 5;
                        weighting = 10;
                    }
                    //get is registered?
                    bool isRegistered = (user.IsRegistered != null && user.IsRegistered == true ? true : false);
                    //get is leaving?
                    bool isLeaving = (user.IsLeaving != null && user.IsLeaving == true ? true : false);
                    //get is complete?
                    bool isComplete = (user.IsRegistered != null && user.IsRegistered == true ? true : false);//((double)user.Progress > 0.2 ? true : false); // TODO: when FE is fully integrated to use the progress indicators, then revert and not user IsRegistered

                    int attendancePercentage = 0;
                    if (isRegistered)
                    {
                        //get attendance register counts across all classroomgroups and programmes
                        attendancePercentage = attendanceRepo.GetAttendancePercentileByParent(user.UserId, fromDate, toDate);
                    }
                    //TODO
                    //progress reports overdue count

                    //TODO
                    //incomplete child registers count

                    //TODO
                    //child progress reporting for coach


                    //priority 0
                    if (isComplete)
                    {
                        weighting10.Icon = MetricsIconEnum.Success.ToString();
                        weighting10.Color = MetricsColorEnum.Success.ToString();
                        weighting10.Subject = "Profile complete";
                        weighting10.Notes = "";
                        priority = 9;
                        weighting = 10;
                    }
                    else
                    {
                        weighting20.Icon = MetricsIconEnum.Error.ToString();
                        weighting20.Color = MetricsColorEnum.Error.ToString();
                        weighting20.Subject = "Profile incomplete";
                        weighting20.Notes = "Complete Profile";
                        priority = 1;
                        weighting = 20;
                    }


                    if (type != "coach")
                    {
                        //absentees - priority varies betwen 4 and 6
                        int absenteePercentage = (100 - (absentDays / avgClassDays) * 100);
                        if (absenteePercentage <= 75)
                        {
                            weighting30.Icon = MetricsIconEnum.Error.ToString();
                            weighting30.Color = MetricsColorEnum.Error.ToString();
                            weighting30.Subject = absentDays + " days absent last month";
                            weighting30.Notes = "Improve attendance";
                            priority = 6;
                            weighting = 30;
                        }
                        else if (absenteePercentage > 75 && absenteePercentage < 90)
                        {
                            weighting20.Icon = MetricsIconEnum.Warning.ToString();
                            weighting20.Color = MetricsColorEnum.Warning.ToString();
                            weighting20.Subject = absentDays + " days absent last month";
                            weighting20.Notes = "Improve attendance";
                            priority = 4;
                            weighting = 20;
                        }
                        else if (absenteePercentage == 100)
                        {
                            weighting10.Icon = MetricsIconEnum.Success.ToString();
                            weighting10.Color = MetricsColorEnum.Success.ToString();
                            weighting10.Subject = absentDays + " days absent last month";
                            weighting10.Notes = "Excellent attendance";
                            priority = 8;
                            weighting = 10;
                        }
                    }

                    //Calculate Overall Attendance Percentages
                    if (attendancePercentage > 0 && attendancePercentage < 60)
                    {
                        weighting30.Icon = MetricsIconEnum.Error.ToString();
                        weighting30.Color = MetricsColorEnum.Error.ToString();
                        weighting30.Subject = "Child Attendance < 60%";
                        weighting30.Notes = "Improve attendance";
                        priority = 5;
                        weighting = 30;
                    }
                    else if (attendancePercentage >= 60 && attendancePercentage < 79)
                    {
                        weighting20.Icon = MetricsIconEnum.Warning.ToString();
                        weighting20.Color = MetricsColorEnum.Warning.ToString();
                        weighting20.Subject = "Child Attendance > 60% and less than 70%";
                        weighting20.Notes = "Improve Attendance";
                        priority = 7;
                        weighting = 20;
                    }
                    else if (attendancePercentage > 80)
                    {
                        weighting10.Icon = MetricsIconEnum.Success.ToString();
                        weighting10.Color = MetricsColorEnum.Success.ToString();
                        weighting10.Subject = "Child Attendance > 80%";
                        weighting10.Notes = "Well done, attendance is 80% or higher.";
                        priority = 8;
                        weighting = 10;
                    }



                    //Priority 1
                    if (!isRegistered)
                    {
                        weighting30.Icon = MetricsIconEnum.Error.ToString();
                        weighting30.Color = MetricsColorEnum.Error.ToString();
                        weighting30.Subject = "Not registered on Funda App";
                        weighting30.Notes = "Request registration on Funda App";
                        priority = 1;
                        weighting = 30;
                    }


                    //priority 0
                    if (isLeaving)
                    {
                        weighting30.Icon = MetricsIconEnum.Error.ToString();
                        weighting30.Color = MetricsColorEnum.Error.ToString();
                        weighting30.Subject = "Practitioner is leaving on " + user.DateToBeRemoved;
                        weighting30.Notes = "Practitioner is leaving on " + user.DateToBeRemoved;
                        priority = 0;
                        weighting = 30;
                    }

                    /*
                     Working in Priority high to low (in SLA terms, lower digits priority is higher) and weighting low to high (more important carries more weight) in seperate streams so that importance overrides
                    TODO: cleanup and use less code
                     */
                    if (priority == 9) //basic default
                    {
                        if (weighting == 10)
                        {
                            finalMessageToDisplay = weighting10.Subject;
                            finalIcon = weighting10.Icon;
                            finalColor = weighting10.Color;
                            finalNotes = weighting10.Notes;
                        }
                    }

                    if (priority == 8)
                    {
                        if (weighting == 10)
                        {
                            finalMessageToDisplay = weighting10.Subject;
                            finalIcon = weighting10.Icon;
                            finalColor = weighting10.Color;
                            finalNotes = weighting10.Notes;
                        }
                        if (weighting == 20)
                        {
                            finalMessageToDisplay = weighting20.Subject;
                            finalIcon = weighting20.Icon;
                            finalColor = weighting20.Color;
                            finalNotes = weighting20.Notes;
                        }
                        if (weighting == 30)
                        {
                            finalMessageToDisplay = weighting30.Subject;
                            finalIcon = weighting30.Icon;
                            finalColor = weighting30.Color;
                            finalNotes = weighting30.Notes;
                        }
                    }

                    if (priority == 7)
                    {
                        if (weighting == 10)
                        {
                            finalMessageToDisplay = weighting10.Subject;
                            finalIcon = weighting10.Icon;
                            finalColor = weighting10.Color;
                            finalNotes = weighting10.Notes;
                        }
                        if (weighting == 20)
                        {
                            finalMessageToDisplay = weighting20.Subject;
                            finalIcon = weighting20.Icon;
                            finalColor = weighting20.Color;
                            finalNotes = weighting20.Notes;
                        }
                        if (weighting == 30)
                        {
                            finalMessageToDisplay = weighting30.Subject;
                            finalIcon = weighting30.Icon;
                            finalColor = weighting30.Color;
                            finalNotes = weighting30.Notes;
                        }
                    }
                    if (priority == 6)
                    {
                        if (weighting == 10)
                        {
                            finalMessageToDisplay = weighting10.Subject;
                            finalIcon = weighting10.Icon;
                            finalColor = weighting10.Color;
                            finalNotes = weighting10.Notes;
                        }
                        if (weighting == 20)
                        {
                            finalMessageToDisplay = weighting20.Subject;
                            finalIcon = weighting20.Icon;
                            finalColor = weighting20.Color;
                            finalNotes = weighting20.Notes;
                        }
                        if (weighting == 30)
                        {
                            finalMessageToDisplay = weighting30.Subject;
                            finalIcon = weighting30.Icon;
                            finalColor = weighting30.Color;
                            finalNotes = weighting30.Notes;
                        }
                    }

                    if (priority == 5)
                    {
                        if (weighting == 10)
                        {
                            finalMessageToDisplay = weighting10.Subject;
                            finalIcon = weighting10.Icon;
                            finalColor = weighting10.Color;
                            finalNotes = weighting10.Notes;
                        }
                        if (weighting == 20)
                        {
                            finalMessageToDisplay = weighting20.Subject;
                            finalIcon = weighting20.Icon;
                            finalColor = weighting20.Color;
                            finalNotes = weighting20.Notes;
                        }
                        if (weighting == 30)
                        {
                            finalMessageToDisplay = weighting30.Subject;
                            finalIcon = weighting30.Icon;
                            finalColor = weighting30.Color;
                            finalNotes = weighting30.Notes;
                        }
                    }

                    if (priority == 4)
                    {
                        if (weighting == 10)
                        {
                            finalMessageToDisplay = weighting10.Subject;
                            finalIcon = weighting10.Icon;
                            finalColor = weighting10.Color;
                            finalNotes = weighting10.Notes;
                        }
                        if (weighting == 20)
                        {
                            finalMessageToDisplay = weighting20.Subject;
                            finalIcon = weighting20.Icon;
                            finalColor = weighting20.Color;
                            finalNotes = weighting20.Notes;
                        }
                        if (weighting == 30)
                        {
                            finalMessageToDisplay = weighting30.Subject;
                            finalIcon = weighting30.Icon;
                            finalColor = weighting30.Color;
                            finalNotes = weighting30.Notes;
                        }
                    }

                    if (priority == 3)
                    {
                        if (weighting == 10)
                        {
                            finalMessageToDisplay = weighting10.Subject;
                            finalIcon = weighting10.Icon;
                            finalColor = weighting10.Color;
                            finalNotes = weighting10.Notes;
                        }
                        if (weighting == 20)
                        {
                            finalMessageToDisplay = weighting20.Subject;
                            finalIcon = weighting20.Icon;
                            finalColor = weighting20.Color;
                            finalNotes = weighting20.Notes;
                        }
                        if (weighting == 30)
                        {
                            finalMessageToDisplay = weighting30.Subject;
                            finalIcon = weighting30.Icon;
                            finalColor = weighting30.Color;
                            finalNotes = weighting30.Notes;
                        }
                    }

                    if (priority == 2)
                    {
                        if (weighting == 10)
                        {
                            finalMessageToDisplay = weighting10.Subject;
                            finalIcon = weighting10.Icon;
                            finalColor = weighting10.Color;
                            finalNotes = weighting10.Notes;
                        }
                        if (weighting == 20)
                        {
                            finalMessageToDisplay = weighting20.Subject;
                            finalIcon = weighting20.Icon;
                            finalColor = weighting20.Color;
                            finalNotes = weighting20.Notes;
                        }
                        if (weighting == 30)
                        {
                            finalMessageToDisplay = weighting30.Subject;
                            finalIcon = weighting30.Icon;
                            finalColor = weighting30.Color;
                            finalNotes = weighting30.Notes;
                        }
                    }

                    if (priority == 1)
                    {
                        if (weighting == 10)
                        {
                            finalMessageToDisplay = weighting10.Subject;
                            finalIcon = weighting10.Icon;
                            finalColor = weighting10.Color;
                            finalNotes = weighting10.Notes;
                        }
                        if (weighting == 20)
                        {
                            finalMessageToDisplay = weighting20.Subject;
                            finalIcon = weighting20.Icon;
                            finalColor = weighting20.Color;
                            finalNotes = weighting20.Notes;
                        }
                        if (weighting == 30)
                        {
                            finalMessageToDisplay = weighting30.Subject;
                            finalIcon = weighting30.Icon;
                            finalColor = weighting30.Color;
                            finalNotes = weighting30.Notes;
                        }
                    }


                    if (priority == 0)
                    {
                        if (weighting == 10)
                        {
                            finalMessageToDisplay = weighting10.Subject;
                            finalIcon = weighting10.Icon;
                            finalColor = weighting10.Color;
                            finalNotes = weighting10.Notes;
                        }
                        if (weighting == 20)
                        {
                            finalMessageToDisplay = weighting20.Subject;
                            finalIcon = weighting20.Icon;
                            finalColor = weighting20.Color;
                            finalNotes = weighting20.Notes;
                        }
                        if (weighting == 30)
                        {
                            finalMessageToDisplay = weighting30.Subject;
                            finalIcon = weighting30.Icon;
                            finalColor = weighting30.Color;
                            finalNotes = weighting30.Notes;
                        }
                    }

                    //build up display for this user
                    NotificationDisplay displayPracti = new NotificationDisplay()
                    {
                        Subject = finalMessageToDisplay,
                        Icon = finalIcon,
                        Color = finalColor,
                        Message = finalMessageToDisplay,
                        Notes = finalNotes,
                        UserId = Guid.Parse(user.UserId),
                        UserType = "practitioner"
                    };

                    notificationList.Add(displayPracti);
                }
            }

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
