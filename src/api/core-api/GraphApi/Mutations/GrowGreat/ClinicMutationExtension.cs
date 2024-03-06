using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
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
    public class ClinicMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Clinic AddClinic([Service] IClinicService clinicService, PortalClinicInputModel input)
        {
            return clinicService.AddClinic(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Clinic EditClinic([Service] IClinicService clinicService, PortalClinicInputModel input)
        {
            return clinicService.EditClinic(input);
        }

        public Clinic DeleteClinicById([Service] IClinicService clinicService, Guid clinicId)
        {
            return clinicService.DeleteClinicById(clinicId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public BreastFeedingClubModel AddBreastFeedingClub(
            [Service] IClinicService clinicService,
            AddBreastFeedingClubInputModel input)
        {
            // TODO -> validation

            var newBreastFeedingClub = clinicService.AddBreastFeedingClub(input.HealthCareWorkerId, input.MeetingDate, input.ClientsAttendedConfirmed, input.Clients);

            return new BreastFeedingClubModel(newBreastFeedingClub);
        }

    }
}
