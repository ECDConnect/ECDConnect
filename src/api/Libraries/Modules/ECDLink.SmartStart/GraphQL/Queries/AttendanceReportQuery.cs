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
            endMonth = endMonth.GetEndOfMonth();

            return report.GenerateMonthlyAttendanceReport(userId, classroomId, startMonth, endMonth);
        }

        public async Task<FileModel> MonthlyAttendanceRecordCSV(
          [Service] MonthlyAttendanceReport report,
          [Service] IFileGenerationService fileService,
          DateTime startMonth,
          DateTime endMonth,
          string ownerId)
        {
            var startOfMonth = startMonth;
            var endOfMonth = endMonth;

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
            var endMonth = endDate.GetEndOfMonth();

            return report.GetChildAttendance(classgroupId, userId, startMonth, endMonth);
        }

        public async Task<List<ClassroomGroupChildAttendanceReportModel>> ClassroomAttendanceReport(
  [Service] ChildAttendanceReport report,
  string userId,
  Guid classgroupId,
  DateTime startDate,
  DateTime endDate)
        {
            var startMonth = startDate.GetStartOfMonth();
            var endMonth = endDate.GetEndOfMonth();

            return report.GetClassroomAttendance(classgroupId, userId, startMonth, endMonth);
        }

        public async Task<ClassroomGroupChildAttendanceReportOverviewModel> ClassroomAttendanceOverviewReport(
[Service] ChildAttendanceReport report,
string userId,
Guid classgroupId,
DateTime startDate,
DateTime endDate)
        {
            var startMonth = startDate.GetStartOfMonth();
            var endMonth = endDate.GetEndOfMonth();

            return report.GetClassroomAttendanceOverView(classgroupId, userId, startMonth, endMonth);
        }
    }
}
