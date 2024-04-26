namespace ECDLink.Core.Caching.Configuration
{
    public class CachingSection
    {
        public static string Name = "Caching";

        public class ContentSection
        {
            public int SlidingExpiration { get; set; }
            public int AbsoluteExpiration { get; set; }
        }

        public ContentSection Content { get; set; }
    }
}
