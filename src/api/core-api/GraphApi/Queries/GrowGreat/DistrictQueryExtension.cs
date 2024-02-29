using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class DistrictQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<DistrictStatsModel> GetDistrictsAndStats([Service] IClinicService clinicService)
        {
            return clinicService.GetDistrictsAndStats();
        }
    }
}
