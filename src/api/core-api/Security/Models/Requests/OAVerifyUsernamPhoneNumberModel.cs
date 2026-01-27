namespace EcdLink.Api.CoreApi.Security.Models.Requests
{
    public class OAVerifyUsernamePhoneNumberModel
    {
        public string Username { get; set; }
        public string PhoneNumber { get; set; }
        public string UserId { get; set; }
        public string GoogleToken { get; set; }
        public string FacebookToken { get; set; }
    }
}
