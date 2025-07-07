namespace ECDLink.Core.Caching.Configuration
{
    public class CachingSection
    {
        public static string Name = "Caching";

        public class CachingItem
        {
            public int SlidingExpiration { get; set; }
            public int AbsoluteExpiration { get; set; }
        }

        public CachingItem Content { get; set; }

        public CachingItem SystemSetting { get; set; }

        public CachingItem Tenant { get; set; }
    }
}
