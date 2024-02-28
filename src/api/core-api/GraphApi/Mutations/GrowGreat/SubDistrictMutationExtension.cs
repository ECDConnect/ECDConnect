using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
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
    public class SubDistrictMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public SubDistrict AddSubDistrict(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            SubDistrictModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var subDistrictRepo = repoFactory.CreateRepository<SubDistrict>(userContext: applicationUserId);
            return subDistrictRepo.Insert( new SubDistrict()
                {
                    Id = new Guid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = applicationUserId.ToString(),
                    Name = input.Name,
                    DistrictId = input.DistrictId
                }
            );
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public SubDistrict EditSubDistrict(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            SubDistrictModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var subDistrictRepo = repoFactory.CreateRepository<SubDistrict>(userContext: applicationUserId);
            var district = subDistrictRepo.GetById((Guid)input.Id);
            district.Name = input.Name;
            district.DistrictId = input.DistrictId;
            district.UpdatedDate = DateTime.Now;
            district.UpdatedBy = applicationUserId.ToString();
            return subDistrictRepo.Update(district);
        }

    }
}
