using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Extensions;
using ECDLink.Core.Reporting;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.PDFGenerator.Services.Interfaces;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports.ChildProgressReport;
using ECDLink.SmartStart.Services.Interfaces;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services
{
    public enum ProgressContentTypeEnum
    {
        Category = 4,
        SubCategory = 5,
        Level = 6,
        Skill = 7
    }

    public class ChildProgressReportService : IChildProgressReportService
    {
        private class Category
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string ImageUrl { get; set; }
            public string Color { get; set; }
            public int[] SubCategoryIds { get; set; }
            public List<SubCategory> SubCategories { get; set; }
        }

        private class SubCategory
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string ImageUrl { get; set; }
            public int[] SkillIds { get; set; }
            public List<Skill> Skills { get; set; }
        }
        private class Skill
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public Category Category { get; set; }
            public SubCategory SubCateogry { get; set; }
        }

        // This is the json data we store for the report content
        private class ProgressData
        {
            public string Notes { get; set; }

            public List<SkillObservation> SkillObservations { get; set; }

            public List<SkillToWorkOn> SkillsToWorkOn { get; set; }

            public string HowToSupport { get; set; }
        }

        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly IDbContextFactory<AuthenticationDbContext> _dbFactory;
        private readonly IFillableFieldService _fieldService;
        private readonly IFileService _fileService;
        private readonly IClassroomService _classroomService;
        private readonly IPersonnelService _personnelService;
        private readonly ContentManagementRepository _contentRepo;
        private readonly ILocaleService<Language> _localeService;

        private IGenericRepository<Child, Guid> _childRepo;
        private IGenericRepository<Learner, Guid> _learnerRepo;
        private IGenericRepository<ChildProgressReport, Guid> _childProgressReportRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private IGenericRepository<Document, Guid> _documentRepo;

        private List<Category> _categories = null;
        private Dictionary<int, Skill> _skillMap = null;

        private Guid _contextUserId;

        public ChildProgressReportService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            IDbContextFactory<AuthenticationDbContext> dbFactory,
            IFillableFieldService fieldService,
            IFileService fileService,
            [Service] IClassroomService classroomService,
            [Service] IPersonnelService personnelService,
            [Service] ContentManagementRepository contentRepo,
            [Service] ILocaleService<Language> localeService
            )
        {
            _repoFactory = repoFactory;
            _dbFactory = dbFactory;
            _fieldService = fieldService;
            _fileService = fileService;
            _classroomService = classroomService;
            _personnelService = personnelService;
            _contentRepo = contentRepo;
            _localeService = localeService;

            _contextUserId = contextAccessor.HttpContext.GetUser().Id;
            _childRepo = repoFactory.CreateRepository<Child>(userContext: _contextUserId);
            _childProgressReportRepo = repoFactory.CreateRepository<ChildProgressReport>(userContext: _contextUserId);
            _practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: _contextUserId);
            _learnerRepo = repoFactory.CreateRepository<Learner>(userContext: _contextUserId);
            _documentRepo = repoFactory.CreateRepository<Document>();
        }

        public void CreateOrUpdateReport(ChildProgressReportModel input)
        {
            if (input == null)
            {
                return;
            }

            var reportContent = new ProgressData
            {
                SkillObservations = input.SkillObservations,
                SkillsToWorkOn = input.SkillsToWorkOn,
                HowToSupport = input.HowToSupport,
                Notes = input.Notes,
            };

            // Check if report exists
            var existingReport = _childProgressReportRepo.GetById(input.Id);

            if (existingReport != null)
            {
                if (input.DateCompleted != null)
                {
                    existingReport.DateCompleted = input.DateCompleted;
                }

                existingReport.ReportContent = JsonConvert.SerializeObject(reportContent);
                existingReport.UserId = _contextUserId;

                _childProgressReportRepo.Update(existingReport);
            }
            else
            {
                var newReport = new ChildProgressReport
                {
                    UserId = _contextUserId,
                    ChildId = input.ChildId,
                    ChildProgressReportPeriodId = input.ChildProgressReportPeriodId,
                    DateCompleted = input.DateCompleted,
                    ReportContent = JsonConvert.SerializeObject(reportContent),
                };

                _childProgressReportRepo.Insert(newReport);
            }
        }


        public IEnumerable<ChildProgressReportModel> GetChildProgressReportsForUser(Guid userId)
        {
            var classroomGroupIds = _classroomService.GetClassroomGroupsForUser(userId).Select(x => x.Id).ToList();
            var childUserIds = _learnerRepo.GetAll().Where(x => classroomGroupIds.Contains(x.ClassroomGroupId)).Select(x => x.UserId);
            var childIds = _childRepo.GetAll().Where(x => childUserIds.Contains(x.UserId)).Select(x => x.Id);

            var reports = _childProgressReportRepo.GetAll().Where(x => childIds.Contains(x.ChildId)).ToList();


            foreach (var report in reports) 
            {
                var data = JsonConvert.DeserializeObject<ProgressData>(report.ReportContent);

                yield return new ChildProgressReportModel
                {
                    Id = report.Id,
                    ChildId = report.ChildId,
                    DateCompleted = report.DateCompleted,
                    ChildProgressReportPeriodId = report.ChildProgressReportPeriodId,
                    DateCreated = report.InsertedDate,
                    HowToSupport = data.HowToSupport,
                    Notes = data.Notes,
                    SkillObservations = data.SkillObservations,
                    SkillsToWorkOn = data.SkillsToWorkOn,
                };
            }
        }





        //public async Task<string> GenerateReport(ChildProgressReport reportEntity,
        //    Practitioner practitioner,
        //    string currentProfileImageUrl,
        //    Document document)
        //{
        //    throw new NotImplementedException();
        //    //var reportContent = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(reportEntity.ReportContent);

        //    //var fields = ChildProgressReportTemplate.GetFieldTemplate(reportContent, practitioner, currentProfileImageUrl);

        //    //if (document == default)
        //    //{
        //    //    throw new FileNotFoundException("No Progress Report Document Assigned");
        //    //}

        //    //var pdfDocument = await _fileService.GetFile(DocumentHelper.GetFileName(document.Reference), FileTypeEnum.ReportTemplates);
        //    //return _fieldService.FillForm(pdfDocument, fields, 5);
        //}

        //// GENERATES PDF MIGHT NOT BE NEEDED ANYMORE
        //public async Task<string> GenerateChildProgressReport(
        //  Guid userId,
        //  Guid childId,
        //  Guid classgroupId,
        //  DateTime reportDate)
        //{
        //    var progressReportEntity = _childProgressReportRepo.GetAll()
        //        .Where(x =>
        //            // x.ClassroomGroupId == classgroupId
        //            x.ChildId == childId
        //            && x.ReportDate.Month == reportDate.Month && x.ReportDate.Year == reportDate.Year)
        //        .OrderBy(x => x.Id)
        //        .FirstOrDefault();

        //    if (progressReportEntity == null)
        //    {
        //        return null;
        //    }

        //    var practitioner = _practitionerRepo.GetAll().Where(x => x.Hierarchy == progressReportEntity.Hierarchy).OrderBy(x => x.Id).FirstOrDefault();

        //    using var dbScope = _dbFactory.CreateDbContext();

        //    var document = _documentRepo.GetAll()
        //        .Where(x => x.Name == ReportConstants.ChildProgressReport && x.IsActive)
        //        .OrderBy(x => x.Id)
        //        .FirstOrDefault();

        //    return await GenerateReport(progressReportEntity, practitioner, practitioner != null ? practitioner.User.ProfileImageUrl : "", document);
        //}

        //public ChildProgressReportDetailedModel GetChildProgressReport(
        //    Guid userId,
        //    Guid reportId)
        //{
        //    var summaryEntity = _childProgressReportRepo.GetById(reportId);

        //    return JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(summaryEntity.ReportContent);
        //}

        //// Should this fetch, get everything for a reporting window, rather than just an input number of reports?
        //public IEnumerable<ChildProgressReportDetailedModel> GetChildProgressReports(
        //    Guid userId,
        //    int count)
        //{
        //    var reports = _childProgressReportRepo.GetAll()
        //        .OrderByDescending(x => x.UpdatedDate)
        //        .Take(count)
        //        .ToList();

        //    var result = new List<ChildProgressReportDetailedModel>();
        //    foreach (var report in reports)
        //    {
        //        var detail = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(report.ReportContent);
        //        if (detail == null)
        //        {
        //            continue;
        //        }
        //        result.Add(detail);
        //    }
        //    return result;
        //}

        //// Should this fetch, get everything for a reporting window, rather than just an input number of reports?
        //public IEnumerable<ChildProgressReportSummaryModel> GetChildProgressReportSummary(
        //    Guid userId,
        //    int count)
        //{
        //    var summaryEntities = _childProgressReportRepo.GetAll()
        //        .OrderByDescending(x => x.UpdatedDate)
        //        .Take(count)
        //        .ToList();

        //    var summaries = new List<ChildProgressReportSummaryModel>();

        //    foreach (var item in summaryEntities)
        //    {
        //        var report = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(item.ReportContent);

        //        if (report == null || string.IsNullOrEmpty(report.DateCompleted))
        //        {
        //            continue;
        //        }

        //        var summary = new ChildProgressReportSummaryModel
        //        {
        //            Categories = report.Categories?.Select(x => new ObservationCategorySummary
        //            {
        //                AchievedLevelId = x.AchievedLevelId,
        //                CategoryId = x.CategoryId,
        //                Tasks = x.Tasks.Select(x => new ObservationCategoryTaskSummary
        //                {
        //                    LevelId = x.LevelId,
        //                    SkillId = x.SkillId,
        //                    Value = x.Value,
        //                }).ToList()
        //            }).ToList() ?? new List<ObservationCategorySummary>(),
        //            ChildFirstname = report.ChildFirstname,
        //            ChildSurname = report.ChildSurname,
        //            ClassroomName = report.ClassroomName,
        //            ReportDate = report.ReportingDate,
        //            ReportPeriod = report.ReportingPeriod,
        //            ReportDateCreated = report.DateCreated,
        //            ReportDateCompleted = report.DateCompleted,
        //            ChildId = report.ChildId,
        //            ReportId = item.Id,
        //        };

        //        summaries.Add(summary);
        //    }

        //    return summaries;
        //}

        //public PractitionerProgressReportSummaryModel GetPractitionerProgressReportSummary(
        //    Guid userId,
        //    DateTime startDate,
        //    DateTime endDate,
        //    string locale)
        //{
        //    var languageId = GetLanguageId(locale);

        //    var result = new PractitionerProgressReportSummaryModel();
        //    result.ReportingPeriod = endDate.ToString("MMMM yyyy"); // Not sure what to do with this?
        //    result.ClassSummaries = GetPractitionerProgressReportSummary(startDate, endDate, userId, languageId);
        //    return result;
        //}

        //public PractitionerProgressReportSummaryModel GetPrincipalProgressReportSummary(
        //    Guid userId,
        //    DateTime startDate,
        //    DateTime endDate,
        //    string locale)
        //{
        //    var languageId = GetLanguageId(locale);

        //    var result = new PractitionerProgressReportSummaryModel();
        //    result.ReportingPeriod = endDate.ToString("MMMM yyyy"); // Not sure what to do with this?
        //    result.ClassSummaries = new List<PractitionerClassProgressReportSummaryModel>();

        //    var practitioners = _personnelService.GetAllPractitionersForPrincipal(userId.ToString());
        //    foreach (var practitioner in practitioners)
        //    {
        //        if (practitioner.UserId == Guid.Empty) continue;
        //        var practitionerClassSummaries = GetPractitionerProgressReportSummary(startDate, endDate, practitioner.UserId.Value, languageId);
        //        if (practitionerClassSummaries.Count > 0)
        //        {
        //            result.ClassSummaries.AddRange(practitionerClassSummaries);
        //        }
        //    }
        //    return result;
        //}

        //private List<PractitionerClassProgressReportSummaryModel> GetPractitionerProgressReportSummary(
        //    DateTime startDate,
        //    DateTime endDate,
        //    Guid practitionerUserId,
        //    Guid languageId)
        //{
        //    var classSummaries = new List<PractitionerClassProgressReportSummaryModel>();
        //    var classroomGroups = _classroomService.GetClassroomGroupsForUser(practitionerUserId);

        //    if (classroomGroups == null)
        //    {
        //        return classSummaries;
        //    }

        //    FetchCategoryData(languageId);

        //    foreach (var classroomGroup in classroomGroups)
        //    {
        //        var practitioner = _practitionerRepo.GetByUserId(practitionerUserId);
        //        var classSummary = new PractitionerClassProgressReportSummaryModel();

        //        classSummaries.Add(classSummary);
        //        classSummary.ClassName = classroomGroup.Name;
        //        classSummary.PractitionerUserId = practitionerUserId;
        //        classSummary.PractitionerFullName = practitioner != null ? practitioner.User.FullName : "";
        //        classSummary.Categories = _categories.Select(x => new PractitionerClassProgressReportCategorySummary
        //        {
        //            Id = x.Id,
        //            Name = x.Name,
        //            ImageUrl = x.ImageUrl,
        //            Color = x.Color,
        //            SubCategories = new List<PractitionerClassProgressReportSubCategorySummary>()
        //        }).ToList();

        //        var learners = _classroomService.GetClassroomGroupsForUser(practitionerUserId);
        //        var learnerUserIds = learners.Select(x => x.UserId).ToList();
        //        classSummary.ChildCount = learnerUserIds.Count;

        //        var childIds = _childRepo.GetAll().Where(x => learnerUserIds.Contains(x.UserId)).Select(x => x.Id).ToList();

        //        var reportContents = _childProgressReportRepo.GetAll()
        //            .Where(r => childIds.Contains(r.ChildId)
        //                && r.IsActive == true
        //                && r.ReportDate.Date >= startDate.Date
        //                && r.ReportDate.Date <= endDate.Date)
        //            .Select(r => r.ReportContent)
        //            .ToList();

        //        foreach (var reportContent in reportContents)
        //        {
        //            var report = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(reportContent);

        //            if (string.IsNullOrEmpty(report.DateCompleted))
        //            {
        //                continue;
        //            }

        //            foreach (var reportCategory in report.Categories)
        //            {
        //                if (reportCategory.SupportingTask == null || !_skillMap.ContainsKey(reportCategory.SupportingTask.TaskId))
        //                {
        //                    continue;
        //                }

        //                var skill = _skillMap[reportCategory.SupportingTask.TaskId];

        //                if (skill == null)
        //                {
        //                    continue;
        //                }

        //                var category = classSummary.Categories.Where(c => c.Id == skill.Category.Id).FirstOrDefault();
        //                var subCategory = category.SubCategories.Where(sc => sc.Id == skill.SubCateogry.Id).FirstOrDefault();

        //                if (subCategory == null)
        //                {
        //                    subCategory = new PractitionerClassProgressReportSubCategorySummary()
        //                    {
        //                        Id = skill.SubCateogry.Id,
        //                        Name = skill.SubCateogry.Name,
        //                        ImageUrl = skill.SubCateogry.ImageUrl,
        //                        ChildrenPerSkill = new List<PractitionerClassProgressReportSkillSummary>()
        //                    };
        //                    category.SubCategories.Add(subCategory);
        //                }

        //                var subCatSkill = subCategory.ChildrenPerSkill.Where(s => s.Id == skill.Id).FirstOrDefault();
        //                if (subCatSkill == null)
        //                {
        //                    subCatSkill = new PractitionerClassProgressReportSkillSummary()
        //                    {
        //                        Id = skill.Id,
        //                        Skill = skill.Name,
        //                        ChildCount = 0
        //                    };
        //                    subCategory.ChildrenPerSkill.Add(subCatSkill);
        //                }
        //                subCatSkill.ChildCount++;
        //            }
        //        }

        //    }
        //    return classSummaries;
        //}

        //private Guid GetLanguageId(string locale)
        //{
        //    var language = _localeService.GetLocale(string.IsNullOrEmpty(locale) ? "en-za" : locale);
        //    if (language == null) return Guid.Empty;
        //    return language.Id;
        //}

        //private void FetchCategoryData(Guid languageId)
        //{
        //    if (_categories != null) return;

        //    _skillMap = new Dictionary<int, Skill>();
        //    _categories = new List<Category>();
        //    var cats = _contentRepo.GetAll((int)ProgressContentTypeEnum.Category, languageId).ToList<dynamic>();
        //    foreach (var cat in cats)
        //    {
        //        var category = new Category()
        //        {
        //            Id = int.Parse(cat.id),
        //            Name = cat.name,
        //            ImageUrl = cat.imageUrl,
        //            Color = cat.color,
        //            SubCategoryIds = (cat.subCategories as string).Split(",").Select(i => int.Parse(i)).ToArray()
        //        };
        //        category.SubCategories = GetSubCategories(category, languageId);
        //        _categories.Add(category);
        //    }
        //}

        //private List<SubCategory> GetSubCategories(Category category, Guid languageId)
        //{
        //    var subCategories = new List<SubCategory>();
        //    var subCats = _contentRepo.GetByIds(5, languageId, category.SubCategoryIds).ToList<dynamic>();
        //    foreach (var subCat in subCats)
        //    {
        //        var subCategory = new SubCategory()
        //        {
        //            Id = int.Parse(subCat.id),
        //            Name = subCat.name,
        //            ImageUrl = subCat.imageUrl,
        //            SkillIds = (subCat.skills as string).Split(",").Select(i => int.Parse(i)).ToArray()
        //        };
        //        subCategory.Skills = GetSkills(category, subCategory, languageId);
        //        subCategories.Add(subCategory);
        //    }
        //    return subCategories;
        //}

        //private List<Skill> GetSkills(Category category, SubCategory subCategory, Guid languageId)
        //{
        //    var data = _contentRepo.GetByIds(7, languageId, subCategory.SkillIds).ToList<dynamic>();
        //    var list = data.Select(x => new Skill
        //    {
        //        Id = int.Parse(x.id),
        //        Name = x.name,
        //        Category = category,
        //        SubCateogry = subCategory
        //    }).ToList();
        //    list.ForEach(s => _skillMap.Add(s.Id, s));
        //    return list;
        //}

        //public (int reportsSubmittedOnTime, int reportsMissingOrIncomplete, int reportsSubmittedOverdue) GetChildProgressReportStatusCountsForPractitioner(
        //    string practitionerHierarcry,
        //    IEnumerable<Guid> classroomGroupIds)
        //{
        //    // Need to lookup the reporting periods for the classroom, and get best match
        //    // TODO: Fix dates here
        //    DateTime previousMonthStart = DateTime.Now.GetStartOfPreviousMonth();
        //    DateTime previousMonthEnd = DateTime.Now.GetEndOfPreviousMonth();
        //    var isPeriod1 = previousMonthStart.Month <= 7;
        //    DateTime reportPeriodStart = GetReportPeriodStart(previousMonthStart.Year, isPeriod1);
        //    DateTime reportPeriodEnd = GetReportPeriodEnd(previousMonthStart.Year, isPeriod1);

        //    DateTime reportDueStart = GetReportDueStart(previousMonthStart.Year, isPeriod1);
        //    DateTime reportDueEnd = GetReportDueEnd(previousMonthStart.Year, isPeriod1);

        //    var reportOverDueStart = GetReportOverDueStart(previousMonthStart.Year, isPeriod1);
        //    var reportOverDueEnd = GetReportOverDueEnd(previousMonthStart.Year, isPeriod1);

        //    var progressReports = _childProgressReportRepo
        //        .GetAll()
        //        .Where(x =>
        //                x.ClassroomGroupId.HasValue
        //                && classroomGroupIds.Contains(x.ClassroomGroupId.Value)
        //                && x.ReportDate >= reportPeriodStart
        //                && x.ReportDate <= reportOverDueEnd
        //                && x.IsActive == true)
        //        .OrderBy(x => x.ReportDate)
        //        .ToList();

        //    var reportsSubmittedOnTime = progressReports.Count(r => r.DateCompleted.HasValue && r.DateCompleted.Value <= reportDueEnd);
        //    var reportsSubmittedOverdue = progressReports.Count(r => r.DateCompleted.HasValue && r.DateCompleted.Value >= reportOverDueStart);

        //    var childCount = _childRepo.GetAll().Count(c => c.IsActive == true && c.Hierarchy.StartsWith(practitionerHierarcry));

        //    var reportsMissingOrIncomplete = childCount - (reportsSubmittedOnTime + reportsSubmittedOverdue);

        //    return (reportsSubmittedOnTime, reportsMissingOrIncomplete, reportsSubmittedOverdue);
        //}

        //// TODO - None of these are needed anymore, or at least need updates
        //public static DateTime GetReportPeriodStart(int year, bool isPeriod1)
        //{
        //    return (isPeriod1 ? new DateOnly(year, 1, 1) : new DateOnly(year, 7, 1))
        //        .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        //}

        //public static DateTime GetReportPeriodEnd(int year, bool isPeriod1)
        //{
        //    return (isPeriod1 ? new DateOnly(year, 6, 30) : new DateOnly(year, 12, 20))
        //                    .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        //}

        //public static DateTime GetNextReportDuePeriodStart(int year, bool isPeriod1)
        //{
        //    return (isPeriod1 ? new DateOnly(year, 11, 1) : new DateOnly(year + 1, 6, 1))
        //                        .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        //}

        //public static DateTime GetNextReportDuePeriodEnd(int year, bool isPeriod1)
        //{
        //    return (isPeriod1 ? new DateOnly(year, 11, 30) : new DateOnly(year + 1, 6, 30))
        //                    .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        //}

        //public static DateTime GetReportDueStart(int year, bool isPeriod1)
        //{
        //    return (isPeriod1 ? new DateOnly(year, 6, 1) : new DateOnly(year, 11, 1))
        //                        .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        //}

        //public static DateTime GetReportDueEnd(int year, bool isPeriod1)
        //{
        //    return (isPeriod1 ? new DateOnly(year, 6, 30) : new DateOnly(year, 11, 30))
        //                    .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        //}

        //public static DateTime GetReportOverDueStart(int year, bool isPeriod1)
        //{
        //    return (isPeriod1 ? new DateOnly(year, 7, 1) : new DateOnly(year, 12, 1))
        //                    .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        //}

        //public static DateTime GetReportOverDueEnd(int year, bool isPeriod1)
        //{
        //    return (isPeriod1 ? new DateOnly(year, 7, 31) : new DateOnly(year, 12, 20))
        //                    .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        //}
    }
}
