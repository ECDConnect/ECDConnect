using System.Linq;

namespace ECDLink.Core.SystemSettings
{
    public static class SettingGroupHelper
    {
        private const string Delimiter = ".";

        public static string GetParentGroup(string setting)
        {
            var settingsSplit = setting.Split(Delimiter);

            return settingsSplit[settingsSplit.Count() - 1];
        }

        public static string GetSettingName(string setting)
        {
            var settingsSplit = setting.Split(Delimiter);

            return settingsSplit.Last();
        }
    }
}
