using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(HealthCareWorker))]
    [EntityPermission(PermissionGroups.USER)]
    public class HealthCareWorker : HealthCareWorker<Guid>
    {

    }

    public class HealthCareWorker<TKey> : EntityBase<TKey>,
        ApplicationUserJoin,
        LanguageJoin<Guid?>,
        TeamLeadJoin<Guid?>
         where TKey : IEquatable<TKey>
    {
        public bool ConsentForPhoto { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }

        [ForeignKey(nameof(LanguageId))]
        public virtual Language Language { get; set; }
        public Guid? LanguageId { get; set; }

        [ForeignKey(nameof(TeamLeadId))]
        public virtual TeamLead TeamLead { get; set; }
        public Guid? TeamLeadId { get; set; }

        public bool IsRegistered { get; set; }
        public Boolean? ClickedVisitTab { get; set; }
        public Boolean? ClickedProgressTab { get; set; }
        public Boolean? ClickedReferralsTab { get; set; }
        public Boolean? ClickedContactTab { get; set; }
        public Boolean? ClickedDashboardClientsTab { get; set; }
        public Boolean? ClickedDashboardVisitsTab { get; set; }
        public Boolean? ClickedDashboardHighlightsTab { get; set; }
        
        [NotMapped]
        public virtual HCWPointsEngine PointsEngineData { get; set; }
    }

    public interface HealthCareWorkerJoin<TKey>
    {
        [ForeignKey(nameof(HealthCareWorkerId))]
        public HealthCareWorker HealthCareWorker { get; set; }
        public TKey HealthCareWorkerId { get; set; }
    }

    public class HCWVisitStatus
    {
        public int MotherOverDueVisits { get; set; }
        public int MotherDueVisits { get; set; }
        public int ChildDueVisits { get; set; }
    }

    public class HCWHighlights
    {
        public int totalThisWeekFamilyVisits { get; set; }
        public int totalThisWeekGrowthMonitored { get; set; }
        public int totalThisWeekNewClients { get; set; }
        public int totalLastWeekFamilyVisits { get; set; }
        public int totalLastWeekGrowthMonitored { get; set; }
        public int totalLastWeekNewClients { get; set; }
    }

    public class HCWSummary
    {
        public DateTime startDate { get; set; }
        public DateTime EndDate { get; set; }

        public int totalPregnantMoms { get; set; }
        public int totalChildren { get; set; }

        public int totalClientsVisited { get; set; }
        public int totalFoldersOpened { get; set; }

        public int totalVisitsMissed { get; set; }
        public int totalPregnantMomsWithUrgentIssues { get; set; }
        public int totalCaregiversAndChildrenWithUrgentIssues { get; set; }

        public int totalVisitsOverdue { get; set; }
        public int totalPregnantMomsWithIssues { get; set; }
        public int totalCaregiversAndChildrenWithIssues { get; set; }
    }

    public class HCWPointsEngine
    {
        public virtual ICollection<PointsLibrary> PointsLibrary { get; set; }
        public virtual ICollection<PointsUserSummary> PointsUserSummary { get; set; }
    }

}
