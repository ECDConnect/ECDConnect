using ECDLink.Core.Extensions;
using ECDLink.Core.Helpers;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Security.JwtSecurity.Enums;
using ECDLink.Security.JwtSecurity.Factories;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECDLink.Security.JwtSecurity.Managers
{
    public class JwtTokenManager
    {
        private IJwtFactory _jwtFactory;
        private IJWTService _jwtService;
        private readonly IClaimsManager _claimsManager;
        private readonly TokenValidationParameters _parameters;

        public JwtTokenManager(
            IJwtFactory jwtFactory,
            IClaimsManager claimsManager,
            [Service] IJWTService jWTService,
            TokenValidationParameters parameters
            )
        {
            _jwtFactory = jwtFactory;
            _claimsManager = claimsManager;
            _parameters = parameters;
            _jwtService = jWTService;
        }

        public async Task<string> GenerateJwt(ClaimsIdentity identity, string userId, JwtEncoderEnum encoderType, bool? resetData)
        {
            var jwtEncoder = _jwtFactory.CreateJwtEncoder(encoderType);

            if (encoderType.Equals(JwtEncoderEnum.OneTime))
            {
                var response = new
                {
                    id = identity.Claims.Single(c => c.Type == "id").Value,
                    auth_token = await jwtEncoder.GenerateEncodedToken(userId, identity.Claims),
                    expires_in = (int)jwtEncoder.Options.ValidFor.TotalSeconds,
                };
                return JsonConvert.SerializeObject(response, new JsonSerializerSettings() { Formatting = Formatting.Indented });
            }
            else
            {

                var response = new
                {
                    id = identity.Claims.Single(c => c.Type == "id").Value,
                    auth_token = await jwtEncoder.GenerateEncodedToken(userId, identity.Claims),
                    expires_in = (int)jwtEncoder.Options.ValidFor.TotalSeconds,
                    resetData = resetData != null ? resetData : false,
                };

                return JsonConvert.SerializeObject(response, new JsonSerializerSettings() { Formatting = Formatting.Indented });
            }
        }

        public async Task<bool> CanRefreshToken(string token)
        {
            var result = GetValidClaimPrincipal(token, false, out var principal);

            if (!result)
            {
                return false;
            }

            if (principal.Claims.Any(x =>
                string.Equals(x.Type, SecurityConstants.Strings.JwtClaimIdentifiers.Type)
                && string.Equals(x.Value, SecurityConstants.Strings.JwtTokenTypes.OneTimeToken)))
            {
                return false;
            }

            return true;
        }

        public bool GetValidClaimPrincipal(string jwt, out ClaimsPrincipal principal)
        {
            return GetValidClaimPrincipal(jwt, true, out principal);
        }

        public bool GetValidClaimPrincipal(string jwt, bool validateLifetime, out ClaimsPrincipal principal)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var parameters = _parameters;
            if (!validateLifetime && _parameters.ValidateLifetime)
            {
                parameters = _parameters.Clone();
                parameters.ValidateLifetime = false;
            }
            principal = jwtTokenHandler.ValidateToken(jwt, parameters, out var validatedToken);

            if (principal == default)
            {
                return false;
            }

            return true;
        }

        public bool GetValidUserWithToken(string jwt, out IdentityUser<Guid> user)
        {
            return GetValidUserWithToken(jwt, true, out user);
        }

        public bool GetValidUserWithToken(string jwt, bool validateLifetime, out IdentityUser<Guid> user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            user = null;

            try
            {
                // Validation 1 - Validation JWT token format
                var parameters = _parameters;
                if (!validateLifetime && parameters.ValidateLifetime)
                {
                    parameters = _parameters.Clone();
                    parameters.ValidateLifetime = false;
                }
                var tokenInVerification = jwtTokenHandler.ValidateToken(jwt, parameters, out var validatedToken);

                // Validation 2 - Validate encryption alg
                if (validatedToken is JwtSecurityToken jwtSecurityToken)
                {
                    var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);

                    if (result == false)
                    {
                        return false;
                    }
                }

                // Validation 3 - validate expiry date
                var utcExpiryDate = long.Parse(tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp).Value);

                var expiryDate = DateTimeHelper.GetDateFromEpoch(utcExpiryDate).AddDays(35);

                var expiryDateValue = expiryDate.ToEpochTime();
                var currentDateValue = DateTime.UtcNow.ToEpochTime();

                if (expiryDateValue < currentDateValue)
                {
                    return false;
                }

                // Validation 4 - Validate the user issued exists
                user = _claimsManager.GetClaimUser<IdentityUser<Guid>>(tokenInVerification);

                if (user == default)
                {
                    return false;
                }

                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public async Task<JWTUserTokensEntityReturn> StoreJWTToken(string auth_token, string expiresIn, string contextIdentifier, string role)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            //remove previous tokens first
            _jwtService.InvalidateExistingTokens(Guid.Parse(contextIdentifier));

            var insertedJWTToken = _jwtService.InsertToken(new JWTUserTokensEntity() { InsertedDate = DateTime.Now, UserId = Guid.Parse(contextIdentifier), Token = auth_token, TokenKey = Guid.NewGuid().ToString(), ExpiresIn = expiresIn, TenantId = tenantId, Role = role });
            return new JWTUserTokensEntityReturn() { id = insertedJWTToken.TokenKey, auth_token = insertedJWTToken.TokenKey, expires_in = insertedJWTToken.ExpiresIn };
        }

        public async Task<bool> InvalidateExistingTokens(string contextIdentifier)
        {
            return _jwtService.InvalidateExistingTokens(Guid.Parse(contextIdentifier));
        }

        public async Task<JWTUserTokensEntity> GetJWTTokenByToken(string auth_token)
        {
            return _jwtService.GetByToken(auth_token);
        }
        public async Task<JWTUserTokensEntity> GetJWTTokenById(string id)
        {
            return _jwtService.GetById(Guid.Parse(id));
        }


        public List<string> GetJWTTokenRole(string id)
        {
            var obfuscatedToken = GetJWTTokenById(id);

            return obfuscatedToken.Result.Role.Split(',').ToList();
        }

    }
}
