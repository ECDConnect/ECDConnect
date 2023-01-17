using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Notifications.SMS.BulkSms.BulkSmsGrouping)]
    public class BulkSmsOptions
    {
        public string Name { get; set; }

        public string BaseUrl { get; set; }

        public string TokenId { get; set; }

        public string TokenSecret { get; set; }

        public string BasicAuthToken { get; set; }
    }
}
