using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Notifications.SMS.iTouch.iTouchGrouping)]
    public class iTouchOptions
    {
        public string BaseUrl { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }
    }
}
