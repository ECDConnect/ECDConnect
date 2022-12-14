using System.Text.RegularExpressions;

namespace ECDLink.Security.Helpers
{
    public static class AuthenticationHelper
    {
        public static string ObscureEmail(string email)
        {
            return Regex.Replace(email, @"/(\w{3})[\w.-]+@([\w.]+\w)/", "$1***@$2");
        }

        public static string ObscurePhoneNumber(string number)
        {
            var pivotPoint = number.Length - 4;

            return $"{new string('x', pivotPoint)}{number.Substring(pivotPoint)}";
        }

        public static string ObscureIdNumber(string number)
        {
            var pivotPoint = number.Length - 4;

            return $"{new string('x', pivotPoint)}{number.Substring(pivotPoint)}";
        }
        public static string ObscureText(string number)
        {
            var pivotPoint = number.Length - 4;

            return $"{new string('x', pivotPoint)}{number.Substring(pivotPoint)}";
        }

    }
}
