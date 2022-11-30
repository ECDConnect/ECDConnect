using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Absentee.AbsenteeCutoffDelay)]
    public class AbsenteeCutoffDelayOptions
    {
        public string AbsenteeCutoffDelay { get; set; }

    }
}
