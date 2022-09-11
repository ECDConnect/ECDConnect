using ECDLink.Core.Extensions;
using ECDLink.Tenancy;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace EcdLink.Api.CoreApi.Tenancy.Context
{
    public class PostgresTenantDbConnectionInterceptor : DbConnectionInterceptor
    {
        private readonly IConfiguration _config;

        public override InterceptionResult ConnectionOpening(
        DbConnection connection,
        ConnectionEventData eventData,
        InterceptionResult result)
        {
            //var franchisor = _config.GetSection<FranchisorConfiguration>(TenancyConstants.Configuration.TenantSettings);
            if (TenantExecutionContext.Tenant != default(TenantModel))
            {
                //if (!string.IsNullOrWhiteSpace(franchisor.ConnectionString))//TenantExecutionContext.Tenant.ConnectionString))
                //{
                //    //connection.ConnectionString = franchisor.ConnectionString;//TenantExecutionContext.Tenant.ConnectionString;
                //}
            }

            return result;
        }

        public override async ValueTask<InterceptionResult> ConnectionOpeningAsync(
            DbConnection connection,
            ConnectionEventData eventData,
            InterceptionResult result,
            CancellationToken cancellationToken = default)
        {
            //var franchisor = _config.GetSection<FranchisorConfiguration>(TenancyConstants.Configuration.TenantSettings);
            if (TenantExecutionContext.Tenant != default(TenantModel))
            {
                //if (!string.IsNullOrWhiteSpace(franchisor.ConnectionString))//TenantExecutionContext.Tenant.ConnectionString))
                //{
                //    //connection.ConnectionString = franchisor.ConnectionString;//TenantExecutionContext.Tenant.ConnectionString;
                //}
            }

            return result;
        }
    }
}
