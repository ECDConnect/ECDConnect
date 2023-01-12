using EcdLink.Api.CoreApi.Tenancy.Context;
using ECDLink.Core.Extensions;
using ECDLink.Tenancy.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;

namespace ECDLink.Tenancy.EntityFramework.Extensions
{

    public static class DbContextOptionsBuilderExtensions
    {

        public static void UseNpgsqlTenancy(this DbContextOptionsBuilder builder, IServiceProvider provider, string MigrationAssembly, IConfiguration config)
        {
            IConfiguration _config = config;

            var conf = _config.GetSection<FranchisorConfiguration>(TenancyConstants.Configuration.TenantSettings);
            builder.AddInterceptors(new PostgresTenantDbConnectionInterceptor());

            builder.UseNpgsql(conf.ConnectionString);
        }
    }
}
