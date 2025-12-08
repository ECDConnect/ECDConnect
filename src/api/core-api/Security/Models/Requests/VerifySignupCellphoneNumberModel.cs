namespace EcdLink.Api.CoreApi.Security.Models.Requests
{
    public class VerifySignupCellphoneNumberModel
    {
        public string Cellphone { get; set; }
        public string Token { get; set; }
        public string AuthCode { get; set; }
    }
}
