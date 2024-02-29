using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.Api.CoreApi.Services.Interfaces
{
    public interface IClinicService
    {
        public List<DistrictStatsModel> GetDistrictsAndStats();
        public District AddDistrict(DistrictModel input);
        public District EditDistrict(DistrictModel input);
        public District DeleteDistrict(Guid districtId);
        public List<SubDistrictStatsModel> GetSubDistrictsAndStats();
        public SubDistrict AddSubDistrict(SubDistrictModel input);
        public SubDistrict EditSubDistrict(SubDistrictModel input);
        public SubDistrict DeleteSubDistrict(Guid subDistrictId);
        public ClinicReportModel GetClinicReportData(Guid clinicId);
        public ClinicVisitReportModel GetClinicVisitReportData(Guid clinicId, DateTime startDate, DateTime endDate);
        public Clinic AddClinic(PortalClinicModel input);
        public Clinic EditClinic(PortalClinicModel input);
        public Clinic DeleteClinic(Guid clinicId);

    }
}