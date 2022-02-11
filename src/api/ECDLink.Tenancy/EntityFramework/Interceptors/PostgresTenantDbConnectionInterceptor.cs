using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Tenancy.Context
{
    public class PostgresTenantDbConnectionInterceptor : DbConnectionInterceptor
    {
        public override InterceptionResult ConnectionOpening(
        DbConnection connection,
        ConnectionEventData eventData,
        InterceptionResult result)
        {
            if (TenantExecutionContext.Tenant != default(TenantModel))
            {
                if (!string.IsNullOrWhiteSpace(TenantExecutionContext.Tenant.ConnectionString))
                {
                    connection.ConnectionString = TenantExecutionContext.Tenant.ConnectionString;
                }
            }

            return result;
        }

        public override async ValueTask<InterceptionResult> ConnectionOpeningAsync(
            DbConnection connection,
            ConnectionEventData eventData,
            InterceptionResult result,
            CancellationToken cancellationToken = default)
        {
            if (TenantExecutionContext.Tenant != default(TenantModel))
            {
                if (!string.IsNullOrWhiteSpace(TenantExecutionContext.Tenant.ConnectionString))
                {
                    connection.ConnectionString = TenantExecutionContext.Tenant.ConnectionString;
                }
            }

            return result;
        }
    }
}
