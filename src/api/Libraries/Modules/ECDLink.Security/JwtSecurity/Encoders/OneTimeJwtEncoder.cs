using ECDLink.Core.Extensions;
using ECDLink.Security.JwtSecurity.Configuration;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using NPOI.Util;

namespace ECDLink.Security.JwtSecurity.Encoders
{
    public class OneTimeJwtEncoder : IJwtEncoder
    {
        public JwtIssuerOptions Options { get; private set; }

        public OneTimeJwtEncoder(JwtIssuerOptions jwtOptions)
        {
            Options = jwtOptions;
            ThrowIfInvalidOptions(Options);
        }

        public async Task<string> GenerateEncodedToken(string userId, IEnumerable<Claim> claims)
        {
            // UPDATED WITH .NET 8 - added NPO package
            var fullClaims = (List<Claim>)claims.Copy();

            fullClaims.Add(new Claim(JwtRegisteredClaimNames.Sub, userId));
            fullClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, await Options.JtiGenerator()));
            fullClaims.Add(new Claim(JwtRegisteredClaimNames.Iat, Options.IssuedAt.ToEpochTime().ToString(), ClaimValueTypes.Integer64));
            fullClaims.Add(new Claim(SecurityConstants.Strings.JwtClaimIdentifiers.Type, SecurityConstants.Strings.JwtTokenTypes.OneTimeToken));
            fullClaims.Add(new Claim(TenancyConstants.Jwt.TenantJwtClaim, TenantExecutionContext.Tenant.GetClaimString()));

            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                issuer: Options.Issuer,
                audience: Options.Audience,
                claims: fullClaims,
                notBefore: Options.NotBefore,
                expires: Options.Expiration,
                signingCredentials: Options.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }

        private static void ThrowIfInvalidOptions(JwtIssuerOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtIssuerOptions.ValidFor));
            }

            if (options.SigningCredentials == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.SigningCredentials));
            }

            if (options.JtiGenerator == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.JtiGenerator));
            }
        }
    }
}
