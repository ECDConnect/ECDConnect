using System;

namespace ECDLink.Security.JwtSecurity.Configuration
{
    public class JwtIssuerOverrides
    {
        public TimeSpan OneTimeTokenValidFor { get; set; } = TimeSpan.FromDays(1);
    }
}
