using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
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
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security;

namespace EcdLink.Api.CoreApi.Services
{
    public class ReferralService : IReferralService
    {
        private ApplicationUserManager _userManager;
        private IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;

        public ReferralService(
            [Service] IHttpContextAccessor contextAccessor,
            ApplicationUserManager userManager,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            _userManager = userManager;

            _visitDataStatusRepo = repoFactory.CreateRepository<VisitDataStatus>(userContext: uId);
        }

        public IEnumerable<PortalReferralModel> GetReferrals(
            Guid userId,
            List<Guid> clinicIds,
            DateTime startDate,
            DateTime endDate)
        {
            var currentUser = _userManager.FindByIdAsync(userId).Result;
            var isTeamLead = _userManager.IsInRoleAsync(currentUser, RolesGG.TEAM_LEAD).Result;

            var referrals = _visitDataStatusRepo.GetAll()
                .Where(x =>
                    x.Type == GGSettings.visit_data_client_referral
                    && x.VisitData.Visit.ActualVisitDate >= startDate
                    && x.VisitData.Visit.ActualVisitDate <= endDate);
               

            if (clinicIds.Any())
            {
                // Filter by CHWs at given clinics
                referrals = referrals.Where(x =>
                    (x.VisitData.Visit.MotherId.HasValue && x.VisitData.Visit.Mother.HealthCareWorker.ClinicId.HasValue && clinicIds.Contains(x.VisitData.Visit.Mother.HealthCareWorker.ClinicId.Value)
                    || x.VisitData.Visit.InfantId.HasValue && x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.ClinicId.HasValue && clinicIds.Contains(x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.ClinicId.Value)));
            }
            else if (isTeamLead)
            {
                // Filter to just the team leads CHWs
                referrals = referrals.Where(x =>
                   (x.VisitData.Visit.MotherId.HasValue && x.VisitData.Visit.Mother.HealthCareWorker.ClinicId.HasValue && x.VisitData.Visit.Mother.HealthCareWorker.Clinic.TeamLeads.Any(y => y.TeamLead.UserId == userId))
                   || x.VisitData.Visit.InfantId.HasValue && x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.ClinicId.HasValue && x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.Clinic.TeamLeads.Any(y => y.TeamLead.UserId == userId));
            }

            var basicReferrals = referrals.Select(x => new
            {
                VisitDataStatusId = x.Id,
                IsPregnantMomVisit = x.VisitData.Visit.MotherId.HasValue,
                x.VisitData.VisitName,
                x.VisitData.VisitId,
                x.VisitData.Question,
                x.Comment,
                x.IsCompleted,
                x.BackReferralCompleted,
                BackReferral = x.BackReferral,
                CompletedDate = x.ReferralDateCompleted,
                CreatedDate = x.InsertedDate,
                Mother = x.VisitData.Visit.Mother,
                Infant = x.VisitData.Visit.Infant,
            }).ToList();

            foreach (var referral in basicReferrals)
            {
                var type = GetReferralType(referral.Comment, referral.IsPregnantMomVisit, referral.Question, referral.VisitName);

                yield return new PortalReferralModel()
                {
                    VisitId = referral.VisitId,
                    VisitDataStatusId = referral.VisitDataStatusId,
                    VisitBackReferralId = referral.BackReferral?.Id,
                    Type = type,
                    AdminBackReferralNote = referral.BackReferral?.AdminComment,
                    CompletedDate = referral.CompletedDate,
                    CreatedDate = referral.CreatedDate,
                    HealthCareWorkerId = referral.IsPregnantMomVisit ? referral.Mother.HealthCareWorkerId.Value : referral.Infant.Caregiver.HealthCareWorkerId.Value,
                    HealthCareWorker = referral.IsPregnantMomVisit 
                        ? $"{referral.Mother.HealthCareWorker.User.FirstName} {referral.Mother.HealthCareWorker.User.Surname}" 
                        : $"{referral.Infant.Caregiver.HealthCareWorker.User.FirstName} {referral.Infant.Caregiver.HealthCareWorker.User.Surname}",
                    Client = referral.IsPregnantMomVisit
                        ? $"{referral.Mother.User.FirstName} {referral.Mother.User.Surname}"
                        : $"{referral.Infant.User.FirstName} & {referral.Infant.Caregiver.FirstName} {referral.Infant.Caregiver.Surname}",
                    HealthCareWorkerBackReferralNote = referral.BackReferral?.Comment,
                    IsBackReferralCompleted = referral.BackReferralCompleted,
                    IsCompleted = referral.IsCompleted,
                    Text = referral.Comment
                };
            }
        }

