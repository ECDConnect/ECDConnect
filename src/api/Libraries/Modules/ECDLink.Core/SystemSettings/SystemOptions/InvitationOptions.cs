using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.CallBacks.Invitations.InvitationsGrouping)]
    public class InvitationOptions
    {
        public string Signup { get; set; }
        public string AdminSignup { get; set; }
        public string TeamLeadSignup { get; set; }
    }
}
