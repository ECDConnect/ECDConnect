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

namespace ECDLink.Tenancy.EntityFramework.Extensions
{
    public static class DbContextOptionsBuilderExtensions
    {
        public static void UseNpgsqlTenancy(this DbContextOptionsBuilder builder, IServiceProvider provider, string MigrationAssembly)
        {
            builder.AddInterceptors(new PostgresTenantDbConnectionInterceptor());

            builder.UseNpgsql("Server=localhost;Port=5432;Database=public;User Id=postgres;Password=admin");
        }
    }
}
