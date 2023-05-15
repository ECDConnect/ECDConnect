using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users.SmartStart
{
    public class PractitionerManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private string _applicationUserId;

        private VisitManager _visitManager;
        private VisitDataStatusManager _visitDataStatusManager;

        private IGenericRepository<LicenseType, Guid> _licenseTypeRepo;
        private IGenericRepository<License, Guid> _licenseRepo;

        public PractitionerManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitManager visitManager,
            VisitDataStatusManager visitDataStatusManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;

            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;

            _visitManager = visitManager;
            _visitDataStatusManager = visitDataStatusManager;

            _licenseTypeRepo = _repoFactory.CreateGenericRepository<LicenseType>(userContext: _applicationUserId);
            _licenseRepo = _repoFactory.CreateGenericRepository<License>(userContext: _applicationUserId);
        }

        public PractitionerTimeLine GetPractitionerTimeline(string userId)
        {

            PractitionerTimeLine timeLine = new PractitionerTimeLine();
            DateTime today = DateTime.Today;

            // Starter license received
            var starterDate = (
                from license in _licenseRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true)
                join licenseType in _licenseTypeRepo.GetAll().Where(y => y.Name == Constants.SSSettings.ss_starter_license) on license.LicenseTypeId equals licenseType.Id
                select license
            ).Select(x => x.LicenseDate).FirstOrDefault();
            if (starterDate != null)
            {
                timeLine.StarterLicenseStatus = Constants.SSSettings.starter_license_received;
                timeLine.StarterLicenseDate = starterDate;
                timeLine.StarterLicenseColor = MetricsColorEnum.Success.ToString();
            } else
            {
                timeLine.StarterLicenseStatus = Constants.SSSettings.starter_license_not_received;
                timeLine.StarterLicenseColor = MetricsColorEnum.Warning.ToString();
            }

            // SmartSpace license received
            var smartSpaceDate = (
                from license in _licenseRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true)
                join licenseType in _licenseTypeRepo.GetAll().Where(y => y.Name == Constants.SSSettings.ss_smart_space_license) on license.LicenseTypeId equals licenseType.Id
                select license
            ).Select(x => x.LicenseDate).FirstOrDefault();

            if (smartSpaceDate != null)
            {
                timeLine.SmartSpaceLicenseStatus = Constants.SSSettings.smart_space_license_received;
                timeLine.SmartSpaceLicenseDate = smartSpaceDate;
                timeLine.SmartSpaceLicenseColor = MetricsColorEnum.Success.ToString();
            }
            else
            {
                timeLine.SmartSpaceLicenseStatus = Constants.SSSettings.smart_space_license_not_received;
                timeLine.SmartSpaceLicenseColor = MetricsColorEnum.Warning.ToString();
            }

            // TODO: meetings -> consolidation meetings + club meetings - waiting for development to be completed

            // TODO: first aid -> waiting for development to be completed

            // Pre-PQA visits
            List<Visit> visits = _visitManager.GetVisitsForClient(userId, Constants.SSSettings.client_practitioner);
            List<Visit> site_visits = new List<Visit>();
            List<Visit> support_visits = new List<Visit>();

            foreach (Visit visit in visits)
            {
                if (visit != null)
                {
                    if (visit.VisitType.Name == Constants.SSSettings.pre_pqa_visit_1)
                    {
                        if (visit.PlannedVisitDate.Date > today.Date)
                        {
                            timeLine.VisitDate1Status = Constants.SSSettings.first_site_visit;
                            timeLine.VisitDate1Color = MetricsColorEnum.Success.ToString();
                            timeLine.VisitDate1 = visit.PlannedVisitDate;
                        } else
                        {
                            timeLine.VisitDate1Status = Constants.SSSettings.first_site_visit;
                            timeLine.VisitDate1Color = MetricsColorEnum.Warning.ToString();
                            timeLine.VisitDate1 = visit.PlannedVisitDate;
                        }
                        site_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.pre_pqa_visit_2)
                    {
                        if (visit.PlannedVisitDate.Date > today.Date)
                        {
                            timeLine.VisitDate1Status = Constants.SSSettings.second_site_visit;
                            timeLine.VisitDate1Color = MetricsColorEnum.Success.ToString();
                            timeLine.VisitDate1 = visit.PlannedVisitDate;
                        }
                        else
                        {
                            timeLine.VisitDate1Status = Constants.SSSettings.second_site_visit;
                            timeLine.VisitDate1Color = MetricsColorEnum.Warning.ToString();
                            timeLine.VisitDate1 = visit.PlannedVisitDate;
                        }
                        site_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_support)
                    {
                        support_visits.Add(visit);
                    }
                }
            }

            timeLine.SiteVisits = site_visits;
            timeLine.SupportVisits = support_visits;

            return timeLine;
        }

    }
}

