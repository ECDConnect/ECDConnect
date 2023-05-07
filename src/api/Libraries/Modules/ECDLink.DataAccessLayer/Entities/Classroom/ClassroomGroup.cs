using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    [Table(nameof(ClassroomGroup))]
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class ClassroomGroup : ClassroomGroup<Guid>
    {

    }

    public class ClassroomGroup<TKey> : EntityBase<TKey>, IUserScoped, IReversedHierarchy, ClassroomJoin<TKey>, ProgrammeTypeJoin<Guid?>, ITrackableType
         where TKey : IEquatable<TKey>
    {
        public TKey ClassroomId { get; set; }

        [ForeignKey(nameof(ClassroomId))]
        public virtual Classroom Classroom { get; set; }

        [ForeignKey(nameof(ProgrammeTypeId))]
        public virtual ProgrammeType ProgrammeType { get; set; }
        public Guid? ProgrammeTypeId { get; set; }

        public virtual ICollection<Learner> Learners { get; set; }

        public virtual ICollection<ClassProgramme> ClassProgrammes { get; set; }

        public string Name { get; set; }
        [GraphQLIgnore]
        public string Hierarchy { get; set; }
        public Guid? UserId { get; set; }
    }

    public interface ClassroomGroupJoin<TKey>
    {
        [ForeignKey(nameof(ClassroomGroupId))]
        public ClassroomGroup ClassroomGroup { get; set; }
        public TKey ClassroomGroupId { get; set; }
    }
}
