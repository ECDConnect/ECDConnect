using System;

namespace EcdLink.Api.CoreApi.Security.Models
{
    public class JwtObfuscatedObject
    {
        public string UserId { get; set; }
        public string TokenKey { get; set; }
        public string Token { get; set; }
        public string JWTToken { get; set; }
        public Guid TenantId { get; set; }
        public string ExpiresIn { get; set; }
        public DateTime InsertedDate { get; set; }
    }
}
