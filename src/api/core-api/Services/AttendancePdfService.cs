using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.SmartStart.Reports.Models;
using ECDLink.SmartStart.Reports;
using ECDLink.SmartStart.Services;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.Security.Extensions;
using ECDLink.Core.Extensions;
using System.Linq;
using System.Text;
using EcdLink.Api.CoreApi.Services.Interfaces;
using DinkToPdf.Contracts;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;

namespace EcdLink.Api.CoreApi.Services
{
    public class AttendancePdfService: IAttendancePdfService
    {
        private IConverter _pdfConverter;

        private ChildAttendanceReport _childAttendanceReport;
        private DocumentManager _documentManager;
        private PersonnelService _personnelService;
        private ApplicationUserManager _userManager;
        private AttendanceService _attendanceService;

        private Guid _applicationUserId;

        public AttendancePdfService(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] ChildAttendanceReport childAttendanceReport,
            [Service] DocumentManager documentManager,
            [Service] PersonnelService personnelService,
            [Service] ApplicationUserManager userManager,
            [Service] AttendanceService attendanceService,
            HierarchyEngine hierarchyEngine,
            IConverter pdfConverter)
        {
            _childAttendanceReport = childAttendanceReport;
            _documentManager = documentManager;
            _personnelService = personnelService;
            _attendanceService = attendanceService;
            _userManager = userManager;
            _pdfConverter = pdfConverter;

            _applicationUserId = (contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetIntegrationUserId().GetValueOrDefault());
        }


        public async Task<Document> GetClassroomAttendanceReportPDFFile(
            string userId,
            Guid classroomId,
            DateTime startDate,
            DateTime endDate)
        {
            var classroomGroups = _attendanceService.GetUserClassroomGroups(userId);

            if (!classroomGroups.Any())
            {
                return null;
            }

            var siteAddress = _personnelService.GetUserSiteAddress(userId);
            var signingSignature = _personnelService.GetUserSignature(userId);
            var signDateRow = _documentManager.GetSignatureRow(signingSignature);
            var css = _documentManager.GetDocumentStyling();
            var header = $"{_documentManager.GetDocumentHeader(startDate.Year, startDate.Month)} Attendance Register";

            var htmlStringBuilder = new StringBuilder($"<html><head>{css}</head><body>");

            var attedanceOverview = _childAttendanceReport.GetClassroomAttendanceOverView(classroomId, userId, startDate.Date, endDate.GetEndOfDay());
            

            var counter = 1;
            foreach (var classroomGroup in classroomGroups)
            {
                var classDayNumbers = new List<int>();
                foreach (var programme in classroomGroup.ClassProgrammes)
                {
                    var dayName = Enum.GetName(typeof(DayOfWeek), programme.MeetingDay);
                    if (!classDayNumbers.Contains(programme.MeetingDay))
                    {
                        classDayNumbers.Add(programme.MeetingDay);
                    }
                }
                classDayNumbers.Sort();

                var availableClassDays = classDayNumbers.Select(x => (DayOfWeek)x).ToList();

                var pdfDocumentHeader = new PdfDocumentHeader()
                {
                    UserId = userId,
                    SiteAddress = siteAddress,
                    ReportType = "AttendancePDF",
                    ProgrammeDays = string.Join(", ", availableClassDays),
                    ClassName = classroomGroup.Name,
                    ProgrammeType = classroomGroup.ProgrammeType.Description,
                };

                var userInfo = _documentManager.GetDocumentHeaderAddress(_userManager, pdfDocumentHeader);

                htmlStringBuilder.AppendLine(userInfo);

                var childAttendandeReports = attedanceOverview.ClassroomAttendanceReport.Where(x => x.ClassgroupId == classroomGroup.Id);


                if (childAttendandeReports.Count() > 0)
                {
                    htmlStringBuilder.AppendLine("<table style='margin-top: 20px;' class='borderTable'><thead>");
                    htmlStringBuilder.AppendLine("<tr style='background-color: #C0C0C0;'><th>Child</th><th>ID/Passport</th>");


                    foreach (var item in attedanceOverview.TotalAttendance)
                    {
                        htmlStringBuilder.AppendLine($"<th style='text-align: center;'>{item.Key}</th>");
                    }

                    htmlStringBuilder.AppendLine("</tr></thead><tbody>");

                    foreach (var childAttendanceReport in childAttendandeReports)
                    {
                        htmlStringBuilder.AppendLine($"<tr><td>{childAttendanceReport.ChildFullName}</td><td>{childAttendanceReport.ChildIdNumber}</td>");

                        foreach (var attendance in childAttendanceReport.Attendance)
                        {
                            var checkCross = !attendance.Value.HasValue ? "*" : attendance.Value.Value != 0 ? "&check;" : "&cross;";
                            var color = attendance.Value != 0 ? "#FFFFFF;" : "#EFEFEF;";

                            htmlStringBuilder.AppendLine($"<td style='text-align: center;background-color:{color}'>{checkCross}</td>");
                        }

                        htmlStringBuilder.AppendLine("</tr>");
                    }

                    htmlStringBuilder.AppendLine("<tr style='background-color: #C0C0C0;'><th colspan='2'>Child attendance per day</th>");
                    foreach (var attendance in attedanceOverview.TotalAttendance)
                    {
                        var totalForDay = GetTotalForDay(attendance.Key, childAttendandeReports);
                        htmlStringBuilder.AppendLine("<th style='text-align: center;'>" + totalForDay + "</th>");
                    }
                    htmlStringBuilder.AppendLine("</tr>");

                    htmlStringBuilder.AppendLine("<table style='margin-top: 10px;'><tr>");
                    htmlStringBuilder.AppendLine($"<td>Total monthly attendance:</td><th>{attedanceOverview.TotalAttendanceStatsReport.TotalMonthlyAttendance}</th>");
                    htmlStringBuilder.AppendLine($"<td>Total number of sessions:</td><th>{attedanceOverview.TotalAttendanceStatsReport.TotalSessions}</th>");
                    htmlStringBuilder.AppendLine($"<td>Number of children who attended all sessions:</td><th>{attedanceOverview.TotalAttendanceStatsReport.TotalChildrenAttendedAllSessions}</th>");
                    htmlStringBuilder.AppendLine($"<td>* = child was not registered yet or practitioner did not take attendance</td>");
                    htmlStringBuilder.AppendLine("</tr></table>");
                    htmlStringBuilder.AppendLine("</tbody></table>");
                }
                else
                {
                    htmlStringBuilder.AppendLine("<div style='margin-top: 40px; font-size: 18px;margin-bottom: 20px;'>No results for class available</div>");
                }

                htmlStringBuilder.AppendLine(signDateRow);
                htmlStringBuilder.AppendLine("</body></html>");

                // ensure each class is on new page
                if (counter < classroomGroups.Count)
                {
                    htmlStringBuilder.AppendLine("<div style='padding-top:80px;page-break-after: always;'></div>");
                }

                counter++;
            }

            var doc = _documentManager.GetPdfSettings(htmlStringBuilder.ToString(), header, "landscape");
            var pdf = _pdfConverter.Convert(doc);
            var Base64Result = Convert.ToBase64String(pdf);

            var pdfDoc = new DocumentModel()
            {
                Reference = Base64Result,
                FileName = $"{header.Replace(" ", "_")}.pdf",
                UserId = userId,
                CreatedUserId = _applicationUserId.ToString(),
            };
            return null;
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
                        if (attendance.Value.HasValue && attendance.Value.Value != 0)
                        {
                            total++;
                        }
                    }
                }
            }
            return total;
        }
    }
}
