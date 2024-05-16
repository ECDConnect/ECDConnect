using ECDLink.Tenancy.Model;
using System;
using System.Threading;

namespace ECDLink.Tenancy.Context
{
    public static class TenantExecutionContext
    {
        /// <summary>
        /// Holds the Tenant in an <see cref="AsyncLocal{T}"/>, so it flows top-down.
        /// </summary>
        private static AsyncLocal<TenantInternalModel> tenant = new AsyncLocal<TenantInternalModel>();

        /// <summary>
        /// Gets the current Tenant 
        /// </summary>
        public static TenantInternalModel Tenant => tenant.Value;

        public static void SetTenant(TenantInternalModel value, bool acceptNullValue = false)
        {
            if (value == null)
            {
                if (acceptNullValue)
                {
                    tenant.Value = null;
                    return;
                }
                throw new InvalidOperationException($"No tenant available for context");
            }

            var currentTenant = tenant.Value;

            if (string.IsNullOrWhiteSpace(currentTenant?.Id.ToString()))
            {
                tenant.Value = value;

                return;
            }

            if (currentTenant.Id == value.Id)
            {
                // If trying to readd the same tenant, do nothing
                return;
            }

            //if (tenant.Value.TenantType == Enums.TenantType.Host)
            //{
            //    // Unique tenant context swap when admin needs to create a DB
            //    tenant.Value = value;
            //    return;
            //}

            // If tenant is already assigned, we cannot change
            throw new InvalidOperationException($"Tried assign the Tenant to '{value.ApplicationName}', but it is already set to {currentTenant.ApplicationName}");
        }
    }
}
