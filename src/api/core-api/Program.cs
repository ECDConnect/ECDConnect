using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System;

namespace EcdLink.Api.CoreApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // TODO: Upgrading to NPGSQL 6 has some changes:
            // https://www.npgsql.org/efcore/release-notes/6.0.html?tabs=annotations#opting-out-of-the-new-timestamp-mapping-logic
            // We will need to migrate our DateTimes to be in UTC or keep storing "localtime"
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            // PGSQL Now breaks DateTime.Min and .Max
            // https://www.npgsql.org/efcore/release-notes/6.0.html?tabs=annotations#datetime-minmax-values-are-now-converted-to-postgresql-infinity-values-by-default
            AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", false);

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
