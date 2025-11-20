namespace EcdLink.Api.CoreApi.Security.Models.Requests
{
    public class VerifyPasswordTokenModel
    {
        public string Username { get; set; }
        public string Token { get; set; }
    }
}
