using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Constants;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
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
        public List<StoryBookViewModel> GetStoryBookRecords(
           [Service] ContentManagementRepository contentRepo,
           [Service] ILocaleService<Language> localeService,
           CancellationToken cancellationToken,
           string search = null,
           List<string> typesSearch = null,
           List<string> themesSearch = null,
           List<string> skillsSearch = null,
           List<Guid> languageSearch = null,
           PagedQueryInput pagingInput = null,
           DateTime? startDate = null,
           DateTime? endDate= null,
           string shareContent = null)
        {
            if (cancellationToken.IsCancellationRequested)
            {
                return null;
            }

            var englishId = new Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var records = new List<StoryBookViewModel>();


            if (languageSearch.Count > 0)
            {
                foreach (var localeId in languageSearch)
                {
                    records.AddRange(contentRepo.GetAll(ContentTypeConstants.StoryBookId, localeId).Select(x => new StoryBookViewModel(x, localeId)).ToList());
                }

            } else
            {
                records = contentRepo.GetAll(ContentTypeConstants.StoryBookId, englishId).Select(x => new StoryBookViewModel(x, englishId)).ToList();
            }

            var themes = contentRepo.GetAll(ContentTypeConstants.ThemeId, englishId);

            var themeRecords = new List<ThemeViewModel>();
            foreach (var theme in themes)
            {
                var item = (IDictionary<string, object>)theme;
                item.TryGetValue("name", out var name);
                item.TryGetValue("themeDays", out var themeDays);

                var themeDayInts = themeDays.ToString().Split(",").Select(i => int.Parse(i)).ToArray();
                themeRecords.AddRange(contentRepo.GetByIds(ContentTypeConstants.ThemeDayId, englishId, themeDayInts)
                                                 .Select(x => new ThemeViewModel(name.ToString(), x))
                                                 .ToList());

            }


            // populate theme values on records
            foreach (var item in records)
            {
                item.Themes = string.Join(",", themeRecords.Where(x => x.StoryBookId == item.Id).Select(x => x.Name).ToArray().Distinct());
            }

            if (records.Any())
            {
                if (string.IsNullOrEmpty(search)
                    && typesSearch.Count == 0
                    && themesSearch.Count == 0
                    && skillsSearch.Count == 0
                    && startDate == null 
                    && endDate == null
                    && string.IsNullOrEmpty(shareContent))
                {
                    return records;
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

                    if (!string.IsNullOrEmpty(shareContent))
                    {
                        foreach (var record in records)
                        {
                            if (record.ShareContent.ToLower().Contains(shareContent.ToLower()))
                            {
                                filteredRecords.Add(record);
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

                    if (themesSearch.Count != 0)
                    {
                        foreach (var record in records)
                        {

                            if (typesSearch.Contains(record.Themes))
                            {
                                filteredRecords.Add(record);
                            }
                        }
                    }

                    if (skillsSearch.Count != 0)
                    {
                        foreach (var record in records)
                        {
                            if (typesSearch.Contains(record.Type))
                            {
                                filteredRecords.Add(record);
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

                    return filteredRecords;
                }
            }

            return records;
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Delete)]
        public BulkDeactivateResult DeleteMultipleStoryBooks(
            [Service] ContentManagementRepository contentRepo,
            [Service] ILocaleService<Language> localeService,
            List<int> contentIds)
        {
            if (contentIds is null || contentIds.Count == 0)
            {
                return new BulkDeactivateResult();
            }

            var success = new List<string>();
            var failed = new List<string>();

            foreach (int contentId in contentIds)
            {
                bool deleteResult = contentRepo.Delete(contentId);
                if (deleteResult)
                {
                    success.Add(contentId.ToString());
                }
                else
                {
                    failed.Add(contentId.ToString());
                }
            }

            return new BulkDeactivateResult() { Failed = failed, Success = success };
        }




       
    }
}
