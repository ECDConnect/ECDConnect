using ECDLink.DataAccessLayer.Entities.Clubs;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClubSupportModel
    {
        public string UserId { get; set; }
        public Guid PractitionerId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string ProfileImageUrl { get; set; }
        public DateTime? DateAssigned { get; set; }

        public ClubSupportModel(ClubSupport clubSupport)
        {
            UserId = clubSupport.Practitioner.User.Id;
            PractitionerId = clubSupport.PractitionerId;
            FirstName = clubSupport.Practitioner.User.FirstName;
            Surname = clubSupport.Practitioner.User.Surname;
            PhoneNumber = clubSupport.Practitioner.User.PhoneNumber;
            WhatsAppNumber = clubSupport.Practitioner.User.WhatsAppNumber;
            DateAssigned = clubSupport.DateAssigned;
        }
    }
}