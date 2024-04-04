using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using static EcdLink.Api.CoreApi.Constants;
using System.Collections.Generic;
using System;
using ECDLink.Security.Extensions;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using System.Linq;
using EcdLink.Api.CoreApi.Services.Interfaces;

namespace EcdLink.Api.CoreApi.Services
{
    public class ReferralService : IReferralService
    {
        private IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;
        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        public ReferralService(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            _visitDataStatusRepo = repoFactory.CreateRepository<VisitDataStatus>(userContext: uId);
            _healthCareWorkerRepo = repoFactory.CreateRepository<HealthCareWorker>(userContext: uId);
        }

        public List<PortalReferralsSummaryModel> GetReferralsForTeamLead(
            Guid userId,
            DateTime startDate,
            DateTime endDate)
        {
            var healthCareWorkerIds = _healthCareWorkerRepo.GetAll()
                    .Where(x => x.ClinicId.HasValue && x.Clinic.TeamLeads.Any(y => y.TeamLead.UserId == userId))
                    .Select(x => x.Id)
                    .ToList();

            return GetReferrals(healthCareWorkerIds, startDate, endDate);
        }

        public List<PortalReferralsSummaryModel> GetReferralsForClinics(
            List<Guid> clinicIds,
            DateTime startDate,
            DateTime endDate)
        {
            var healthCareWorkerIds = _healthCareWorkerRepo.GetAll()
                    .Where(x => x.ClinicId.HasValue && clinicIds.Contains(x.ClinicId.Value))
                    .Select(x => x.Id)
                    .ToList();

            return GetReferrals(healthCareWorkerIds, startDate, endDate);
        }

