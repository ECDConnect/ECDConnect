using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Clinics;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ClinicMeetingMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public ClinicMeeting AddClinicMeeting([Service] IClinicService clinicService, AddClinicMeetingInputModel input)
        {
            return clinicService.AddClinicMeeting(input);
        }

    }
}
