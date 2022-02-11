using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Security.Jwt.JwtGroup)]
    public class JwtOptions
    {
        public string LongJwtLifespan { get; set; }

        public string ShortJwtLifespan { get; set; }
    }
}
