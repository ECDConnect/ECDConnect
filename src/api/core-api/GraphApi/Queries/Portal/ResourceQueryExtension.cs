using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Portal;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ResourceQueryExtension
    {
        [GraphQLType("[ClassroomBusinessResource]!")]
        public IEnumerable<object> GetResources(
           [Service] ContentManagementRepository contentRepo,
           [Service] ILocaleService<Language> localeService,
           Guid localeId,
           string sectionType,
           CancellationToken cancellationToken,
           PagedQueryInput pagingInput = null,
           string search = null,
           List<string> likesSearch = null,
           List<string> dataFreeSearch = null,
           DateTime? startDate = null,
           DateTime? endDate= null)
        {
            if (cancellationToken.IsCancellationRequested)
            {
                return null;
            }

            var resourceData =  contentRepo.GetByValueKey("ClassroomBusinessResource", "sectionType", sectionType, localeId);

            if (resourceData.Any())
            {
                if (string.IsNullOrEmpty(search) && likesSearch.Count == 0 && dataFreeSearch.Count == 0 && startDate == null && endDate == null)
                {
                    return resourceData;
                } 
                else
                {
                    var allContentValuePairs = new List<object>();

                    if (!string.IsNullOrEmpty(search))
                    {
                        foreach (var resource in resourceData)
                        {
                            var item = (IDictionary<string, object>)resource;
                            item.TryGetValue("title", out var title);
                            
                            if (title.ToString().ToLower().Contains(search.ToLower())) {
                                allContentValuePairs.Add(item);
                            }
                        }
                    }

                    if (dataFreeSearch.Count != 0)
                    {
                        foreach (var resource in resourceData)
                        {
                            var item = (IDictionary<string, object>)resource;
                            item.TryGetValue("dataFree", out var dataFree);

                            if (dataFreeSearch.Contains(dataFree))
                            {
                                allContentValuePairs.Add(item);
                            }
                        }
                    }

                    if (likesSearch.Count != 0)
                    {
                        foreach (var resource in resourceData)
                        {
                            var item = (IDictionary<string, object>)resource;
                            item.TryGetValue("numberLikes", out var numberLikes);

                            if (numberLikes is null)
                            {
                                if (likesSearch.Contains(Constants.ResourceLikes.Zero))
                                {
                                    allContentValuePairs.Add(item);
                                }
                            }
                            else
                            {
                                var itemLikes = int.TryParse(numberLikes.ToString(), out var likes);

                                if (likesSearch.Contains(Constants.ResourceLikes.Zero))
                                {
                                    if (numberLikes.ToString() == "" || numberLikes.ToString() == "0")
                                    {
                                        allContentValuePairs.Add(item);
                                    }
                                }
                                if (likesSearch.Contains(Constants.ResourceLikes.OneToTen))
                                {
                                    if (likes > 0 && likes < 11)
                                    {
                                        allContentValuePairs.Add(item);
                                    }
                                }
                                if (likesSearch.Contains(Constants.ResourceLikes.ElevenToFifty))
                                {
                                    if (likes > 10 && likes < 51)
                                    {
                                        allContentValuePairs.Add(item);
                                    }
                                }
                                if (likesSearch.Contains(Constants.ResourceLikes.FiftyOneToHundred))
                                {
                                    if (likes > 51 && likes < 101)
                                    {
                                        allContentValuePairs.Add(item);
                                    }
                                }
                                if (likesSearch.Contains(Constants.ResourceLikes.MoreThanHundred))
                                {
                                    if (likes > 100)
                                    {
                                        allContentValuePairs.Add(item);
                                    }
                                }
                            }
                        }
                    }

                    if (startDate != null)
                    {
                        foreach (var resource in resourceData)
                        {
                            var item = (IDictionary<string, object>)resource;
                            item.TryGetValue("updatedDate", out var updatedDate);
                            item.TryGetValue("insertedDate", out var insertedDate);

                            if (insertedDate is not null)
                            {
                                var hasInsert = DateTime.TryParse(insertedDate.ToString(), out var insertDate);
                                if (endDate != null)
                                {
                                    if (insertDate >= startDate && insertDate <= endDate)
                                    {
                                        allContentValuePairs.Add(item);
                                    }
                                }
                                else
                                {
                                    if (insertDate >= startDate)
                                    {
                                        allContentValuePairs.Add(item);
                                    }
                                }
                            } 
                            else
                            {
                                var hasUpdate = DateTime.TryParse(updatedDate.ToString(), out var updateDate);
                                if (endDate != null)
                                {
                                    if (updateDate >= startDate && updateDate <= endDate)
                                    {
                                        allContentValuePairs.Add(item);
                                    }
                                } 
                                else
                                {
                                    if (updateDate >= startDate)
                                    {
                                        allContentValuePairs.Add(item);
                                    }
                                }
                            }

                        }
                    }

                    return allContentValuePairs;
                }
            }

            return resourceData;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public UserResourceLikes GetResourceLikedStatusForUser(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            int contentId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var userResourceLikesRepo = repoFactory.CreateRepository<UserResourceLikes>();
            return userResourceLikesRepo.GetAll().Where(x => x.UserId == uId && x.ContentId == contentId).FirstOrDefault();
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<UserResourcesModel> GetAllResourceLikesForUser(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            Guid userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var userResourceLikesRepo = repoFactory.CreateRepository<UserResourceLikes>();
            return userResourceLikesRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).Select(x => new UserResourcesModel() { IsActive = x.IsActive, ContentId = x.ContentId}).ToList();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ResourceModel GetResourceByLanguage(
           [Service] ContentManagementRepository contentRepo,
           int contentId,
           int contentTypeId,
           Guid localeId)
        {
            var result = new ResourceModel();
            var languageIds = contentRepo.GetAllLanguagesForContentId(contentId, contentTypeId);
            if (!languageIds.Contains(localeId))
            {
                return null;
            }

            var resource = contentRepo.GetById(contentId, localeId);

            var item = (IDictionary<string, object>)resource;
            item.TryGetValue("resourceType", out var resourceType);
            item.TryGetValue("title", out var title);
            item.TryGetValue("shortDescription", out var shortDescription);
            item.TryGetValue("link", out var link);
            item.TryGetValue("longDescription", out var longDescription);
            item.TryGetValue("dataFree", out var dataFree);
            item.TryGetValue("sectionType", out var sectionType);
            item.TryGetValue("numberLikes", out var numberLikes);

            result.ResourceType = resourceType.ToString();
            result.Title = title.ToString();
            result.ShortDescription = shortDescription.ToString();
            result.Link = link.ToString();
            result.LongDescription = longDescription.ToString();
            result.DataFree = dataFree.ToString();
            result.SectionType = sectionType.ToString();
            result.NumberLikes = numberLikes == null ? "0" : numberLikes.ToString();
            result.AvailableLanguages = languageIds;

            return result;

        }
    }
}
