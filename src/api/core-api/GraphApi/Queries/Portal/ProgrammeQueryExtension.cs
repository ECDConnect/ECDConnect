using EcdLink.Api.CoreApi.GraphApi.Models.Portal;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Constants;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ProgrammeQueryExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.View)]
        public List<StoryBookViewModel> GetStoryBookRecords(
           [Service] ContentManagementRepository contentRepo,
           AuthenticationDbContext dbContext,
           CancellationToken cancellationToken,
           string search = null,
           List<string> typesSearch = null,
           List<int> themesSearch = null,
           List<Guid> languageSearch = null,
           List<string> shareContent = null,
           PagedQueryInput pagingInput = null,
           DateTime? startDate = null,
           DateTime? endDate= null)
        {
            if (cancellationToken.IsCancellationRequested)
            {
                return null;
            }

            var englishId = new Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var records = new List<StoryBookViewModel>();
            var themeDayRecords = contentRepo.GetAll(ContentTypeConstants.ThemeDayId, englishId)
                                     .Select(x => new GeneralThemeDaysViewModel(x))
                                     .Where(x => x.TenantId.ToString() == TenantExecutionContext.Tenant.Id.ToString())
                                     .Select(x => new ThemeDayViewModel(x.Id, x.StoryBook))
                                     .Distinct()
                                     .ToList();
            var themeRecords = contentRepo.GetAll(ContentTypeConstants.ThemeId, englishId)
                                     .Select(x => new ThemeNameDaysViewModel(x))
                                     .Where(x => x.TenantId.ToString() == TenantExecutionContext.Tenant.Id.ToString())
                                     .ToList();

            if (languageSearch.Count > 0)
            {
                foreach (var localeId in languageSearch)
                {
                    records.AddRange(contentRepo.GetAll(ContentTypeConstants.StoryBookId, localeId).Select(x => new StoryBookViewModel(x, localeId, themeDayRecords, themeRecords)).ToList());
                }
            }
            else
            {
                records = contentRepo.GetAll(ContentTypeConstants.StoryBookId, englishId).Select(x => new StoryBookViewModel(x, englishId, themeDayRecords, themeRecords)).ToList();
            }


            if (records.Any())
            {
                if (string.IsNullOrEmpty(search)
                    && typesSearch.Count == 0
                    && themesSearch.Count == 0
                    && startDate == null
                    && endDate == null
                    && shareContent.Count == 0)
                {
                    return records
                        .OrderByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Year : d.InsertedDate.Value.Year)
                        .ThenByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Month : d.InsertedDate.Value.Month)
                        .ThenByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Day : d.InsertedDate.Value.Day)
                        .ToList();
                }
                else
                {
                    var filteredRecords = new List<StoryBookViewModel>();

                    if (!string.IsNullOrEmpty(search))
                    {
                        foreach (var record in records)
                        {
                            if (record.Name.ToLower().Contains(search.ToLower()))
                            {
                                filteredRecords.Add(record);
                            }
                        }
                    }

                    if (shareContent.Count != 0)
                    {
                        if (shareContent.Contains("Yes"))
                        {
                            filteredRecords.AddRange(records.Where(x => x.ShareContent == "yes" || x.ShareContent == "true").ToList());
                        }
                        else if (shareContent.Contains("No"))
                        {
                            filteredRecords.AddRange(records.Where(x => x.ShareContent == "no" || x.ShareContent == "false").ToList());
                        }
                        else
                        {
                            filteredRecords.AddRange(records.Where(x => x.ShareContent == "").ToList());
                        }
                    }

                    if (typesSearch.Count != 0)
                    {
                        foreach (var record in records)
                        {
                            if (typesSearch.Contains(record.Type))
                            {
                                filteredRecords.Add(record);
                            }
                        }
                    }

                    if (themesSearch.Count != 0)
                    {
                        if (themesSearch.Contains(0))
                        {
                            filteredRecords.AddRange(records.Where(x => x.Themes == "").ToList());
                        }

                        foreach (var record in records)
                        {
                            if (record.ThemeItems.Count > 0)
                            {
                                foreach (var theme in record.ThemeItems)
                                {
                                    if (themesSearch.Contains(theme))
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                            }
                        }
                    }

                    if (startDate != null)
                    {
                        foreach (var record in records)
                        {
                            if (record.InsertedDate is not null)
                            {
                                if (endDate != null)
                                {
                                    if (record.InsertedDate >= startDate && record.InsertedDate <= endDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                                else
                                {
                                    if (record.InsertedDate >= startDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                            }
                            else
                            {
                                if (endDate != null)
                                {
                                    if (record.UpdatedDate >= startDate && record.UpdatedDate <= endDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                                else
                                {
                                    if (record.UpdatedDate >= startDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                            }
                        }
                    }
                    return filteredRecords
                            .OrderByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Year : d.InsertedDate.Value.Year)
                            .ThenByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Month : d.InsertedDate.Value.Month)
                            .ThenByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Day : d.InsertedDate.Value.Day)
                            .ToList();
                }
            }
            return records
                    .OrderByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Year : d.InsertedDate.Value.Year)
                    .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Month : d.InsertedDate.Value.Month)
                    .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Day : d.InsertedDate.Value.Day)
                    .ToList();
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.View)]
        public List<StoryBookPartModel> GetStoryBookPartQuestions(
            [Service] ContentManagementRepository contentRepo, 
            Guid localeId) {

            return contentRepo.GetAll(ContentTypeConstants.StoryBookPartQuestionId, localeId).Select(x => new StoryBookPartModel(x)).ToList();
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.View)]
        public List<ActivityViewModel> GetActivityRecords(
           [Service] ContentManagementRepository contentRepo,
           AuthenticationDbContext dbContext,
           CancellationToken cancellationToken,
           bool isStoryActivity,
           string search = null,
           List<string> subTypesSearch = null,
           List<string> typesSearch = null,
           List<int> themesSearch = null,
           List<int> skillSearch = null,
           List<Guid> languageSearch = null,
           List<string> shareContent = null,
           PagedQueryInput pagingInput = null,
           DateTime? startDate = null,
           DateTime? endDate = null)
        {
            if (cancellationToken.IsCancellationRequested)
            {
                return null;
            }

            var englishId = new Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var records = new List<ActivityViewModel>();

            var themeDayRecords = contentRepo.GetAll(ContentTypeConstants.ThemeDayId, englishId)
                                    .Select(x => new GeneralThemeDaysViewModel(x))
                                    .Where(x => x.TenantId.ToString() == TenantExecutionContext.Tenant.Id.ToString()).ToList();
            var themeRecords = contentRepo.GetAll(ContentTypeConstants.ThemeId, englishId)
                                     .Select(x => new ThemeNameDaysViewModel(x))
                                     .Where(x => x.TenantId.ToString() == TenantExecutionContext.Tenant.Id.ToString())
                                     .ToList();


            var smallActivityRecords = themeDayRecords.Select(x => new ThemeDayViewModel(x.Id, x.SmallGroupActivity)).Distinct().ToList();
            var largeActivityRecords = themeDayRecords.Select(x => new ThemeDayViewModel(x.Id, x.LargeGroupActivity)).Distinct().ToList();
            var storyActivityRecords = themeDayRecords.Select(x => new ThemeDayViewModel(x.Id, x.StoryActivity)).Distinct().ToList();

            var subCategories = contentRepo.GetAll(ContentTypeConstants.ProgressTrackingSubCategoryId, englishId)
                .Select(x => new SubCategoryViewModel(x)).ToList();

            if (languageSearch.Count > 0)
            {
                foreach (var localeId in languageSearch)
                {
                    if (isStoryActivity) {
                        records.AddRange(contentRepo.GetByValueKey(ContentTypeConstants.Activity, "type", ContentTypeConstants.ActivityStoryTime, localeId)
                        .Select(x => new ActivityViewModel(x, localeId, new List<SubCategoryViewModel>(), storyActivityRecords, themeRecords)).ToList());
                    } else {
                        records.AddRange(contentRepo.GetByValueKey(ContentTypeConstants.Activity, "type", ContentTypeConstants.SmallGroup, localeId)
                        .Select(x => new ActivityViewModel(x, localeId, subCategories, smallActivityRecords, themeRecords)).ToList());
                        records.AddRange(contentRepo.GetByValueKey(ContentTypeConstants.Activity, "type", ContentTypeConstants.LargeGroup, localeId)
                        .Select(x => new ActivityViewModel(x, localeId, subCategories, largeActivityRecords, themeRecords)).ToList());
                    }
                }
            }
            else
            {
                if (isStoryActivity) {
                    records = contentRepo.GetByValueKey(ContentTypeConstants.Activity, "type", ContentTypeConstants.ActivityStoryTime, englishId)
                    .Select(x => new ActivityViewModel(x, englishId, new List<SubCategoryViewModel>(), storyActivityRecords, themeRecords)).ToList();
                } else {
                    records.AddRange(contentRepo.GetByValueKey(ContentTypeConstants.Activity, "type", ContentTypeConstants.SmallGroup, englishId)
                    .Select(x => new ActivityViewModel(x, englishId, subCategories, smallActivityRecords, themeRecords)).ToList());
                    records.AddRange(contentRepo.GetByValueKey(ContentTypeConstants.Activity, "type", ContentTypeConstants.LargeGroup, englishId)
                    .Select(x => new ActivityViewModel(x, englishId, subCategories, largeActivityRecords, themeRecords)).ToList());
                }
            }

            if (records.Any())
            {
                if (string.IsNullOrEmpty(search)
                    && subTypesSearch.Count == 0
                    && typesSearch.Count == 0
                    && themesSearch.Count == 0
                    && skillSearch.Count == 0
                    && startDate == null
                    && endDate == null
                    && shareContent.Count == 0)
                {
                    return records
                            .OrderByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Year : d.InsertedDate.Value.Year)
                            .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Month : d.InsertedDate.Value.Month)
                            .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Day : d.InsertedDate.Value.Day)
                            .ToList();
                }
                else
                {
                    var filteredRecords = new List<ActivityViewModel>();

                    if (!string.IsNullOrEmpty(search))
                    {
                        foreach (var record in records)
                        {
                            if (record.Name.ToLower().Contains(search.ToLower()))
                            {
                                filteredRecords.Add(record);
                            }
                        }
                    }

                    if (shareContent.Count != 0)
                    {
                        if (shareContent.Contains("Yes"))
                        {
                            filteredRecords.AddRange(records.Where(x => x.ShareContent == "yes" || x.ShareContent == "true").ToList());
                        }
                        else if (shareContent.Contains("No"))
                        {
                            filteredRecords.AddRange(records.Where(x => x.ShareContent == "no" || x.ShareContent == "false").ToList());
                        }
                        else
                        {
                            filteredRecords.AddRange(records.Where(x => x.ShareContent == "").ToList());
                        }
                    }

                    if (subTypesSearch.Count != 0)
                    {
                        foreach (var record in records)
                        {
                            if (record.SubTypeItems.Count > 0) {
                                foreach (var subTypeItem in record.SubTypeItems) {
                                    if (subTypesSearch.Contains(subTypeItem))
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                            }
                        }
                    }
                    if (typesSearch.Count != 0)
                    {
                        foreach (var record in records)
                        {
                            if (typesSearch.Contains(record.Type))
                            {
                                filteredRecords.Add(record);
                            }
                        }
                    }
                    if (skillSearch.Count != 0)
                    {
                        foreach (var record in records)
                        {
                            if (record.SubCategoryItems.Count > 0) {
                                foreach (var subCat in record.SubCategoryItems) {
                                    if (skillSearch.Contains(Int32.Parse(subCat.Id)))
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                            }
                        }
                    }
                    if (themesSearch.Count != 0)
                    {
                        if (themesSearch.Contains(0))
                        {
                            filteredRecords.AddRange(records.Where(x => x.Themes == "").ToList());
                        }
                        
                        foreach (var record in records)
                        {
                            if (record.ThemeItems.Count > 0) {
                                foreach (var theme in record.ThemeItems) {
                                    if (themesSearch.Contains(theme))
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                            }
                        }
                    }
                    if (startDate != null)
                    {
                        foreach (var record in records)
                        {
                            if (record.InsertedDate is not null)
                            {
                                if (endDate != null)
                                {
                                    if (record.InsertedDate >= startDate && record.InsertedDate <= endDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                                else
                                {
                                    if (record.InsertedDate >= startDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                            }
                            else
                            {
                                if (endDate != null)
                                {
                                    if (record.UpdatedDate >= startDate && record.UpdatedDate <= endDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                                else
                                {
                                    if (record.UpdatedDate >= startDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                            }
                        }
                    }
                    return filteredRecords
                            .OrderByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Year : d.InsertedDate.Value.Year)
                            .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Month : d.InsertedDate.Value.Month)
                            .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Day : d.InsertedDate.Value.Day)
                            .ToList();
                }
            }
            return records
                    .OrderByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Year : d.InsertedDate.Value.Year)
                    .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Month : d.InsertedDate.Value.Month)
                    .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Day : d.InsertedDate.Value.Day)
                    .ToList();
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.View)]
        public List<ThemeViewModel> GetThemeRecords(
           [Service] ContentManagementRepository contentRepo,
           [Service] ILocaleService<Language> localeService,
           CancellationToken cancellationToken,
           string search = null,
           List<string> shareContent = null,
           PagedQueryInput pagingInput = null,
           DateTime? startDate = null,
           DateTime? endDate= null)
        {
            if (cancellationToken.IsCancellationRequested)
            {
                return null;
            }

            var englishId = new Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var records = contentRepo.GetAll(ContentTypeConstants.ThemeId, englishId)
                                     .Select(x => new ThemeViewModel(x, englishId))
                                     .Where(x => x.TenantId.ToString() == TenantExecutionContext.Tenant.Id.ToString())
                                     .ToList();

            if (records.Any())
            {
                if (string.IsNullOrEmpty(search)
                    && startDate == null 
                    && endDate == null
                    && shareContent.Count == 0)
                {
                    return records
                        .OrderByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Year : d.InsertedDate.Value.Year)
                        .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Month : d.InsertedDate.Value.Month)
                        .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Day : d.InsertedDate.Value.Day)
                        .ToList();
                }
                else
                {
                    var filteredRecords = new List<ThemeViewModel>();

                    if (!string.IsNullOrEmpty(search))
                    {
                        foreach (var record in records)
                        {
                            if (record.Name.ToLower().Contains(search.ToLower()))
                            {
                                filteredRecords.Add(record);
                            }
                        }
                    }

                    if (shareContent.Count != 0)
                    {
                        if (shareContent.Contains("Yes"))
                        {
                            filteredRecords.AddRange(records.Where(x => x.ShareContent == "yes" || x.ShareContent == "true").ToList());
                        }
                        else if (shareContent.Contains("No"))
                        {
                            filteredRecords.AddRange(records.Where(x => x.ShareContent == "no" || x.ShareContent == "false").ToList());
                        }
                        else
                        {
                            filteredRecords.AddRange(records.Where(x => x.ShareContent == "").ToList());
                        }
                    }

                    if (startDate != null)
                    {
                        foreach (var record in records)
                        {
                            if (record.InsertedDate is not null)
                            {
                                if (endDate != null)
                                {
                                    if (record.InsertedDate >= startDate && record.InsertedDate <= endDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                                else
                                {
                                    if (record.InsertedDate >= startDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                            }
                            else
                            {
                                if (endDate != null)
                                {
                                    if (record.UpdatedDate >= startDate && record.UpdatedDate <= endDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                                else
                                {
                                    if (record.UpdatedDate >= startDate)
                                    {
                                        filteredRecords.Add(record);
                                    }
                                }
                            }
                        }
                    }
                    return filteredRecords
                            .OrderByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Year : d.InsertedDate.Value.Year)
                            .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Month : d.InsertedDate.Value.Month)
                            .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Day : d.InsertedDate.Value.Day)
                            .ToList();
                }
            }
           return records
                    .OrderByDescending(d => d.UpdatedDate.HasValue ? d.UpdatedDate.Value.Year : d.InsertedDate.Value.Year)
                    .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Month : d.InsertedDate.Value.Month)
                    .ThenByDescending(d => d.UpdatedDate.HasValue ?  d.UpdatedDate.Value.Day : d.InsertedDate.Value.Day)
                    .ToList();
        }

    }
}
