using System;

namespace ECDLink.Core.Helpers
{
    public static class DocumentHelper
    {
        public static string GetFileName(string url)
        {
            var uri = new Uri(url);

            return uri.Segments[uri.Segments.Length - 1];
        }
    }
}
