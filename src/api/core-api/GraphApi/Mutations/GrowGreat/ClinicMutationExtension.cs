using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ClinicMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Clinic AddClinic(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            ClinicModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;

            var clinic = new Clinic()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId.ToString(),
                Name = input.Name,
                PhoneNumber = input.PhoneNumber,
                SiteAddressId = input.SiteAddressId,
                EmergencyContactPerson = input.EmergencyContactPerson,
                EmergencyContactNumber = input.EmergencyContactNumber
            };

            var clinicRepo = repoFactory.CreateRepository<Clinic>(userContext: applicationUserId);
            return clinicRepo.Insert(clinic);

        }

    }
}
