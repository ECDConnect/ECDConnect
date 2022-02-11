using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
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

    public class Programme<TKey> : EntityBase<TKey>, ClassroomJoin<TKey>
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
    }

    public interface ProgrammeJoin<TKey>
    {
        [ForeignKey(nameof(ProgrammeId))]
        public Programme Programme { get; set; }
        public TKey ProgrammeId { get; set; }
    }
}
