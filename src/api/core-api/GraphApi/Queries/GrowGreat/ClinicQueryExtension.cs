using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using EcdLink.Api.CoreApi.GraphApi.Models;
using System.Collections.Generic;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ClinicQueryExtension
    {
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
