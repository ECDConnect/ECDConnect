using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.CallBacks.Security.SecurityGrouping)]
    public class SecurityNotificationOptions
    {
        public string ForgotPassword { get; set; }

        public string Login { get; set; }
    }
}
