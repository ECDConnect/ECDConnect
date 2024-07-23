using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clinics;
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
            [Service] IGrowGreatPointsCalculationsService pointsService,
            AddBreastFeedingClubInputModel input)
        {
            if (input == null) 
            { 
                throw new ArgumentNullException("input");
            }

            if (input.Clients == null || input.Clients.Count == 0)
            {
                throw new ArgumentException("Must contain at least one client");
            }

            if (input.MeetingDate.Month != DateTime.Now.Month)
            {
                throw new ArgumentException("Must be for current month");
            }

            var newBreastFeedingClub = clinicService.AddBreastFeedingClub(input.ClinicId, input.HealthCareWorkerId, input.MeetingDate, input.ClientsAttendedConfirmed, input.Clients);

            pointsService.CalculateBreastFeedingClubPoints(input.ClinicId);

            return new BreastFeedingClubModel(newBreastFeedingClub);
        }

    }
}
