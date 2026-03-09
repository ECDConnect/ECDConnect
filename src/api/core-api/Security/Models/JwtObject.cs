namespace EcdLink.Api.CoreApi.Security.Models
{
    public class JwtObject
    {
        public string id { get; set; }
        public string auth_token { get; set; }
        public string expires_in { get; set; }
        public bool resetData { get; set; }
        public bool userMustConfirmAuthCode { get; set; } = false;
        public string loginType { get; set; } = "";
        public string userName { get; set; } = "";
    }
}
