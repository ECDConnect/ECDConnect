using ECDLink.DataAccessLayer.Entities.Clubs;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClubMemberModel
    {
        public string UserId { get; set; }
        public Guid PractitionerId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string ProfileImageUrl { get; set; }
        public string WelcomeMessage { get; set; }  

        public ClubMemberModel(ClubMember clubMember)
        {
            PractitionerId = clubMember.PractitionerId;
            UserId = clubMember.Practitioner.User.Id.ToString();
            FirstName = clubMember.Practitioner.User.FirstName;
            Surname = clubMember.Practitioner.User.Surname;
            PhoneNumber = clubMember.Practitioner.User.PhoneNumber;
            WhatsAppNumber = clubMember.Practitioner.User.WhatsAppNumber;
            ProfileImageUrl = clubMember.Practitioner.User.ProfileImageUrl;
            WelcomeMessage = clubMember.WelcomeMessage;
        }
    }
}