using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Clinics;
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
    public class SubDistrictQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<SubDistrictStatsModel> GetSubDistrictsAndStats([Service] IClinicService clinicService)
        {
            return clinicService.GetSubDistrictsAndStats();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<SubDistrict> GetSubDistrictsForDistrictId([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            List<Guid> provinceIds = null,
            List<Guid> districtIds = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var repo = repoFactory.CreateGenericRepository<SubDistrict>(userContext: uId);
            var allSubdistricts = repo.GetAll().Where(x => x.IsActive).OrderBy(x => x.Name).ToList();
            var filteredRecords = new List<SubDistrict>();

            if (provinceIds != null && provinceIds.Any())
            {
                filteredRecords.AddRange(allSubdistricts.Where(x => provinceIds.Contains(x.District.ProvinceId)).ToList());
            }
            if (districtIds != null && districtIds.Any())
            {
                filteredRecords.AddRange(allSubdistricts.Where(x => districtIds.Contains(x.DistrictId)).ToList());
            }
            if (provinceIds.Any() || districtIds.Any())
            {
                return filteredRecords;
            }
            return allSubdistricts;
        }
    }
}