        public List<PortalReferralsSummaryModel> GetReferralsSummary(
            Guid userId,
            List<Guid> clinicIds,
            DateTime startDate,
            DateTime endDate)
        {
            var referrals = GetReferrals(userId, clinicIds, startDate, endDate);

            var referralModels = new Dictionary<string, PortalReferralsSummaryModel>
            {
                { ReferralTypes.EarlyIdentificationOfPregnancy, new PortalReferralsSummaryModel { Type = ReferralTypes.EarlyIdentificationOfPregnancy, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.ChildSupportGrant, new PortalReferralsSummaryModel { Type = ReferralTypes.ChildSupportGrant, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.DevelopmentalDelays, new PortalReferralsSummaryModel { Type = ReferralTypes.DevelopmentalDelays, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.MaternalDistress, new PortalReferralsSummaryModel { Type = ReferralTypes.MaternalDistress, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.SeverlyUnderweight, new PortalReferralsSummaryModel { Type = ReferralTypes.SeverlyUnderweight, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.VitaminANotUpToDate, new PortalReferralsSummaryModel { Type = ReferralTypes.VitaminANotUpToDate, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.ClinicVisitsNotUpToDate, new PortalReferralsSummaryModel { Type = ReferralTypes.ClinicVisitsNotUpToDate, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.DangerSignsChildsMother, new PortalReferralsSummaryModel { Type = ReferralTypes.DangerSignsChildsMother, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.DangerSignsPregnantMom, new PortalReferralsSummaryModel { Type = ReferralTypes.DangerSignsPregnantMom, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.MaternalMalnutrition, new PortalReferralsSummaryModel { Type = ReferralTypes.MaternalMalnutrition, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.SubstanceAbuse, new PortalReferralsSummaryModel { Type = ReferralTypes.SubstanceAbuse, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.DangerSignsChild, new PortalReferralsSummaryModel { Type = ReferralTypes.DangerSignsChild, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.CaregiverIDBook, new PortalReferralsSummaryModel { Type = ReferralTypes.CaregiverIDBook, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.SevereAcuteMalnutrition, new PortalReferralsSummaryModel { Type = ReferralTypes.SevereAcuteMalnutrition, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.SeverlyStunted, new PortalReferralsSummaryModel { Type = ReferralTypes.SeverlyStunted, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.LowBirthWeight, new PortalReferralsSummaryModel { Type = ReferralTypes.LowBirthWeight, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.GrowthFaltering, new PortalReferralsSummaryModel { Type = ReferralTypes.GrowthFaltering, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.Underweight, new PortalReferralsSummaryModel { Type = ReferralTypes.Underweight, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.Overweight, new PortalReferralsSummaryModel { Type = ReferralTypes.Overweight, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.Obese, new PortalReferralsSummaryModel { Type = ReferralTypes.Obese, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.LowBirthLength, new PortalReferralsSummaryModel { Type = ReferralTypes.LowBirthLength, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.Stunted, new PortalReferralsSummaryModel { Type = ReferralTypes.Stunted, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.ModerateAcuteMalnutrition, new PortalReferralsSummaryModel { Type = ReferralTypes.ModerateAcuteMalnutrition, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.DewormingNotUpToDate, new PortalReferralsSummaryModel { Type = ReferralTypes.DewormingNotUpToDate, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.ImmunisationNotUpToDate, new PortalReferralsSummaryModel { Type = ReferralTypes.ImmunisationNotUpToDate, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },
                { ReferralTypes.ChildBirthCertificate, new PortalReferralsSummaryModel { Type = ReferralTypes.ChildBirthCertificate, BackReferralsMade = 0, ReferralsMade = 0, ReferralsRaised = 0 } },        
            };

            foreach (var referral in referrals)
            {
                if (referral.Type == "Unknown")
                {
                    continue;
                }

                referralModels[referral.Type].ReferralsRaised++;

                if (referral.IsCompleted)
                {
                    referralModels[referral.Type].ReferralsMade++;
                }

                if (referral.IsBackReferralCompleted)
                {
                    referralModels[referral.Type].BackReferralsMade++;
                }
            }

            return referralModels.Values.ToList();
        }

        private string GetReferralType(string comment, bool isPregnantMomVisit, string question, string visitName)
        {
            #region EarlyIdentificationOfPregnancy

            if (comment == GGSettings.pregnancy_not_booked)
            {
                return ReferralTypes.EarlyIdentificationOfPregnancy;
            }

            #endregion

            #region MaternalDistress

            if (comment.EndsWith(GGSettings.maternal_distress))
            {
                return ReferralTypes.MaternalDistress;
            }

            #endregion

            #region DangerSignsChildsMother

            if (!isPregnantMomVisit && question == GGSettings.q_danger_signs && visitName == GGSettings.cfm_name)
            {
                return ReferralTypes.DangerSignsChildsMother;
            }

            #endregion

            #region DangerSignsPregnantMom

            if (isPregnantMomVisit && question == GGSettings.q_danger_signs)
            {
                return ReferralTypes.DangerSignsPregnantMom;
            }

            #endregion

            #region MaternalMalnutrition

            if (comment == GGSettings.IndicatorMotherUnderweight)
            {
                return ReferralTypes.MaternalMalnutrition;
            }

            #endregion

            // Referral always saved on tolerance question, but should we include the other in the check in case?
            #region SubstanceAbuse

            if (question == GGSettings.QuestionAlcoholTolerance)
            {
                return ReferralTypes.SubstanceAbuse;
            }

            #endregion

            #region CaregiverIDBook

            if (comment.EndsWith(GGSettings.no_id_book))
            {
                return ReferralTypes.CaregiverIDBook;
            }

            #endregion

            // Child referrals

            #region ChildSupportGrant

            if (comment == GGSettings.has_csg3)
            {
                return ReferralTypes.ChildSupportGrant;
            }

            #endregion

            // Too many comparisons
            #region DevelopmentalDelays

            if (
                question == GGSettings.q_hearing1 ||
                question == GGSettings.q_hearing2 ||
                question == GGSettings.q_hearing3 ||
                question == GGSettings.q_hearing4 ||
                question == GGSettings.q_hearing5 ||
                question == GGSettings.q_hearing6 ||
                question == GGSettings.q_hearing7 ||
                question == GGSettings.q_hearing8 ||
                question == GGSettings.q_hearing9 ||
                question == GGSettings.q_seeing1 ||
                question == GGSettings.q_seeing2 ||
                question == GGSettings.q_seeing3 ||
                question == GGSettings.q_seeing4 ||
                question == GGSettings.q_seeing5 ||
                question == GGSettings.q_seeing6 ||
                question == GGSettings.q_seeing7 ||
                question == GGSettings.q_brain1 ||
                question == GGSettings.q_brain2 ||
                question == GGSettings.q_brain3 ||
                question == GGSettings.q_brain4 ||
                question == GGSettings.q_brain5 ||
                question == GGSettings.q_brain6 ||
                question == GGSettings.q_brain7 ||
                question == GGSettings.q_moving1 ||
                question == GGSettings.q_moving2 ||
                question == GGSettings.q_moving3 ||
                question == GGSettings.q_moving4 ||
                question == GGSettings.q_moving5 ||
                question == GGSettings.q_moving6 ||
                question == GGSettings.q_moving7)
            {
                return ReferralTypes.DevelopmentalDelays;
            }

            #endregion

            #region ClinicVisitsNotUpToDate

            if (comment == GGSettings.clinic_visits_not_up_to_date
                || comment == GGSettings.infant_missed_clinic_visit)
            {
                return ReferralTypes.ClinicVisitsNotUpToDate;
            }

            #endregion

            #region DangerSignsChild

            if (visitName != GGSettings.cfm_name
                && question == GGSettings.q_danger_signs)
            {
                return ReferralTypes.DangerSignsChildsMother;
            }

            #endregion

            #region LowBirthWeight

            if (question == GGSettings.QuestionWeight
                && comment.Contains(GGSettings.IndicatorLowBirthWeight))
            {
                return ReferralTypes.LowBirthWeight;
            }

            #endregion

            #region GrowthFaltering
            
            if (question == GGSettings.QuestionWeight
                && comment.Contains(GGSettings.IndicatorGrowthFaltering))
            {
                return ReferralTypes.GrowthFaltering;
            }

            #endregion

            #region SeverlyUnderweight

            if (question == GGSettings.QuestionWeight
                && comment.Contains(GGSettings.IndicatorSeverelyUnderweight))
            {
                return ReferralTypes.SeverlyUnderweight;
            }

            #endregion

            #region Underweight

            if (question == GGSettings.QuestionWeight
                    && comment.Contains(GGSettings.IndicatorUnderweight))
            {
                return ReferralTypes.Underweight;
            }

            #endregion

            #region Overweight

            if (question == GGSettings.QuestionWeight
                    && comment.Contains(GGSettings.IndicatorOverweight))
            {
                return ReferralTypes.Overweight;
            }

            #endregion

            #region Obese

            if (question == GGSettings.QuestionWeight
                    && comment.Contains(GGSettings.IndicatorObese))
            {
                return ReferralTypes.Obese;
            }

            #endregion

            #region SeverlyStunted

            if (question == GGSettings.QuestionWeight // Referral for measurement always saved on the weight question
                    && comment.Contains(GGSettings.IndicatorSeverelyStunted))
            {
                return ReferralTypes.SeverlyStunted;
            }

            #endregion

            // This referral still needs to be added
            #region LowBirthLength

            if (question == GGSettings.QuestionWeight // Referral for measurement always saved on the weight question
                    && comment.Contains(GGSettings.IndicatorLowBirthLength))
            {
                return ReferralTypes.LowBirthLength;
            }

            #endregion

            #region Stunted

            if (question == GGSettings.QuestionWeight // Referral for measurement always saved on the weight question
                    && comment.Contains(GGSettings.IndicatorStunted))
            {
                return ReferralTypes.Stunted;
            }

            #endregion

            #region SevereAcuteMalnutrition

            if (question == GGSettings.QuestionWeight // Referral for measurement always saved on the weight question
                    && comment.Contains(GGSettings.IndicatorSevereAcuteMalnutrition))
            {
                return ReferralTypes.SevereAcuteMalnutrition;
            }

            #endregion

            #region ModerateAcuteMalnutrition

            if (question == GGSettings.QuestionWeight // Referral for measurement always saved on the weight question
                    && comment.Contains(GGSettings.IndicatorModerateAcuteMalnutrition))
            {
                return ReferralTypes.ModerateAcuteMalnutrition;
            }

            #endregion

            #region VitaminANotUpToDate

            if (comment == GGSettings.VitaminANotUpToDate)
            {
                return ReferralTypes.VitaminANotUpToDate;
            }

            #endregion

            #region DewormingNotUpToDate

            if (comment == GGSettings.DewormingNotUpToDate)
            {
                return ReferralTypes.DewormingNotUpToDate;
            }

            #endregion

            #region ImmunisationNotUpToDate

            if (comment == GGSettings.DewormingNotUpToDate)
            {
                return ReferralTypes.ImmunisationNotUpToDate;
            }

            #endregion

            #region ChildBirthCertificate

            if (comment.EndsWith(GGSettings.no_birth_certificate))
            {
                return ReferralTypes.ChildBirthCertificate;
            }

            #endregion

            return "Unknown";
        }
    }
}
