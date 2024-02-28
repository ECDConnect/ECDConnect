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
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class DistrictQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<DistrictStatsModel> GetDistrictsAndStats(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var districtRepo = repoFactory.CreateRepository<District>(userContext: uId);
            var clinicRepo = repoFactory.CreateRepository<Clinic>(userContext: uId);
            var clinicTeamLeadRepo = repoFactory.CreateRepository<ClinicTeamLead>(userContext: uId);
            var hcwRepo = repoFactory.CreateRepository<HealthCareWorker>(userContext: uId);

            var districtRecords = districtRepo.GetAll().Include(x => x.SubDistricts).Where(x => x.IsActive).ToList();
            var clinics = clinicRepo.GetAll().Where(x => x.IsActive && x.SubDistrictId.HasValue).ToList();
            var clinicTeamLeads = clinicTeamLeadRepo.GetAll().Where(x => x.IsActive).ToList();
            var hCWs = hcwRepo.GetAll().Where(x => x.IsActive && x.ClinicId.HasValue).ToList();

            List<DistrictStatsModel> districts = new List<DistrictStatsModel>();
            foreach (var district in districtRecords)
            {
                districts.Add(new DistrictStatsModel() { 
                    Id = district.Id,
                    Name = district.Name,
                    InsertedDate = district.InsertedDate,
                    Province = district.Province,
                    SubDistricts = district.SubDistricts,
                    TotalSubDistricts = district.SubDistricts.Count(),
                    TotalClinics = clinics.Where(x => x.SubDistrict.DistrictId == district.Id).Distinct().Count(),
                    TotalTeamLeads = clinicTeamLeads.Where(x => x.Clinic.SubDistrict.DistrictId == district.Id).Distinct().Count(),
                    TotalHCWs = hCWs.Where(x => x.Clinic.SubDistrict.DistrictId == district.Id).Distinct().Count()
                });
            }

            return districts;
        }
    }
}
