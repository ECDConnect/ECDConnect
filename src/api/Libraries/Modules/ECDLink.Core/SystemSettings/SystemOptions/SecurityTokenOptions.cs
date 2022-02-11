using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Security.Tokens.TokenGroup)]
    public class SecurityTokenOptions
    {
        public string InvitationLinkExpiry { get; set; }

        public string OpenAccessInvitationExpiry { get; set; }
    }
}
