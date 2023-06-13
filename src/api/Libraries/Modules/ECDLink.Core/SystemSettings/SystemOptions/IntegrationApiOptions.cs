using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Proxies.Integration.SmartLinkApiGrouping)]
    public class IntegrationApiOptions
    {
        public string BaseUrl { get; set; }

        public string Key { get; set; }

        public string Mode { get; set; }
        public string MaskDataMode { get; set; }
        public string MaskDataNumber { get; set; }
        public string MaskDataEmail { get; set; }
        public string MaskDataIdNumber { get; set; }
    }
}
