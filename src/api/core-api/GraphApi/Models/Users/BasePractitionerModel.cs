using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class BasePractitionerModel
    {
        public Guid UserId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string ProfileImageUrl { get; set; }
    }
}