        private List<PortalReferralsSummaryModel> GetReferrals(
            List<Guid> healthCareWorkerIds,
            DateTime startDate,
            DateTime endDate)
        {
            var referrals = _visitDataStatusRepo.GetAll()
                .Where(x =>
                    x.Type == GGSettings.visit_data_client_referral
                    && x.VisitData.Visit.ActualVisitDate >= startDate
                    && x.VisitData.Visit.ActualVisitDate <= endDate
                    && (x.VisitData.Visit.MotherId.HasValue && x.VisitData.Visit.Mother.HealthCareWorkerId.HasValue && healthCareWorkerIds.Contains(x.VisitData.Visit.Mother.HealthCareWorkerId.Value)
                        || x.VisitData.Visit.InfantId.HasValue && x.VisitData.Visit.Infant.Caregiver.HealthCareWorkerId.HasValue && healthCareWorkerIds.Contains(x.VisitData.Visit.Infant.Caregiver.HealthCareWorkerId.Value)))
                .Select(x => new { x.Id, IsPregnantMomVisit = x.VisitData.Visit.MotherId.HasValue, x.VisitData.VisitName, x.VisitData.VisitId, x.VisitData.VisitSection, x.VisitData.Question, x.VisitData.Visit.ActualVisitDate, x.Comment, x.IsCompleted, x.BackReferral, x.BackReferralCompleted, OtherStatuses = x.VisitData.VisitDataStatus.ToList() })
                .ToList();

            var referralModels = new List<PortalReferralsSummaryModel>();

            // Mother referrals

            #region EarlyIdentificationOfPregnancy

            var earlyIdentificationOfPregnancyReferrals = referrals.Where(x => x.Comment == GGSettings.pregnancy_not_booked).ToList();

            var earlyIdentificationOfPregnancyReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.EarlyIdentificationOfPregnancy,
                ReferralsRaised = earlyIdentificationOfPregnancyReferrals.Count,
                ReferralsMade = earlyIdentificationOfPregnancyReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = earlyIdentificationOfPregnancyReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(earlyIdentificationOfPregnancyReferralModel);

            #endregion

            #region MaternalDistress

            var maternalDistressReferrals = referrals.Where(x => x.Comment.EndsWith(GGSettings.maternal_distress)).ToList();

            var maternalDistressReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.MaternalDistress,
                ReferralsRaised = maternalDistressReferrals.Count,
                ReferralsMade = maternalDistressReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = maternalDistressReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(maternalDistressReferralModel);

            #endregion

            #region DangerSignsChildsMother

            var dangerSignsChildsMotherReferrals = referrals
                .Where(x =>
                    !x.IsPregnantMomVisit
                    && x.Question == GGSettings.q_danger_signs
                    && x.VisitName == GGSettings.cfm_name)
                .ToList();

            var dangerSignsChildsMotherReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.DangerSignsChildsMother,
                ReferralsRaised = dangerSignsChildsMotherReferrals.Count,
                ReferralsMade = dangerSignsChildsMotherReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = dangerSignsChildsMotherReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(dangerSignsChildsMotherReferralModel);

            #endregion

            #region DangerSignsPregnantMom

            var dangerSignsPregnantMomReferrals = referrals
                .Where(x =>
                    x.IsPregnantMomVisit
                    && x.Question == GGSettings.q_danger_signs)
                .ToList();

            var dangerSignsPregnantMomReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.DangerSignsPregnantMom,
                ReferralsRaised = dangerSignsPregnantMomReferrals.Count,
                ReferralsMade = dangerSignsPregnantMomReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = dangerSignsPregnantMomReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(dangerSignsPregnantMomReferralModel);

            #endregion

            #region MaternalMalnutrition

            var maternalMalnutritionReferrals = referrals.Where(x => x.Comment == GGSettings.IndicatorMotherUnderweight).ToList();

            var maternalMalnutritionReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.MaternalMalnutrition,
                ReferralsRaised = maternalMalnutritionReferrals.Count,
                ReferralsMade = maternalMalnutritionReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = maternalMalnutritionReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(maternalMalnutritionReferralModel);

            #endregion

            // Referral always saved on tolerance question, but should we include the other in the check in case?
            #region SubstanceAbuse

            var substanceAbuseReferrals = referrals.Where(x => x.Question == GGSettings.QuestionAlcoholTolerance).ToList();

            var substanceAbuseReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.SubstanceAbuse,
                ReferralsRaised = substanceAbuseReferrals.Count,
                ReferralsMade = substanceAbuseReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = substanceAbuseReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(substanceAbuseReferralModel);

            #endregion

            #region CaregiverIDBook

            var caregiverIDBookReferrals = referrals.Where(x => x.Comment.EndsWith(GGSettings.no_id_book)).ToList();

            var caregiverIDBookReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.CaregiverIDBook,
                ReferralsRaised = caregiverIDBookReferrals.Count,
                ReferralsMade = caregiverIDBookReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = caregiverIDBookReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(caregiverIDBookReferralModel);

            #endregion

            // Child referrals

            #region ChildSupportGrant

            var childSupportGrantReferrals = referrals.Where(x => x.Comment == GGSettings.has_csg3).ToList();

            var childSupportGrantReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.ChildSupportGrant,
                ReferralsRaised = childSupportGrantReferrals.Count,
                ReferralsMade = childSupportGrantReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = childSupportGrantReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(childSupportGrantReferralModel);

            #endregion

            // Too many comparisons
            #region DevelopmentalDelays

            var developmentalDelaysReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.q_hearing1 ||
                    x.Question == GGSettings.q_hearing2 ||
                    x.Question == GGSettings.q_hearing3 ||
                    x.Question == GGSettings.q_hearing4 ||
                    x.Question == GGSettings.q_hearing5 ||
                    x.Question == GGSettings.q_hearing6 ||
                    x.Question == GGSettings.q_hearing7 ||
                    x.Question == GGSettings.q_hearing8 ||
                    x.Question == GGSettings.q_hearing9 ||
                    x.Question == GGSettings.q_seeing1 ||
                    x.Question == GGSettings.q_seeing2 ||
                    x.Question == GGSettings.q_seeing3 ||
                    x.Question == GGSettings.q_seeing4 ||
                    x.Question == GGSettings.q_seeing5 ||
                    x.Question == GGSettings.q_seeing6 ||
                    x.Question == GGSettings.q_seeing7 ||
                    x.Question == GGSettings.q_brain1 ||
                    x.Question == GGSettings.q_brain2 ||
                    x.Question == GGSettings.q_brain3 ||
                    x.Question == GGSettings.q_brain4 ||
                    x.Question == GGSettings.q_brain5 ||
                    x.Question == GGSettings.q_brain6 ||
                    x.Question == GGSettings.q_brain7 ||
                    x.Question == GGSettings.q_moving1 ||
                    x.Question == GGSettings.q_moving2 ||
                    x.Question == GGSettings.q_moving3 ||
                    x.Question == GGSettings.q_moving4 ||
                    x.Question == GGSettings.q_moving5 ||
                    x.Question == GGSettings.q_moving6 ||
                    x.Question == GGSettings.q_moving7)
                .ToList();

