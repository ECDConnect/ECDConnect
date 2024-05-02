using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.ContentManagement.Repositories;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class NatalQueryExtension
    {
        public List<PortalNatalModel> GetNatalRecordsForType(
           [Service] ContentManagementRepository contentRepo,
           int contentTypeId,
           string natalType,
           Guid localeId)
        {
            List<PortalNatalModel> results = new List<PortalNatalModel>();
            var allNatal = contentRepo.GetAll(contentTypeId, localeId);
            var natalTypeId = natalType.ToLower() == "postnatal" ? GetPostnatalId(contentRepo) : GetAntenatalId(contentRepo);

            foreach (var natalItem in allNatal)
            {
                var natal = (IDictionary<string, object>)natalItem;
                natal.TryGetValue("type", out var typeValue);

                if (Convert.ToString(typeValue) == natalTypeId)
                {
                    natal.TryGetValue("title", out var titleValue);
                    natal.TryGetValue("section", out var sectionValue);
                    natal.TryGetValue("availableLanguages", out var languagesValue);
                    natal.TryGetValue("updatedDate", out var updatedDateValue);

                    natal.TryGetValue("info", out var infoValue);
                    natal.TryGetValue("video", out var videoValue);
                    natal.TryGetValue("graphic", out var graphicValue);
                    natal.TryGetValue("health", out var healthValue);

                    var title = Convert.ToString(titleValue);
                    var section = Convert.ToString(sectionValue);
                    var languages = Convert.ToString(languagesValue);
                    var updatedDate = Convert.ToDateTime(updatedDateValue);
                    var childType = "";
                    var childId = "";

                    var info = Convert.ToString(infoValue);
                    var video = Convert.ToString(videoValue);
                    var graphic = Convert.ToString(graphicValue);
                    var health = Convert.ToString(healthValue);

                    // A natal record can only have one of the following
                    if (info != "")
                    {
                        childType = "Info";
                        childId = info;
                    } 
                    else if (video != "")
                    {
                        childType = "Video";
                        childId = video;
                    }
                    else if (graphic != "")
                    {
                         childType = "Infographic";
                         childId = graphic;
                    }
                    else if (health != "")
                    {
                         childType = "Health promotion";
                         childId = health;
                    }

                    var contentType = contentRepo.GetContentTypeForContentId(int.Parse(childId));
                    if (contentType != null)
                    {
                        var childContentTypeName = contentType.Name;
                        var childContentTypeId = contentType.Id.ToString();
                        var childLanguages = contentRepo.GetAllLanguagesForContentId(int.Parse(childId), contentType.Id);
                        var availableLanguages = childLanguages.Select(x => x.ToString()).ToList();

                        results.Add(new PortalNatalModel(title, section, availableLanguages, childType, childId, updatedDate, childContentTypeName, childContentTypeId));
                    }
                }
            }
            return results;
        }

        private string GetPostnatalId([Service] ContentManagementRepository contentRepo)
        {
            var localeId = Guid.Parse("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var postnatal = (IDictionary<string, object>)contentRepo.GetByValueKey("NatalType", "name", "Postnatal", localeId).FirstOrDefault();
            postnatal.TryGetValue("id", out var value);
            return Convert.ToString(value);
        }

        private string GetAntenatalId([Service] ContentManagementRepository contentRepo)
        {
            var localeId = Guid.Parse("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var antenatal = (IDictionary<string, object>)contentRepo.GetByValueKey("NatalType", "name", "Antenatal", localeId).FirstOrDefault();
            antenatal.TryGetValue("id", out var value);
            return Convert.ToString(value);
        }

    }
}
