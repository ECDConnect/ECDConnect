using DinkToPdf;
using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;


namespace EcdLink.Api.CoreApi.Managers
{

    public class DocumentManager
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private IFileService _fileService;
        private Guid? _uId;

        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly IGenericRepository<Document, Guid> _documentRepo;
        private readonly IGenericRepository<DocumentType, Guid> _documentTypeRepo;
        private readonly IGenericRepository<WorkflowStatusType, Guid> _workflowStatusTypeRepo;
        private readonly IGenericRepository<WorkflowStatus, Guid> _workflowStatusRepo;

        public DocumentManager(
            IHttpContextAccessor contextAccessor,
            [Service] IFileService fileService, 
            IGenericRepositoryFactory repoFactory, 
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _fileService = fileService;

            _uId = contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _documentRepo = _repoFactory.CreateGenericRepository<Document>(userContext: _uId);
            _documentTypeRepo = _repoFactory.CreateGenericRepository<DocumentType>(userContext: _uId);
            _workflowStatusTypeRepo = _repoFactory.CreateGenericRepository<WorkflowStatusType>(userContext: _uId);
            _workflowStatusRepo = _repoFactory.CreateGenericRepository<WorkflowStatus>(userContext: _uId);
        }

        //
        // DEFAULT DOCUMENT SETTINGS
        //

        public string GetDocumentStyling()
        {
            string css = "<style>";
            css += "body { font-family: 'Arial Regular', 'Arial Bold', sans-serif; color: #4d4d4d; font-size: 10px;}";
            css += "table { display: table; font-family: 'Arial', page-break-inside: auto; }";
            css += "th {text-align: left; padding-left: 4px; padding-right: 4px;padding-top: 4px; padding-bottom: 4px;}";
            css += "td {padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px;}";
            css += "table.borderTable {border: 1px solid black; width: 100%;border-collapse: collapse;}";
            css += "table.borderTable th {border: 1px solid black;text-align: left; padding-left: 4px; padding-right: 4px;padding-top: 4px; padding-bottom: 4px;}";
            css += "table.borderTable td {border: 1px solid black;padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px;}";
            css += "</style>";

            return css;
        }

        public string GetSignatureRow(string _signingSignature)
        {
            return "<table style='width: 100%; margin-top: 12px;'><tr><td style='width: 10%;'>Sign:</td><td colspan='2' style='height: 80px;border: 1px solid black;text-align: center; width: 50%'><img style='height: 80px;' src='" + _signingSignature + "'/></td><td style='width: 10%;'>Date:</td><td colspan='2' style='border: 1px solid black;height: 80px;text-align: center; width: 50%'>" + DateTime.Now.ToString("dd MMMM yyyy") + "</td></tr></table>";
        }

        public string GetDocumentHeader(int year, int month)
        {
            DateTime docDate = new DateTime(year, month, 01);
            return docDate.ToString("MMMM", CultureInfo.InvariantCulture) + " " + docDate.ToString("yyyy", CultureInfo.InvariantCulture);
        }

        public string GetDocumentHeaderAddress([Service] ApplicationUserManager userManager, PdfDocumentHeader pdfDocumentHeader)
        {
            var _headerAddress = "";
            ApplicationUser user = userManager.FindByIdAsync(pdfDocumentHeader.UserId).Result;

            string siteAddress = string.IsNullOrEmpty(pdfDocumentHeader.SiteAddress) ? "-" : pdfDocumentHeader.SiteAddress;
            string firstName = user?.FirstName + " " + user?.Surname;
            string phoneNumber = string.IsNullOrEmpty(user.PhoneNumber) ? "-" : user?.PhoneNumber;
            string idNumber = string.IsNullOrEmpty(user?.IdNumber) ? "-" : user?.IdNumber;
            string classNames = string.IsNullOrEmpty(pdfDocumentHeader.ClassName) ? "-" : pdfDocumentHeader.ClassName;
            string programmeDays = string.IsNullOrEmpty(pdfDocumentHeader.ProgrammeDays) ? "-" : pdfDocumentHeader.ProgrammeDays;
            string programmeType = string.IsNullOrEmpty(pdfDocumentHeader.ProgrammeType) ? "-" : pdfDocumentHeader.ProgrammeType;

            if (pdfDocumentHeader.ReportType == "StatementsPDF")
            {
                _headerAddress = "<div style='float: right;'><table>";
                _headerAddress += "<tr><th style='width:50%'>Name:</th><td>" + firstName + "</td></tr>";
                _headerAddress += "<tr><th>Phone number:</th><td>" + phoneNumber + "</td></tr>";
                _headerAddress += "<tr><th>ID number:</th><td>" + idNumber + "</td></tr>";
                _headerAddress += "<tr><th>Site Address:</th><td>" + siteAddress + "</td></tr>";
                _headerAddress += "</table></div>";

            } else if (pdfDocumentHeader.ReportType == "AttendancePDF")
            {

                _headerAddress = "<div style='padding-top: 20px;'><table width='100%'><tr><th width='10%'>Name:</th><td>" + firstName + "</td><th width='10%'>Site Address:</th><td>" + siteAddress + "</td><th>Class:</th><td>" + classNames + "</td></tr>";
                _headerAddress += "<tr><th>Phone number:</th><td>" + phoneNumber + "</td><th></th><td></td><th>Programme days:</th><td>"+ programmeDays + "</td></tr>";
                _headerAddress += "<tr><th>ID number</th><td>" + idNumber + "</td><th></th><td></td><th>Programme type:</th><td>"+programmeType+"</td></tr></table></div>";
            }

            return _headerAddress;
        }

        public HtmlToPdfDocument GetPdfSettings(string _html, string _header, string orientation)
        {
            return new HtmlToPdfDocument()
            {
                GlobalSettings = {
                    ColorMode = ColorMode.Color,
                    Orientation = orientation == "portrait" ?  Orientation.Portrait : Orientation.Landscape,
                    PaperSize = PaperKind.A4,
                    Margins = new MarginSettings() { Top = 10, Bottom=10, Left=5, Right=5 },
                    // Use Out when you want to save the pdf to your local disk
                    //Out = @"C:\DinkToPdf\" + _header.Replace(" ", "_") + ".pdf",
                },
                Objects = {
                    new ObjectSettings() {
                        PagesCount = true,
                        HtmlContent = _html,
                        WebSettings = { DefaultEncoding = "utf-8" },
                        HeaderSettings = { FontSize=12, FontName="Arial", Left= _header, Line=false },
                        FooterSettings = { FontSize=8, FontName="Arial", Right="Page [page] of [toPage]", Line = false },
                        }
                    }
            };
        }
    }
}

