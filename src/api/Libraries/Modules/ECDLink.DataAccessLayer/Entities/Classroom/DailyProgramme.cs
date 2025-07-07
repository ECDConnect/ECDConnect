using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    [Table("ProgrammeDay")]
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class DailyProgramme : DailyProgramme<Guid>
    {

    }

    public class DailyProgramme<TKey> : EntityBase<TKey>, ProgrammeJoin<TKey>, ITrackableType
         where TKey : IEquatable<TKey>
    {
        public TKey ProgrammeId { get; set; }

        [ForeignKey(nameof(ProgrammeId))]
        [GraphIgnoreInput]
        public virtual Programme Programme { get; set; }

        public int Day { get; set; }
        public DateTime DayDate { get; set; }

        public string MessageBoardText { get; set; }

        public int SmallGroupActivityId { get; set; }

        public int LargeGroupActivityId { get; set; }

        public int StoryBookId { get; set; }

        public int StoryActivityId { get; set; }

        public DateTime? DateCompleted { get; set; }
    }

    public interface DailyProgrammeJoin<TKey>
    {
        [ForeignKey(nameof(DailyProgrammeId))]
        public DailyProgramme DailyProgramme { get; set; }
        public TKey DailyProgrammeId { get; set; }
    }
}
