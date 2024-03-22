using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.ContentManagement.Entities;
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
            var natalTypeId = natalType == "postnatal" ? GetPostnatalId(contentRepo, localeId) : GetAntenatalId(contentRepo, localeId);

            foreach (var natalItem in allNatal)
            {
                var natal = (IDictionary<string, object>)natalItem;
                natal.TryGetValue("title", out var titleValue);
                natal.TryGetValue("section", out var sectionValue);
                natal.TryGetValue("type", out var typeValue);
                natal.TryGetValue("availableLanguages", out var languagesValue);
                natal.TryGetValue("updatedDate", out var updatedDateValue);

                natal.TryGetValue("info", out var infoValue);
                natal.TryGetValue("video", out var videoValue);
                natal.TryGetValue("graphic", out var graphicValue);
                natal.TryGetValue("health", out var healthValue);

                if (Convert.ToString(typeValue) == natalTypeId)
                {
                    var title = Convert.ToString(titleValue);
                    var section = Convert.ToString(sectionValue);
                    var languages = Convert.ToString(languagesValue);
                    var updatedDate = Convert.ToDateTime(updatedDateValue);
                    var childType = "";
                    var childId = "";
                    var childContentTypeName = "";
                    var childContentTypeId = "";
                    var contentType = new ContentType();

                    var info = Convert.ToString(infoValue);
                    var video = Convert.ToString(videoValue);
                    var graphic = Convert.ToString(graphicValue);
                    var health = Convert.ToString(healthValue);

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
                    
                    contentType = contentRepo.GetContentTypeForContentId(int.Parse(childId));
                    childContentTypeName = contentType.Name;
                    childContentTypeId = contentType.Id.ToString();

                    results.Add(new PortalNatalModel(title, section, languages, childType, childId, updatedDate, childContentTypeName, childContentTypeId));
                }
            }
            return results;
        }

        private string GetPostnatalId([Service] ContentManagementRepository contentRepo, Guid localeId)
        {
            var postnatal = (IDictionary<string, object>)contentRepo.GetByValueKey("NatalType", "name", "Postnatal", localeId).FirstOrDefault();
            postnatal.TryGetValue("id", out var value);
            return Convert.ToString(value);
        }

        private string GetAntenatalId([Service] ContentManagementRepository contentRepo, Guid localeId)
        {
            var antenatal = (IDictionary<string, object>)contentRepo.GetByValueKey("NatalType", "name", "Antenatal", localeId).FirstOrDefault();
            antenatal.TryGetValue("id", out var value);
            return Convert.ToString(value);
        }

    }
}
