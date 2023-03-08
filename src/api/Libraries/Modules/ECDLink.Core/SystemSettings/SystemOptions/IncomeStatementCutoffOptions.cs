using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.IncomeStatement.IncomeStatementCutoff)]
    public class IncomeStatementCutoffOptions
    {
        public string IncomeStatementCutoff { get; set; }

    }
}
