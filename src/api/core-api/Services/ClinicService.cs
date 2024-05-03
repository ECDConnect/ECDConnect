using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.Abstractrions.Constants;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Clinics;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services
{
    public class ClinicService : IClinicService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private readonly IGenericRepository<District, Guid> _districtRepo;
        private readonly IGenericRepository<SubDistrict, Guid> _subDistrictRepo;
        private readonly IGenericRepository<Clinic, Guid> _clinicRepo;
        private readonly IGenericRepository<ClinicMeeting, Guid> _clinicMeetingRepo;
        private readonly IGenericRepository<ClinicMeetingParticipantOptedOut, Guid> _clinicMeetingCHWsOptedOutRepo;
        private readonly IGenericRepository<ClinicMeetingParticipantInField, Guid> _clinicMeetingCHWsInFieldRepo;
        private readonly IGenericRepository<ClinicTeamLead, Guid> _clinicTeamRepo;
        private readonly IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;
        private readonly IGenericRepository<Infant, Guid> _infantRepo;
        private readonly IGenericRepository<VisitData, Guid> _visitDataRepo;
        private readonly IGenericRepository<BreastFeedingClub, Guid> _breastFeedingClubRepo;
        private readonly IGenericRepository<Caregiver, Guid> _caregiverRepo;
        private readonly IGenericRepository<TeamLead, Guid> _teamLeadRepo;
        private readonly IGenericRepository<MessageLog, Guid> _messageRepo;

        private readonly Guid? _applicationUserId;

        private readonly IPointsEngineService _pointsEngineService;
        private readonly INotificationService _notificationService;
        private readonly ContentManagementRepository _contentRepo;

        public ClinicService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            [Service] IPointsEngineService pointsEngineService,
            [Service] INotificationService notificationService,
            [Service] ContentManagementRepository contentRepo,
            HierarchyEngine hierarchyEngine
            )
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _applicationUserId = _contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _districtRepo = _repositoryFactory.CreateGenericRepository<District>(userContext: _applicationUserId);
            _subDistrictRepo = _repositoryFactory.CreateGenericRepository<SubDistrict>(userContext: _applicationUserId);
            _clinicRepo = _repositoryFactory.CreateGenericRepository<Clinic>(userContext: _applicationUserId);
            _clinicTeamRepo = _repositoryFactory.CreateGenericRepository<ClinicTeamLead>(userContext: _applicationUserId);
            _healthCareWorkerRepo = _repositoryFactory.CreateGenericRepository<HealthCareWorker>(userContext: _applicationUserId);
            _infantRepo = _repositoryFactory.CreateGenericRepository<Infant>(userContext: _applicationUserId);
            _visitDataRepo = _repositoryFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            _breastFeedingClubRepo = _repositoryFactory.CreateGenericRepository<BreastFeedingClub>(userContext: _applicationUserId);
            _caregiverRepo = _repositoryFactory.CreateGenericRepository<Caregiver>(userContext: _applicationUserId);
            _clinicMeetingRepo = _repositoryFactory.CreateGenericRepository<ClinicMeeting>(userContext: _applicationUserId);
            _clinicMeetingCHWsOptedOutRepo = _repositoryFactory.CreateGenericRepository<ClinicMeetingParticipantOptedOut>(userContext: _applicationUserId);
            _clinicMeetingCHWsInFieldRepo = _repositoryFactory.CreateGenericRepository<ClinicMeetingParticipantInField>(userContext: _applicationUserId);
            _teamLeadRepo = _repositoryFactory.CreateGenericRepository<TeamLead>(userContext: _applicationUserId);
            _messageRepo = _repositoryFactory.CreateGenericRepository<MessageLog>(userContext: _applicationUserId);

            _pointsEngineService = pointsEngineService;
            _notificationService = notificationService;
            _contentRepo = contentRepo;

        }

        #region District

        public List<DistrictStatsModel> GetDistrictsAndStats()
        {
            var districtRecords = _districtRepo.GetAll().Include(x => x.SubDistricts.Where(x => x.IsActive)).Where(x => x.IsActive).ToList();
            var clinics = _clinicRepo.GetAll().Where(x => x.IsActive && x.SubDistrictId.HasValue).ToList();
            var clinicTeamLeads = _clinicTeamRepo.GetAll().Where(x => x.IsActive).ToList();
            var hCWs = _healthCareWorkerRepo.GetAll().Where(x => x.IsActive && x.ClinicId.HasValue).ToList();

            List<DistrictStatsModel> districts = new List<DistrictStatsModel>();
            foreach (var district in districtRecords)
            {
                districts.Add(new DistrictStatsModel()
                {
                    Id = district.Id,
                    Name = district.Name,
                    InsertedDate = district.InsertedDate,
                    Province = district.Province,
                    SubDistricts = district.SubDistricts.Where(x => x.IsActive).ToList(),
                    TotalSubDistricts = district.SubDistricts.Where(x => x.IsActive).Count(),
                    TotalClinics = clinics.Where(x => x.SubDistrictId == district.Id).Distinct().Count(),
                    TotalTeamLeads = clinicTeamLeads.Where(x => x.Clinic.SubDistrictId == district.Id).Distinct().Count(),
                    TotalHCWs = hCWs.Where(x => x.Clinic.SubDistrictId == district.Id).Distinct().Count()
                });
            }

            return districts;
        }

        public District AddDistrict(DistrictInputModel input)
        {
            return _districtRepo.Insert(new District()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToStringOrNull(),
                Name = input.Name,
                ProvinceId = input.ProvinceId
            }
            );
        }

        public District EditDistrict(DistrictInputModel input)
        {
            var district = _districtRepo.GetById((Guid)input.Id);
            district.Name = input.Name;
            district.ProvinceId = input.ProvinceId;
            district.UpdatedDate = DateTime.Now;
            district.UpdatedBy = _applicationUserId.ToStringOrNull();
            return _districtRepo.Update(district);
        }

        public District DeleteDistrict(Guid districtId)
        {
            var district = _districtRepo.GetById(districtId);
            district.IsActive = false;
            district.UpdatedDate = DateTime.Now;
            district.UpdatedBy = _applicationUserId.ToStringOrNull();
            return _districtRepo.Update(district);
        }

        #endregion

        #region SubDistrict
        public List<SubDistrictStatsModel> GetSubDistrictsAndStats()
        {
            var subDistrictRecords = _subDistrictRepo.GetAll().Where(x => x.IsActive).ToList();
            var clinics = _clinicRepo.GetAll().Where(x => x.IsActive && x.SubDistrictId.HasValue).ToList();
            var clinicTeamLeads = _clinicTeamRepo.GetAll().Where(x => x.IsActive).ToList();
            var hCWs = _healthCareWorkerRepo.GetAll().Where(x => x.IsActive && x.ClinicId.HasValue).ToList();

            List<SubDistrictStatsModel> subDistricts = new List<SubDistrictStatsModel>();
            foreach (var subDistrict in subDistrictRecords)
            {
                subDistricts.Add(new SubDistrictStatsModel()
                {
                    Id = subDistrict.Id,
                    Name = subDistrict.Name,
                    InsertedDate = subDistrict.InsertedDate,
                    District = subDistrict.District,
                    TotalClinics = clinics.Where(x => x.SubDistrictId == subDistrict.Id).Distinct().Count(),
                    TotalTeamLeads = clinicTeamLeads.Where(x => x.Clinic.SubDistrictId == subDistrict.Id).Distinct().Count(),
                    TotalHCWs = hCWs.Where(x => x.Clinic.SubDistrictId == subDistrict.Id).Distinct().Count()
                });
            }

            return subDistricts;
        }

        public SubDistrict AddSubDistrict(SubDistrictInputModel input)
        {
            return _subDistrictRepo.Insert(new SubDistrict()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToStringOrNull(),
                Name = input.Name,
                DistrictId = input.DistrictId
            }
            );
        }
        public SubDistrict EditSubDistrict(SubDistrictInputModel input)
        {
            var subDistrict = _subDistrictRepo.GetById((Guid)input.Id);
            subDistrict.Name = input.Name;
            subDistrict.DistrictId = input.DistrictId;
            subDistrict.UpdatedDate = DateTime.Now;
            subDistrict.UpdatedBy = _applicationUserId.ToStringOrNull();
            return _subDistrictRepo.Update(subDistrict);
        }

        public SubDistrict DeleteSubDistrict(Guid subDistrictId)
        {
            var subDistrict = _subDistrictRepo.GetById(subDistrictId);
            var linkedClinic = _clinicRepo.GetAll().Where(x => x.SubDistrictId == subDistrictId).Select(x => x.Id).Distinct().Count();
            if (linkedClinic == 0)
            {
                subDistrict.IsActive = false;
                subDistrict.UpdatedDate = DateTime.Now;
                subDistrict.UpdatedBy = _applicationUserId.ToStringOrNull();
                return _subDistrictRepo.Update(subDistrict);
            }
            return subDistrict;
        }

        #endregion

        #region Clinic

        public ClinicReportModel GetClinicPointsData(Guid clinicId)
        {
            ClinicReportModel clinicReportModel = new ClinicReportModel();

            var prevYearDec = new DateTime(DateTime.Now.Year - 1, 12, 01);
            var clinic = _clinicRepo.GetAll()
                .Where(x => x.Id == clinicId)
                .Include(x => x.TeamLeads.Where(x => x.IsActive == true))
                .Include(x => x.HealthCareWorkers.Where(x => x.IsActive == true))
                .Include(x => x.Leagues)
            .FirstOrDefault();

            // league
            var league = clinic.Leagues.FirstOrDefault(x => x.IsActive);

            // get all active HCWs
            var hcwUserIds = clinic.HealthCareWorkers.Select(x => x.UserId).ToList();
            clinicReportModel.TotalHCWs = hcwUserIds.Count;

            if (league != null)
            {
                // All Points
                var allPoints = _pointsEngineService.GetPointsDetailsForClinic(clinicId);
                if (allPoints?.Points != null)
                {
                    clinicReportModel.LeagueRanking = allPoints.LeagueRanking;
                    clinicReportModel.PointsTotal = allPoints.PointsTotal;
                    clinicReportModel.MaxPointsTotal = allPoints.MaxPointsTotal;
                }
            }
           
            var momData = GetMomPointsData(clinicId, prevYearDec, Constants.PointsActivityConstants.PregnantMomFolderOpenedActivityId);
            clinicReportModel.MomsTargetPerc = momData.MomsTargetPerc;
            clinicReportModel.MomsTargetPercColor = momData.MomsTargetPercColor;
            clinicReportModel.MomsClinicHigherThan50Perc = momData.MomsClinicHigherThan50Perc;
            clinicReportModel.MomsClinicLowerThan50Perc = momData.MomsClinicLowerThan50Perc;
            clinicReportModel.MomsTeamsBottomPerc = momData.MomsTeamsBottomPerc;
            clinicReportModel.MomsTeamsTopPerc = momData.MomsTeamsTopPerc;
            clinicReportModel.MomsTopTeamPerc = momData.MomsTopTeamPerc;

            var childData = GetChildPointsData(clinicId, prevYearDec, Constants.PointsActivityConstants.ChildFoldersOpenedActivityId);
            clinicReportModel.ChildrenTargetPerc = childData.ChildrenTargetPerc;
            clinicReportModel.ChildrenTargetPercColor = childData.ChildrenTargetPercColor;
            clinicReportModel.ChildrenClinicHigherThan50Perc = childData.ChildrenClinicHigherThan50Perc;
            clinicReportModel.ChildrenClinicLowerThan50Perc = childData.ChildrenClinicLowerThan50Perc;
            clinicReportModel.ChildrenTeamsBottomPerc = childData.ChildrenTeamsBottomPerc;
            clinicReportModel.ChildrenTeamsTopPerc = childData.ChildrenTeamsTopPerc;
            clinicReportModel.ChildrenTopTeamPerc = childData.ChildrenTopTeamPerc;

            return clinicReportModel;
        }

        private ClinicReportModel GetMomPointsData(Guid clinicId, DateTime startDate, Guid ActivityId)
        {
            var clinicReportModel = new ClinicReportModel();

            var allClinicRankingData = _pointsEngineService.GetClinicRankingsForActivity(ActivityId, startDate, DateTime.Now.Date);
            var currentClinic = allClinicRankingData.Where(x => x.ClinicId == clinicId).FirstOrDefault();
            var totalClinicsBelowClinicRank = allClinicRankingData.Where(x => x.TargetPercentage < currentClinic.TargetPercentage && x.ClinicId != currentClinic.ClinicId).Count();
            var totalClinicsAboveClinicRank = allClinicRankingData.Where(x => x.TargetPercentage >= currentClinic.TargetPercentage && x.ClinicId != currentClinic.ClinicId).Count();

            clinicReportModel.MomsTargetPerc = currentClinic.TargetPercentage > 100 ? 100 : currentClinic.TargetPercentage;
            clinicReportModel.MomsTargetPercColor = currentClinic.TargetPercentageColor;
            clinicReportModel.MomsTopTeamPerc = allClinicRankingData.GetItemByIndex(0).TargetPercentage;
            clinicReportModel.MomsClinicHigherThan50Perc = currentClinic.RankingForYear < (allClinicRankingData.Count() / 2)  ? "Yes" : "No";
            
            if (clinicReportModel.MomsClinicHigherThan50Perc == "Yes")
            {
                clinicReportModel.MomsTeamsBottomPerc = Math.Round((double)totalClinicsBelowClinicRank / (double)allClinicRankingData.Count() * 100);
            } else
            {
                clinicReportModel.MomsTeamsTopPerc = Math.Round(((double)totalClinicsAboveClinicRank / (double)allClinicRankingData.Count() * 100));
                clinicReportModel.MomsClinicLowerThan50Perc = Math.Round(100 - clinicReportModel.MomsTeamsTopPerc);

            }
            return clinicReportModel;
        }

        private ClinicReportModel GetChildPointsData(Guid clinicId, DateTime startDate, Guid ActivityId)
        {
            var clinicReportModel = new ClinicReportModel();

            var allClinicRankingData = _pointsEngineService.GetClinicRankingsForActivity(ActivityId, startDate, DateTime.Now.Date);
            var currentClinic = allClinicRankingData.Where(x => x.ClinicId == clinicId).FirstOrDefault();
            var totalClinicsBelowClinicRank = allClinicRankingData.Where(x => x.TargetPercentage < currentClinic.TargetPercentage && x.ClinicId != currentClinic.ClinicId).Count();
            var totalClinicsAboveClinicRank = allClinicRankingData.Where(x => x.TargetPercentage >= currentClinic.TargetPercentage && x.ClinicId != currentClinic.ClinicId).Count();

            clinicReportModel.ChildrenTargetPerc = currentClinic.TargetPercentage > 100 ? 100 : currentClinic.TargetPercentage;
            clinicReportModel.ChildrenTargetPercColor = currentClinic.TargetPercentageColor;
            clinicReportModel.ChildrenTopTeamPerc = allClinicRankingData.GetItemByIndex(0).TargetPercentage;
            clinicReportModel.ChildrenClinicHigherThan50Perc = currentClinic.RankingForYear < (allClinicRankingData.Count() / 2) ? "Yes" : "No";

            if (clinicReportModel.ChildrenClinicHigherThan50Perc == "Yes")
            {
                clinicReportModel.ChildrenTeamsBottomPerc = Math.Round((double)totalClinicsBelowClinicRank / (double)allClinicRankingData.Count() * 100);
            }
            else
            {
                clinicReportModel.ChildrenTeamsTopPerc = Math.Round(((double)totalClinicsAboveClinicRank / (double)allClinicRankingData.Count() * 100));
                clinicReportModel.ChildrenClinicLowerThan50Perc = Math.Round(100 - clinicReportModel.ChildrenTeamsTopPerc);

            }
            return clinicReportModel;
        }

        public ClinicVisitReportModel GetClinicVisitReportData(Guid clinicId, DateTime startDate, DateTime endDate)
        {
            var clinic = _clinicRepo.GetAll()
                .Where(x => x.Id == clinicId)
                .Include(hcw => hcw.HealthCareWorkers.Where(hcw => hcw.IsActive))
                .ThenInclude(m => m.Mothers.Where(m => m.IsActive))
                .Include(hcw => hcw.HealthCareWorkers.Where(hcw => hcw.IsActive))
                .ThenInclude(c => c.Caregivers.Where(c => c.IsActive))
            .FirstOrDefault();

            // Caregivers
            IEnumerable<Guid> caregiversIds = new List<Guid>();
            var caregiverRecords = clinic.HealthCareWorkers.Where(x => x.Caregivers.Count > 0).Select(x => x.Caregivers).ToList();
            caregiversIds = caregiverRecords.Aggregate(caregiversIds, (current, list) => current.Concat(list.Select(x => x.Id))).ToList();

            // Infants
            var infants = _infantRepo.GetAll().Where(x => caregiversIds.Contains((Guid)x.CaregiverId) && x.IsActive).ToList();
            var infantIds = infants.Select(x => x.Id).Distinct().ToList();

            // Mothers
            IEnumerable<Mother> mothers = new List<Mother>();
            var motherRecords = clinic.HealthCareWorkers.Where(x => x.Mothers.Count > 0).Select(x => x.Mothers).ToList();
            mothers = motherRecords.Aggregate(mothers, (current, list) => current.Concat(list)).ToList();
            var motherIds = mothers.Select(x => x.Id).Distinct().ToList();

            ClinicVisitReportModel clinicVisitReportModel = new ClinicVisitReportModel();
            clinicVisitReportModel.ClientRegistration = GetClientRegistration(mothers, infants, startDate.Date, endDate.Date);
            clinicVisitReportModel.PregnantMoms = GetPregnantMoms(motherIds, startDate.Date, endDate.Date);
            clinicVisitReportModel.ChildClients = GetChildClients(infantIds, startDate.Date, endDate.Date);
            clinicVisitReportModel.BreastFeedingClub = GetBreastFeedingClubData(clinicId, startDate.Date, endDate.Date);

            return clinicVisitReportModel;
        }

        private ClientRegistrationModel GetClientRegistration(IEnumerable<Mother> mothers, List<Infant> infants, DateTime startDate, DateTime endDate)
        {
            var totalChildFoldersOpened = infants.Where(x => x.InsertedDate.Date >= startDate && x.InsertedDate.Date <= endDate).Count();
            var filteredMothers = mothers.Where(x => x.InsertedDate.Date >= startDate && x.InsertedDate.Date <= endDate).ToList();
            var totalMotherFoldersOpened = filteredMothers.Count();
            var totalMotherFoldersBefore20WeeksOpened = 0;

            foreach (var mother in filteredMothers)
            {
                // Calculation: Pregnancy term calculated: "expected delivery date" - "280 days (40 weeks)"
                var endTermDate = mother.ExpectedDateOfDelivery.Value;
                var startTermDate = endTermDate.AddDays(-280);

                var diffOfDates = (DateTime)mother.InsertedDate - (DateTime)startTermDate;
                var diffWeeks = diffOfDates.Days / 7;
                if (diffWeeks < 21)
                {
                    totalMotherFoldersBefore20WeeksOpened++;
                }
            }

            return new ClientRegistrationModel()
            {
                TotalChildFoldersOpened = totalChildFoldersOpened,
                TotalMotherFoldersOpened = totalMotherFoldersOpened,
                TotalMotherFoldersBefore20WeeksOpened = totalMotherFoldersBefore20WeeksOpened
            };
        }

        private PregnantMomsModel GetPregnantMoms(List<Guid> motherIds, DateTime startDate, DateTime endDate)
        {
            var visitData = _visitDataRepo.GetAll().Where(x => x.Visit.MotherId.HasValue && 
                                                            motherIds.Contains((Guid)x.Visit.MotherId) && 
                                                            x.Visit.Attended == true &&
                                                            x.InsertedDate.Date >= startDate &&
                                                            x.InsertedDate.Date <= endDate).ToList();

            return new PregnantMomsModel()
            {
                TotalMaternalDistress = visitData.Where(x => x.VisitSection == Constants.GGSettings.MaternalDistressScreening).Select(x => x.Visit.MotherId).Distinct().Count(),
                TotalMaternalMalnutrition = visitData.Where(x => x.Visit.VisitType.Name == Constants.GGSettings.visit1).Select(x => x.Visit.MotherId).Distinct().Count(),
                TotalAlcoholAbuse = visitData.Where(x => x.VisitSection == Constants.GGSettings.alcohol_use).Select(x => x.Visit.MotherId).Distinct().Count()
            };
        }

        private ChildClientsModel GetChildClients(List<Guid> infantIds, DateTime startDate, DateTime endDate)
        {

            var visitData = _visitDataRepo.GetAll().Where(x => x.Visit.InfantId.HasValue &&
                                                            infantIds.Contains((Guid)x.Visit.InfantId) &&
                                                            x.Visit.Attended == true &&
                                                            x.InsertedDate.Date >= startDate &&
                                                            x.InsertedDate.Date <= endDate).ToList();

            var totalSupportGrant = visitData.Where(x => x.Question == Constants.GGSettings.QuestionReceivingCSG &&
                                                         x.QuestionAnswer == Constants.GGSettings.AnswerYes).Select(x => x.Visit.InfantId).Distinct().Count();
            var totalGrowthMonitored = visitData.Where(x => (x.Question == Constants.GGSettings.QuestionLength || 
                                                             x.Question == Constants.GGSettings.QuestionWeight || 
                                                             x.Question == Constants.GGSettings.QuestionMUAC) &&
                                                             x.VisitSection != Constants.GGSettings.child_road_to_health).Select(x => x.Visit.InfantId).Distinct().Count();
            var totalUpToDateImmunisations = visitData.Where(x => x.Question == Constants.GGSettings.QuestionImmunisation &&
                                                         x.QuestionAnswer == Constants.GGSettings.AnswerYes).Select(x => x.Visit.InfantId).Distinct().Count();
            var totalUpToDateDeworming = visitData.Where(x => x.Question == Constants.GGSettings.QuestionDeworming &&
                                                         x.QuestionAnswer == Constants.GGSettings.AnswerYes).Select(x => x.Visit.InfantId).Distinct().Count();
            var totalUpToDateVitaminA = visitData.Where(x => x.Question == Constants.GGSettings.QuestionVitaminA &&
                                                         x.QuestionAnswer == Constants.GGSettings.AnswerYes).Select(x => x.Visit.InfantId).Distinct().Count();

            return new ChildClientsModel()
            {
                TotalSupportGrant = totalSupportGrant,
                TotalGrowthMonitored = totalGrowthMonitored,
                TotalUpToDateImmunisations = totalUpToDateImmunisations,
                TotalUpToDateDeworming = totalUpToDateDeworming,
                TotalUpToDateVitaminA = totalUpToDateVitaminA
            };
        }

        private BreastFeedingClubPortalModel GetBreastFeedingClubData(Guid clinicId, DateTime startDate, DateTime endDate)
        {
            var clubMeetings = _breastFeedingClubRepo.GetAll()
                .Where(x => x.ClinicId == clinicId
                    && x.MeetingDate.Date >= startDate && x.MeetingDate <= endDate)
                .ToList();

            return new BreastFeedingClubPortalModel()
            {
                TotalClubsHeld = clubMeetings.Count,
                TotalCaregiversAttended = clubMeetings.Select(x => x.Clients.Count).Sum(),
            };
        }

        public Clinic AddClinic(PortalClinicInputModel input)
        {
            var clinic = _clinicRepo.Insert(new Clinic()
                {
                    Id = new Guid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = _applicationUserId.ToStringOrNull(),
                    Name = input.Name,
                    PhoneNumber = input.PhoneNumber,
                    SiteAddressId = input.SiteAddressId,
                    SubDistrictId = input.SubDistrictId,
                }
            );

            // TeamLead1 is compulsory
            ManageTeamLead(clinic.Id, input.TeamLead1Id, input.TeamLead2Id);

            return clinic;
        }

        public Clinic EditClinic(PortalClinicInputModel input)
        {
            var clinic = _clinicRepo.GetById((Guid)input.Id);
            clinic.UpdatedDate = DateTime.Now;
            clinic.UpdatedBy = _applicationUserId.ToStringOrNull();
            clinic.Name = input.Name;
            clinic.PhoneNumber = input.PhoneNumber;
            clinic.SiteAddressId = input.SiteAddressId;
            clinic.SubDistrictId = input.SubDistrictId;

            // TeamLead1 is compulsory
            ManageTeamLead(clinic.Id, input.TeamLead1Id, input.TeamLead2Id);

            var updatedClinic = _clinicRepo.Update(clinic);

            // Expire notification
            _notificationService.DeleteGroupNotifications(TemplateTypeConstants.ClinicMissingTeamLead, updatedClinic.Id);

            return updatedClinic;
        }

        private bool ManageTeamLead(Guid clinicId, Guid teamLead1Id, Guid? teamLead2Id)
        {
            var clinicRecords = _clinicTeamRepo.GetAll().Where(x => x.ClinicId == clinicId).ToList();
            if (clinicRecords.Any())
            {
                // Get all records that is not associated with team lead 1 and lead 2 and archive them
                List<Guid> teamLeadIds = new List<Guid>() { teamLead1Id };
                if (teamLead2Id != null)
                {
                    teamLeadIds.Add((Guid)teamLead2Id);
                }
                var currentIds = clinicRecords.Where(x => !teamLeadIds.Contains(x.TeamLeadId) && x.IsActive).ToList();
                if (currentIds.Any())
                {
                    foreach (var item in currentIds)
                    {
                        item.UpdatedDate = DateTime.Now;
                        item.UpdatedBy = _applicationUserId.ToStringOrNull();
                        item.IsActive = false;
                        _clinicTeamRepo.Update(item);
                    }
                } 

                // Add team lead 1 if not available, but set active if available and in active
                var teamLead1 = clinicRecords.Where(x => x.TeamLeadId == teamLead1Id).FirstOrDefault();
                if (teamLead1 == null)
                {
                    AddClinicTeamLead(clinicId, teamLead1Id);
                } else
                {
                    if (!teamLead1.IsActive)
                    {
                        teamLead1.UpdatedDate = DateTime.Now;
                        teamLead1.UpdatedBy = _applicationUserId.ToStringOrNull();
                        teamLead1.IsActive = true;
                        _clinicTeamRepo.Update(teamLead1);
                    }
                }


                if (teamLead2Id != null)
                {
                    // Add team lead 2 if not available, but set active if available and in active
                    var teamLead2 = clinicRecords.Where(x => x.TeamLeadId == (Guid)teamLead2Id).FirstOrDefault();
                    if (teamLead2 == null)
                    {
                        AddClinicTeamLead(clinicId, (Guid)teamLead2Id);
                    } else
                    {
                        if (!teamLead2.IsActive)
                        {
                            teamLead2.UpdatedDate = DateTime.Now;
                            teamLead2.UpdatedBy = _applicationUserId.ToStringOrNull();
                            teamLead2.IsActive = true;
                            _clinicTeamRepo.Update(teamLead2);
                        }
                    }
                }
            } 
            else
            {
                AddClinicTeamLead(clinicId, teamLead1Id);

                if (teamLead2Id != null)
                {
                    AddClinicTeamLead(clinicId, (Guid)teamLead2Id);
                }
            }

            return true;
        }

        private ClinicTeamLead AddClinicTeamLead(Guid clinicId, Guid teamLeadId)
        {
            return _clinicTeamRepo.Insert(new ClinicTeamLead()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToStringOrNull(),
                ClinicId = clinicId,
                TeamLeadId = teamLeadId
            });
        }

        public Clinic DeleteClinicById(Guid clinicId)
        {
            var clinic = _clinicRepo.GetById(clinicId);
            clinic.IsActive = false;
            clinic.UpdatedDate = DateTime.Now;
            clinic.UpdatedBy = _applicationUserId.ToStringOrNull();
            return _clinicRepo.Update(clinic);
        }

        #endregion

        #region Breast feeding clubs

        public BreastFeedingClub AddBreastFeedingClub(Guid clinicId, Guid healthCareWorkId, DateTime meetingDate, bool clientsAttendedConfirmed, List<Guid> caregiversAttended)
        {
            var caregivers = _caregiverRepo.GetAll().Where(x => caregiversAttended.Contains(x.Id)).ToList();

            var clubId = Guid.NewGuid();
            var breastFeedingClub = new BreastFeedingClub()
            {
                Id = clubId,
                ClinicId = clinicId,
                HealthCareWorkerId = healthCareWorkId,
                MeetingDate = meetingDate,
                ClientsAttendedConfirmed = clientsAttendedConfirmed,
                Clients = caregivers.Select(x => new BreastFeedingClubClient()
                {
                    Caregiver = x
                }).ToList()
            };

            _breastFeedingClubRepo.Insert(breastFeedingClub);

            return breastFeedingClub;
        }

        public List<BreastFeedingClub> GetBreastFeedingClubs(Guid clinicId)
        {
            var breastFeedingClubs = _breastFeedingClubRepo.GetAll()
                .Where(x => clinicId == x.ClinicId
                    && x.MeetingDate > new DateTime(DateTime.Now.Year, 1, 1))                
                .ToList();

            return breastFeedingClubs;
        }

        public List<Caregiver> GetAvailableCaregiversForBreastFeedingClub(Guid clinicId)
        {
            var healthCareWorkerIdsForClinic = _healthCareWorkerRepo.GetAll().Where(x => x.ClinicId == clinicId).Select(x => x.Id).ToList();

            var twoYearsAgo = DateTime.Now.AddYears(-2);
            var caregiversForInfantsUnderTwoYears = _infantRepo.GetAll().Where(x => 
                x.User.DateOfBirth > twoYearsAgo
                && x.Caregiver.HealthCareWorkerId.HasValue
                && healthCareWorkerIdsForClinic.Contains(x.Caregiver.HealthCareWorkerId.Value))
                .Select(x => x.Caregiver).ToList();

            return caregiversForInfantsUnderTwoYears;
        }

        #endregion

        #region Clinic Meetings
        public ClinicMeeting AddClinicMeeting(AddClinicMeetingInputModel input)
        {
            var teamLead = _teamLeadRepo.GetByUserId(input.TeamLeadUserId);
            var clinicMeeting = _clinicMeetingRepo.Insert(new ClinicMeeting()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToStringOrNull(),
                MeetingDate = input.MeetingDate,
                MeetingTypeId = Constants.MeetingTypes.TeamLeadMonthlyMeetingId,
                ClinicId = input.ClinicId,
                TeamLeadId = teamLead.Id,
                PositiveStory = input.PositiveStory,
                ReportingIssue = input.ReportingIssue,
                TotalSupportVisits = input.TotalSupportVisits
            }
            );

            if (input.ParticipantsOptedOutIds.Count > 0)
            {
                List<ClinicMeetingParticipantOptedOut> clinicMeetingParticipantOptedOuts = new List<ClinicMeetingParticipantOptedOut>();
                foreach (Guid item in input.ParticipantsOptedOutIds)
                {
                    clinicMeetingParticipantOptedOuts.Add(new ClinicMeetingParticipantOptedOut()
                    {
                        Id = new Guid(),
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _applicationUserId.ToStringOrNull(),
                        HealthCareWorkerId = item,
                        ClinicMeetingId = clinicMeeting.Id
                    });
                }
                _clinicMeetingCHWsOptedOutRepo.InsertMany(clinicMeetingParticipantOptedOuts);
            }
            if (input.ParticipantsInFieldIds.Count > 0)
            {
                List<ClinicMeetingParticipantInField> clinicMeetingParticipantInFields = new List<ClinicMeetingParticipantInField>();
                foreach (Guid item in input.ParticipantsInFieldIds)
                {
                    clinicMeetingParticipantInFields.Add(new ClinicMeetingParticipantInField()
                    {
                        Id = new Guid(),
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _applicationUserId.ToStringOrNull(),
                        HealthCareWorkerId = item,
                        ClinicMeetingId = clinicMeeting.Id
                    });
                }
                _clinicMeetingCHWsInFieldRepo.InsertMany(clinicMeetingParticipantInFields);
            }

            // Remove notifications when the report has been submitted for the TLs clinic(s) for the month
            var notification = _messageRepo.GetAll().Where(x =>
                    x.MessageProtocol == "portal" &&
                    x.MessageTemplateType == TemplateTypeConstants.GGPortalTLMissingMonthlyReport &&
                    x.To == clinicMeeting.TeamLeadId.ToString() &&
                    x.IsActive == true &&
                    (x.MessageDate.Value.Date.Year == clinicMeeting.MeetingDate.Year && x.MessageDate.Value.Date.Month == clinicMeeting.MeetingDate.Month)
                ).FirstOrDefault();

            if (notification != null)
            {
                notification.IsActive = false;
                notification.MessageEndDate = DateTime.Now;
                notification.UpdatedDate = DateTime.Now;
                _messageRepo.Update(notification);
            }

            return clinicMeeting;
        }

        public PortalClinicMeetingModel GetClinicMeetingForMonth(Guid clinicId)
        {
            // Always show report from 8 of current month to 7th of next month
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 07);
            var endDate = startDate.AddMonths(1);
            endDate = endDate.AddDays(1);

            var clinicMeeting =  _clinicMeetingRepo.GetAll()
                .Where(x => x.IsActive && 
                            x.MeetingDate.Date >= startDate && x.MeetingDate.Date <= endDate.Date &&
                            x.ClinicId == clinicId)
                .FirstOrDefault();

            if (clinicMeeting != null)
            {
                var meetingTopic = GetCMSTopicForMonth(clinicMeeting.MeetingDate.ToString("MMMM yyyy"));
                return new PortalClinicMeetingModel(clinicMeeting, meetingTopic);
            }

            return null;

        }
        public List<PortalClinicMeetingModel> GetAllClinicMeetings()
        {
            List<PortalClinicMeetingModel> records = new List<PortalClinicMeetingModel>();
            var clinicMeetings = _clinicMeetingRepo
                                .GetAll()
                                .Where(x => x.IsActive && x.MeetingDate.Year == DateTime.Now.Year).ToList();

            foreach (var item in clinicMeetings)
            {
                var meetingTopic = GetCMSTopicForMonth(item.MeetingDate.ToString("MMMM yyyy"));
                records.Add(new PortalClinicMeetingModel(item, meetingTopic));
            }

            return records;
        }

        public MeetingTopic GetCMSTopicForMonth(string title)
        {
            Guid localeId = Guid.Parse("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var result = _contentRepo.GetByValueKey("Topic", "title", title, localeId);

            if (result.Count()  > 0)
            {
                var field = (IDictionary<string, object>)result.GetItemByIndex(0);
                field.TryGetValue("title", out var titleValue);
                field.TryGetValue("topicTitle", out var topicTitleValue);
                field.TryGetValue("topicContent", out var topicContentValue);
                field.TryGetValue("infoGraphic", out var infoGraphicValue);
                field.TryGetValue("knowledgeContent", out var knowledgeContentValue);
                field.TryGetValue("selfCareContent", out var selfCareContentValue);

                return new MeetingTopic()
                {
                    Title = Convert.ToString(titleValue),
                    TopicTitle = Convert.ToString(topicTitleValue),
                    TopicContent = Convert.ToString(topicContentValue),
                    InfoGraphic = Convert.ToString(infoGraphicValue),
                    KnowledgeContent = Convert.ToString(knowledgeContentValue),
                    SelfCareContent = Convert.ToString(selfCareContentValue)
                };
            }

            return new MeetingTopic();
        }

        #endregion
    }
}
