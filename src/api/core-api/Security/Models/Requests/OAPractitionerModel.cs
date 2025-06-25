namespace EcdLink.Api.CoreApi.Security.Models.Requests
{
    public class OAPractitionerModel
    {
        // For Facebook save the id/number to Username
        // For Google save the email to Username
        public string Username { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string RegisterType { get; set; } // username, google, facebook
        public bool ShareInfoPartners { get; set; }
    }
}
