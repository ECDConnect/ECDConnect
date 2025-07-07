namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class ChildTokenAccessModel
    {
        public TokenAccessChildDetailModel Child { get; set; }

        public TokenAccessPractitionerDetailModel Practitoner { get; set; }

        public string AccessToken { get; set; }
    }

    public class TokenAccessChildDetailModel
    {
        public string Firstname { get; set; }

        public string Surname { get; set; }

        public string GroupName { get; set; }

        public string UserId { get; set; }
    }

    public class TokenAccessPractitionerDetailModel
    {
        public string Firstname { get; set; }

        public string Surname { get; set; }

        public string PhoneNumber { get; set; }
    }
}
