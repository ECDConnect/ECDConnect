using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Proxies.UrlShortner.UrlShortnerGroupBase)]
    public class UrlShortnerOptions
    {
        public string RedirectUrl { get; set; }
    }
}
