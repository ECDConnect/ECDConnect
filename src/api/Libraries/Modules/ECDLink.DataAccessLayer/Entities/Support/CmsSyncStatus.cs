namespace ECDLink.DataAccessLayer.Entities
{
    public class CmsSyncStatus
    {
        public bool SyncActivities { get; set; }
        public bool SyncCalendarEventTypes { get; set; }
        public bool SyncStoryBooks { get; set; }
        public bool SyncConsent { get; set; }
        public bool SyncResourceLinks { get; set; }
        public bool SyncResources { get; set; }
        public bool SyncAgeGroups { get; set; }
        public bool SyncProgrammeRoutines { get; set; }
        public bool SyncProgrammeThemes { get; set; }
        public bool SyncHolidays { get; set; }

    }
}
