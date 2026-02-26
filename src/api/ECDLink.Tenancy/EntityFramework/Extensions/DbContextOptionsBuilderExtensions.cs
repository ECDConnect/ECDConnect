using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ECDLink.Tenancy.EntityFramework.Extensions
{

    public static class DbContextOptionsBuilderExtensions
    {

        public static void UseNpgsqlTenancy(this DbContextOptionsBuilder builder, IConfiguration config)
        {
            var connectionString = config.GetConnectionString("DefaultConnection");
            builder.UseNpgsql(connectionString);
        }
    }
}
