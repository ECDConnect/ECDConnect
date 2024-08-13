using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

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

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<District> GetDistrictsForProvinceId([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            List<Guid> provinceIds = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var repo = repoFactory.CreateGenericRepository<District>(userContext: uId);
            if (provinceIds != null && provinceIds.Any())
            {
                return repo.GetAll().Where(x => x.IsActive && provinceIds.Contains(x.ProvinceId)).OrderBy(x => x.Name).ToList();
            } 
            else
            {
                return repo.GetAll().Where(x => x.IsActive).OrderBy(x => x.Name).ToList();
            }
        }
    }
}
