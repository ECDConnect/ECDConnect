using System;

namespace EcdLink.Api.CoreApi.Security.Models.Requests
{
    public class UpdateUserNameModel
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
        public bool ShareInfo { get; set; } = false;
        public string RegisterType { get; set; }
        public string AcquisitionUrl { get; set; }
        public string UtmSource { get; set; }
        public string UtmMedium { get; set; }
        public string UtmCampaign { get; set; }
    }
}
