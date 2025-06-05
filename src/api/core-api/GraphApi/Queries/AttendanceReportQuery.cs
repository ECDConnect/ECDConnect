using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.Services;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Extensions;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class AttendanceReportQuery
    {
        // Need to find out how/where this is used
        // It is used by the admin portal
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

            var filteredList = classroomsActiveDuringPeriod.Where(x => x.UserId.ToString() == ownerId);

            foreach (var classroom in filteredList)
            {
                var monthReport = report.GenerateMonthlyAttendanceReport(classroom.UserId.ToString(), startOfMonth, endOfMonth).FirstOrDefault();

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
    }
}
