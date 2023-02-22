using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.CallBacks.Security.SecurityGrouping)]
    public class SecurityNotificationOptions
    {
        public string ForgotPassword { get; set; }

        public string VerifyEmail { get; set; }

        public string Login { get; set; }
    }
}
