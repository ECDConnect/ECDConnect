using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Proxies.UrlShortner.UrlShortnerGroupBase)]
    public class UrlShortnerOptions
    {
        public string RedirectUrl { get; set; }
    }
}
