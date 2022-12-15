using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.PDFGenerator.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.SmartStart.Reports.ChildProgressReport
{
    public class ChildProgressReportService
    {
        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly IFillableFieldService _fieldService;
        private readonly IFileService _fileService;

        public ChildProgressReportService(IGenericRepositoryFactory repoFactory, IFillableFieldService fieldService, IFileService fileService)
        {
            _repoFactory = repoFactory;
            _fieldService = fieldService;
            _fileService = fileService;
        }

        public async Task<string> GenerateReport(DataAccessLayer.Entities.Reports.ChildProgressReport reportEntity, Document document)
        {
            var reportContent = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(reportEntity.ReportContent);

            var fields = ChildProgressReportTemplate.GetFieldTemplate(reportContent);

            if (document == default)
            {
                throw new FileNotFoundException("No Progress Report Document Assigned");
            }

            var pdfDocument = await _fileService.GetFile(DocumentHelper.GetFileName(document.Reference), FileTypeEnum.ReportTemplates);
            return _fieldService.FillForm(pdfDocument, fields, 5);
        }
    }
}
