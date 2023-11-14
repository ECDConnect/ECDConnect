using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(ClassReassignmentHistory))]
    [EntityPermission(PermissionGroups.USER)]
    public class ClassReassignmentHistory : ClassReassignmentHistory<Guid>
    {

    }

    public class ClassReassignmentHistory<TKey> : EntityBase<TKey>,
        ApplicationUserJoin
        where TKey : IEquatable<TKey>
    {
        //[ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid UserId { get; set; }
        public string Reason { get; set; }
        public string LoggedBy { get; set; }

        public string ReassignedToUser { get; set; }
        public DateTime ReassignedToDate { get; set; }
        public string ReassignedBackToUserId { get; set; }
        public DateTime? ReassignedBackToDate { get; set; }

        public string HierarchyToUser { get; set; }
        public string HierarchyBackToUser { get; set; }

        public string ReassignedClassrooms { get; set; }
        public string ReassignedClassroomGroups { get; set; }
        public string ReassignedChildrenUserIds { get; set; }
        public string ReassignedClassProgrammes { get; set; }
        public string ReassignedLearners { get; set; }

    }

    public interface ClassReassignmentHistoryJoin<TKey>
    {
        [ForeignKey(nameof(ClassReassignmentHistoryId))]
        public ClassReassignmentHistory ClassReassignmentHistory { get; set; }
        public TKey ClassReassignmentHistoryId { get; set; }
    }
}
