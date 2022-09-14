using EcdLink.Api.CoreApi.Tenancy.Context;
using ECDLink.Tenancy.Exceptions;
using ECDLink.Tenancy.Extensions;
using ECDLink.Tenancy.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using ECDLink.Core.Extensions;

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
