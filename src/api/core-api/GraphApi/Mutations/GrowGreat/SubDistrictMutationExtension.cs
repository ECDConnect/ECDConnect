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
    public class SubDistrictMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public SubDistrict AddSubDistrict([Service] IClinicService clinicService, SubDistrictInputModel input)
        {
            return clinicService.AddSubDistrict(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public SubDistrict EditSubDistrict([Service] IClinicService clinicService, SubDistrictInputModel input)
        {
            return clinicService.EditSubDistrict(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public SubDistrict DeleteSubDistrict([Service] IClinicService clinicService, Guid subDistrictId)
        {
            return clinicService.DeleteSubDistrict(subDistrictId);
        }

    }
}
