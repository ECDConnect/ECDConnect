using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CommunityProfileInputModel
    {
        public Guid UserId { get; set; }
        public string AboutShort { get; set; }
        public string AboutLong { get; set; }
        public bool? ShareContactInfo { get; set; }
        public bool? ShareEmail { get; set; }
        public bool? SharePhoneNumber { get; set; }
        public bool? ShareProfilePhoto { get; set; }
        public bool? ShareProvince { get; set; }
        public bool? ShareRole { get; set; }
        public Guid? ProvinceId { get; set; }
        public List<Guid> CommunitySkillIds { get; set; }
    }
}
