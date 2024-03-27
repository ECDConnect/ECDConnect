using ECDLink.Abstractrions.Constants;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users.GrowGreat
{
    public class InfantManager : BaseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private HealthCareWorkerManager _healthCareWorkerManager;
        private VisitManager _visitManager;
        private VisitDataManager _visitDataManager;
        private VisitDataStatusManager _visitDataStatusManager;
        private IGrowGreatPointsCalculationsService _pointsCalculationService;
        private INotificationService _notificationService;

        private Guid? _applicationUserId;
        private IGenericRepository<Infant, Guid> _infantRepo;
        private IGenericRepository<SiteAddress, Guid> _addressRepo;
        private IGenericRepository<Province, Guid> _provinceRepo;
        private IGenericRepository<VisitType, Guid> _visitTypeRepo;
        private IGenericRepository<Caregiver, Guid> _caregiverRepo;
        private IGenericRepository<Mother, Guid> _motherRepo;

        private ApplicationUserManager _userManager;

        public InfantManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HealthCareWorkerManager healthCareWorkerManager,
            VisitManager visitManager,
            VisitDataStatusManager visitDataStatusManager,
            VisitDataManager visitDataManager,
            [Service] IGrowGreatPointsCalculationsService pointsCalculationService,
            [Service] INotificationService notificationService,
            [Service] ApplicationUserManager userManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _healthCareWorkerManager = healthCareWorkerManager;
            _visitManager = visitManager;
            _visitDataStatusManager = visitDataStatusManager;
            _visitDataManager = visitDataManager;
            _pointsCalculationService = pointsCalculationService;
            _notificationService = notificationService;
            _userManager = userManager;

            _applicationUserId = _contextAccessor.HttpContext.GetUser()?.Id;
            _infantRepo = _repoFactory.CreateGenericRepository<Infant>(userContext: _applicationUserId);
            _caregiverRepo = _repoFactory.CreateGenericRepository<Caregiver>(userContext: _applicationUserId);
            _motherRepo = _repoFactory.CreateGenericRepository<Mother>(userContext: _applicationUserId);
            _addressRepo = _repoFactory.CreateGenericRepository<SiteAddress>(userContext: _applicationUserId);
            _provinceRepo = _repoFactory.CreateGenericRepository<Province>(userContext: _applicationUserId);
            _visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: _applicationUserId);
        }

        // GG BUSINESS RULES FOR CREATING A CHILD AND SELECTING AN EXISTING CAREGIVER

        // Scenario 1: This existing caregiver is of type mother.
        // Then we populate MotherCaregiverId on the Infant table to indicate that the mom is linked to this child
        // Scenario 2: If existing caregiver is not of type mother
        // Then we populate CaregiverId on the Infant table

        public Infant AddInfant(InfantModel input)
        {
            var infantUser = GetUserFromInputModel(input);
            var infant = new Infant();

            // EC-797 - if this infant is not the first client, we set the tab values to true;
            int totalClients = _motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId == _applicationUserId && (x.ClickedVisitTab == true || x.ClickedProgressTab == true || x.ClickedReferralsTab == true || x.ClickedContactTab == true)).Count()
                            + _infantRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId == _applicationUserId && (x.ClickedVisitTab == true || x.ClickedProgressTab == true || x.ClickedReferralsTab == true || x.ClickedContactTab == true)).Count();

            int totalActiveClieants = _motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId == _applicationUserId && (x.IsActive == true)).Count()
                            + _infantRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId == _applicationUserId && (x.IsActive == true)).Count();
                

            // Either load the caregiver or map from input
            var caregiver = input.CaregiverId.HasValue ? _caregiverRepo.GetById(input.CaregiverId.Value) : null;
            var mother = _motherRepo.GetAll().Where(x => x.UserId == input.CaregiverId).OrderBy(x => x.Id).FirstOrDefault();

            // if both are null we create a new caregiver from request data
            if (caregiver == null && mother == null)
            {
                caregiver = GetCaregiverFromInput(input);

                infant = new Infant()
                {
                    Id = infantUser.Id,
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = _applicationUserId.ToStringOrNull(),
                    UserId = infantUser.Id,
                    User = infantUser,
                    CaregiverId = caregiver.Id,
                    Caregiver = caregiver,
                    GenderId = input.GenderId,
                    WeightAtBirth = input.WeightAtBirth,
                    LengthAtBirth = input.LengthAtBirth,
                    Completed24MonthVisits = false,
                    ClickedVisitTab = totalClients != 0,
                    ClickedProgressTab = totalClients != 0,
                    ClickedReferralsTab = totalClients != 0,
                    ClickedContactTab = totalClients != 0
                };
            }
            else
            {
                if (mother != null)
                {
                    infant = new Infant()
                    {
                        Id = infantUser.Id,
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _applicationUserId.ToStringOrNull(),
                        UserId = infantUser.Id,
                        User = infantUser,
                        MotherCaregiverId = mother.Id,
                        Mother = mother,
                        GenderId = input.GenderId,
                        WeightAtBirth = input.WeightAtBirth,
                        LengthAtBirth = input.LengthAtBirth,
                        Completed24MonthVisits = false,
                        ClickedVisitTab = totalClients != 0,
                        ClickedProgressTab = totalClients != 0,
                        ClickedReferralsTab = totalClients != 0,
                        ClickedContactTab = totalClients != 0
                    };
                }
                else
                {
                    infant = new Infant()
                    {
                        Id = infantUser.Id,
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _applicationUserId.ToStringOrNull(),
                        UserId = infantUser.Id,
                        User = infantUser,
                        CaregiverId = caregiver.Id,
                        Caregiver = caregiver,
                        GenderId = input.GenderId,
                        WeightAtBirth = input.WeightAtBirth,
                        LengthAtBirth = input.LengthAtBirth,
                        Completed24MonthVisits = false,
                        ClickedVisitTab = totalClients != 0,
                        ClickedProgressTab = totalClients != 0,
                        ClickedReferralsTab = totalClients != 0,
                        ClickedContactTab = totalClients != 0
                    };
                }
            }

            var createdInfant = _infantRepo.Insert(infant);

            if (createdInfant != null)
            {
                AddVisits(infant.Id, infant.User.DateOfBirth);
                _pointsCalculationService.CalculateInfantClientRegistration(_applicationUserId.Value);
            }

            if (totalActiveClieants == 0) {
                List<TagsReplacements> replacements = new List<TagsReplacements>();
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "infantId",
                    ReplacementValue = infant.UserId.ToString(),
                });

               var userToSend = _userManager.FindByIdAsync(_applicationUserId).Result;
               _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGWalkthroughNotificationInfant, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements);   
            }

            return createdInfant;
        }
        public Infant UpdateInfant(Guid id, InfantModel input)
        {
            var infantToUpdate = _infantRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();

            var infantUser = infantToUpdate.User;
            infantUser.DateOfBirth = (DateTime)input.DateOfBirth;

            infantToUpdate.UpdatedDate = DateTime.Now;
            infantToUpdate.UpdatedBy = _applicationUserId.ToStringOrNull();
            infantToUpdate.UserId = infantUser.Id;
            infantToUpdate.User = infantUser;
            infantToUpdate.Completed24MonthVisits = input.Completed24MonthVisits == null ? false : input.Completed24MonthVisits;
            infantToUpdate.ClickedVisitTab = input.ClickedVisitTab == null ? false : input.ClickedVisitTab;
            infantToUpdate.ClickedProgressTab = input.ClickedProgressTab == null ? false : input.ClickedProgressTab;
            infantToUpdate.ClickedReferralsTab = input.ClickedReferralsTab == null ? false : input.ClickedReferralsTab;
            infantToUpdate.ClickedContactTab = input.ClickedContactTab == null ? false : input.ClickedContactTab;
            if (input.WeightAtBirth != null)
            {
                infantToUpdate.WeightAtBirth = input.WeightAtBirth;
            }
            if (input.LengthAtBirth != null)
            {
                infantToUpdate.LengthAtBirth = input.LengthAtBirth;
            }
            return _infantRepo.Update(infantToUpdate);
        }

        public Infant UpdateInfantCaregiverContactDetails(Guid id, InfantModel input)
        {
            var entityToUpdate = _caregiverRepo.GetAll().Where(x => x.Id == input.CaregiverId).FirstOrDefault();

            entityToUpdate.UpdatedBy = _applicationUserId.ToStringOrNull();
            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.WhatsAppNumber = input.Caregiver.WhatsAppNumber;
            entityToUpdate.PhoneNumber = input.Caregiver.PhoneNumber;

            _caregiverRepo.Update(entityToUpdate);
            return _infantRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();
        }

        public Boolean UpdateInfantCaregiverToMother(Guid infantId, Guid motherId)
        {
            // Called from add mother in mother manager.
            // Business Rule scenario 1 at the top of this file is enforced
            var infantToUpdate = _infantRepo.GetAll().Where(x => x.User.Id == infantId).FirstOrDefault();
            infantToUpdate.MotherCaregiverId = motherId;
            infantToUpdate.CaregiverId = null;
            infantToUpdate.UpdatedDate = DateTime.Now;
            infantToUpdate.UpdatedBy = _applicationUserId.ToStringOrNull();
            _infantRepo.Update(infantToUpdate);
            return true;
        }

        public Infant UpdateInfantCaregiverAddress(Guid id, InfantModel input)
        {
            var entityToUpdate = _addressRepo.GetAll().Where(x => x.Id == input.Caregiver.SiteAddress.Id).FirstOrDefault();

            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId.ToStringOrNull();
            entityToUpdate.AddressLine1 = input.Caregiver.SiteAddress.AddressLine1;
            _addressRepo.Update(entityToUpdate);

            return _infantRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();
        }

        public Infant UpdateInfantCaregiver(Guid infantId, InfantModel input)
        {
            // The caregiverId arriving here, could be a caregiver or mother from select box when adding an infant
            Caregiver caregiver = _caregiverRepo.GetAll().Where(x => x.Id == input.CaregiverId).OrderBy(x => x.Id).FirstOrDefault();
            Mother mother = _motherRepo.GetAll().Where(x => x.UserId == input.CaregiverId).OrderBy(x => x.Id).FirstOrDefault();

            var infantToUpdate = _infantRepo.GetAll().Where(x => x.User.Id == infantId).FirstOrDefault();
            infantToUpdate.UpdatedDate = DateTime.Now;
            infantToUpdate.UpdatedBy = _applicationUserId.ToStringOrNull();

            if (mother == null && caregiver == null)
            {
                caregiver = GetCaregiverFromInput(input);
                caregiver = _caregiverRepo.Insert(caregiver);

                infantToUpdate.MotherCaregiverId = null;
                infantToUpdate.CaregiverId = caregiver.Id;
                infantToUpdate.Caregiver = caregiver;
            }
            else
            {
                if (mother != null)
                {
                    infantToUpdate.MotherCaregiverId = input.CaregiverId;
                    infantToUpdate.CaregiverId = null;
                    infantToUpdate.MotherCaregiverId = mother.Id;
                    infantToUpdate.Mother = mother;
                }
                else
                {
                    infantToUpdate.MotherCaregiverId = null;
                    infantToUpdate.CaregiverId = caregiver.Id;
                    infantToUpdate.Caregiver = caregiver;
                }
            }

            return _infantRepo.Update(infantToUpdate);
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
                IsImported = false
            };

        }
        private Guid GetUserIdOrGenerateNew(string userId)
        {
            return string.IsNullOrEmpty(userId) ? Guid.NewGuid() : Guid.Parse(userId);
        }
        private Caregiver GetCaregiverFromInput(InfantModel input)
        {
            var caregiverInput = input.Caregiver;
            if (caregiverInput == null)
            {
                return null;
            }

            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var healthCareWorkerId = _healthCareWorkerManager.GetHealthCareWorkerIdByUserId(_applicationUserId.ToStringOrNull());
            if (healthCareWorkerId != null)
            {
                caregiverInput.HealthCareWorkerId = healthCareWorkerId;
            }
            SiteAddress siteAddress = _addressRepo.GetById(caregiverInput.SiteAddress.Id);
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
                var naProvince = _provinceRepo.GetAll().Where(x => x.Description.Equals("N/A")).OrderBy(x => x.Id).FirstOrDefault();
                caregiverInput.SiteAddress.ProvinceId = naProvince.Id;
            }

            return new Caregiver()
            {
                Id = GetCaregiverIdOrGenerateNew(input.CaregiverId),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToStringOrNull(),
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
            return _infantRepo.GetAll().Where(x => x.MotherCaregiverId == motherId).Count();
        }
        public DisplaySet GetStatusInfo(Infant child, Boolean withinWeek)
        {
            DisplaySet statusInfo = new DisplaySet();
            statusInfo.Notes = Constants.GGSettings.client_child;
            DateTime today = DateTime.Today;
            var totalMonths = ((today.Year - child.InsertedDate.Year) * 12) + today.Month - child.InsertedDate.Month;

            //
            // Green or neutral Alerts
            //


            // show "booked" if a visit has been scheduled in the calendar -> DEVELOPMENT PENDING 
            // don't show a visit date if the booked date has passed; or if the last possible day to conduct that visit has passed (see timing in G5 & G6) -> DEVELOPMENT PENDING 

            // Growing well:- for child clients only, show if the child's weight, length, and MUAC measurements are all in the normal range and the child's growth is NOT faltering (ie, growth has increased in the previous 2 visits) 
            var green_growthStatus = _visitDataStatusManager.GetGrowthStatusForInfant(child.Id.ToString(), child.User.FirstName, MetricsIconEnum.Success.ToString());
            if (green_growthStatus != "")
            {
                statusInfo.Color = MetricsIconEnum.Success.ToString();
                statusInfo.Icon = MetricsIconEnum.Success.ToString();
                statusInfo.Subject = "Growing well";
            }

            // Visit 2 due / booked 12 April: -show if the visit deadline is 7 days or further away(replace "Visit 2" with the name of the visit; this is relevant for both pregnant mom and child clients)
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

            // Refer to the clinic:-show if any of these referral items are flagged for child client: Underweight, Growth faltering, Stunted, Obese, Overweight(see G3.8)
            var amber_growthStatus = _visitDataStatusManager.GetGrowthStatusForInfant(child.Id.ToString(), child.User.FirstName, MetricsIconEnum.Warning.ToString());
            if (amber_growthStatus != "")
            {
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Color = MetricsColorEnum.Warning.ToString();
                statusInfo.Subject = Constants.GGSettings.refer_to_clinic;
            }

            // Refer to Home Affairs:-show if the referral item No CSG/ birth certificate is relevant --only if no birth certificate
            var amber_birthCertificateStatus = _visitDataManager.GetIDDocCSGStatusForInfant(child.Id.ToString());
            if (amber_birthCertificateStatus != "")
            {
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Color = MetricsColorEnum.Warning.ToString();
                statusInfo.Subject = Constants.GGSettings.home_affairs_referrals;
            }

            // Refer to SASSA: -Show if client is eligible for CSG but has not applied(see G5.7.1 Child documentation) 
            var amber_CSGStatus = _visitDataManager.GetCSGStatusForInfant(child.Id.ToString());
            if (amber_CSGStatus != "")
            {
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Color = MetricsColorEnum.Warning.ToString();
                statusInfo.Subject = Constants.GGSettings.sassa_refferals;
            }

            // Visit 2 due 12 April:-show if the visit deadline is less than 7 days away(replace "Visit 2" with the name of the visit; this is relevant for both pregnant mom and child clients)
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
            // Refer to the clinic urgently: -show if there any red items as flagged on G3.8
            var redAlerts = _visitDataStatusManager.GetRedAlertsForUser(child.Id.ToString(), Constants.GGSettings.client_child);
            if (redAlerts != "")
            {
                statusInfo.Icon = MetricsIconEnum.Error.ToString();
                statusInfo.Color = MetricsColorEnum.Error.ToString();
                statusInfo.Subject = redAlerts;
            }

            // if client registered within the past 3 months AND none of the higher-priority flags are raised
            // (ie none of the all of the flags above - green.amber.red - are raised-- this should only happen if no visit has happened yet.)
            if (totalMonths <= 3)
            {
                var lastVisit = _visitManager.GetLastCompletedVisitId(child.Id.ToString(), Constants.GGSettings.client_child);

                if (lastVisit == Guid.Empty)
                {
                    if (child.WeightAtBirth != null && (double)child.WeightAtBirth < 2.5)
                    {
                        statusInfo.Color = MetricsIconEnum.Warning.ToString();
                        statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                        statusInfo.Subject = Constants.GGSettings.low_birth_weight;
                    }
                    else
                    {
                        statusInfo.Color = MetricsIconEnum.Success.ToString();
                        statusInfo.Icon = MetricsIconEnum.Success.ToString();
                        statusInfo.Subject = Constants.GGSettings.client_new;
                    }
                }
            }

            return statusInfo;
        }
        private void AddVisits(Guid infantId, DateTime BirthDate)
        {
            // Get all visit types linked to child excluding additional_visits
            List<VisitType> visitTypes = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_child) && x.Name != Constants.GGSettings.VisitTypeAdditionalVisit).OrderBy(x => x.Order).ToList();

            // Get dates for each visit
            List<VisitModel> visits = GetVisitDates(BirthDate.Date.AddDays(1), visitTypes);

            if (visits.Count > 0)
            {   // Add visits for child
                foreach (var visit in visits)
                {
                    visit.InfantId = infantId;
                    visit.Risk = Constants.GGSettings.normal_risk;
                    visit.MotherId = null;
                    visit.Attended = false;
                    _visitManager.AddVisit(visit);
                }

                UpdateDueDates(infantId);
            }
        }

        public Boolean UpdateDueDates(Guid infantId)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            List<Visit> visitList = visitRepo.GetAll().Where(x => x.InfantId == infantId).OrderBy(x => x.PlannedVisitDate).ToList();

            foreach (var _visit in visitList)
            {
                if (_visit.VisitType.Name == Constants.GGSettings.day_3)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.day_7).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.day_7)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.week_2).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.week_2)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.week_4).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.week_4)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeWeekSevenToEight).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeWeekSevenToEight)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeThreeMonths).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeThreeMonths)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeFourMonths).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeFourMonths)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeFiveMonths).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeFiveMonths)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeSixMonths).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeSixMonths)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeNineMonths).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeNineMonths)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeTwelveMonths).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeTwelveMonths)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeFifteenMonths).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeFifteenMonths)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeEighteenMonths).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeEighteenMonths)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeTwentyOneMonths).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeTwentyOneMonths)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeTwentyFourMonths).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeTwentyFourMonths)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeYearFive).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.VisitTypeYearFive)
                {
                    _visit.DueDate = (_visit.PlannedVisitDate != default(DateTime) ? _visit?.PlannedVisitDate.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
            }
            return true;
        }

        private List<VisitModel> GetVisitDates(DateTime BirthDate, List<VisitType> visitTypes)
        {
            var dateList = new List<VisitModel>();

            // Due dates are created normally 1 day before the actual planned visit date

            for (var i = 0; i < visitTypes.Count; i++)
            {
                var visitDaySet = new VisitModel();
                visitDaySet.VisitType = visitTypes[i];

                if (visitTypes[i].Name == Constants.GGSettings.day_3)
                {
                    visitDaySet.PlannedVisitDate = BirthDate;
                }
                else if (visitTypes[i].Name == Constants.GGSettings.day_7)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddDays(6);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.week_2)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddDays(13);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.week_4)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddDays(27);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeWeekSevenToEight)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddDays(48);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeThreeMonths)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(3);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeFourMonths)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(4);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeFiveMonths)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(5);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeSixMonths)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(6);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeNineMonths)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(9);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeTwelveMonths)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(12);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeFifteenMonths)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(15);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeEighteenMonths)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(18);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeTwentyOneMonths)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(21);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeTwentyFourMonths)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddMonths(24);
                    visitDaySet.PlannedVisitDate = visitDaySet.PlannedVisitDate.AddDays(-1);
                }
                else if (visitTypes[i].Name == Constants.GGSettings.VisitTypeYearFive)
                {
                    visitDaySet.PlannedVisitDate = BirthDate.AddYears(5);
                }
                dateList.Add(visitDaySet);
            }
            return dateList;
        }
        public Guid? GetInfantIdByUserId(Guid userId)
        {
            var infant = _infantRepo.GetAll().Where(x => x.UserId == userId).OrderBy(x => x.Id).FirstOrDefault();
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
        public int GetTotalNewInfantsForWeek(Guid id, Boolean currentWeek)
        {
            DateTime today = DateTime.Today;
            var monday = StartOfWeek(today, DayOfWeek.Monday);
            var next7Days = monday.AddDays(6);

            if (!currentWeek)
            {
                int days = DateTime.Now.DayOfWeek - DayOfWeek.Sunday;
                DateTime pastDate = DateTime.Now.AddDays(-days);
                monday = StartOfWeek(pastDate, DayOfWeek.Monday);
                next7Days = monday.AddDays(6);
            }

            return _infantRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId == id && x.IsActive.Equals(true) && x.InsertedDate >= monday && x.InsertedDate <= next7Days).Select(x => x.Id).Distinct().Count();
        }

        public int GetTotalInfantCountForPeriod(Guid healthCareWorkerUserId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var infants = _infantRepo.GetAll().Where(
                i => i.Caregiver.HealthCareWorker.UserId == healthCareWorkerUserId
                    && i.IsActive == true);

            if (startDate is not null)
                infants = infants.Where(x => x.InsertedDate >= startDate);

            if (endDate is not null)
                infants = infants.Where(x => x.InsertedDate <= endDate);

            return infants.Select(x => x.Id)
                .Distinct()
                .Count();
        }
        
        public List<Infant> GetAllInfantsForCaregiver(Guid caregiverId)
        {
            List<Infant> infants = _infantRepo.GetAll().Where(x => x.CaregiverId == caregiverId && x.IsActive == true).OrderBy(y => y.User.FirstName).ToList();
            foreach (var infant in infants)
            {
                infant.StatusInfo = GetStatusInfo(infant, true);
                infant.NextVisitDate = GetClientsNextVisitDate(infant.Id);
            }

            return infants;
        }
    }
}