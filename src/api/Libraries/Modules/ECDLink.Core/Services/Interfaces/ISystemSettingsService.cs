using ECDLink.Core.Models.Settings;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface ISystemSettingsService
    {
        public Task<IEnumerable<ISetting>> GetSystemSettings();
    }
}
