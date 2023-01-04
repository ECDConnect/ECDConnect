using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Invitation.InvitationCutoffDelay)]
    public class IntegrationDelayOptions
    {
        public string IntegrationDelay { get; set; }

    }
}
