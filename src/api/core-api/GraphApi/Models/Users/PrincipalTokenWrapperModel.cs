using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class PrincipalPractitionerTokenWrapperModel
    {
        public Guid AddedByUserId { get; set; }
        public Guid AddedToUserId { get; set; }
        public string Token { get; set; }
        public string PreSchoolNameCode { get; set; }
        public string PhoneNumber { get; set; }
        public string IdNumber { get; set; }
        public string UserName { get; set; }
    }
}
