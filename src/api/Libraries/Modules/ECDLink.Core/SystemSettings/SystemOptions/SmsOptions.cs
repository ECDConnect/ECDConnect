using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Notifications.SMS.Sms.SmsGrouping)]
    public class SmsOptions
    {
        public string Provider { get; set; }
    }
}
