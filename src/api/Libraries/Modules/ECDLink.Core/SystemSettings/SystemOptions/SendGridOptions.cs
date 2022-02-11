using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

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
