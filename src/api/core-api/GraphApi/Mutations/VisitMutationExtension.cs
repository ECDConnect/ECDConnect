using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
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
using System.Globalization;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
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
            if (input.PlannedVisitDate != default)
            {
                input.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            }

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
            if (input.PlannedVisitDate != default)
            {
                input.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            }

            return visitManager.AddAdditionalVisit(input);
        }

        #region Practitioners

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
            }
            else
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
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForPractitioner(visitModel);
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
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == input.PractitionerId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.MotherId = null;
            visitModel.InfantId = null;
            visitModel.LinkedVisitId = input.LinkedVisitId;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.FollowUpData.VisitId = visit.Id.ToString();
            input.FollowUpData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.FollowUpData, false);

            // PQA Rating
            var pqaRating = visitDataManager.CalculateAndSavePractitionerPQARating(visit);
            visitManager.AddNextPQAOrFollowUpVisit(pqaRating.OverallRatingColor, practitioner.Id, visit);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddReAccreditationFollowUpVisitForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            FollowUpVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_re_accreditation_follow_up).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == input.PractitionerId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.MotherId = null;
            visitModel.InfantId = null;
            visitModel.LinkedVisitId = input.LinkedVisitId;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.FollowUpData.VisitId = visit.Id.ToString();
            input.FollowUpData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.FollowUpData, false);

            // PQA Rating
            PQARating pqaRating = visitDataManager.CalculateAndSaveReAccreditationRating(visit);
            visitManager.AddNextReAccreditationOrFollowUpVisit(pqaRating.OverallRatingColor, practitioner.Id, visit);

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
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == input.PractitionerId.ToString()).FirstOrDefault();
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.MotherId = null;
            visitModel.InfantId = null;
            visitModel.LinkedVisitId = input.LinkedVisitId;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            if (input.PlannedVisitDate.ToString() != "")
            {
                visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
                visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);

            }
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.ReAccreditationData.VisitId = visit.Id.ToString();
            input.ReAccreditationData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.ReAccreditationData, false);

            // PQA Rating
            PQARating pqaRating = visitDataManager.CalculateAndSaveReAccreditationRating(visit);
            visitManager.AddNextReAccreditationOrFollowUpVisit(pqaRating.OverallRatingColor, practitioner.Id, visit);

            return visit;
        }

        // This function is here for adding visits 'manually' via postman for a practitioner, but is also called from GetAllPractitionersForCoach
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool ValidateDefaultVisitsForPractitioner(
            [Service] VisitManager visitManager,
            string userId)
        {
            return visitManager.ValidateDefaultVisitsForPractitioner(userId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddSelfAssessmentForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SupportVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type == Constants.SSSettings.client_practitioner && x.Name == Constants.SSSettings.visitType_self_assessment).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == input.PractitionerId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.MotherId = null;
            visitModel.InfantId = null;
            visitModel.LinkedVisitId = input.LinkedVisitId;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.SupportData.VisitId = visit.Id.ToString();
            input.SupportData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.SupportData, false);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit UpdateVisitPlannedVisitDate(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            UpdateVisitPlannedVisitDateModel input)
        {
            return visitManager.UpdateVisitPlannedVisitDate(input);
        }

        #endregion

        #region Trainees

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddSSChecklistForTrainee(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SSChecklistVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_trainee) && x.Name == Constants.SSSettings.visitType_smart_space_checklist).FirstOrDefault();
            Trainee trainee = traineeRepo.GetAll().Where(x => x.UserId == input.TraineeId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = null;
            visitModel.TraineeId = trainee.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForTrainee(visitModel);
            // Add VisitData for visit
            input.ChecklistData.VisitId = visit.Id.ToString();
            input.ChecklistData.TraineeId = trainee.Id.ToString();
            visitDataManager.AddTraineeVisitData(input.ChecklistData);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddStartupSupportAgreementForTrainee(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SupportVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_trainee) && x.Name == Constants.SSSettings.visitType_startup_support_agreement).FirstOrDefault();
            Trainee trainee = traineeRepo.GetAll().Where(x => x.UserId == input.TraineeId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = null;
            visitModel.TraineeId = trainee.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForTrainee(visitModel);
            // Add VisitData for visit
            input.SupportData.VisitId = visit.Id.ToString();
            input.SupportData.TraineeId = trainee.Id.ToString();
            visitDataManager.AddTraineeVisitData(input.SupportData);

            return visit;
        }

        #endregion

        #region Coaches

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddCoachVisitInviteForTrainee(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SSChecklistVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: applicationUserId);
            var traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_coach) && x.Name == Constants.SSSettings.visitType_trainee_visit).FirstOrDefault();
            Coach coach = coachRepo.GetAll().Where(x => x.UserId == input.CoachId.ToString()).FirstOrDefault();
            Trainee trainee = traineeRepo.GetAll().Where(x => x.UserId == input.TraineeId.ToString()).FirstOrDefault();

            if (input.CoachId == null || input.TraineeId == null)
            {
                return new Visit();
            }

            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = null;
            visitModel.CoachId = coach.Id;
            visitModel.TraineeId = trainee.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForCoach(visitModel);
            // Add VisitData for visit
            input.ChecklistData.VisitId = visit.Id.ToString();
            input.ChecklistData.TraineeId = trainee.Id.ToString();
            input.ChecklistData.CoachId = coach.Id.ToString();
            visitDataManager.AddTraineeVisitData(input.ChecklistData);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddCoachFranchiseeAgreementForTrainee(
            [Service] IIntegrationService integrationService,
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SSChecklistVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: applicationUserId);
            var traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_coach) && x.Name == Constants.SSSettings.visitType_coach_franchisee_agreement).FirstOrDefault();
            Coach coach = coachRepo.GetAll().Where(x => x.UserId == input.CoachId.ToString()).FirstOrDefault();
            Trainee trainee = traineeRepo.GetAll().Where(x => x.UserId == input.TraineeId.ToString()).FirstOrDefault();

            if (input.CoachId == null || input.TraineeId == null)
            {
                return new Visit();
            }

            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = null;
            visitModel.CoachId = coach.Id;
            visitModel.TraineeId = trainee.Id;
            visitModel.PlannedVisitDate = DateTime.Now;
            visitModel.DueDate = DateTime.Now;
            visitModel.ActualVisitDate = DateTime.Now;
            visitModel.Attended = true;

            Visit visit = visitManager.AddVisitForCoach(visitModel);
            // Add VisitData for visit
            input.ChecklistData.VisitId = visit.Id.ToString();
            input.ChecklistData.TraineeId = trainee.Id.ToString();
            input.ChecklistData.CoachId = coach.Id.ToString();

            Visit updatedVisit = visitDataManager.AddCoachData(input.ChecklistData);
            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddCoachVisitInviteForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            VisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            VisitType visitType;
            if (input.isSupportCall == true)
            {
                visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_coach) && x.Name == Constants.SSSettings.visitType_practitioner_call).OrderBy(x => x.NormalizedName).FirstOrDefault();
            }
            else
            {
                visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_coach) && x.Name == Constants.SSSettings.visitType_practitioner_visit).OrderBy(x => x.NormalizedName).FirstOrDefault();
            }

            Coach coach = coachRepo.GetAll().Where(x => x.Id == input.CoachId).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == input.PractitionerId.ToString()).FirstOrDefault();

            if (coach == null || practitioner == null)
            {
                return new Visit();
            }

            input.VisitType = visitType;
            input.Attended = false;
            input.CoachId = coach.Id;
            input.PractitionerId = practitioner.Id;
            input.LinkedVisitId = input.LinkedVisitId;
            input.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            input.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            return visitManager.AddVisitForCoach(input);
        }

        #endregion
    }
}
