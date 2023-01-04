using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Proxies.Integration.SmartLinkApiGrouping)]
    public class IntegrationApiOptions
    {
        public string Url { get; set; }

        public string Key { get; set; }
    }
}
