using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
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
                if (search == null && likesSearch == null && dataFreeSearch == null && startDate == null && endDate == null)
                {
                    return resourceData;
                } 
                else
                {
                    var allContentValuePairs = new List<object>();
                    foreach (var resource in resourceData)
                    {
                        var item = (IDictionary<string, object>)resource;
                        item.TryGetValue("id", out var id);
                        item.TryGetValue("resourceType", out var resourceTypeValue);
                        item.TryGetValue("title", out var titleValue);
                        item.TryGetValue("shortDescription", out var shortDescription);
                        item.TryGetValue("link", out var link);
                        item.TryGetValue("longDescription", out var longDescription);
                        item.TryGetValue("dataFree", out var dataFree);
                        item.TryGetValue("sectionType", out var sType);
                        item.TryGetValue("numberLikes", out var numberLikes);
                        item.TryGetValue("availableLanguages", out var availableLanguages);
                        item.TryGetValue("updatedDate", out var updatedDate);
                        item.TryGetValue("insertedDate", out var insertedDate);


                        if (likesSearch != null)
                        {

                        }
                        if (dataFreeSearch != null)
                        {
                        }

                        if (startDate != null)
                        {
                        }

                        if (endDate != null)
                        {
                        }

                        Dictionary<string, object> dataDict = new Dictionary<string, object>
                        {
                            { "id", Convert.ToString(id) },
                            { "resourceType", Convert.ToString(resourceTypeValue) },
                            { "title", Convert.ToString(titleValue) },
                            { "shortDescription", Convert.ToString(shortDescription) },
                            { "link", Convert.ToString(link)},
                            { "longDescription", Convert.ToString(longDescription) },
                            { "dataFree", Convert.ToString(dataFree) },
                            { "sectionType", Convert.ToString(sType) },
                            { "numberLikes", Convert.ToString(numberLikes) },
                            { "availableLanguages", Convert.ToString(availableLanguages) },
                            { "updatedDate", Convert.ToString(updatedDate) },
                            { "insertedDate", Convert.ToString(insertedDate) },
                        };
                        allContentValuePairs.Add(dataDict);
                    }
                    return allContentValuePairs;
                }
            }

            return resourceData;
        }
    }
}
