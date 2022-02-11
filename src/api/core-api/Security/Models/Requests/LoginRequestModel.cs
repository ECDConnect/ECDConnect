namespace EcdLink.Api.CoreApi.Security.Models.Requests
{
    public class LoginRequestModel
    {
        public string Username { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
    }
}
