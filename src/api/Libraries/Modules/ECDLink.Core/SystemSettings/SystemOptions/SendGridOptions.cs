using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Notifications.Email.SendGrid.SendGridGrouping)]
    public class SendGridOptions
    {
        public string User { get; set; }

        public string Key { get; set; }

        public string FromEmail { get; set; }

    }
}
