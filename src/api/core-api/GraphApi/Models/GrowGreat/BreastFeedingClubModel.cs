using ECDLink.DataAccessLayer.Entities.Clinics;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class BreastFeedingClubModel
    {
        public Guid Id { get; set; }
        public DateTime MeetingDate { get; set; }
        public bool ClientsAttendedConfirmed { get; set; }
        public List<CaregiverBaseModel> Clients { get; set; }

        public BreastFeedingClubModel(BreastFeedingClub breastFeedingClub)
        {
            Id = breastFeedingClub.Id;
            MeetingDate = breastFeedingClub.MeetingDate;
            ClientsAttendedConfirmed = breastFeedingClub.ClientsAttendedConfirmed;
            Clients = breastFeedingClub.Clients.Select(x => new CaregiverBaseModel(x.Caregiver)).ToList();
        }
    }
}
