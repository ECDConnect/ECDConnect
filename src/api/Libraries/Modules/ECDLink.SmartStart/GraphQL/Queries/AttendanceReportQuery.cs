using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.SmartStart.Reports;
using ECDLink.SmartStart.Reports.Models;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.ObjectTypes.Extentions.Query
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class AttendanceReportQuery
    {
        public IEnumerable<MonthlyAttendanceReportModel> MonthlyAttendanceReport(
          [Service] MonthlyAttendanceReport report,
          string userId,
          Guid classroomId,
          DateTime startMonth,
          DateTime endMonth)
        {
            startMonth = startMonth.GetStartOfMonth();
            //endMonth = endMonth.GetEndOfMonth();
            //if current month, do not project as per business rules and use current date as enddate - if its the 1st of the month and dates match, then add 1 day
            endMonth = (endMonth.Month == DateTime.Now.Month ? (startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1).Date : DateTime.Now.GetEndOfDay()) : endMonth.GetEndOfMonth().GetEndOfDay());


            return report.GenerateMonthlyAttendanceReport(userId, classroomId, startMonth, endMonth);
        }

        public async Task<FileModel> MonthlyAttendanceRecordCSV(
          [Service] MonthlyAttendanceReport report,
          [Service] IFileGenerationService fileService,
          DateTime startMonth,
          DateTime endMonth,
          string ownerId)
        {
            //if current month, do not project as per business rules and use current date as enddate - if its the 1st of the month and dates match, then add 1 day
            endMonth = (endMonth.Month == DateTime.Now.Month ? (startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1).Date : DateTime.Now.GetEndOfDay()) : endMonth.GetEndOfMonth().GetEndOfDay());


            var startOfMonth = startMonth.Date;
            var endOfMonth = endMonth.GetEndOfDay();

            var reportList = new List<MonthlyAttendanceCSVReport>();

            var classroomsActiveDuringPeriod = report.GetActiveClassrooms(startOfMonth, endOfMonth).ToList();

            var filteredList = classroomsActiveDuringPeriod.Where(x => x.UserId == ownerId);

            foreach (var classroom in filteredList)
            {
                var monthReport = report.GenerateMonthlyAttendanceReport(classroom.UserId, classroom.Id, startOfMonth, endOfMonth).FirstOrDefault();

                if (monthReport == default(MonthlyAttendanceReportModel))
                {
                    continue;
                }

                reportList.Add(new MonthlyAttendanceCSVReport
                {
                    AttendancePercentage = monthReport.PercentageAttendance,
                    CellphoneNumber = classroom.User.PhoneNumber,
                    Firstname = classroom.User.FirstName,
                    Surname = classroom.User.Surname
                });
            }

            var reportName = $"{DateTime.Now.ToString("Y")} Practitioner Tracking Report";
            return await fileService.DataTableToExcelFile(reportList.ToDataTable(), reportName);
        }

        public async Task<ChildAttendanceReportModel> ChildAttendanceReport(
          [Service] ChildAttendanceReport report,
          string userId,
          Guid classgroupId,
          DateTime startDate,
          DateTime endDate)
        {
            var startMonth = startDate.GetStartOfMonth();
            //var endMonth = endDate.GetEndOfMonth();

            //if current month, do not project as per business rules and use current date as enddate - if its the 1st of the month and dates match, then add 1 day
            var endMonth = (endDate.Month == DateTime.Now.Month ? (startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1) : DateTime.Now) : endDate.GetEndOfMonth());


            return report.GetChildAttendance(classgroupId, userId, startMonth.Date, endMonth.GetEndOfDay());
        }

        public async Task<List<ClassroomGroupChildAttendanceReportModel>> ClassroomAttendanceReport(
             [Service] ChildAttendanceReport report,
             string userId,
             Guid classgroupId,
             DateTime startDate,
             DateTime endDate)
        {
            var startMonth = startDate.GetStartOfMonth();
            //var endMonth = endDate.GetEndOfMonth();
            //if current month, do not project as per business rules and use current date as enddate - if its the 1st of the month and dates match, then add 1 day
            var endMonth = (endDate.Month == DateTime.Now.Month ? (startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1) : DateTime.Now) : endDate.GetEndOfMonth());

            return report.GetClassroomAttendance(classgroupId, userId, startMonth.Date, endMonth.GetEndOfDay());
        }

        public async Task<ClassroomGroupChildAttendanceReportOverviewModel> ClassroomAttendanceOverviewReport(
            [Service] ChildAttendanceReport report,
            string userId,
            Guid classgroupId,
            DateTime startDate,
            DateTime endDate)
        {
            var startMonth = startDate.GetStartOfMonth();
            //var endMonth = endDate.GetEndOfMonth();
            //if current month, do not project as per business rules and use current date as enddate - if its the 1st of the month and dates match, then add 1 day
            var endMonth = (endDate.Month == DateTime.Now.Month ? (startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1) : DateTime.Now) : endDate.GetEndOfMonth());

            return report.GetClassroomAttendanceOverView(classgroupId, userId, startMonth.Date, endMonth.GetEndOfDay());
        }
    }
}
