using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Absentees))]
    [EntityPermission(PermissionGroups.USER)]
    public class Absentees : Absentees<Guid>
    {

    }

    public class Absentees<TKey> : EntityBase<TKey>,
        ApplicationUserJoin, PractitionerRemovalHistoryJoin<Guid?>, ITrackableType
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
        public string Reason { get; set; }
        public DateTime AbsentDate { get; set; }
        public DateTime? AbsentDateEnd { get; set; }
        public string LoggedBy { get; set; }
        public string ReassignedClass { get; set; }
        public string ReassignedToPractitioner { get; set; }

        [GraphQLIgnore]
        public virtual Practitioner Practitioner { get; set; }
        public virtual Programme Program { get; set; }

        [GraphQLIgnore]
        public Guid? PractitionerRemovalHistoryId { get; set; }

        [GraphQLIgnore, ForeignKey(nameof(PractitionerRemovalHistoryId))]
        public virtual PractitionerRemovalHistory PractitionerRemovalHistory { get; set; }

        public DateTime? CompletedDate { get; set; }
        public DateTime? AssignedDate { get; set; }
        public bool IsRoleAssign { get; set; }

    }

    public interface AbsenteesJoin<TKey>
    {
        [ForeignKey(nameof(AbsenteesId))]
        public Absentees Absentees { get; set; }
        public TKey AbsenteesId { get; set; }
    }

    public class AbsenteeDetail
    {
        public string AbsenteeId { get; set; }
        public string Reason { get; set; }
        public DateTime AbsentDate { get; set; }
        public DateTime? AbsentDateEnd { get; set; }

        public string ClassName { get; set; }
        public string ClassroomGroupId { get; set; }

        public string ReassignedToPerson { get; set; }
        public string ReassignedToUserId { get; set; }

        public string LoggedByPerson { get; set; }
        public string LoggedByUserId { get; set; }

    }
}
