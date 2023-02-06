using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Invitation.InvitationCutoffDelay)]
    public class InvitationCutoffDelayOptions
    {
        public string InvitationCutoffDelay { get; set; }

    }
}