            var developmentalDelaysReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.DevelopmentalDelays,
                ReferralsRaised = developmentalDelaysReferrals.Count,
                ReferralsMade = developmentalDelaysReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = developmentalDelaysReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(developmentalDelaysReferralModel);

            #endregion

            #region ClinicVisitsNotUpToDate

            var clinicVisitsNotUpToDateReferrals = referrals
                .Where(x =>
                    x.Comment == GGSettings.clinic_visits_not_up_to_date
                    || x.Comment == GGSettings.infant_missed_clinic_visit)
                .ToList();

            var clinicVisitsNotUpToDateReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.ClinicVisitsNotUpToDate,
                ReferralsRaised = clinicVisitsNotUpToDateReferrals.Count,
                ReferralsMade = clinicVisitsNotUpToDateReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = clinicVisitsNotUpToDateReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(clinicVisitsNotUpToDateReferralModel);

            #endregion

            #region DangerSignsChild

            var dangerSignsChildReferrals = referrals
                .Where(x =>
                    x.VisitName != GGSettings.cfm_name
                    && x.Question == GGSettings.q_danger_signs)
                .ToList();

            var dangerSignsChildReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.DangerSignsChildsMother,
                ReferralsRaised = dangerSignsChildReferrals.Count,
                ReferralsMade = dangerSignsChildReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = dangerSignsChildReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(dangerSignsChildReferralModel);

            #endregion

            #region LowBirthWeight

            var lowBirthWeightReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.QuestionWeight
                    && x.Comment.Contains(GGSettings.IndicatorLowBirthWeight))
                .ToList();

            var lowBirthWeightReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.LowBirthWeight,
                ReferralsRaised = lowBirthWeightReferrals.Count,
                ReferralsMade = lowBirthWeightReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = lowBirthWeightReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(lowBirthWeightReferralModel);

            #endregion

            #region GrowthFaltering

