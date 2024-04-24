using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Clinics;
using System;
using System.Collections.Generic;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;

namespace ECDLink.Api.CoreApi.Services.Interfaces
{
    public interface IClinicService
    {
        List<DistrictStatsModel> GetDistrictsAndStats();
        District AddDistrict(DistrictInputModel input);
        District EditDistrict(DistrictInputModel input);
        District DeleteDistrict(Guid districtId);
        List<SubDistrictStatsModel> GetSubDistrictsAndStats();
        SubDistrict AddSubDistrict(SubDistrictInputModel input);
        SubDistrict EditSubDistrict(SubDistrictInputModel input);
        SubDistrict DeleteSubDistrict(Guid subDistrictId);
        ClinicReportModel GetClinicPointsData(Guid clinicId);
        ClinicVisitReportModel GetClinicVisitReportData(Guid clinicId, DateTime startDate, DateTime endDate);
        Clinic AddClinic(PortalClinicInputModel input);
        Clinic EditClinic(PortalClinicInputModel input);
        Clinic DeleteClinicById(Guid clinicId);
        BreastFeedingClub AddBreastFeedingClub(Guid clinicId, Guid healthCareWorkId, DateTime meetingDate, bool clientsAttendedConfirmed, List<Guid> caregiversAttended);
        List<BreastFeedingClub> GetBreastFeedingClubs(Guid clinicId);
        List<Caregiver> GetAvailableCaregiversForBreastFeedingClub(Guid clinicId);
        ClinicMeeting AddClinicMeeting(AddClinicMeetingInputModel input);
        PortalClinicMeetingModel GetClinicMeetingForMonth(Guid clinicId);
        List<PortalClinicMeetingModel> GetAllClinicMeetings();
    }
}