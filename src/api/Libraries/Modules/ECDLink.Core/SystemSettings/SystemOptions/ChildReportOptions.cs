using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Reporting.ChildReports.ReportIntervals)]
    public class ChildReportOptions
    {
        public string ReportIntervals { get; set; }
    }
}