            var growthFalteringReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.QuestionWeight
                    && x.Comment.Contains(GGSettings.IndicatorGrowthFaltering))
                .ToList();

            var growthFalteringReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.GrowthFaltering,
                ReferralsRaised = growthFalteringReferrals.Count,
                ReferralsMade = growthFalteringReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = growthFalteringReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(growthFalteringReferralModel);

            #endregion

            #region SeverlyUnderweight

            var severlyUnderweightReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.QuestionWeight
                    && x.Comment.Contains(GGSettings.IndicatorSeverelyUnderweight))
                .ToList();

            var severlyUnderweightReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.SeverlyUnderweight,
                ReferralsRaised = severlyUnderweightReferrals.Count,
                ReferralsMade = severlyUnderweightReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = severlyUnderweightReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(severlyUnderweightReferralModel);

            #endregion

            #region Underweight

            var underweightReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.QuestionWeight
                    && x.Comment.Contains(GGSettings.IndicatorUnderweight))
                .ToList();

            var underweightReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.Underweight,
                ReferralsRaised = underweightReferrals.Count,
                ReferralsMade = underweightReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = underweightReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(underweightReferralModel);

            #endregion

            #region Overweight

            var overweightReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.QuestionWeight
                    && x.VisitName != GGSettings.CareForBaby
                    && x.Comment.Contains(GGSettings.IndicatorOverweight))
                .ToList();

            var overweightReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.Overweight,
                ReferralsRaised = overweightReferrals.Count,
                ReferralsMade = overweightReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = overweightReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(overweightReferralModel);

            #endregion

            #region Obese

            var obeseReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.QuestionWeight
                    && x.VisitName != GGSettings.CareForBaby
                    && x.Comment.Contains(GGSettings.IndicatorObese))
                .ToList();

            var obeseReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.Obese,
                ReferralsRaised = obeseReferrals.Count,
                ReferralsMade = obeseReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = obeseReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(obeseReferralModel);

            #endregion

            #region SeverlyStunted

            var severlyStuntedReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.QuestionWeight // Referral for measurement always saved on the weight question
                    && x.Comment.Contains(GGSettings.IndicatorSeverelyStunted))
                .ToList();

            var severlyStuntedReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.SeverlyStunted,
                ReferralsRaised = severlyStuntedReferrals.Count,
                ReferralsMade = severlyStuntedReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = severlyStuntedReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(severlyStuntedReferralModel);

            #endregion

            // This referral still needs to be added
            #region LowBirthLength

            var lowBirthLengthReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.QuestionWeight // Referral for measurement always saved on the weight question
                    && x.OtherStatuses.Any(x => x.Comment == GGSettings.IndicatorLowBirthLength))
                .ToList();

            var lowBirthLengthReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.LowBirthLength,
                ReferralsRaised = lowBirthLengthReferrals.Count,
                ReferralsMade = lowBirthLengthReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = lowBirthLengthReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(lowBirthLengthReferralModel);

            #endregion

            #region Stunted

            var stuntedReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.QuestionWeight // Referral for measurement always saved on the weight question
                    && x.Comment.Contains(GGSettings.IndicatorStunted))
                .ToList();

            var stuntedReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.Stunted,
                ReferralsRaised = stuntedReferrals.Count,
                ReferralsMade = stuntedReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = stuntedReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(stuntedReferralModel);

            #endregion

            #region SevereAcuteMalnutrition

            var severeAcuteMalnutritionReferrals = referrals
                .Where(x =>
                   x.Question == GGSettings.QuestionWeight // Referral for measurement always saved on the weight question
                    && x.Comment.Contains(GGSettings.IndicatorSevereAcuteMalnutrition))
                .ToList();

            var severeAcuteMalnutritionReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.SevereAcuteMalnutrition,
                ReferralsRaised = severeAcuteMalnutritionReferrals.Count,
                ReferralsMade = severeAcuteMalnutritionReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = severeAcuteMalnutritionReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(severeAcuteMalnutritionReferralModel);

            #endregion

            #region ModerateAcuteMalnutrition

            var moderateAcuteMalnutritionReferrals = referrals
                .Where(x =>
                    x.Question == GGSettings.QuestionWeight // Referral for measurement always saved on the weight question
                    && x.Comment.Contains(GGSettings.IndicatorModerateAcuteMalnutrition))
                .ToList();

            var moderateAcuteMalnutritionReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.ModerateAcuteMalnutrition,
                ReferralsRaised = moderateAcuteMalnutritionReferrals.Count,
                ReferralsMade = moderateAcuteMalnutritionReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = moderateAcuteMalnutritionReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(moderateAcuteMalnutritionReferralModel);

            #endregion

            #region VitaminANotUpToDate

            var vitaminANotUpToDateReferrals = referrals
                .Where(x => x.Comment == GGSettings.VitaminANotUpToDate).ToList();

            var vitaminANotUpToDateReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.VitaminANotUpToDate,
                ReferralsRaised = vitaminANotUpToDateReferrals.Count,
                ReferralsMade = vitaminANotUpToDateReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = vitaminANotUpToDateReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(vitaminANotUpToDateReferralModel);

            #endregion

            #region DewormingNotUpToDate

            var dewormingNotUpToDateReferrals = referrals
                .Where(x => x.Comment == GGSettings.DewormingNotUpToDate).ToList();

            var dewormingNotUpToDateReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.DewormingNotUpToDate,
                ReferralsRaised = dewormingNotUpToDateReferrals.Count,
                ReferralsMade = dewormingNotUpToDateReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = dewormingNotUpToDateReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(dewormingNotUpToDateReferralModel);

            #endregion

            #region ImmunisationNotUpToDate

            var immunisationNotUpToDateReferrals = referrals
                .Where(x => x.Comment == GGSettings.DewormingNotUpToDate).ToList();

            var immunisationNotUpToDateReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.ImmunisationNotUpToDate,
                ReferralsRaised = immunisationNotUpToDateReferrals.Count,
                ReferralsMade = immunisationNotUpToDateReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = immunisationNotUpToDateReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(immunisationNotUpToDateReferralModel);

            #endregion

            #region ChildBirthCertificate

            var childBirthCertificateReferrals = referrals.Where(x => x.Comment.EndsWith(GGSettings.no_birth_certificate)).ToList();

            var childBirthCertificateReferralModel = new PortalReferralsSummaryModel()
            {
                Type = ReferralTypes.ChildBirthCertificate,
                ReferralsRaised = childBirthCertificateReferrals.Count,
                ReferralsMade = childBirthCertificateReferrals.Where(x => x.IsCompleted).Count(),
                BackReferralsMade = childBirthCertificateReferrals.Where(x => x.BackReferralCompleted).Count(),
            };

            referralModels.Add(childBirthCertificateReferralModel);

            #endregion

            return referralModels;
        }
    }
}
