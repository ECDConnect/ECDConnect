using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Proxies.Integration.SmartLinkApiGrouping)]
    public class IntegrationApiOptions
    {
        public string BaseUrl { get; set; }

        public string Key { get; set; }

        public string Mode { get; set; }
    }
}
