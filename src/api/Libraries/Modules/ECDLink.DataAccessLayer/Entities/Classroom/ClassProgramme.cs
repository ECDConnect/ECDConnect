using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    // Duplicate program per day
    [Table(nameof(ClassProgramme))]
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class ClassProgramme : ClassProgramme<Guid>
    {

    }

    public class ClassProgramme<TKey> : EntityBase<TKey>, IUserScoped, IReversedHierarchy, ClassroomGroupJoin<Guid?>, ITrackableType
         where TKey : IEquatable<TKey>
    {
        public DateTime ProgrammeStartDate { get; set; }

        public int MeetingDay { get; set; }

        public bool IsFullDay { get; set; }
        public virtual ClassroomGroup ClassroomGroup { get; set; }
        public Guid? ClassroomGroupId { get; set; }
        [GraphQLIgnore]
        public string Hierarchy { get; set; } // This should be removed
    }

    public interface ClassProgrammeJoin<TKey>
    {
        [ForeignKey(nameof(ClassroomProgrammeId))]
        public ClassProgramme ClassroomProgramme { get; set; }
        public TKey ClassroomProgrammeId { get; set; }
    }
}
