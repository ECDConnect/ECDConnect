using System;

namespace ECDLink.Security.JwtSecurity
{
    public class AspNetJWTSession
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public string Token { get; set; }
        public DateTime InsertedDate { get; set; }
    }
}
