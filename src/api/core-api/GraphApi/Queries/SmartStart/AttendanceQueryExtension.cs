using DinkToPdf;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports;
using ECDLink.SmartStart.Reports.Models;
using ECDLink.SmartStart.Services;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class AttendanceQueryExtension
    {
        private SynchronizedConverter _pdfConverter = new SynchronizedConverter(new PdfTools());

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.View)]
        [UseFiltering]
        public IEnumerable<Attendance> GetAttendance(
            [Service] AttendanceTrackingRepository trackingRepository,
            [Service] IHttpContextAccessor httpContextAccessor,
            int year,
            int? monthOfYear,
            int? weekOfYear)
        {
            var userId = httpContextAccessor.HttpContext.GetUser().Id;

            var attendance = trackingRepository.GetAllAttendancesByParentId(userId)
              .Where(x => x.Year == year);

            if (monthOfYear != null && monthOfYear > 0)
            {
                attendance = attendance.Where(x => x.MonthOfYear == monthOfYear);
            }

            if (weekOfYear != null)
            {
                attendance = attendance.Where(x => x.WeekOfYear == weekOfYear);
            }

            if (attendance == null)
            {
                return Enumerable.Empty<Attendance>().AsQueryable();
            }

            return attendance;
        }

        public IEnumerable<Attendance> GetWeeklyAttendance(
    [Service] AttendanceTrackingRepository trackingRepository,
    string userId,
    int year,
    int? monthOfYear,
    int? weekOfYear)
        {
            var attendance = trackingRepository.GetAllAttendancesByParentId(userId)
                .Where(x => x.Year == year);

            if (monthOfYear != null && monthOfYear > 0)
            {
                attendance = attendance.Where(x => x.MonthOfYear == monthOfYear);
            }

            if (weekOfYear != null)
            {
                attendance = attendance.Where(x => x.WeekOfYear == weekOfYear);
            }

            if (attendance == null)
            {
                return Enumerable.Empty<Attendance>().AsQueryable();
            }

            return attendance;
        }

        public IEnumerable<Attendance> GetDailyAttendance(
[Service] AttendanceTrackingRepository trackingRepository,
string userId,
DateTime attendanceDate)
        {
            var attendance = trackingRepository.GetAllAttendancesByParentId(userId)
              .Where(x => x.Year == attendanceDate.Year);

            if (attendanceDate != null)
            {
                attendance = attendance.Where(x => x.AttendanceDate == attendanceDate);
            }

            if (attendance == null)
            {
                return Enumerable.Empty<Attendance>().AsQueryable();
            }

            return attendance;
        }


        public async Task<Document> GetClassroomAttendanceReportPDFFile(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IFileService fileService,
            [Service] ChildAttendanceReport report,
            [Service] DocumentManager documentManager,
            [Service] PersonnelService personnelService,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] AttendanceService attendanceService,
            IGenericRepositoryFactory repoFactory,
            string userId,
            Guid classgroupId,
            DateTime startDate,
            DateTime endDate)
        {
            string _siteAddress = personnelService.GetUserSiteAddress(userId);
            string _signingSignature = personnelService.GetUserSignature(userId);
            string signDateRow = documentManager.GetSignatureRow(_signingSignature);
            string _css = documentManager.GetDocumentStyling();
            string _header = documentManager.GetDocumentHeader(startDate.Year, startDate.Month) + " Attendance Register";
            string _html = "<html><head>" + _css + "</head><body>";

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var startMonth = startDate.GetStartOfMonth();
            var endMonth = (endDate.Month == DateTime.Now.Month ? (startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1) : DateTime.Now) : endDate.GetEndOfMonth());
            var result = report.GetClassroomAttendanceOverView(classgroupId, userId, startMonth.Date, endMonth.GetEndOfDay());
            var classroomGroups = attendanceService.GetUserClassroomGroups(userId);

            var counter = 1;
            foreach (ClassroomGroup group in classroomGroups)
            {
                List<int> classDayNumbers = new List<int>();
                foreach (ClassProgramme programme in group.ClassProgrammes)
                {
                    var dayName = Enum.GetName(typeof(DayOfWeek), Convert.ToInt32(programme.MeetingDay));
                    if (!classDayNumbers.Contains(programme.MeetingDay))
                    {
                        classDayNumbers.Add(programme.MeetingDay);
                    }
                }
                classDayNumbers.Sort();
                var availableClassDays = classDayNumbers.Select(x => (DayOfWeek)x).ToList();

                PdfDocumentHeader pdfDocumentHeader = new PdfDocumentHeader();
                pdfDocumentHeader.UserId = userId;
                pdfDocumentHeader.SiteAddress = _siteAddress;
                pdfDocumentHeader.ReportType = "AttendancePDF";
                pdfDocumentHeader.ProgrammeDays = string.Join(", ", availableClassDays);
                pdfDocumentHeader.ClassName = group.Name;
                pdfDocumentHeader.ProgrammeType = group.ProgrammeType.Description;

                string _userInfo = documentManager.GetDocumentHeaderAddress(userManager, pdfDocumentHeader);

                _html += _userInfo;

                var children = result.ClassroomAttendanceReport.Where(x => x.ClassgroupId == group.Id);
                

                if (children.Count() > 0)
                {
                    _html += "<table style='margin-top: 20px;' class='borderTable'><thead>";
                    _html += "<tr style='background-color: #C0C0C0;'><th>Child</th><th>ID/Passport</th>";

                
                    foreach (var item in result.TotalAttendance)
                    {
                        _html += "<th style='text-align: center;'>" + item.Key + "</th>";
                    }

                    _html += "</tr></thead><tbody>";

                    int totalActualAttendance = 0;
                    int totalSessions = 0;

                    foreach (ClassroomGroupChildAttendanceReportModel child in children)
                    {
                        _html += "<tr><td>" + child.ChildFullName + "</td><td>" + child.ChildIdNumber + "</td>";

                        foreach (var attendance in child.Attendance)
                        {
                            var _checkCross = attendance.Value != 0 ? "&check;" : "&cross;";
                            var _color = attendance.Value != 0 ? "#FFFFFF;" : "#EFEFEF;";

                            _html += "<td style='text-align: center;background-color:" + _color + "'>" + _checkCross + "</td>";
                        }

                        _html += "</tr>";

                        totalActualAttendance = child.TotalActualAttendance;
                        totalSessions = child.TotalExpectedAttendance + 1;

                        _html += "<tr style='background-color: #C0C0C0;'><th colspan='2'>Child attendance per day</th>";

                    }

                    foreach (var attendance in result.TotalAttendance)
                    {
                        int totalForDay = GetTotalForDay(attendance.Key, children);
                        _html += "<th style='text-align: center;'>" + totalForDay + "</th>";
                    }
                    _html += "</tr>";

                    int allSessionsAttended = GetTotalForAllSessions(children);
                    _html += "<table style='margin-top: 10px;'><tr>";
                    _html += "<td>Total monthly attendance:</td><th>" + totalActualAttendance + "</th>";
                    _html += "<td>Total number of sessions:</td><th>" + totalSessions + "</th>";
                    _html += "<td>Number of children who attended all sessions:</td><th>" + allSessionsAttended + "</th>";
                    _html += "</tr></table>";

                    _html += "</tbody></table>";
                } else
                {
                    _html += "<div style='margin-top: 40px; font-size: 18px;margin-bottom: 20px;'>No results for class available</div>";
                }

                 _html += signDateRow;
                _html += "</body></html>";

                // ensure each class is on new page
                if (counter < classroomGroups.Count)
                {
                    _html += "<div style='padding-top:80px;page-break-after: always;'></div>";
                }

                counter++;
            }

            HtmlToPdfDocument doc = documentManager.GetPdfSettings(_html, _header, "landscape");
            byte[] pdf = _pdfConverter.Convert(doc);
            string Base64Result = Convert.ToBase64String(pdf);

            DocumentModel pdfDoc = new DocumentModel();
            pdfDoc.Reference = Base64Result;
            pdfDoc.FileName = _header.Replace(" ", "_") + ".pdf";
            pdfDoc.UserId = userId;
            pdfDoc.CreatedUserId = uId;
            return await documentManager.SaveAttendancePDF(pdfDoc);
        }

        private int GetTotalForDay(int key, IEnumerable<ClassroomGroupChildAttendanceReportModel> children)
        {
            var total = 0;
            foreach (ClassroomGroupChildAttendanceReportModel child in children)
            {
                foreach (var attendance in child.Attendance)
                {
                    if ((int)attendance.Key == (int)key)
                    {
                        if (attendance.Value != 0)
                        {
                            total++;
                        }
                    }
                }
            }
            return total;
        }

        private int GetTotalForAllSessions(IEnumerable<ClassroomGroupChildAttendanceReportModel> children)
        {
            var total = 0;
            foreach (ClassroomGroupChildAttendanceReportModel child in children)
            {
                if (child.TotalActualAttendance == (child.TotalExpectedAttendance + 1))
                {
                    total++;
                }
            }
            return total;
        }

    }
}
