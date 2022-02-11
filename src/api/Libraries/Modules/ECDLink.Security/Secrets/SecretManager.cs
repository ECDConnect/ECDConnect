using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ECDLink.Security.Secrets
{
    public static class SecretManager
    {
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            var secretKey = "iNivDmHLpUA223sqsfhqGbMRdRj1PVkH"; // todo: get this from somewhere secure
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));
        }

        public static SigningCredentials GetSigningCredentials(string algorithm = SecurityAlgorithms.HmacSha256)
        {
            return new SigningCredentials(GetSymmetricSecurityKey(), algorithm);
        }
    }
}
