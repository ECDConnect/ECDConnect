using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ClinicMeetingQueryExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public PortalClinicMeetingModel GetClinicMeetingForMonth([Service] IClinicService clinicService, Guid clinicId)
        {
            return clinicService.GetClinicMeetingForMonth(clinicId);
        }

    }
}
