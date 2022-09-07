using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace ECDLink.Core.Extensions
{
    public static class StringExtensions
    {
        public static string LocaleSplit(this string locale)
        {
            var local = locale.Replace("-", string.Empty);

            return local.ToUpper();
        }

        public static string SplitCamelCase(this string input)
        {
            var split = Regex.Split(input, @"([A-Z]?[a-z]+)").Where(str => !string.IsNullOrEmpty(str));

            return string.Join(" ", split);
        }

        public static string NoSpace(this string input)
        {
            return input.Replace(" ", "");
        }

        public static string FirstCharToLowerCase(this string str)
        {
            if (string.IsNullOrEmpty(str) || char.IsLower(str[0]))
            {
                return str;
            }

            return char.ToLower(str[0]) + str.Substring(1);
        }

        public static int WordCount(this string str)
        {
            return str.Split(new char[] { ' ', '.', '?' },
                             StringSplitOptions.RemoveEmptyEntries).Length;
        }

        public static bool ContainsAny(this string str, params string[] values)
        {
            if (!string.IsNullOrEmpty(str) || values.Length > 0)
            {
                foreach (string value in values)
                {
                    if (str.Contains(value))
                        return true;
                }
            }

            return false;
        }

    }
}
