using System.Linq;
using System.Text.RegularExpressions;

namespace ECDLink.Core.Extensions
{
    public static class StringExtensions
    {
        public static string[] GetMessagePlaceHolders(this string str, string startPlaceHolder = @"\[\[", string endPlaceHolder = @"\]\]")
        {
            var regex = $"({startPlaceHolder})[^\\]]*({endPlaceHolder})";
            MatchCollection matches = Regex.Matches(str, regex,
                                              RegexOptions.IgnoreCase);

            return matches.Select(x => x.Value.Trim().Replace("[[", "").Replace("]]", "")).ToArray();
        }

        public static string LocaleSplit(this string locale)
        {
            var local = locale.Replace("-", string.Empty);

            //var data = locale.Split("-");
            //var newLocale = $"{data[0]}{data[1]}"; 
            return local.ToUpper();
        }
    }
}
