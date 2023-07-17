using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Notifications.SMS.SMSPortal.SMSPortalGrouping)]
    public class SMSPortalOptions
    {
        public string BaseUrl { get; set; }

        public string ApiKey { get; set; }

        public string ApiSecret { get; set; }
    }
}
