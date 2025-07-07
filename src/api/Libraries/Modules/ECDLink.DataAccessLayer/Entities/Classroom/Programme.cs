using ECDLink.Abstractrions.GraphQL.Attributes;
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
    [Table(nameof(Programme))]
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class Programme : Programme<Guid>
    {

    }

    public class Programme<TKey> : EntityBase<TKey>, ClassroomJoin<TKey>, ITrackableType
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string PreferredLanguage { get; set; }

        [ForeignKey(nameof(ClassroomId))]
        [GraphIgnoreInput]
        public virtual Classroom Classroom { get; set; }
        public TKey ClassroomId { get; set; }

        [GraphIgnoreInput]
        public virtual ICollection<DailyProgramme> DailyProgrammes { get; set; }

        [ForeignKey(nameof(ClassroomGroupId))]
        [GraphIgnoreInput]
        public virtual ClassroomGroup ClassroomGroup { get; set; }
        [GraphQLType(typeof(Nullable<Guid>))]
        public Guid? ClassroomGroupId { get; set; } = null;
    }

    public interface ProgrammeJoin<TKey>
    {
        [ForeignKey(nameof(ProgrammeId))]
        public Programme Programme { get; set; }
        public TKey ProgrammeId { get; set; }
    }
}
