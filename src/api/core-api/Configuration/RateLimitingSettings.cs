using System;

namespace EcdLink.Api.CoreApi.Configuration
{
    public class RateLimiting
    {
        public int Limit { get; set; } = 0;
        public int PeriodInSeconds { get; set; } = 60;
    }

    public class RateLimitingSettings
    {
        public RateLimiting PerClient { get; set; } = new RateLimiting();
        public RateLimiting Global {  get; set;  } = new RateLimiting();
    }
}
