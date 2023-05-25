using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddAdditionalVisitForMother(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            VisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: applicationUserId);
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_mother) && x.Name == Constants.GGSettings.additional_visits).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Mother mother = motherRepo.GetAll().Where(x => x.UserId == input.MotherId.ToString()).FirstOrDefault();

            input.VisitType = visitType;
            input.Attended = false;
            input.InfantId = null;
            input.MotherId = mother.Id;
            input.LinkedVisitId = null;
            input.PractitionerId = null;

            return visitManager.AddAdditionalVisit(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddAdditionalVisitForInfant(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            VisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var infantRepo = repoFactory.CreateGenericRepository<Infant>(userContext: applicationUserId);
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_child) && x.Name == Constants.GGSettings.additional_visits).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Infant infant = infantRepo.GetAll().Where(x => x.UserId == input.InfantId.ToString()).FirstOrDefault();


            input.VisitType = visitType;
            input.Attended = false;
            input.MotherId = null;
            input.InfantId = infant.Id;
            input.LinkedVisitId = null;
            input.PractitionerId = null;

            return visitManager.AddAdditionalVisit(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddSupportVisitForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SupportVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);
            VisitType visitType;
            if (input.isSupportCall == true)
            {
                visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_call).OrderBy(x => x.NormalizedName).FirstOrDefault();
            } else
            {
                visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_support).OrderBy(x => x.NormalizedName).FirstOrDefault();
            }

            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == input.PractitionerId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.MotherId = null;
            visitModel.InfantId = null;
            visitModel.LinkedVisitId = null;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddSupportVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.SupportData.VisitId = visit.Id.ToString();
            input.SupportData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.SupportData, false);

            return visit;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddFollowUpVisitForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            FollowUpVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == input.PractitionerId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.MotherId = null;
            visitModel.InfantId = null;
            visitModel.LinkedVisitId = null;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddFollowUpVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.FollowUpData.VisitId = visit.Id.ToString();
            input.FollowUpData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.FollowUpData, false);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddReAccreditationVisitForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            ReAccreditationVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_re_accreditation).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == input.PractitionerId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.MotherId = null;
            visitModel.InfantId = null;
            visitModel.LinkedVisitId = null;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddFollowUpVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.ReAccreditationData.VisitId = visit.Id.ToString();
            input.ReAccreditationData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.ReAccreditationData, false);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool AddPGARatingVisitForPractitioner([Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] UserLicenseManager userLicenseManager,
            string userId,
            string ratingColor)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            License smartSpaceLic = userLicenseManager.GetLicenseForUserForType(userId, Constants.SSSettings.ss_smart_space_license);
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == userId).FirstOrDefault();

            // 3 visit pqa first visit types
            VisitType pqaType1 = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_pqa_visit_1).FirstOrDefault();
            VisitType pqaType2 = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_pqa_visit_2).FirstOrDefault();
            VisitType pqaType3 = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_pqa_visit_3).FirstOrDefault();

            Visit firstPQA = visitRepo.GetAll().Where(x => x.Practitioner.User.Id == userId && x.VisitTypeId == pqaType1.Id).FirstOrDefault();
            Visit secondPQA = visitRepo.GetAll().Where(x => x.Practitioner.User.Id == userId && x.VisitTypeId == pqaType2.Id).FirstOrDefault();

            var input = new VisitModel();
            input.MotherId = null;
            input.InfantId = null;
            input.LinkedVisitId = null;
            input.PractitionerId = practitioner.Id;

            // Red rating follow up -- if the practitioner receives a red rating:
            // the coach must schedule another First PQA visit; deadline = date of the initial First PQA visit +14 days
            if (ratingColor == MetricsColorEnum.Error.ToString())
            {
                if (firstPQA != null && secondPQA == null)
                {
                    DateTime dt = (DateTime)smartSpaceLic.LicenseDate;
                    DateTime newDate = dt.AddDays(14);
                    input.PlannedVisitDate = newDate;
                    input.VisitType = pqaType2;
                    visitManager.AddVisit(input);
                }

            }

            // Orange rating follow up -- if the practitioner receives an orange rating:
            // coach must schedule another First PQA visit when the practitioner is ready (as determined in the follow up visit flow); deadline = date of the last First PQA visit + 60 days
            if (ratingColor == MetricsColorEnum.Warning.ToString())
            {
                if (secondPQA != null)
                {
                    DateTime dt = secondPQA.PlannedVisitDate;
                    DateTime newDate = dt.AddDays(60);
                    input.PlannedVisitDate = newDate;
                    input.VisitType = pqaType3;
                } else
                {
                    DateTime dt = firstPQA.PlannedVisitDate;
                    DateTime newDate = dt.AddDays(60);
                    input.PlannedVisitDate = newDate;
                    input.VisitType = pqaType2;
                }
                
                visitManager.AddVisit(input);
            }

            return true;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool AddDefaultVisitsForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] UserLicenseManager userLicenseManager,
            string userId)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == userId).FirstOrDefault();
            List<VisitType> visitTypes = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name != Constants.SSSettings.visitType_support).OrderBy(x => x.NormalizedName).ToList();

            var smartSpaceLic = userLicenseManager.GetLicenseForUserForType(userId, Constants.SSSettings.ss_smart_space_license);

            if (smartSpaceLic != null)
            {
                var input = new VisitModel();
                foreach (VisitType visitType in visitTypes)
                {
                    input = new VisitModel();
                    input.VisitType = visitType;
                    input.Attended = false;
                    input.MotherId = null;
                    input.InfantId = null;
                    input.LinkedVisitId = null;
                    input.PractitionerId = practitioner.Id;

                    // -- first visit; Deadline for first visit = { date SmartSpace licence was received + 1 month }
                    if (visitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_1)
                    {
                        DateTime dt = (DateTime)smartSpaceLic.LicenseDate;
                        DateTime newDate = dt.AddMonths(1);
                        input.PlannedVisitDate = newDate;
                        visitManager.AddVisit(input);
                    }
                    // --second visit; Deadline for second visit = { date SmartSpace licence was received + 2 months }
                    if (visitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_2)
                    {
                        DateTime dt = (DateTime)smartSpaceLic.LicenseDate;
                        DateTime newDate = dt.AddMonths(2);
                        input.PlannedVisitDate = newDate;
                        visitManager.AddVisit(input);
                    }
                    // SmartSpace licence received date + 3 months
                    if (visitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
                    {
                        DateTime dt = (DateTime)smartSpaceLic.LicenseDate;
                        DateTime newDate = dt.AddMonths(3);
                        input.PlannedVisitDate = newDate;
                        visitManager.AddVisit(input);
                    }
                }

            }

            return true;
        }
    }
}
