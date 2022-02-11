namespace EcdLink.Api.CoreApi.Security.Models.Requests
{
    public class VerifyInvitationModel
    {
        public string Username { get; set; }

        public string Token { get; set; }

        public string PhoneNumber { get; set; }
    }
}
