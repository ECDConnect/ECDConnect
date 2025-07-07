using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{

    public class PortalUserModel : ConnectUsageModel
    {
        public PortalUserModel(ApplicationUser user, bool isRegistered, DateTime? invitationDate)
            : base(user.IsActive, isRegistered, user.LastSeen, user.UpdatedDate, invitationDate)
        {
            Id = user.Id;
            IsSouthAfricanCitizen = user.IsSouthAfricanCitizen;
            IdNumber = user.IdNumber;
            VerifiedByHomeAffairs = user.VerifiedByHomeAffairs;
            DateOfBirth = user.DateOfBirth;
            InsertedDate = user.InsertedDate;
            LockoutEnd = user.LockoutEnd;
            LastSeen = user.LastSeen;
            GenderId = user.GenderId;
            RaceId = user.RaceId;
            FirstName = user.FirstName;
            Surname = user.Surname;
            FullName = user.FullName;
            UserName = user.UserName;
            ContactPreference = user.ContactPreference ?? MessageTypeConstants.SMS;
            PhoneNumber = user.PhoneNumber;
            Email = user.Email;
            WhatsAppNumber = user.WhatsAppNumber;
            IsActive = user.IsActive;
        }

        public Guid Id { get; set; }
        public bool? IsSouthAfricanCitizen { get; set; }
        public string IdNumber { get; set; }
        public bool? VerifiedByHomeAffairs { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? InsertedDate { get; set; }
        public DateTime LastSeen { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public Guid? GenderId { get; set; }
        public Guid? RaceId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string ContactPreference { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string WhatsAppNumber { get; set; }
        public bool IsActive { get; set; } = false;        
    }
}
