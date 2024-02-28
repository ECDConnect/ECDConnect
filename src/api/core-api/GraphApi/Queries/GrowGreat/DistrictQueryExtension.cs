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
using System.Linq;
using System;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Clubs;
using Microsoft.EntityFrameworkCore;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class DistrictQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public District GetDistrictByName(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string name)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var districtRepo = repoFactory.CreateRepository<District>(userContext: uId);
            return districtRepo.GetAll().Where(x => x.Name == name).FirstOrDefault();
        }

        public DistrictStatsModel GetDistrictStats(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            Guid districtId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var subDistrictRepo = repoFactory.CreateRepository<SubDistrict>(userContext: uId);
            var clinicRepo = repoFactory.CreateRepository<Clinic>(userContext: uId);
            var clinicTeamLeadRepo = repoFactory.CreateRepository<ClinicTeamLead>(userContext: uId);
            var hcwRepo = repoFactory.CreateRepository<HealthCareWorker>(userContext: uId);

            DistrictStatsModel districtStatsModel = new DistrictStatsModel();
            districtStatsModel.TotalSubDistricts = subDistrictRepo.GetAll().Where(x => x.IsActive && x.DistrictId == districtId).Distinct().Count();
            districtStatsModel.TotalClinics = clinicRepo.GetAll().Where(x => x.IsActive && x.SubDistrict.DistrictId == districtId).Distinct().Count();
            districtStatsModel.TotalTeamLeads = clinicTeamLeadRepo.GetAll().Where(x => x.IsActive && x.Clinic.SubDistrict.DistrictId == districtId).Distinct().Count();
            districtStatsModel.TotalHCWs = hcwRepo.GetAll().Where(x => x.IsActive && x.Clinic.SubDistrict.DistrictId == districtId).Distinct().Count();

            return districtStatsModel;
        }
    }
}
