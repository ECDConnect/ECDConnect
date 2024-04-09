using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using EcdLink.Api.CoreApi.Services;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ClinicQueryExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Clinic> GetAllPortalClinics(
            [Service] IHttpContextAccessor contextAccessor,
            ApplicationUserManager userManager,
            IGenericRepositoryFactory repoFactory)
        {
            var user = contextAccessor.HttpContext.GetUser();

            // Check if team lead or admin
            var currentUser = userManager.FindByIdAsync(user.Id).Result;
            var isUserAdmin = userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR).Result;

            var clinicRepo = repoFactory.CreateRepository<Clinic>(userContext: user.Id);
            return clinicRepo.GetAll()
                .Where(x => 
                    x.IsActive
                    && (isUserAdmin || x.TeamLeads.Any(y => y.TeamLead.UserId == user.Id)))
                .Include(x => x.TeamLeads.Where(x => x.IsActive))
                .Include(x => x.SiteAddress)
                .Include(x => x.SubDistrict)
                .Include(x => x.HealthCareWorkers.Where(x => x.IsActive))
                .Include(x => x.Leagues.Where(x => x.IsActive))
                .ToList();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClinicReportModel GetClinicPointsData([Service] IClinicService clinicService, Guid clinicId)
        {
            return clinicService.GetClinicPointsData(clinicId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClinicVisitReportModel GetClinicVisitReportData([Service] IClinicService clinicService, Guid clinicId, DateTime startDate, DateTime endDate)
        {
            return clinicService.GetClinicVisitReportData(clinicId, startDate, endDate);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClinicModel GetClinicById(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IPointsEngineService pointsEngineService,
            IGenericRepositoryFactory repoFactory,
            Guid clinicId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var clinicRepo = repoFactory.CreateRepository<Clinic>(userContext: uId);
            var pointsLibraryRepo = repoFactory.CreateRepository<PointsLibrary>(userContext: uId);

            var clinic = clinicRepo.GetAll()
                .Where(x => x.Id == clinicId)
                .Include(x => x.TeamLeads)
                .Include(x => x.SiteAddress)
                .Include(x => x.HealthCareWorkers)
                .Include(x => x.Leagues)
                .FirstOrDefault();

            var clinicPoints = pointsEngineService.GetPointsDetailsForClinic(clinicId);

            return new ClinicModel(clinic, clinicPoints);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<CaregiverBaseModel> GetAvailableCaregiversForBreastFeedingClub(
            [Service] IClinicService clinicService,
            Guid clinicId)
        {
            var caregivers = clinicService.GetAvailableCaregiversForBreastFeedingClub(clinicId);

            return caregivers.Select(x => new CaregiverBaseModel(x)).ToList();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<BreastFeedingClubModel> GetBreastFeedingClubs(
            [Service] IClinicService clinicService,
            Guid clinicId)
        {
            var breastFeedingClubs = clinicService.GetBreastFeedingClubs(clinicId);

            return breastFeedingClubs.Select(x => new BreastFeedingClubModel(x)).ToList();
        }
    }
}
