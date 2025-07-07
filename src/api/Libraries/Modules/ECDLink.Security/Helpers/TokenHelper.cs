using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace ECDLink.Security.Helpers
{
    public static class TokenHelper
    {
        public static string EncodeToken(string token)
        {
            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
            return WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
        }

        public static string DecodeToken(string encodedToken)
        {
            var codeDecodedBytes = WebEncoders.Base64UrlDecode(encodedToken);
            return Encoding.UTF8.GetString(codeDecodedBytes);
        }
    }
}
