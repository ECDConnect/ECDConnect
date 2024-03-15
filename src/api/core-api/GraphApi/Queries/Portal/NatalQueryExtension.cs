using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class NatalQueryExtension
    {
        [GraphQLType("[Natal]!")]
        public List<PortalNatalModel> GetNatalRecordsForType(
           [Service] ContentManagementRepository contentRepo,
           string type,
           string localeId)
        {
            return new List<PortalNatalModel>();
            //return contentRepo.GetByValueKey("VisitVideos", "section", section, localeId);
        }

        public bool TransferVisitVideosToNatalVideos()
        {
            return true;
        }

        public bool TransferInfoGraphicsToNatalGraphics()
        {
            return true;
        }

        public bool TransferHealthPromotionToNatalHealth()
        {
            return true;
        }
    }
}
