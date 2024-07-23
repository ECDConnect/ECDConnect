namespace ECDLink.Tenancy.Model
{
    public class TenantModuleModel
    {
        public bool CoachRoleEnabled { get; set; } = false;
        public string CoachRoleName { get; set; }
        public bool ClassroomActivitiesEnabled { get; set; } = false;
        public bool ProgressEnabled { get; set; } = false;
        public bool AttendanceEnabled { get; set; } = false;
        public bool CalendarEnabled { get; set; } = false;
        public bool TrainingEnabled {  get; set; } = false;
        public bool BusinessEnabled {  get; set; } = false;
    }
}
