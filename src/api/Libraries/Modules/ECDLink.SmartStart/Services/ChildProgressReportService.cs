using ECDLink.Abstractrions.Enums;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Extensions;
using ECDLink.Core.Helpers;
using ECDLink.Core.Reporting;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
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
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.SmartStart.Services
{
    public enum ProgressContentTypeEnum
    {
        Category = 4,
        SubCategory = 5,
        Level = 6,
        Skill = 7
    }

    public class ChildProgressReportService
    {
        public class Category
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string ImageUrl { get; set; }
            public string Color { get; set; }
            public int[] SubCategoryIds { get; set; }
            public List<SubCategory> SubCategories { get; set; }
        }

        public class SubCategory
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string ImageUrl { get; set; }
            public int[] SkillIds {  get; set; }
            public List<Skill> Skills { get; set; }
        }
        public class Skill
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public Category Category { get; set; }
            public SubCategory SubCateogry { get; set; }
        }

        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly IDbContextFactory<AuthenticationDbContext> _dbFactory;
        private readonly IFillableFieldService _fieldService;
        private readonly IFileService _fileService;
        private readonly AttendanceService _attendanceService;
        private readonly IPersonnelService _personnelService;
        private readonly ContentManagementRepository _contentRepo;
        private readonly ILocaleService<Language> _localeService;

        private IGenericRepository<Child, Guid> _childRepo;
        private IGenericRepository<ChildProgressReport, Guid> _childProgressReportRepo;

        private List<Category> _categories = null;
        private Dictionary<int, Skill> _skillMap = null;

        public ChildProgressReportService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            IDbContextFactory<AuthenticationDbContext> dbFactory,
            IFillableFieldService fieldService,
            IFileService fileService,
            [Service] AttendanceService attendanceService,
            [Service] IPersonnelService personnelService,
            [Service] ContentManagementRepository contentRepo,
            [Service] ILocaleService<Language> localeService
            )
        {
            _repoFactory = repoFactory;
            _dbFactory = dbFactory;
            _fieldService = fieldService;
            _fileService = fileService;
            _attendanceService = attendanceService;
            _personnelService = personnelService;
            _contentRepo = contentRepo;
            _localeService = localeService;

            var userId = contextAccessor.HttpContext.GetUser()?.Id;
            _childRepo = repoFactory.CreateRepository<Child>(userContext: userId);
            _childProgressReportRepo = repoFactory.CreateRepository<ChildProgressReport>(userContext: userId);
        }

        public async Task<string> GenerateReport(DataAccessLayer.Entities.Reports.ChildProgressReport reportEntity,
            Practitioner practitioner,
            string currentProfileImageUrl,
            Document document)
        {
            var reportContent = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(reportEntity.ReportContent);

            var fields = ChildProgressReportTemplate.GetFieldTemplate(reportContent, practitioner, currentProfileImageUrl);

            if (document == default)
            {
                throw new FileNotFoundException("No Progress Report Document Assigned");
            }

            var pdfDocument = await _fileService.GetFile(DocumentHelper.GetFileName(document.Reference), FileTypeEnum.ReportTemplates);
            return _fieldService.FillForm(pdfDocument, fields, 5);
        }

        public async Task<string> GenerateChildProgressReport(
          Guid userId,
          Guid childId,
          Guid classgroupId,
          DateTime reportDate)
        {
            var progressReportRepo = _repoFactory.CreateRepository<DataAccessLayer.Entities.Reports.ChildProgressReport>(userContext: userId);

            var progressReportEntity = progressReportRepo
                                            .GetAll()
                                            .Where(x =>
                                                    // x.ClassroomGroupId == classgroupId
                                                    x.ChildId == childId
                                                    && x.ReportDate.Month == reportDate.Month && x.ReportDate.Year == reportDate.Year)
                                            .OrderBy(x => x.Id)
                                            .FirstOrDefault();

            if (progressReportEntity == default)
            {
                return null;
            }

            var practitionerRepo = _repoFactory.CreateRepository<Practitioner>(userContext: userId);
            var practitioner = practitionerRepo.GetAll().Where(x => x.Hierarchy == progressReportEntity.Hierarchy).OrderBy(x => x.Id).FirstOrDefault();

            using var dbScope = _dbFactory.CreateDbContext();

            var document = dbScope.Documents
                                  .Where(x => string.Equals(x.Name, ReportConstants.ChildProgressReport) && x.IsActive)
                                  .OrderBy(x => x.Id)
                                  .FirstOrDefault();

            return await GenerateReport(progressReportEntity, practitioner, practitioner != null ? practitioner.User.ProfileImageUrl : "", document);
        }

        public async Task<ChildProgressReportDetailedModel> GetChildProgressReport(
            Guid userId,
            Guid reportId)
        {
            var reportRepo = _repoFactory.CreateRepository<DataAccessLayer.Entities.Reports.ChildProgressReport>();
            reportRepo.SetUserContext(userId);

            var summaryEntity = reportRepo.GetById(reportId);

            return JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(summaryEntity.ReportContent);
        }

        public async Task<IEnumerable<ChildProgressReportDetailedModel>> GetChildProgressReports(
            Guid userId,
            int count)
        {
            var reportRepo = _repoFactory.CreateRepository<DataAccessLayer.Entities.Reports.ChildProgressReport>();
            reportRepo.SetUserContext(userId);

            var reports = reportRepo.GetAll()
                               .OrderByDescending(x => x.UpdatedDate)
                               .Take(count)
                               .ToList();

            var result = new List<ChildProgressReportDetailedModel>();
            foreach (var report in reports)
            {
                var detail = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(report.ReportContent);
                if (detail == default(ChildProgressReportDetailedModel))
                {
                    continue;
                }
                result.Add(detail);
            }
            return result;
        }

        public async Task<IEnumerable<ChildProgressReportSummaryModel>> GetChildProgressReportSummary(
            Guid userId,
            int count)
        {
            var reportRepo = _repoFactory.CreateRepository<DataAccessLayer.Entities.Reports.ChildProgressReport>();
            reportRepo.SetUserContext(userId);

            var summaryEntities = reportRepo.GetAll()
                                    .OrderByDescending(x => x.UpdatedDate)
                                    .Take(count)
                                    .ToList();

            var summaries = new List<ChildProgressReportSummaryModel>();

            foreach (var item in summaryEntities)
            {
                var report = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(item.ReportContent);

                if (report == default(ChildProgressReportDetailedModel))
                {
                    continue;
                }
                if (string.IsNullOrEmpty(report.DateCompleted))
                {
                    continue;
                }

                var summary = new ChildProgressReportSummaryModel
                {
                    Categories = report?.Categories?.Select(x => new ObservationCategorySummary
                    {
                        AchievedLevelId = x.AchievedLevelId,
                        CategoryId = x.CategoryId,
                        Tasks = x.Tasks.Select(x => new ObservationCategoryTaskSummary
                        {
                            LevelId = x.LevelId,
                            SkillId = x.SkillId,
                            Value = x.Value,
                        }).ToList() ?? new List<ObservationCategoryTaskSummary>()
                    }).ToList() ?? new List<ObservationCategorySummary>(),
                    ChildFirstname = report.ChildFirstname,
                    ChildSurname = report.ChildSurname,
                    ClassroomName = report.ClassroomName,
                    ReportDate = report.ReportingDate,
                    ReportPeriod = report.ReportingPeriod,
                    ReportDateCreated = report.DateCreated,
                    ReportDateCompleted = report.DateCompleted,
                    ChildId = report.ChildId,
                    ReportId = item.Id,
                };

                summaries.Add(summary);
            }

            return summaries;
        }

        public async Task<PractitionerProgressReportSummaryModel> GetPractitionerProgressReportSummary(
            Guid userId,
            string reportingPeriod,
            string locale)
        {
            var languageId = GetLanguageId(locale);
            var pracRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: userId);
            var cprRepo = _repoFactory.CreateGenericRepository<ChildProgressReport>(userContext: userId);
            var childRepo = _repoFactory.CreateGenericRepository<Child>(userContext: userId);
            var reportingPeriodDate = GetDateFromReportingPeriod(reportingPeriod);

            var result = new PractitionerProgressReportSummaryModel();
            result.ReportingPeriod = reportingPeriodDate.ToString("MMMM yyyy");
            result.ClassSummaries = GetPractitionerProgressReportSummary(pracRepo, cprRepo, childRepo, reportingPeriodDate, userId, languageId);
            return result;
        }

        public async Task<PractitionerProgressReportSummaryModel> GetPrincipalProgressReportSummary(
            Guid userId,
            string reportingPeriod,
            string locale)
        {
            var languageId = GetLanguageId(locale);
            var pracRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: userId);
            var cprRepo = _repoFactory.CreateGenericRepository<ChildProgressReport>(userContext: userId);
            var childRepo = _repoFactory.CreateGenericRepository<Child>(userContext: userId);
            var reportingPeriodDate = GetDateFromReportingPeriod(reportingPeriod);

            var result = new PractitionerProgressReportSummaryModel();
            result.ReportingPeriod = reportingPeriodDate.ToString("MMMM yyyy");
            result.ClassSummaries = new List<PractitionerClassProgressReportSummaryModel>();

            var practitioners = _personnelService.GetAllPractitionersForPrincipal(userId.ToString());
            foreach (var practitioner in practitioners)
            {
                if (practitioner.UserId==Guid.Empty) continue;
                var practitionerClassSummaries = GetPractitionerProgressReportSummary(pracRepo, cprRepo, childRepo, reportingPeriodDate, practitioner.UserId.Value, languageId);
                if (practitionerClassSummaries.Count > 0)
                {
                    result.ClassSummaries.AddRange(practitionerClassSummaries);
                }
            }
            return result;
        }

        private List<PractitionerClassProgressReportSummaryModel> GetPractitionerProgressReportSummary(
                IGenericRepository<Practitioner, Guid> pracRepo,
                IGenericRepository<ChildProgressReport, Guid> cprRepo,
                IGenericRepository<Child, Guid> childRepo,
                DateTime reportingPeriodDate,
                Guid userId,
                Guid languageId
            )
        {
            var classSummaries = new List<PractitionerClassProgressReportSummaryModel>();
            var classroomGroups = _attendanceService.GetUserClassroomGroups(userId.ToString());
            if (classroomGroups == null) return classSummaries;

            FetchCategoryData(languageId);

            foreach (var classroomGroup in classroomGroups)
            {
                var practitioner = pracRepo.GetByUserId(userId);
                var classSummary = new PractitionerClassProgressReportSummaryModel();
                classSummaries.Add(classSummary);
                classSummary.ClassName = classroomGroup.Name;
                classSummary.PractitionerUserId = userId;
                classSummary.PractitionerFullName = practitioner != null ? practitioner.User.FullName : "";
                classSummary.Categories = _categories.Select(x => new PractitionerClassProgressReportCategorySummary
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImageUrl = x.ImageUrl,
                    Color = x.Color,
                    SubCategories = new List<PractitionerClassProgressReportSubCategorySummary>()
                }).ToList();

                var learners = _attendanceService.GetAllLearnerGroupInstances(classroomGroup.Id);
                var learnerUserIds = learners.Select(x => x.UserId).ToList();
                classSummary.ChildCount = learnerUserIds.Count;

                var childIds = childRepo.GetAll().Where(x => learnerUserIds.Contains(x.UserId)).Select(x => x.Id).ToList();

                var reportContents = cprRepo.GetAll()
                    .Where(r => childIds.Contains(r.ChildId)
                        && r.IsActive == true
                        && r.ReportDate >= reportingPeriodDate.AddDays(-1)
                        && r.ReportDate <= reportingPeriodDate.AddDays(1))
                    .Select(r => r.ReportContent)
                    .ToList();
                foreach (var reportContent in reportContents)
                {
                    var report = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(reportContent);
                    if (string.IsNullOrEmpty(report.DateCompleted)) continue;
                    foreach (var reportCat in report.Categories)
                    {
                        if (reportCat.SupportingTask == null) continue;
                        if (!_skillMap.ContainsKey(reportCat.SupportingTask.TaskId)) continue;
                        var skill = _skillMap[reportCat.SupportingTask.TaskId];
                        if (skill == null) continue;
                        var cat = classSummary.Categories.Where(c => c.Id == skill.Category.Id).FirstOrDefault();
                        var subCat = cat.SubCategories.Where(sc => sc.Id == skill.SubCateogry.Id).FirstOrDefault();
                        if (subCat == null)
                        {
                            subCat = new PractitionerClassProgressReportSubCategorySummary()
                            {
                                Id = skill.SubCateogry.Id,
                                Name = skill.SubCateogry.Name,
                                ImageUrl = skill.SubCateogry.ImageUrl,
                                ChildrenPerSkill = new List<PractitionerClassProgressReportSkillSummary>()
                            };
                            cat.SubCategories.Add(subCat);
                        }
                        var subCatSkill = subCat.ChildrenPerSkill.Where(s => s.Id == skill.Id).FirstOrDefault();
                        if (subCatSkill == null)
                        {
                            subCatSkill = new PractitionerClassProgressReportSkillSummary()
                            {
                                Id = skill.Id,
                                Skill = skill.Name,
                                ChildCount = 0
                            };
                            subCat.ChildrenPerSkill.Add(subCatSkill);
                        }
                        subCatSkill.ChildCount++;
                    }
                }

            }
            return classSummaries;
        }


        private DateTime GetDateFromReportingPeriod(string reportingPeriod)
        {
            if (reportingPeriod.Length < 8) return DateTime.MinValue;
            var month = reportingPeriod.Substring(0, 3).ToLower();
            int year = 1900;
            int.TryParse(reportingPeriod.Substring(reportingPeriod.Length - 4, 4), out year);
            if (month == "jun") return new DateTime(year, 6, 1);
            if (month == "nov") return new DateTime(year, 11, 1);
            return DateTime.MinValue;
        }

        private Guid GetLanguageId(string locale)
        {
            var language = _localeService.GetLocale(string.IsNullOrEmpty(locale) ? "en-za" : locale);
            if (language == null) return Guid.Empty;
            return language.Id;
        }

        private void FetchCategoryData(Guid languageId)
        {
            if (_categories != null) return;

            _skillMap = new Dictionary<int, Skill>();
            _categories = new List<Category>();
            var cats = _contentRepo.GetAll((int)ProgressContentTypeEnum.Category, languageId).ToList<dynamic>();
            foreach(var cat in cats)
            {
                var category = new Category()
                {
                    Id = int.Parse(cat.id),
                    Name = cat.name,
                    ImageUrl = cat.imageUrl,
                    Color = cat.color,
                    SubCategoryIds = (cat.subCategories as string).Split(",").Select(i => int.Parse(i)).ToArray()
                };
                category.SubCategories = GetSubCategories(category, languageId);
                _categories.Add(category);
            }
        }

        private List<SubCategory> GetSubCategories(Category category, Guid languageId)
        {
            var subCategories = new List<SubCategory>();
            var subCats = _contentRepo.GetByIds(languageId, category.SubCategoryIds).ToList<dynamic>();
            foreach(var subCat in subCats)
            {
                var subCategory = new SubCategory()
                {
                    Id = int.Parse(subCat.id),
                    Name = subCat.name,
                    ImageUrl = subCat.imageUrl,
                    SkillIds = (subCat.skills as string).Split(",").Select(i => int.Parse(i)).ToArray()
                };
                subCategory.Skills = GetSkills(category, subCategory, languageId);
                subCategories.Add(subCategory);
            }
            return subCategories;
        }

        private List<Skill> GetSkills(Category category, SubCategory subCategory, Guid languageId) 
        {
            var data = _contentRepo.GetByIds(languageId, subCategory.SkillIds).ToList<dynamic>();
            var list = data.Select(x => new Skill
            {
                Id = int.Parse(x.id),
                Name = x.name,
                Category = category,
                SubCateogry = subCategory
            }).ToList();
            list.ForEach(s => _skillMap.Add(s.Id, s));
            return list;
        }

        public (int reportsSubmittedOnTime, int reportsMissingOrIncomplete, int reportsSubmittedOverdue) GetChildProgressReportStatusCountsForPractitioner(
            string practitionerHierarcry,
            IEnumerable<Guid> classroomGroupIds)
        {
            DateTime previousMonthStart = DateTime.Now.GetStartOfPreviousMonth();
            DateTime previousMonthEnd = DateTime.Now.GetEndOfPreviousMonth();
            var isPeriod1 = previousMonthStart.Month <= 7;
            DateTime reportPeriodStart = GetReportPeriodStart(previousMonthStart.Year, isPeriod1);
            DateTime reportPeriodEnd = GetReportPeriodEnd(previousMonthStart.Year, isPeriod1);

            DateTime reportDueStart = GetReportDueStart(previousMonthStart.Year, isPeriod1);
            DateTime reportDueEnd = GetReportDueEnd(previousMonthStart.Year, isPeriod1);

            var reportOverDueStart = GetReportOverDueStart(previousMonthStart.Year, isPeriod1);
            var reportOverDueEnd = GetReportOverDueEnd(previousMonthStart.Year, isPeriod1);

            var progressReports = _childProgressReportRepo
                .GetAll()
                .Where(x =>
                        x.ClassroomGroupId.HasValue
                        && classroomGroupIds.Contains(x.ClassroomGroupId.Value)
                        && x.ReportDate >= reportPeriodStart
                        && x.ReportDate <= reportOverDueEnd
                        && x.IsActive == true)
                .OrderBy(x => x.ReportDate)
                .ToList();

            var reportsSubmittedOnTime = progressReports?.Count(r => r.DateCompleted.HasValue && r.DateCompleted.Value <= reportDueEnd) ?? 0;
            var reportsSubmittedOverdue = progressReports?.Count(r => r.DateCompleted.HasValue && r.DateCompleted.Value >= reportOverDueStart) ?? 0;

            var childCount = _childRepo.GetAll().Count(c => c.IsActive == true && c.Hierarchy.StartsWith(practitionerHierarcry));

            var reportsMissingOrIncomplete = childCount - (reportsSubmittedOnTime + reportsSubmittedOverdue);

            return (reportsSubmittedOnTime, reportsMissingOrIncomplete, reportsSubmittedOverdue);
        }


        public static DateTime GetReportPeriodStart(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 1, 1) : new DateOnly(year, 7, 1))
                .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        }

        public static DateTime GetReportPeriodEnd(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 6, 30) : new DateOnly(year, 12, 20))
                            .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        }

        public static DateTime GetNextReportDuePeriodStart(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 11, 1) : new DateOnly(year + 1, 6, 1))
                                .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        }

        public static DateTime GetNextReportDuePeriodEnd(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 11, 30) : new DateOnly(year + 1, 6, 30))
                            .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        }

        public static DateTime GetReportDueStart(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 6, 1) : new DateOnly(year, 11, 1))
                                .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        }

        public static DateTime GetReportDueEnd(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 6, 30) : new DateOnly(year, 11, 30))
                            .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        }

        public static DateTime GetReportOverDueStart(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 7, 1) : new DateOnly(year, 12, 1))
                            .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        }

        public static DateTime GetReportOverDueEnd(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 7, 31) : new DateOnly(year, 12, 20))
                            .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        }
    }
}
