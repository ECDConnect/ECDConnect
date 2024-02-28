using EcdLink.Api.CoreApi.GraphApi.Models;
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

        #endregion

        #region Clinic

        #endregion
    }
}
