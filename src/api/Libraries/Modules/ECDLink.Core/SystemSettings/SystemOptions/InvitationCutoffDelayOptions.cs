using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Invitation.InvitationCutoffDelay)]
    public class InvitationCutoffDelayOptions
    {
        public string InvitationCutoffDelay { get; set; }

    }
}
