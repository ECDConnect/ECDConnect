using EcdLink.Api.CoreApi.GraphApi.Models.Portal;
using EcdLink.Api.CoreApi.GraphApi.Models.Users;
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
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ResourcesMutationExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public bool UpdateCaregiverResourceLink(
            [Service] ContentManagementRepository contentRepo,
            List<CMSResourceLinkModel> input,
            Guid localeId)
        {
            foreach (var item in input)
            {
                Dictionary<string, object> connectDict = new Dictionary<string, object>
                {
                    { "title", item.Title },
                    { "link", item.Link },
                    { "description", item.Description },
                };

                if (item.ContentId != -1)
                {
                    //update
                    contentRepo.Update(item.ContentId, localeId, connectDict);
                } else
                {
                    //insert
                    item.ContentId = contentRepo.Create(item.ContentTypeId, localeId, connectDict);
                }
            }

            return true;
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public bool UpdateResourceConnectItem(
            [Service] ContentManagementRepository contentRepo,
            List<CMSConnectItemModel> input,
            Guid localeId)
        {
            foreach (var item in input)
            {
                Dictionary<string, object> connectDict = new Dictionary<string, object>
                {
                    { "buttonText", item.ButtonText },
                    { "link", item.Link },
                };

                if (item.ContentId != -1)
                {
                    //update
                    contentRepo.Update(item.ContentId, localeId, connectDict);
                }
                else
                {
                    //insert
                    item.ContentId = contentRepo.Create(item.ContentTypeId, localeId, connectDict);
                }
            }

            return true;
        }


        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Delete)]
        public BulkDeactivateResult DeleteBulkResources(
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

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public bool UpdateResourceTypesAndDataFree(
            [Service] ContentManagementRepository contentRepo,
            int contentId,
            int contentTypeId,
            string resourceType,
            string dataFree,
            Guid localeId)
        {
            if (contentId == 0)
            {
                return false;
            }

            var allLanguages = contentRepo.GetAllLanguagesForContentId(contentId, contentTypeId);
            foreach (var languageId in allLanguages)
            {
                if (languageId != localeId)
                {
                    Dictionary<string, object> connectDict = new Dictionary<string, object>
                    {
                        { "resourceType", resourceType},
                        { "dataFree", dataFree }
                    };

                    contentRepo.Update(contentId, languageId, connectDict);
                }
            }
            return true;
        }


        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public bool UpdateResourceLikes(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] ContentManagementRepository contentRepo,
            int contentId,
            int contentTypeId,
            bool liked)
        {
            if (contentId == 0)
            {
                return false;
            }

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var userResourceLikesRepo = repoFactory.CreateRepository<UserResourceLikes>();
            var userResource = userResourceLikesRepo.GetAll().Where(x => x.UserId == uId && x.ContentId == contentId).FirstOrDefault();
            if (liked)
            {
                if (userResource == null)
                {
                    userResourceLikesRepo.Insert(new UserResourceLikes()
                    {
                        UserId = uId,
                        ContentId = contentId
                    });
                } else
                {
                    userResource.IsActive = true;
                    userResourceLikesRepo.Update(userResource);
                }
            }
            else
            {
                if (userResource != null)
                {
                    userResourceLikesRepo.Delete(userResource.Id);
                }
            }
            
            var allLanguages = contentRepo.GetAllLanguagesForContentId(contentId, contentTypeId);
            foreach (var languageId in allLanguages)
            {
                var resourceData = contentRepo.GetById(contentId, languageId);

                var item = (IDictionary<string, object>)resourceData;
                item.TryGetValue("numberLikes", out var numberLikes);

                if (numberLikes == null)
                {
                    if (liked)
                    {
                        Dictionary<string, object> connectDict = new Dictionary<string, object>
                        {
                            { "numberLikes", 1},
                        };
                        contentRepo.Update(contentId, languageId, connectDict);
                    }
                }
                else
                {
                    var numLikes = int.Parse(numberLikes.ToString());
                    if (liked)
                    {
                        numLikes++;
                    }
                    else
                    {
                        if (numLikes > 0)
                        {
                            numLikes--;
                        }
                    }

                    Dictionary<string, object> connectDict = new Dictionary<string, object>
                    {
                        { "numberLikes", numLikes},
                    };
                    contentRepo.Update(contentId, languageId, connectDict);
                }
            }

            return true;
;
        }

    }
}
