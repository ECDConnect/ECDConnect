using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace ECDLink.Core.Extensions
{
    public static class StringExtensions
    {
        public static string[] GetMessagePlaceHolders(this string str, string startPlaceHolder = "[[", string endPlaceHolder = "]]")
        {
            var escapedStartPlaceHolder = Regex.Escape(startPlaceHolder);
            var escapedEndPlaceHolder = Regex.Escape(endPlaceHolder);
            var regex = $"({escapedStartPlaceHolder})[^\\]\\[]+({escapedEndPlaceHolder})";

            MatchCollection matches = Regex.Matches(str, regex, RegexOptions.IgnoreCase);

            return matches.Select(x => x.Value.Trim().Replace(startPlaceHolder, "").Replace(endPlaceHolder, "")).Distinct().ToArray();
        }
    }
}
