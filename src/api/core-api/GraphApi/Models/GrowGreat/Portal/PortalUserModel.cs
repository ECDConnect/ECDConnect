using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class PortalUsersHCWModel
    {
        public Guid Id { get; set; }
        public DateTime InsertedDate { get; set; }
        public PortalUserModel User { get; set; }
        public Guid? ClinicId { get; set; }
        public string ClinicName { get; set; }
        public string ConnectUsage { get; set; }
        public bool IsRegistered { get; set; }
        public Guid? ProvinceId { get; set; }
        public Guid? SubDistrictId { get; set; }
    }

    public class PortalUserHCWModel
    {
        public Guid Id { get; set; }
        public Guid? ClinicId { get; set; }
        public Guid? UserId { get; set; }
        public bool IsActive { get; set; }
        public bool IsRegistered { get; set; }

        public PortalUserHCWModel(HealthCareWorker entity)
        {
            Id = entity.Id;
            ClinicId = entity.ClinicId;
            UserId = entity.UserId;
            IsActive = entity.IsActive;
            IsRegistered = entity.IsRegistered;
        }
    }

    public class PortalUsersTLModel
    {
        public Guid Id { get; set; }
        public DateTime InsertedDate { get; set; }
        public PortalUserModel User { get; set; }
        public List<Guid> ClinicIds { get; set; }
        public List<string> ClinicNames { get; set; }
        public List<Guid> ProvinceIds { get; set; }
        public List<Guid> SubDistrictIds { get; set; }
        public string ConnectUsage { get; set; }
        public bool IsRegistered { get; set; }
    }

    public class PortalUserTLModel
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public bool IsActive { get; set; }
        public bool IsRegistered { get; set; }
        public List<Guid> ClinicIds { get; set; }
        public PortalUserTLModel(TeamLead entity)
        {
            Id = entity.Id;
            UserId = entity.UserId;
            IsRegistered = entity.IsRegistered;
            ClinicIds = entity.Clinics.Where(x => x.IsActive).Select(x => x.ClinicId).ToList();
        }
    }

    public class PortalUserModel
    {
        public PortalUserModel()
        {
        }

        public PortalUserModel(ApplicationUser user, List<ShortenUrlEntity> invitations)
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
            ConnectUsage = GetConnectUsage(user, invitations);
        }

        private string GetConnectUsage(ApplicationUser user, List<ShortenUrlEntity> invitations)
        {
            var comment = "";

            if (user.IsActive == false)
            {
                comment = "Removed: " + user.UpdatedDate?.ToString("dd/MM/yyyy");
            }
            else
            {
                comment = "Online: " + user.LastSeen.ToString("dd/MM/yyyy");

                if (invitations.Count != 0)
                {
                    var invitation = invitations.Where(x => x.UserId == user.Id).OrderByDescending(x => x.InsertedDate).FirstOrDefault();

                    if (invitation != null)
                    {
                        DateTime date = invitation.InsertedDate;
                        DateTime expiredDate = date.AddDays(30);
                        if (expiredDate > DateTime.Now)
                        {
                            comment = Constants.PortalSettings.usage_invitation_active;
                        }
                        else if (expiredDate < DateTime.Now)
                        {
                            comment = Constants.PortalSettings.usage_invitation_expired;
                        }
                    }
                }
            }
            return comment;
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
        public string ConnectUsage { get; set; }
        
    }
}
