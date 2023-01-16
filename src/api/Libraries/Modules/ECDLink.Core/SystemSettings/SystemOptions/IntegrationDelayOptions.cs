using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Invitation.InvitationCutoffDelay)]
    public class IntegrationDelayOptions
    {
        public string IntegrationDelay { get; set; }

    }
}
