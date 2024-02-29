using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class DistrictMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public District AddDistrict([Service] IClinicService clinicService, DistrictModel input)
        {
            return clinicService.AddDistrict(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public District EditDistrict([Service] IClinicService clinicService, DistrictModel input)
        {
            return clinicService.EditDistrict(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public District DeleteDistrict([Service] IClinicService clinicService, Guid districtId)
        {
            return clinicService.DeleteDistrict(districtId);
        }

    }
}
