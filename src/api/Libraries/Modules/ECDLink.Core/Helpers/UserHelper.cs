using System;
using System.Text.RegularExpressions;

namespace ECDLink.Core.Helpers
{
    public static class UserHelper
    {
        public static string NormalizePhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
            {
                return string.Empty;
            }

            var noSpacePhoneNumber = Regex.Replace(phoneNumber, @"^()|\D", "$1", RegexOptions.None, TimeSpan.FromMilliseconds(100));

            if (noSpacePhoneNumber.Contains("<"))
            {
                throw new Exception("Phone number not valid, try again");
            }

            // TODO: Support international phone numbers.
            if (noSpacePhoneNumber.StartsWith("+27"))
            {
                return noSpacePhoneNumber;
            }

            if (noSpacePhoneNumber.StartsWith("0"))
            {
                return $"+27{noSpacePhoneNumber.Substring(1, noSpacePhoneNumber.Length - 1)}";
            }

            if (noSpacePhoneNumber.StartsWith("27"))
            {
                return $"+{noSpacePhoneNumber}";
            }

            if (noSpacePhoneNumber.StartsWith("+"))
            {
                return $"{noSpacePhoneNumber}";
            }

            throw new Exception("Phone number not recognised for normalization");
        }
    }
}
