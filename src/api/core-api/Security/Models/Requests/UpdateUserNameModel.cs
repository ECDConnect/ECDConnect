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
    }
}
