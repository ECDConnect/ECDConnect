using ECDLink.Security.JwtSecurity.Configuration;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECDLink.Security.JwtSecurity.Encoders
{
    public interface IJwtEncoder
    {
        JwtIssuerOptions Options { get; }

        Task<string> GenerateEncodedToken(string userId, IEnumerable<Claim> claims);
    }
}
