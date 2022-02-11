using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Security.JwtSecurity.Configuration
{
    public class JwtIssuerOverrides
    {
        public TimeSpan OneTimeTokenValidFor { get; set; } = TimeSpan.FromDays(1);
    }
}
