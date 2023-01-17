using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Children.ChildrenGroupBase)]
    public class ChildrenOptions
    {
        public string ChildObservationPeriod { get; set; }

        public string ChildExpiryTime { get; set; }
    }
}
