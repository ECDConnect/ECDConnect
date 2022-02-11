using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Proxies.Holiday.RapidApi.RapidApiGrouping)]
    public class RapidApiOptions
    {
        public string Name { get; set; }

        public string BaseUrl { get; set; }

        public string Host { get; set; }

        public string Key { get; set; }
    }
}
