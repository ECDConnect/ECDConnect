using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.Security;
using ECDLink.DataAccessLayer.Entities.Classroom;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Absentees))]
    [EntityPermission(PermissionGroups.USER)]
    public class Absentees : Absentees<Guid>
    {

    }

    public class Absentees<TKey> : EntityBase<TKey>,
        ApplicationUserJoin
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public string Reason { get; set; }
        public DateTime AbsentDate { get; set; }
        public string LoggedBy { get; set; }
        public string ReassignedClass { get; set; }
        public string ReassignedToPractitioner { get; set; }

        public Practitioner Practitioner { get; set; }
        public Programme Program { get; set; }

    }

    public interface AbsenteesJoin<TKey>
    {
        [ForeignKey(nameof(AbsenteesId))]
        public Absentees Absentees { get; set; }
        public TKey AbsenteesId { get; set; }
    }
}
