using ECDLink.DataAccessLayer.Entities.Clubs;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClubLeaderModel
    {
        public string UserId { get; set; }
        public Guid PractitionerId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string ProfileImageUrl { get; set; }
        public DateTime? DateAccepted { get; set; }
        public DateTime? DateAssigned { get; set; }

        public ClubLeaderModel(ClubLeader clubLeader)
        {
            UserId = clubLeader.Practitioner.User.Id.ToString();
            PractitionerId = clubLeader.PractitionerId;
            FirstName = clubLeader.Practitioner.User.FirstName;
            Surname = clubLeader.Practitioner.User.Surname;
            PhoneNumber = clubLeader.Practitioner.User.PhoneNumber;
            WhatsAppNumber = clubLeader.Practitioner.User.WhatsAppNumber;
            ProfileImageUrl = clubLeader.Practitioner.User.ProfileImageUrl;
            DateAccepted = clubLeader.DateAccepted;
            DateAssigned = clubLeader.DateAssigned;
        }
    }
}