using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using System;
using HotChocolate;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.Security;
using ECDLink.DataAccessLayer.Entities.Classroom;

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
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public string Reason { get; set; }
        public string LoggedBy { get; set; }
        public string ReassignedClass { get; set; }
        public string ReassignedToUser { get; set; }
        public DateTime ReassignedDate { get; set; }
        public DateTime ReassignedBackDate { get; set; }
        public string ReassignedBackToUserId { get; set; }
        public string HierarchyToUser { get; set; }
        public string HierarchyBackToUser { get; set; }

    }

    public interface ClassReassignmentHistoryJoin<TKey>
    {
        [ForeignKey(nameof(ClassReassignmentHistoryId))]
        public ClassReassignmentHistory ClassReassignmentHistory { get; set; }
        public TKey ClassReassignmentHistoryId { get; set; }
    }
}
