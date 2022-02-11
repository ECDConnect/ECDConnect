using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Reporting.ChildReports.ReportIntervals)]
    public class ChildReportOptions
    {
        public string ReportIntervals { get; set; }
    }
}
