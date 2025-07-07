using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
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
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
        public string Reason { get; set; }
        [ForeignKey(nameof(LoggedBy))] 
        public Guid? LoggedBy { get; set; }

        [ForeignKey(nameof(ReassignedToUser))]
        public Guid? ReassignedToUser { get; set; }
        public DateTime ReassignedToDate { get; set; }
        [ForeignKey(nameof(ReassignedBackToUserId))]
        public Guid? ReassignedBackToUserId { get; set; }
        public DateTime? ReassignedBackToDate { get; set; }

        public string HierarchyToUser { get; set; }
        public string HierarchyBackToUser { get; set; }

        public string ReassignedClassrooms { get; set; }
        public string ReassignedClassroomGroups { get; set; }
        public string ReassignedChildrenUserIds { get; set; }
        public string ReassignedClassProgrammes { get; set; }
        public string ReassignedLearners { get; set; }


        public DateTime AssignedToDate { get; set; }

        [GraphQLIgnore]
        public Guid? AbsenteeId { get; set; }

        [GraphQLIgnore, ForeignKey(nameof(AbsenteeId))]
        public virtual Absentees Absentee { get; set; }

        public DateTime? AssignedRoleDate { get; set; }
        public DateTime? ReassignedRoleBackDate { get; set; }
        public string AssignedRole { get; set; }
        public string ReassignedRoleBack { get; set; }
        public string RoleAssignedToUser { get; set; }

    }

    public interface ClassReassignmentHistoryJoin<TKey>
    {
        [ForeignKey(nameof(ClassReassignmentHistoryId))]
        public ClassReassignmentHistory ClassReassignmentHistory { get; set; }
        public TKey ClassReassignmentHistoryId { get; set; }
    }
}
