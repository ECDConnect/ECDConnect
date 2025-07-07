using ECDLink.DataAccessLayer.Entities.Community;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CommunityProfileBaseModel
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public string AboutShort { get; set; }
        public string AboutLong { get; set; }
        public bool? ShareContactInfo { get; set; }
        public bool? ShareEmail { get; set; }
        public bool? SharePhoneNumber { get; set; }
        public bool? ShareProfilePhoto { get; set; }
        public bool? ShareProvince { get; set; }
        public Guid? ProvinceId { get; set; }
        public string ProvinceName { get; set; }
        public bool? ShareRole { get; set; }
        public CommunityUserModel CommunityUser { get; set; }
        public DateTime InsertedDate { get; set; }
        public List<CommunityProfileSkillModel> ProfileSkills { get; set; }

        public CommunityProfileBaseModel(CommunityProfile profile, List<string> userRoles)
        {
            Id = profile.Id;
            UserId = profile.UserId;
            AboutShort = profile.AboutShort;
            AboutLong = profile.AboutLong;
            ShareContactInfo = profile.ShareContactInfo;
            ShareEmail = profile.ShareEmail;
            SharePhoneNumber = profile.SharePhoneNumber;
            ShareProfilePhoto = profile.ShareProfilePhoto;
            ShareProvince = profile.ShareProvince;
            ProvinceId = profile.ProvinceId;
            ProvinceName = profile.Province != null ? profile.Province.Description: "";
            ShareRole = profile.ShareRole;
            CommunityUser = new CommunityUserModel(profile.User, userRoles);
            InsertedDate = profile.InsertedDate;
            ProfileSkills = profile.ProfileSkills.Select(x => new CommunityProfileSkillModel(x.CommunitySkill, x.IsActive)).Where(x => x.IsActive).OrderBy(x => x.Ordering).ToList();
        }

        public CommunityProfileBaseModel()
        {
        }
    }
}
