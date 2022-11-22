using System;

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

            var noSpacePhoneNumber = phoneNumber.Replace(" ", "");

            if (noSpacePhoneNumber.Contains("<"))
            {
                throw new Exception("Phone number not valid, try again");
            }

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

            throw new Exception("Phone number not recognised for normalization");
        }
    }
}
