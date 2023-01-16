using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Proxies.Integration.SmartLinkApiGrouping)]
    public class IntegrationApiOptions
    {
        public string Url { get; set; }

        public string Key { get; set; }
    }
}
