using System.IO;
using System.Text.RegularExpressions;

namespace ECDLink.Core.Helpers
{
    public class DirectoryHelper
    {
        public static string GetApplicationRoot()
        {
            var exePath = Path.GetDirectoryName(System.Reflection
                              .Assembly.GetExecutingAssembly().CodeBase);

            Regex appPathMatcher = new Regex(@"(?<!fil)[A-Za-z]:\\+[\S\s]*");
            var appRoot = appPathMatcher.Match(exePath).Value;

            return appRoot;
        }
    }
}
