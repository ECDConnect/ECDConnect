using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CommunityUserModel
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string ProfilePhoto { get; set; }
        public string RoleName { get; set; }
        public string UserName { get; set; }
        
        public CommunityUserModel(ApplicationUser user, List<string> userRoles)
        {
            Id = user.Id;
            FullName = user.FullName;
            UserName = user.UserName;
            FirstName = user.FirstName;
            Email = user.Email;
            PhoneNumber = user.PhoneNumber;
            WhatsAppNumber = user.WhatsAppNumber;
            ProfilePhoto = user.ProfileImageUrl;
            RoleName = userRoles != null ? string.Join(", ", userRoles) : "";
        }

        public CommunityUserModel()
        {
        }
    }
    
}