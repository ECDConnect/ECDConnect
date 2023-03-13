using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users.GrowGreat
{
    public class InfantManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private HealthCareWorkerManager _healthCareWorkerManager;
        private VisitManager _visitManager;

        public InfantManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HealthCareWorkerManager healthCareWorkerManager,
            VisitManager visitManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _healthCareWorkerManager = healthCareWorkerManager;
            _visitManager = visitManager;
        }

        // GG BUSINESS RULES FOR CREATING A CHILD AND SELECTING AN EXISTING CAREGIVER

        // This existing caregiver is of type mother.
        // Then we populate MotherCaregiverId on the Infant table to indicate that the mom is linked to this child
        // If existing caregiver is not of type mother
        // Then we populate CaregiverId on the Infant table

        public Infant AddInfant(InfantModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var infantUser = GetUserFromInputModel(input);
            var infant = new Infant();

            // The caregiverId arriving here, could be a caregiver or mother from select box when adding an infant
            var caregiverRepo = _repoFactory.CreateGenericRepository<Caregiver>(userContext: applicationUserId);
            Caregiver caregiver = caregiverRepo.GetAll().Where(x => x.Id.Equals(input.CaregiverId)).FirstOrDefault();

            var motherRepo = _repoFactory.CreateGenericRepository<Mother>(userContext: applicationUserId);
            Mother mother = motherRepo.GetAll().Where(x => x.UserId.Equals(input.CaregiverId.ToString())).FirstOrDefault();

            // if both are null we create a new caregiver from request data
            if (caregiver == null && mother == null)
            {
                caregiver = GetCaregiverFromInput(input);

                infant = new Infant()
                {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = applicationUserId,
                    UserId = input.UserId,
                    User = infantUser,
                    CaregiverId = caregiver.Id,
                    Caregiver = caregiver,
                    GenderId = input.GenderId,
                    WeightAtBirth = input.WeightAtBirth,
                    LengthAtBirth = input.LengthAtBirth
                };
            }
            else
            {
                if (mother != null)
                {
                    infant = new Infant()
                    {
                        Id = Guid.NewGuid(),
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = applicationUserId,
                        UserId = input.UserId,
                        User = infantUser,
                        MotherCaregiverId = mother.Id,
                        Mother = mother,
                        GenderId = input.GenderId,
                        WeightAtBirth = input.WeightAtBirth,
                        LengthAtBirth = input.LengthAtBirth
                    };
                }
                else
                {
                    infant = new Infant()
                    {
                        Id = Guid.NewGuid(),
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = applicationUserId,
                        UserId = input.UserId,
                        User = infantUser,
                        CaregiverId = caregiver.Id,
                        Caregiver = caregiver,
                        GenderId = input.GenderId,
                        WeightAtBirth = input.WeightAtBirth,
                        LengthAtBirth = input.LengthAtBirth
                    };
                }
            }

            var infantRepo = _repoFactory.CreateGenericRepository<Infant>(userContext: applicationUserId);
            var createdInfant = infantRepo.Insert(infant);

            if (createdInfant != null)
            {
                AddVisits(infant.Id, infant.User.DateOfBirth);
            }

            return createdInfant;
        }

        public Infant UpdateInfant(string id, InfantModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var infantRepo = _repoFactory.CreateGenericRepository<Infant>(userContext: applicationUserId);
            var infantToUpdate = infantRepo.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).FirstOrDefault();
            var infantUser = GetUserFromInputModel(input);

            infantToUpdate.UpdatedDate = DateTime.Now;
            infantToUpdate.UpdatedBy = applicationUserId;
            infantToUpdate.UserId = input.UserId;
            infantToUpdate.User = infantUser;
            infantToUpdate.CaregiverId = input.CaregiverId;
            infantToUpdate.Caregiver = GetCaregiverFromInput(input);
            infantToUpdate.GenderId = input.GenderId;
            infantToUpdate.WeightAtBirth = input.WeightAtBirth;
            infantToUpdate.LengthAtBirth = input.LengthAtBirth;

            return infantRepo.Update(infantToUpdate);
        }

        private ApplicationUser GetUserFromInputModel(InfantModel input)
        {
            return new ApplicationUser()
            {
                Id = GetUserIdOrGenerateNew(input.UserId),
                FirstName = input.FirstName,
                DateOfBirth = input.DateOfBirth,
                EmailConfirmed = false,
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                IsSouthAfricanCitizen = false,
                VerifiedByHomeAffairs = false,
                IsActive = true,
                LastSeen = DateTime.Now,
            };

        }

        private string GetUserIdOrGenerateNew(string userId)
        {
            return userId ?? Guid.NewGuid().ToString();
        }

        private Caregiver GetCaregiverFromInput(InfantModel input)
        {
            var caregiverInput = input.Caregiver;
            if (caregiverInput == null)
            {
                return null;
            }

            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var addressRepo = _repoFactory.CreateGenericRepository<SiteAddress>(userContext: applicationUserId);
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var healthCareWorkerId = _healthCareWorkerManager.GetHealthCareWorkerIdByUserId(applicationUserId);
            if (healthCareWorkerId != null)
            {
                caregiverInput.HealthCareWorkerId = healthCareWorkerId;
            }
            SiteAddress siteAddress = addressRepo.GetAll().Where(x => x.Id.Equals(caregiverInput.SiteAddress.Id)).FirstOrDefault();
            if (siteAddress == null)
            {
                caregiverInput.SiteAddress.Id = Guid.NewGuid();
            }
            else
            {
                caregiverInput.SiteAddress = siteAddress;
            }

            // Populate province id with N/A option when site address is null
            if (caregiverInput.SiteAddressId == null)
            {
                var repository = _repoFactory.CreateGenericRepository<Province>(userContext: applicationUserId);
                var naProvince = repository.GetAll().Where(x => x.Description.Equals("N/A")).FirstOrDefault();
                caregiverInput.SiteAddress.ProvinceId = naProvince.Id;
            }

            return new Caregiver()
            {
                Id = GetCaregiverIdOrGenerateNew(input.CaregiverId),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId,
                JoinReferencePanel = false,
                Contribution = false,
                FirstName = caregiverInput.FirstName,
                Surname = caregiverInput.Surname,
                PhoneNumber = caregiverInput.PhoneNumber,
                RelationId = caregiverInput.RelationId,
                Age = caregiverInput.Age,
                WhatsAppNumber = caregiverInput.WhatsAppNumber,
                HealthCareWorkerId = caregiverInput.HealthCareWorkerId,
                SiteAddressId = caregiverInput.SiteAddressId,
                SiteAddress = caregiverInput.SiteAddress,
                TenantId = tenantId
            };

        }

        private Guid GetCaregiverIdOrGenerateNew(Guid? caregiverId)
        {
            return caregiverId ?? Guid.NewGuid();
        }

        public int GetChildCountForMother(Guid motherId)
        {
            var uId = _contextAccessor.HttpContext.GetUser().Id;
            var childRepo = _repoFactory.CreateGenericRepository<Infant>(userContext: uId);

            return childRepo.GetAll().Where(x => x.MotherCaregiverId.Equals(motherId)).Count();
        }

        public DisplaySet GetStatusInfo(Infant child, Boolean withinWeek)
        {
            DisplaySet statusInfo = new DisplaySet();
            statusInfo.Notes = Constants.GGSettings.client_child;

            //
            // Green or neutral Alerts
            //

            // Visit 2 due / booked 12 April: -show if the visit deadline is 7 days or further away(replace "Visit 2" with the name of the visit; this is relevant for both pregnant mom and child clients)
            // show "booked" if a visit has been scheduled in the calendar -> DEVELOPMENT PENDING 
            // don't show a visit date if the booked date has passed; or if the last possible day to conduct that visit has passed (see timing in G5 & G6) -> DEVELOPMENT PENDING 
            // Growing well:- for child clients only, show if the child's weight, length, and MUAC measurements are all in the normal range and the child's growth is NOT faltering (ie, growth has increased in the previous 2 visits) -> DEVELOPMENT PENDING 

            statusInfo.Color = MetricsIconEnum.Success.ToString();
            statusInfo.Icon = MetricsIconEnum.Success.ToString();
            statusInfo.Subject = "Growing well";

            // No color alert notification
            var nextVisitAfter7Days = _visitManager.GetNextVisitMoreThan7DaysAway(child.Id, Constants.GGSettings.client_child);
            if (nextVisitAfter7Days != "")
            {
                statusInfo.Icon = MetricsIconEnum.None.ToString();
                statusInfo.Color = MetricsColorEnum.None.ToString();
                statusInfo.Subject = nextVisitAfter7Days;
            }

            //
            // Orange Alerts
            //

            // Refer to the clinic:-show if any of these referral items are flagged for child client: Underweight, Growth faltering, Stunted, Obese, Overweight(see G3.8) -> DEVELOPMENT PENDING 
            // Refer to Home Affairs:-show if the referral item No CSG/ birth certificate is relevant --only if no birth certificate -> DEVELOPMENT PENDING
            // Refer to SASSA: -Show if client is eligible for CSG but has not applied(see G5.7.1 Child documentation) -> DEVELOPMENT PENDING
            // Visit 2 due 12 April:-show if the visit deadline is less than 7 days away(replace "Visit 2" with the name of the visit; this is relevant for both pregnant mom and child clients)
            // Icon and Color -> MetricsIconEnum.Warning.ToString()

            /*if (child.WeightAtBirth == null)
            {
                statusInfo.Color = MetricsIconEnum.Warning.ToString();
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Subject = "Low birth weight";
            }
            if (child.LengthAtBirth == null)
            {
                statusInfo.Color = MetricsIconEnum.Warning.ToString();
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Subject = "Growth faltering";
            }*/

            var nextVisitWithin7Days = _visitManager.GetNextVisitLessThan7DaysAway(child.Id, Constants.GGSettings.client_child, withinWeek);
            if (nextVisitWithin7Days != "")
            {
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Color = MetricsColorEnum.Warning.ToString();
                statusInfo.Subject = nextVisitWithin7Days;
            }

            //
            // Red Alerts
            //
            // Refer to the clinic urgently: -show if there any red items as flagged on G3.8 -> DEVELOPMENT PENDING
            // Icon and Color -> MetricsIconEnum.Error.ToString()

            return statusInfo;
        }

        private void AddVisits(Guid infantId, DateTime BirthDate)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var _type = "child";

            // Get all visit types linked to child excluding additional_visits
            List<VisitType> visitTypes = visitTypeRepo.GetAll().Where(x => x.Type.Equals(_type) && x.Name != Constants.GGSettings.additional_visits).OrderBy(x => x.Order).ToList();

            // Get dates for each visit
            List<VisitModel> visits = GetVisitDates(BirthDate, visitTypes);

            if (visits.Count > 0)
            {   // Add visits for child
                foreach (var visit in visits)
                {
                    visit.InfantId = infantId;
                    visit.Risk = "normal";
                    visit.MotherId = null;
                    visit.Attended = false;
                    _visitManager.AddVisit(visit);
                }
            }
        }

        private List<VisitModel> GetVisitDates(DateTime BirthDate, List<VisitType> visitTypes) 
        {
            var dateList = new List<VisitModel>();

            // Due dates are created normally 1 day before the actual planned visit date

            for (var i=0; i < visitTypes.Count; i++)
            {
                var visitDaySet = new VisitModel();
                visitDaySet.VisitType = visitTypes[i];

                if (visitTypes[i].Name == "day_3")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddDays(2);
                } 
                else if (visitTypes[i].Name == "day_7")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddDays(6);
                } 
                else if (visitTypes[i].Name == "week_2")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddDays(13);
                }
                else if (visitTypes[i].Name == "week_4")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddDays(27);
                }
                else if (visitTypes[i].Name == "week_7_to_8")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddDays(48);
                }
                else if (visitTypes[i].Name == "3_months")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(3);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == "4_months")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(4);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == "5_months")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(5);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == "6_months")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(6);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == "9_months")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(9);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == "12_months")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(12);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == "15_months")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(15);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == "18_months")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(18);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == "21_months")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(21);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == "24_months")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(24);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == "5_years")
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddYears(5);
                }
                dateList.Add(visitDaySet);
            }
            return dateList;
        }

        public Guid? GetInfantIdByUserId(string userId)
        {
            var uId = _contextAccessor.HttpContext.GetUser().Id;
            var repo = _repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            var infant = repo.GetAll().Where(x => x.UserId == userId).FirstOrDefault();
            if (infant != null)
            {
                return infant.Id;
            }
            return null;
        }

        public DateTime? GetClientsNextVisitDate(Guid infantId)
        {
            return _visitManager.GetClientsNextVisitDate(infantId, Constants.GGSettings.client_child);
        }

    }
}