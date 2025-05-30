using EcdLink.Api.CoreApi.GraphApi.Models.ChildProgress;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.PDFGenerator.Services.Interfaces;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

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

            public string ChildEnjoys { get; set; }

            public string GoodProgressWith { get; set; }

            public string HowCanCaregiverSupport { get; set; }

            public string ClassroomName { get; set; }
            public string PractitionerName { get; set; }
            public string PrincipalName { get; set; }
            public string PrincipalPhoneNumber { get; set; }
        }

        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly IDbContextFactory<AuthenticationDbContext> _dbFactory;
        private readonly IFillableFieldService _fieldService;
        private readonly IFileService _fileService;
        private readonly IClassroomService _classroomService;
        private readonly IPersonnelService _personnelService;
        private readonly ContentManagementRepository _contentRepo;
        private readonly ILocaleService<Language> _localeService;
        private readonly IPointsEngineService _pointsEngineService;
        private readonly INotificationService _notificationService;

        private IGenericRepository<Child, Guid> _childRepo;
        private IGenericRepository<Learner, Guid> _learnerRepo;
        private IGenericRepository<ChildProgressReport, Guid> _childProgressReportRepo;
        private IGenericRepository<ChildProgressReportPeriod, Guid> _childProgressReportPeriodRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private IGenericRepository<Document, Guid> _documentRepo;
        private readonly IGenericRepository<ClassroomGroup, Guid> _classroomGroupRepo;

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
            [Service] ILocaleService<Language> localeService,
            [Service] IPointsEngineService pointsEngineService,
            [Service] INotificationService notificationService
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
            _pointsEngineService = pointsEngineService;
            _notificationService = notificationService;

            _contextUserId = contextAccessor.HttpContext.GetUser().Id;
            _childRepo = repoFactory.CreateRepository<Child>(userContext: _contextUserId);
            _childProgressReportRepo = repoFactory.CreateRepository<ChildProgressReport>(userContext: _contextUserId);
            _childProgressReportPeriodRepo = repoFactory.CreateRepository<ChildProgressReportPeriod>(userContext: _contextUserId);
            _practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: _contextUserId);
            _learnerRepo = repoFactory.CreateRepository<Learner>(userContext: _contextUserId);
            _classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: _contextUserId);
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
                ChildEnjoys = input.ChildEnjoys,
                GoodProgressWith = input.GoodProgressWith,
                HowCanCaregiverSupport = input.HowCanCaregiverSupport,
                ClassroomName = input.ClassroomName,
                PractitionerName = input.PractitionerName,
                PrincipalName = input.PrincipalName,
                PrincipalPhoneNumber = input.PrincipalPhoneNumber,
            };

            // Check if report exists
            var existingReport = _childProgressReportRepo.GetById(input.Id);

            if (existingReport != null)
            {
                if (input.DateCompleted != null)
                {
                    existingReport.DateCompleted = input.DateCompleted;
                }

                existingReport.ObservationsCompleteDate = input.ObservationsCompleteDate;
                existingReport.ReportContent = JsonConvert.SerializeObject(reportContent);
                existingReport.UserId = _contextUserId;

                _childProgressReportRepo.Update(existingReport);

                // Call points engine after update
                if (input.DateCompleted != null)
                {
                    _pointsEngineService.CalculateCreateChildProgressReport(_contextUserId);
                    // Create notification if progress is 100%
                    CreateCompletedReportNotification(existingReport.ChildProgressReportPeriodId, input.DateCompleted.Value.Date);
                
                }
                if (input.ObservationsCompleteDate != null)
                {
                    _pointsEngineService.CalculateCompleteChildProgressObservations(_contextUserId);
                }
            }
            else
            {
                var newReport = new ChildProgressReport
                {
                    Id = input.Id,
                    UserId = _contextUserId,
                    ChildId = input.ChildId,
                    ChildProgressReportPeriodId = input.ChildProgressReportPeriodId,
                    DateCompleted = input.DateCompleted,
                    ObservationsCompleteDate = input.ObservationsCompleteDate,
                    ReportContent = JsonConvert.SerializeObject(reportContent),                    
                };

                _childProgressReportRepo.Insert(newReport);

                if (input.ObservationsCompleteDate != null)
                {
                    _pointsEngineService.CalculateCompleteChildProgressObservations(_contextUserId);
                }

                // Expire the finish-progress-report notification for the user, when creating a report
                var messages = _notificationService.GetMessagesForUser(_contextUserId.ToString(), TemplateTypeConstants.FinishProgressReport, input.ChildProgressReportPeriodId).ToArray();
                if (messages.Count() > 0) {
                    foreach (var item in messages)
                    {
                        _notificationService.DisableNotification(item.Id.ToString());
                    }
                }
            }
        }

        private void CreateCompletedReportNotification(Guid childProgressReportPeriodId, DateTime dateCompleted) 
        {
            var practitioner = _practitionerRepo.GetByUserId(_contextUserId);
            var isPrincipal = practitioner.IsPrincipalOrAdmin();
            var totalChildren = 0;
            if (isPrincipal)
            {
                //principal = the number of children at the preschool;
                totalChildren = _classroomGroupRepo.GetAll()
                                .Where(x => x.IsActive && x.Classroom.UserId == _contextUserId && x.Classroom.IsActive)
                                .SelectMany(x => x.Learners.Where(y => y.IsActive && y.User.IsActive))
                                .Count();
            } else
            {
                //practitioner = the number of children assigned to the user
                totalChildren = _childRepo.GetAll()
                                .Where(x => x.IsActive && x.Hierarchy.StartsWith(practitioner.Hierarchy)).Count();
            }

            if (totalChildren != 0) {
                var totalCompleted = _childProgressReportRepo
                                    .GetAll()
                                    .Where(x => x.ChildProgressReportPeriodId == childProgressReportPeriodId
                                                && x.DateCompleted.HasValue
                                                && x.IsActive == true)
                                    .Count();

                if (totalCompleted == totalChildren) {
                    var endDate = dateCompleted.AddDays(7);
                    _notificationService.SendNotificationAsync(null, TemplateTypeConstants.AllProgressReportsCreated, dateCompleted.Date, practitioner.User, "", MessageStatusConstants.Green, null, endDate, false, true, null,
                        relatedEntities: new List<RelatedEntity> { new RelatedEntity(childProgressReportPeriodId, "ChildProgressReportPeriod") });
                }
            }
        }


        public IEnumerable<ChildProgressReportModel> GetChildProgressReportsForUser(Guid userId)
        {
            var userClassrooms = _classroomService.GetClassroomGroupsForUser(userId);
            var classroomIds = userClassrooms.Select(x => x.ClassroomId);
            var classroomGroupIds = userClassrooms.Select(x => x.Id);
            var childUserIds = _learnerRepo.GetAll().Where(x => classroomGroupIds.Contains(x.ClassroomGroupId) && x.IsActive).Select(x => x.UserId);
            var childIds = _childRepo.GetAll().Where(x => childUserIds.Contains(x.UserId) && x.IsActive).Select(x => x.Id);
            var today = DateTime.Now;

            // 1. Active reports within period
            // 2. Completed reports outside period
            var reportPeriods = _childProgressReportPeriodRepo.GetAll()
                                        .Where(x => classroomIds.Contains(x.ClassroomId) && x.IsActive)
                                        .Select(x => new { x.Id, x.StartDate, x.EndDate }).AsNoTracking().AsQueryable();

            var allPeriodIds = reportPeriods.Select(x => x.Id);
            var activeReportPeriodId = reportPeriods
                                       .Where(x => today.Date >= x.StartDate.Date && today.Date <= x.EndDate.Date)
                                       .Select(x => x.Id)
                                       .FirstOrDefault();


            var reports = _childProgressReportRepo.GetAll().Where(x => childIds.Contains(x.ChildId) && allPeriodIds.Contains(x.ChildProgressReportPeriodId)).AsNoTracking().ToList();
            var allReports = new List<ChildProgressReport>();

            allReports.AddRange(reports.Where(x => x.ChildProgressReportPeriodId == activeReportPeriodId)); // current period report
            allReports.AddRange(reports.Where(x => x.DateCompleted.HasValue)); // completed

            foreach (var report in allReports.Distinct()) 
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
                    ObservationsCompleteDate = report.ObservationsCompleteDate,
                    ChildEnjoys = data.ChildEnjoys,
                    GoodProgressWith = data.GoodProgressWith,
                    HowCanCaregiverSupport = data.HowCanCaregiverSupport,
                    ClassroomName = data.ClassroomName,
                    PractitionerName = data.PractitionerName,
                    PrincipalName = data.PrincipalName,
                    PrincipalPhoneNumber = data.PrincipalPhoneNumber,
                };
            }
        }

        public PractitionerProgressReportSummaryModel GetPractitionerProgressReportSummary(
            Guid userId,
            DateTime startDate,
            DateTime endDate,
            string locale)
        {
            var languageId = GetLanguageId(locale);

            var result = new PractitionerProgressReportSummaryModel();
            result.ReportingPeriod = endDate.ToString("MMMM yyyy"); // Not sure what to do with this?
            result.ClassSummaries = GetPractitionerProgressReportSummary(startDate, endDate, userId, languageId);
            return result;
        }

        private List<PractitionerClassProgressReportSummaryModel> GetPractitionerProgressReportSummary(
            DateTime startDate,
            DateTime endDate,
            Guid practitionerUserId,
            Guid languageId)
        {
            var classSummaries = new List<PractitionerClassProgressReportSummaryModel>();
            var classroomGroups = _classroomService.GetClassroomGroupsForUser(practitionerUserId);

            if (classroomGroups == null)
            {
                return classSummaries;
            }

            FetchCategoryData(languageId);

            foreach (var classroomGroup in classroomGroups)
            {
                var practitioner = _practitionerRepo.GetByUserId(practitionerUserId);
                var classSummary = new PractitionerClassProgressReportSummaryModel();

                classSummaries.Add(classSummary);
                classSummary.ClassName = classroomGroup.Name;
                classSummary.PractitionerUserId = practitionerUserId;
                classSummary.PractitionerFullName = practitioner != null ? practitioner.User.FullName : "";
                classSummary.Categories = _categories.Select(x => new PractitionerClassProgressReportCategorySummary
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImageUrl = x.ImageUrl,
                    Color = x.Color,
                    SubCategories = new List<PractitionerClassProgressReportSubCategorySummary>()
                }).ToList();

                var learners = _classroomService.GetClassroomGroupsForUser(practitionerUserId);
                var learnerUserIds = learners.Select(x => x.UserId).ToList();
                classSummary.ChildCount = learnerUserIds.Count;

                var childIds = _childRepo.GetAll().Where(x => learnerUserIds.Contains(x.UserId)).Select(x => x.Id).ToList();

                var reportContents = _childProgressReportRepo.GetAll()
                    .Where(r => childIds.Contains(r.ChildId)
                        && r.IsActive == true
                        && r.ChildProgressReportPeriod.StartDate <= endDate
                        && r.ChildProgressReportPeriod.EndDate >= startDate)
                    .Select(r => r.ReportContent)
                    .ToList();

                foreach (var reportContent in reportContents)
                {
                    var report = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(reportContent);

                    if (string.IsNullOrEmpty(report.DateCompleted))
                    {
                        continue;
                    }

                    foreach (var reportCategory in report.Categories)
                    {
                        if (reportCategory.SupportingTask == null || !_skillMap.ContainsKey(reportCategory.SupportingTask.TaskId))
                        {
                            continue;
                        }

                        var skill = _skillMap[reportCategory.SupportingTask.TaskId];

                        if (skill == null)
                        {
                            continue;
                        }

                        var category = classSummary.Categories.Where(c => c.Id == skill.Category.Id).FirstOrDefault();
                        var subCategory = category.SubCategories.Where(sc => sc.Id == skill.SubCateogry.Id).FirstOrDefault();

                        if (subCategory == null)
                        {
                            subCategory = new PractitionerClassProgressReportSubCategorySummary()
                            {
                                Id = skill.SubCateogry.Id,
                                Name = skill.SubCateogry.Name,
                                ImageUrl = skill.SubCateogry.ImageUrl,
                                ChildrenPerSkill = new List<PractitionerClassProgressReportSkillSummary>()
                            };
                            category.SubCategories.Add(subCategory);
                        }

                        var subCatSkill = subCategory.ChildrenPerSkill.Where(s => s.Id == skill.Id).FirstOrDefault();
                        if (subCatSkill == null)
                        {
                            subCatSkill = new PractitionerClassProgressReportSkillSummary()
                            {
                                Id = skill.Id,
                                Skill = skill.Name,
                                ChildCount = 0
                            };
                            subCategory.ChildrenPerSkill.Add(subCatSkill);
                        }
                        subCatSkill.ChildCount++;
                    }
                }

            }
            return classSummaries;
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
            foreach (var cat in cats)
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
            var subCats = _contentRepo.GetByIds(5, languageId, category.SubCategoryIds).ToList<dynamic>();
            foreach (var subCat in subCats)
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
            var data = _contentRepo.GetByIds(7, languageId, subCategory.SkillIds).ToList<dynamic>();
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
    }
}
