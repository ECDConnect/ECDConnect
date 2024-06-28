using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CommunityUserModel
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string ProfilePhoto { get; set; }
        public string RoleName { get; set; }
        
        public CommunityUserModel(ApplicationUser user, bool? shareEmail, bool? sharePhoneNumber, bool? shareProfilePhoto, bool? shareRole, List<string> userRoles)
        {
            Id = user.Id;
            FullName = user.FullName;
            Email = shareEmail.HasValue && shareEmail.Value ? user.Email : "";
            PhoneNumber = sharePhoneNumber.HasValue && sharePhoneNumber.Value ? user.PhoneNumber : "";
            ProfilePhoto = shareProfilePhoto.HasValue && shareProfilePhoto.Value ? user.ProfileImageUrl: "";
            RoleName = shareRole.HasValue && shareRole.Value ? string.Join(", ", userRoles): "";
        }

        public CommunityUserModel()
        {
        }
    }
    
}