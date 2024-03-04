using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.Api.CoreApi.Services.Interfaces
{
    public interface IClinicService
    {
        public List<DistrictStatsModel> GetDistrictsAndStats();
        public District AddDistrict(DistrictInputModel input);
        public District EditDistrict(DistrictInputModel input);
        public District DeleteDistrict(Guid districtId);
        public List<SubDistrictStatsModel> GetSubDistrictsAndStats();
        public SubDistrict AddSubDistrict(SubDistrictInputModel input);
        public SubDistrict EditSubDistrict(SubDistrictInputModel input);
        public SubDistrict DeleteSubDistrict(Guid subDistrictId);
        public ClinicReportModel GetClinicPointsData(Guid clinicId);
        public ClinicVisitReportModel GetClinicVisitReportData(Guid clinicId, DateTime startDate, DateTime endDate);
        public Clinic AddClinic(PortalClinicInputModel input);
        public Clinic EditClinic(PortalClinicInputModel input);
        public Clinic DeleteClinicById(Guid clinicId);

    }
}