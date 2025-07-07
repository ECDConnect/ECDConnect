using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.Security.JwtSecurity.Configuration;
using ECDLink.Security.JwtSecurity.Encoders;
using ECDLink.Security.JwtSecurity.Enums;
using Microsoft.Extensions.Options;
using System;

namespace ECDLink.Security.JwtSecurity.Factories
{
    public class JwtFactory : IJwtFactory
    {
        private readonly JwtIssuerOptions _jwtIssuerOptions;
        private ISystemSetting<JwtOptions> _jwtOptions;

        public JwtFactory(IOptions<JwtIssuerOptions> jwtIssuerOptions, ISystemSetting<JwtOptions> jwtOptions)
        {
            _jwtIssuerOptions = jwtIssuerOptions.Value;
            _jwtOptions = jwtOptions;
        }

        public IJwtEncoder CreateJwtEncoder(JwtEncoderEnum encoderType)
        {
            switch (encoderType)
            {
                case JwtEncoderEnum.OneTime:
                    {
                        var localOptions = new JwtIssuerOptions
                        {
                            SigningCredentials = _jwtIssuerOptions.SigningCredentials,
                            Audience = _jwtIssuerOptions.Audience,
                            Issuer = _jwtIssuerOptions.Issuer,
                            ValidFor = TimeSpan.FromMinutes(double.Parse(_jwtOptions.Value.ShortJwtLifespan)),
                            Subject = _jwtIssuerOptions.Subject
                        };

                        return new OneTimeJwtEncoder(localOptions);
                    }
                case JwtEncoderEnum.Standard:
                    return new StandardJwtEncoder(_jwtIssuerOptions);
                default:
                    throw new NotImplementedException("Specified jwt encoder does not exist");
            }
        }
    }
}
