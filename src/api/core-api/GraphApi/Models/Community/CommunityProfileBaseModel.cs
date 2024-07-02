using ECDLink.DataAccessLayer.Entities.Community;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CommunityProfileBaseModel
    {
        public Guid Id { get; set; }
        public Guid FromUserId { get; set; }
        public Guid ToUserId { get; set; }
        public string AboutShort { get; set; }
        public string AboutLong { get; set; }
        public bool? ShareEmail { get; set; }
        public bool? SharePhoneNumber { get; set; }
        public bool? ShareProfilePhoto { get; set; }
        public bool? ShareProvince { get; set; }
        public Guid? ProvinceId { get; set; }
        public string ProvinceName { get; set; }
        public bool? ShareRole { get; set; }
        public bool? InviteAccepted { get; set; }
        public CommunityUserModel CommunityUser { get; set; }

        public CommunityProfileBaseModel(CommunityProfile profile, List<string> userRoles)
        {
            Id = profile.Id;
            FromUserId = profile.FromUserId;
            ToUserId = profile.ToUserId;
            AboutShort = profile.AboutShort;
            AboutLong = profile.AboutLong;
            ShareEmail = profile.ShareEmail;
            SharePhoneNumber = profile.SharePhoneNumber;
            ShareProfilePhoto = profile.ShareProfilePhoto;
            ShareProvince = profile.ShareProvince;
            ProvinceId = profile.ProvinceId;
            ProvinceName = profile.Province != null ? profile.Province.Description: "";
            ShareRole = profile.ShareRole;
            InviteAccepted = profile.InviteAccepted;
            CommunityUser = new CommunityUserModel(profile.ToUser, profile.ShareEmail, profile.SharePhoneNumber, profile.ShareProfilePhoto, profile.ShareRole, userRoles);
        }

        public CommunityProfileBaseModel()
        {
        }
    }
}
