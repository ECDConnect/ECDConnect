using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using static iTextSharp.text.pdf.AcroFields;

namespace EcdLink.Api.CoreApi.Services
{
    public class ClinicService : IClinicService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private readonly IGenericRepository<District, Guid> _districtRepo;
        private readonly IGenericRepository<SubDistrict, Guid> _subDistrictRepo;
        private readonly IGenericRepository<Clinic, Guid> _clinicRepo;
        private readonly IGenericRepository<ClinicTeamLead, Guid> _clinicTeamRepo;
        private readonly IGenericRepository<HealthCareWorker, Guid> _hcwRepo;

        private readonly string _applicationUserId;

        public ClinicService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory
            )
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser()?.Id.ToString();

            _districtRepo = _repositoryFactory.CreateGenericRepository<District>(userContext: _applicationUserId);
            _subDistrictRepo = _repositoryFactory.CreateGenericRepository<SubDistrict>(userContext: _applicationUserId);
            _clinicRepo = _repositoryFactory.CreateGenericRepository<Clinic>(userContext: _applicationUserId);
            _clinicTeamRepo = _repositoryFactory.CreateGenericRepository<ClinicTeamLead>(userContext: _applicationUserId);
            _hcwRepo = _repositoryFactory.CreateGenericRepository<HealthCareWorker>(userContext: _applicationUserId);
            
        }

        #region District

        public List<DistrictStatsModel> GetDistrictsAndStats()
        {
            var districtRecords = _districtRepo.GetAll().Include(x => x.SubDistricts).Where(x => x.IsActive).ToList();
            var clinics = _clinicRepo.GetAll().Where(x => x.IsActive && x.SubDistrictId.HasValue).ToList();
            var clinicTeamLeads = _clinicTeamRepo.GetAll().Where(x => x.IsActive).ToList();
            var hCWs = _hcwRepo.GetAll().Where(x => x.IsActive && x.ClinicId.HasValue).ToList();

            List<DistrictStatsModel> districts = new List<DistrictStatsModel>();
            foreach (var district in districtRecords)
            {
                districts.Add(new DistrictStatsModel()
                {
                    Id = district.Id,
                    Name = district.Name,
                    InsertedDate = district.InsertedDate,
                    Province = district.Province,
                    SubDistricts = district.SubDistricts,
                    TotalSubDistricts = district.SubDistricts.Count(),
                    TotalClinics = clinics.Where(x => x.SubDistrict.DistrictId == district.Id).Distinct().Count(),
                    TotalTeamLeads = clinicTeamLeads.Where(x => x.Clinic.SubDistrict.DistrictId == district.Id).Distinct().Count(),
                    TotalHCWs = hCWs.Where(x => x.Clinic.SubDistrict.DistrictId == district.Id).Distinct().Count()
                });
            }

            return districts;
        }

        public District AddDistrict(DistrictModel input)
        {
            return _districtRepo.Insert(new District()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId,
                Name = input.Name,
                ProvinceId = input.ProvinceId
            }
            );
        }

        public District EditDistrict(DistrictModel input)
        {
            var district = _districtRepo.GetById((Guid)input.Id);
            district.Name = input.Name;
            district.ProvinceId = input.ProvinceId;
            district.UpdatedDate = DateTime.Now;
            district.UpdatedBy = _applicationUserId;
            return _districtRepo.Update(district);
        }

        public District DeleteDistrict(Guid districtId)
        {
            var district = _districtRepo.GetById(districtId);
            district.IsActive = false;
            district.UpdatedDate = DateTime.Now;
            district.UpdatedBy = _applicationUserId;
            return _districtRepo.Update(district);
        }

        #endregion

        #region SubDistrict
        public List<SubDistrictStatsModel> GetSubDistrictsAndStats()
        {
            var subDistrictRecords = _subDistrictRepo.GetAll().Where(x => x.IsActive).ToList();
            var clinics = _clinicRepo.GetAll().Where(x => x.IsActive && x.SubDistrictId.HasValue).ToList();
            var clinicTeamLeads = _clinicTeamRepo.GetAll().Where(x => x.IsActive).ToList();
            var hCWs = _hcwRepo.GetAll().Where(x => x.IsActive && x.ClinicId.HasValue).ToList();

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

        public SubDistrict AddSubDistrict(SubDistrictModel input)
        {
            return _subDistrictRepo.Insert(new SubDistrict()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId,
                Name = input.Name,
                DistrictId = input.DistrictId
            }
            );
        }

        public SubDistrict EditSubDistrict(SubDistrictModel input)
        {
            var district = _subDistrictRepo.GetById((Guid)input.Id);
            district.Name = input.Name;
            district.DistrictId = input.DistrictId;
            district.UpdatedDate = DateTime.Now;
            district.UpdatedBy = _applicationUserId;
            return _subDistrictRepo.Update(district);
        }

        public SubDistrict DeleteSubDistrict(Guid subDistrictId)
        {
            var subDistrict = _subDistrictRepo.GetById(subDistrictId);
            subDistrict.IsActive = false;
            subDistrict.UpdatedDate = DateTime.Now;
            subDistrict.UpdatedBy = _applicationUserId;
            return _subDistrictRepo.Update(subDistrict);
        }

        #endregion

        #region Clinic

        // This data will come from G11 - could be replaced - this is temp
        public ClinicReportModel GetClinicReportData(Guid clinicId)
        {
            ClinicReportModel clinicReportModel = new ClinicReportModel();
            clinicReportModel.TotalHCWs = _hcwRepo.GetAll().Where(x => x.IsActive && x.ClinicId == clinicId).Count();
            clinicReportModel.LeaguePosition = 0;
            clinicReportModel.TotalQuarterPoints = 0;

            return clinicReportModel;
        }

        public ClinicVisitReportModel GetClinicVisitReportData(Guid clinicId, DateTime startDate, DateTime endDate)
        {
            // TODO
            return new ClinicVisitReportModel();
        }

        public Clinic AddClinic(PortalClinicModel input)
        {
            var clinic = _clinicRepo.Insert(new Clinic()
                {
                    Id = new Guid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = _applicationUserId,
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

        public Clinic EditClinic(PortalClinicModel input)
        {
            var clinic = _clinicRepo.GetById((Guid)input.Id);
            clinic.UpdatedDate = DateTime.Now;
            clinic.UpdatedBy = _applicationUserId;
            clinic.Name = input.Name;
            clinic.PhoneNumber = input.PhoneNumber;
            clinic.SiteAddressId = input.SiteAddressId;
            clinic.SubDistrictId = input.SubDistrictId;

            // TeamLead1 is compulsory
            ManageTeamLead(clinic.Id, input.TeamLead1Id, input.TeamLead2Id);

            return _clinicRepo.Update(clinic);
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
                        item.UpdatedBy = _applicationUserId;
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
                        teamLead1.UpdatedBy = _applicationUserId;
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
                            teamLead2.UpdatedBy = _applicationUserId;
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
                UpdatedBy = _applicationUserId,
                ClinicId = clinicId,
                TeamLeadId = teamLeadId
            });
        }

        public Clinic DeleteClinic(Guid clinicId)
        {
            var clinic = _clinicRepo.GetById(clinicId);
            clinic.IsActive = false;
            clinic.UpdatedDate = DateTime.Now;
            clinic.UpdatedBy = _applicationUserId;
            return _clinicRepo.Update(clinic);
        }

        #endregion
    }
}
