using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.CallBacks.Invitations.InvitationsGrouping)]
    public class InvitationOptions
    {
        public string Signup { get; set; }
    }
}
