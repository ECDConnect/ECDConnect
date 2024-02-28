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
    public class DistrictMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public District AddDistrict(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            DistrictModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var districtRepo = repoFactory.CreateRepository<District>(userContext: applicationUserId);
            return districtRepo.Insert( new District()
                {
                    Id = new Guid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = applicationUserId.ToString(),
                    Name = input.Name,
                    ProvinceId = input.ProvinceId
                }
            );
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public District EditDistrict(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            DistrictModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var districtRepo = repoFactory.CreateRepository<District>(userContext: applicationUserId);
            var district = districtRepo.GetById((Guid)input.Id);
            district.Name = input.Name;
            district.ProvinceId = input.ProvinceId;
            district.UpdatedDate = DateTime.Now;
            district.UpdatedBy = applicationUserId.ToString();
            return districtRepo.Update(district);
        }

    }
}
