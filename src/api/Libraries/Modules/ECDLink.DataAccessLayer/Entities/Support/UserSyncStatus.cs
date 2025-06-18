using System;

namespace ECDLink.DataAccessLayer.Entities
{
    public class UserSyncStatus
    {
        public bool SyncClassroom { get; set; }
        public bool SyncChildren { get; set; }
        public bool SyncReportingPeriods { get; set; }
        public bool SyncPoints { get; set; }

        public bool SyncPermissions { get; set; }
    }
}
