using System;

namespace ECDLink.Core.Attributes
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class SettingGroupAttribute : Attribute
    {
        public string SettingGroup { get; private set; }

        public SettingGroupAttribute(string name)
        {
            SettingGroup = name;
        }
    }
}
