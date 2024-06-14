using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class PortalCoachModel
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public bool IsRegistered { get; set; }
        public DateTime? InsertedDate { get; set; }
        public PortalCoachUserModel User { get; set; }
    }

    public class PortalCoachUserModel : AppUsageModel
    {

        public PortalCoachUserModel(ApplicationUser user, bool isRegistered, DateTime? invitationDate, int? notificationResult)
            : base(user.IsActive, isRegistered, user.LastSeen, user.UpdatedDate, invitationDate, notificationResult)
        {
            Id = user.Id;
            IdNumber = user.IdNumber;
            InsertedDate = user.InsertedDate.Value.Date;
            LastSeen = user.LastSeen;
            FirstName = user.FirstName;
            Surname = user.Surname;
            FullName = user.FullName;
            UserName = user.UserName;
            PhoneNumber = user.PhoneNumber;
            Email = user.Email;
            IsActive = user.IsActive;
        }

        public Guid Id { get; set; }
        public string IdNumber { get; set; }
        public DateTime? InsertedDate { get; set; }
        public DateTime LastSeen { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; } = false;        
    }
}
