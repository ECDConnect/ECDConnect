using ECDLink.Security.JwtSecurity.Encoders;
using ECDLink.Security.JwtSecurity.Enums;

namespace ECDLink.Security.JwtSecurity.Factories
{
    public interface IJwtFactory
    {
        IJwtEncoder CreateJwtEncoder(JwtEncoderEnum encoderType);
    }
}
