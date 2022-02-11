using ECDLink.Core.Models.Settings;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.Services.Interfaces
{
    public interface ISystemSetting<T>
    {
        T GetSettings(string settingsGroup);

        T Value { get; }
    }
}
