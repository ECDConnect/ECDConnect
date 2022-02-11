namespace EcdLink.Api.CoreApi.Security.Models.Requests
{
    public class PasswordResetModel
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public string ResetToken { get; set; }
    }
}
