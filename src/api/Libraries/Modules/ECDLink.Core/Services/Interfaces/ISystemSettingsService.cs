using ECDLink.Core.Models.Settings;
using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface ISystemSettingsService
    {
        public IEnumerable<ISetting> GetSystemSettings();
    }
}
