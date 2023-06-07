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

        public static void UseNpgsqlTenancy(this DbContextOptionsBuilder builder, IConfiguration config)
        {
            var conf = config.GetSection<FranchisorConfiguration>(TenancyConstants.Configuration.TenantSettings);
            builder.AddInterceptors(new PostgresTenantDbConnectionInterceptor());

            builder.UseNpgsql(conf.ConnectionString);
        }
    }
}
