using ECDLink.ContentManagement.Entities;
using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.ContentManagement.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Linq;
using EcdLink.Api.CoreApi.GraphApi.Models.Portal;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class DangerSignsQueryExtension
    {
        public DangerSignsQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
         public async Task<IEnumerable<DangerSignTranslation>> GetDangerSignTranslations(
         [Service] ContentManagementRepository contentRepo,
         [Service] ILocaleService<Language> localeService,
         string section,
         string toTranslate)
        {

            var data = contentRepo.GetAllTranslations("DangerSign", "section", section, toTranslate);
            if (data.Any())
            {
                var translatedList = new List<DangerSignTranslation>();
                foreach (var item in data)
                {
                    var more = (IDictionary<string, object>)item;
                    foreach (string key in more.Keys)
                    {
                        var language = localeService.GetLocaleById(Guid.Parse(key));
                        translatedList.Add(new DangerSignTranslation
                        {
                            Language = Convert.ToString(language.Description),
                            Translation = Convert.ToString(more[key])
                        });
                    }
                }
                return translatedList;
            }
            return new List<DangerSignTranslation>();
        }
    }
}
