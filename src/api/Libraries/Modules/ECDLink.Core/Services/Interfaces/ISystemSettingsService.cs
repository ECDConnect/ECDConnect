using ECDLink.Core.Models.Settings;
using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface ISystemSettingsService
    {
        public IEnumerable<ISetting> GetSystemSettings();

        /// <summary>
        /// Every tenant's settings, for building the GraphQL schema, which is shared by all tenants
        /// and built when no request (and so no tenant) exists. Use the values only for shape.
        /// </summary>
        public IEnumerable<ISetting> GetSystemSettingsForAllTenants();
    }
}
