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
        public string AcquisitionUrl { get; set; }
        public string UtmSource { get; set; }
        public string UtmMedium { get; set; }
        public string UtmCampaign { get; set; }
        public bool ShareInfoPartners { get; set; }
        public string GoogleToken { get; set; }
        public string FacebookToken { get; set; }
    }
}
