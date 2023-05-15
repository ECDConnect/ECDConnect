using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class UserModel
    {
        public string Id { get; set; }
        public bool IsSouthAfricanCitizen { get; set; }
        public string IdNumber { get; set; }
        public bool VerifiedByHomeAffairs { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Guid? GenderId { get; set; }
        public Guid? RaceId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string ContactPreference { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ProfileImageUrl { get; set; }
        public Guid? LanguageId { get; set; }
        public string EmergencyContactPhoneNumber { get; set; }
        public string EmergencyContactFirstName { get; set; }
        public string EmergencyContactSurname { get; set; }
        public string NextOfKinFirstName { get; set; }
        public string NextOfKinSurname { get; set; }
        public string NextOfKinContactNumber { get; set; }
        public string WhatsAppNumber { get; set; }
    }
}
