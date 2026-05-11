using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ECDLink.Security.Secrets
{
    public static class SecretManager
    {
        public static SymmetricSecurityKey GetSymmetricSecurityKey(string key)
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));
        }

        public static SigningCredentials GetSigningCredentials(string key, string algorithm = SecurityAlgorithms.HmacSha256)
        {
            return new SigningCredentials(GetSymmetricSecurityKey(key), algorithm);
        }
    }
}
