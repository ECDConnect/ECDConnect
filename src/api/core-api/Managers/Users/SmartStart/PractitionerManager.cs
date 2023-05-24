using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
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
        private VisitDataManager _visitDataManager;

        private IGenericRepository<LicenseType, Guid> _licenseTypeRepo;
        private IGenericRepository<License, Guid> _licenseRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;

        public PractitionerManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitManager visitManager,
            VisitDataStatusManager visitDataStatusManager,
            VisitDataManager visitDataManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;

            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;

            _visitManager = visitManager;
            _visitDataStatusManager = visitDataStatusManager;
            _visitDataManager = visitDataManager;

            _practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _licenseTypeRepo = _repoFactory.CreateGenericRepository<LicenseType>(userContext: _applicationUserId);
            _licenseRepo = _repoFactory.CreateGenericRepository<License>(userContext: _applicationUserId);
            _visitDataManager = visitDataManager;
        }

        public PractitionerTimeline GetPractitionerTimeline(string userId)
        {

            PractitionerTimeline timeLine = new PractitionerTimeline();
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
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_1)
                    {
                        if (visit.PlannedVisitDate.Date > today.Date)
                        {
                            timeLine.PrePQAVisitDate1Status = Constants.SSSettings.first_site_visit;
                            timeLine.PrePQAVisitDate1Color = MetricsColorEnum.Success.ToString();
                            timeLine.PrePQAVisitDate1 = visit.PlannedVisitDate;
                        } else
                        {
                            timeLine.PrePQAVisitDate1Status = Constants.SSSettings.first_site_visit;
                            timeLine.PrePQAVisitDate1Color = MetricsColorEnum.Warning.ToString();
                            timeLine.PrePQAVisitDate1 = visit.PlannedVisitDate;
                        }
                        site_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_2)
                    {
                        if (visit.PlannedVisitDate.Date > today.Date)
                        {
                            timeLine.PrePQAVisitDate1Status = Constants.SSSettings.second_site_visit;
                            timeLine.PrePQAVisitDate1Color = MetricsColorEnum.Success.ToString();
                            timeLine.PrePQAVisitDate1 = visit.PlannedVisitDate;
                        }
                        else
                        {
                            timeLine.PrePQAVisitDate1Status = Constants.SSSettings.second_site_visit;
                            timeLine.PrePQAVisitDate1Color = MetricsColorEnum.Warning.ToString();
                            timeLine.PrePQAVisitDate1 = visit.PlannedVisitDate;
                        }
                        site_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
                    {
                        PQARating pqaRating = _visitDataManager.GetPractitionerPQARating(userId);
                        visit.OverallRatingColor = pqaRating.OverallRatingColor;
                        site_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1_follow_up)
                    {
                        site_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_support || visit.VisitType.Name == Constants.SSSettings.visitType_call)
                    {
                        support_visits.Add(visit);
                    }
                }
            }

            timeLine.SiteVisits = site_visits;
            timeLine.SupportVisits = support_visits;

            return timeLine;
        }

    
        public bool DeActivatePractitioner(string userId, string leavingComment)
        {
            Practitioner practitioner = _practitionerRepo.GetAll().Where(x => x.User.Id == userId).FirstOrDefault();

            if (practitioner != null)
            {
                practitioner.IsActive = false;
                practitioner.UpdatedBy = _applicationUserId;
                practitioner.UpdatedDate = DateTime.Now;
                practitioner.LeavingComment = leavingComment;
                _practitionerRepo.Update(practitioner);

                return true;
            }
            return false;
        }

       
    }
}

