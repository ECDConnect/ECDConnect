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
        private IGenericRepository<VisitDataStatusReferralType, Guid> _referralTypeRepo;

        public ReferralService(
            [Service] IHttpContextAccessor contextAccessor,
            ApplicationUserManager userManager,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            _userManager = userManager;

            _visitDataStatusRepo = repoFactory.CreateRepository<VisitDataStatus>(userContext: uId);
            _referralTypeRepo = repoFactory.CreateRepository<VisitDataStatusReferralType>(userContext: uId);
        }

        public IEnumerable<PortalReferralModel> GetReferrals(
            Guid userId,
            List<Guid> clinicIds,
            DateTime startDate,
            DateTime endDate)
        {
            var currentUser = _userManager.FindByIdAsync(userId).Result;
            var isTeamLead = _userManager.IsInRoleAsync(currentUser, RolesGG.TEAM_LEAD).Result;

            var referrals = _referralTypeRepo.GetAll();
               

            if (clinicIds != null && clinicIds.Any())
            {
                // Filter by CHWs at given clinics
                referrals = referrals.Where(x =>
                    (x.VisitDataStatus.VisitData.Visit.MotherId.HasValue && x.VisitDataStatus.VisitData.Visit.Mother.HealthCareWorker.ClinicId.HasValue && clinicIds.Contains(x.VisitDataStatus.VisitData.Visit.Mother.HealthCareWorker.ClinicId.Value)
                    || x.VisitDataStatus.VisitData.Visit.InfantId.HasValue && x.VisitDataStatus.VisitData.Visit.Infant.Caregiver.HealthCareWorker.ClinicId.HasValue && clinicIds.Contains(x.VisitDataStatus.VisitData.Visit.Infant.Caregiver.HealthCareWorker.ClinicId.Value)));
            }
            else if (isTeamLead)
            {
                // Filter to just the team leads CHWs
                referrals = referrals.Where(x =>
                   (x.VisitDataStatus.VisitData.Visit.MotherId.HasValue && x.VisitDataStatus.VisitData.Visit.Mother.HealthCareWorker.ClinicId.HasValue && x.VisitDataStatus.VisitData.Visit.Mother.HealthCareWorker.Clinic.TeamLeads.Any(y => y.TeamLead.UserId == userId))
                   || x.VisitDataStatus.VisitData.Visit.InfantId.HasValue && x.VisitDataStatus.VisitData.Visit.Infant.Caregiver.HealthCareWorker.ClinicId.HasValue && x.VisitDataStatus.VisitData.Visit.Infant.Caregiver.HealthCareWorker.Clinic.TeamLeads.Any(y => y.TeamLead.UserId == userId));
            }

            var basicReferrals = referrals.Select(x => new
            {
                VisitDataStatusId = x.VisitDataStatusId,
                Type = x.ReferralType.Name,
                IsPregnantMomVisit = x.VisitDataStatus.VisitData.Visit.MotherId.HasValue,
                //x.VisitData.VisitName,
                x.VisitDataStatus.VisitData.VisitId,
                x.VisitDataStatus.Comment,
                x.VisitDataStatus.IsCompleted,
                x.VisitDataStatus.BackReferralCompleted,
                x.VisitDataStatus.BackReferralAdminComment,
                BackReferral = x.VisitDataStatus.BackReferral,
                CompletedDate = x.VisitDataStatus.ReferralDateCompleted,
                CreatedDate = x.InsertedDate,
                Mother = x.VisitDataStatus.VisitData.Visit.Mother,
                Infant = x.VisitDataStatus.VisitData.Visit.Infant,
            }).ToList();

            foreach (var referral in basicReferrals)
            {
                yield return new PortalReferralModel()
                {
                    VisitId = referral.VisitId,
                    VisitDataStatusId = referral.VisitDataStatusId,
                    VisitBackReferralId = referral.BackReferral?.Id,
                    Type = referral.Type,
                    AdminBackReferralNote = referral.BackReferralAdminComment,
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
    }
}
