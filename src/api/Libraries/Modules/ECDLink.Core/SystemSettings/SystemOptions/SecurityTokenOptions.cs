using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Security.Tokens.TokenGroup)]
    public class SecurityTokenOptions
    {
        public string InvitationLinkExpiry { get; set; }

        public string OpenAccessInvitationExpiry { get; set; }
    }
}
