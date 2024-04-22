using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class PortalTeamLeadModel
    {
        public PortalTeamLeadModel()
        {
        }

        public PortalTeamLeadModel(ApplicationUser user, string clinicNames, string location, int totalClinics, int totalHealthCareWorkers,
                              int totalPregnantMoms, int totalChildren, int totalMeetingReportsSubmitted, int totalInFieldVisitsCompleted, List<BaseClinicModel> clinics)
        {
            IdNumber = user.IdNumber;
            PhoneNumber = user.PhoneNumber;
            WhatsAppNumber = user.WhatsAppNumber;
            FirstName = user.FirstName;
            Surname = user.Surname;
            LastSeen = user.LastSeen;
            ClinicNames = clinicNames;
            Location = location;
            TotalClinics = totalClinics;
            TotalHealthCareWorkers = totalHealthCareWorkers;
            TotalPregnantMoms = totalPregnantMoms;
            TotalChildren = totalChildren;
            TotalMeetingReportsSubmitted = totalMeetingReportsSubmitted;
            TotalInFieldVisitsCompleted = totalInFieldVisitsCompleted;
            Clinics = clinics;
        }

        public DateTime LastSeen { get; set; }
        public string IdNumber { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string ClinicNames { get; set; }
        public string Location { get; set; }
        public int TotalClinics { get; set; } = 0;
        public int TotalHealthCareWorkers { get; set; } = 0;
        public int TotalPregnantMoms { get; set; } = 0;
        public int TotalChildren { get; set; } = 0;
        public int TotalMeetingReportsSubmitted { get; set; } = 0;
        public int TotalInFieldVisitsCompleted { get; set; } = 0;
        public List<BaseClinicModel> Clinics { get; set; }
    }
}
