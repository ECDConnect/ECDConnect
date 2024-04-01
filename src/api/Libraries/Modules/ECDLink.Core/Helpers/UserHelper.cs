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

            if (noSpacePhoneNumber.Length == 9 && !noSpacePhoneNumber.StartsWith("0"))
            {
                return $"+27{noSpacePhoneNumber}";
            }
                
            return phoneNumber;
            //throw new Exception("Phone number not recognised for normalization");
        }

        public static bool IsSAIDValid(string southAfricanIdNumber)
        {
            if (southAfricanIdNumber?.Length != 13)
                return false;

            if (Regex.IsMatch(
                        southAfricanIdNumber,
                        @"\D",
                        RegexOptions.IgnoreCase,
                        TimeSpan.FromMilliseconds(200)))
                return false;
            return true;

            /*
            var resultIntArray = southAfricanIdNumber
                .ToCharArray()
                .Select(c => int.Parse(c.ToString()))
                .Reverse();

            int i = 0;
            var finalResult = resultIntArray.Aggregate(new List<int>(), (acc, c) => {
                if (i % 2 == 1) {
                    var oddDigitSum = c * 2;
                    acc.Add(oddDigitSum > 9 ? oddDigitSum - 9 : oddDigitSum);
                }
                else
                    acc.Add(c * 1);

                i++;
                return acc;
            }).Aggregate(0, (acc, d) => {
                return acc + d;
            });

            return finalResult % 10 == 0;
            */
        }

        public static string CoerceValidSAID(string shortSouthAfricanIdNumber)
        { 
            if (shortSouthAfricanIdNumber is null)
                return null;

            return shortSouthAfricanIdNumber.PadLeft(13, '0');
        }

            // Warning: When using System.Text.RegularExpressions to process untrusted input, pass a timeout. Default is INFINITE.
            // A malicious user can provide input to RegularExpressions, causing a Denial-of - Service attack.
            // ASP.NET Core framework APIs that use RegularExpressions pass a timeout.

            public static bool IsEmailValid(string email)
        {
            return Regex.IsMatch(
                        email, 
                        @"^[^@\s]+@[^@\s]+\.[^@\s]+$", 
                        RegexOptions.IgnoreCase,
                        TimeSpan.FromMilliseconds(200));
        }
    }
}
