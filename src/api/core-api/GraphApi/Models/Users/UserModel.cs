using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class UserModel
    {
        public UserModel()
        {
        }

        public UserModel(ApplicationUser user)
        {
            Id = user.Id.ToString();
            IsSouthAfricanCitizen = user.IsSouthAfricanCitizen;
            IdNumber = user.IdNumber;
            UserName = user.UserName;
            VerifiedByHomeAffairs = user.VerifiedByHomeAffairs;
            DateOfBirth = user.DateOfBirth;
            GenderId = user.GenderId;
            RaceId = user.RaceId;
            FirstName = user.FirstName;
            Surname = user.Surname;
            ContactPreference = user.ContactPreference ?? MessageTypeConstants.SMS;
            PhoneNumber = user.PhoneNumber;
            Email = user.Email;
            ProfileImageUrl = user.ProfileImageUrl;
            LanguageId = user.LanguageId;
            EmergencyContactPhoneNumber = user.EmergencyContactPhoneNumber;
            EmergencyContactFirstName = user.EmergencyContactFirstName;
            EmergencyContactSurname = user.EmergencyContactSurname;
            NextOfKinFirstName = user.NextOfKinFirstName;
            NextOfKinSurname = user.NextOfKinSurname;
            NextOfKinContactNumber = user.NextOfKinContactNumber;
            WhatsAppNumber = user.WhatsAppNumber;
            Password = null;
            IsAdmin = null;
            ResetData = user.ResetData;
        }

        public string Id { get; set; }
        public bool? IsSouthAfricanCitizen { get; set; }
        public string IdNumber { get; set; }
        public string UserName { get; set; }
        public bool? VerifiedByHomeAffairs { get; set; }
        public DateTime? DateOfBirth { get; set; }
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
        public bool? IsAdmin { get; set; } = false;
        public bool? ResetData { get; set; } = false;
        public string WelcomeMessage { get; set; }
        public bool? ProfilePicIsEmoji { get; set; } = false;
    }
}
