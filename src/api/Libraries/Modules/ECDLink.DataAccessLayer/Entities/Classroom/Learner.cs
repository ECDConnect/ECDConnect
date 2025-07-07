using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    [Table(nameof(Learner))]
    [EntityPermission(PermissionGroups.CLASSROOM)]
    [PrimaryKey(nameof(UserId), nameof(Id), nameof(ClassroomGroupId))]
    public class Learner : EntityBase<Guid>, IUserScoped, ApplicationUserJoin, ClassroomGroupJoin<Guid>, ProgrammeAttendanceReasonJoin<Guid?>, ITrackableType
    {
        public Guid? UserId { get; set; }

        [GraphIgnoreInput]
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }

        [ForeignKey(nameof(ClassroomGroupId))]
        public virtual ClassroomGroup ClassroomGroup { get; set; }
        public Guid ClassroomGroupId { get; set; }

        [GraphIgnoreInput]
        [ForeignKey(nameof(ProgrammeAttendanceReasonId))]
        public virtual ProgrammeAttendanceReason ProgrammeAttendanceReason { get; set; }
        public Guid? ProgrammeAttendanceReasonId { get; set; }

        public string OtherAttendanceReason { get; set; }

        public DateTime StartedAttendance { get; set; }

        public DateTime? StoppedAttendance { get; set; }

        [GraphQLIgnore]
        public string Hierarchy { get; set; }
    }

    public interface LearnerJoin<TKey>
    {
        [ForeignKey(nameof(LearnerId))]
        public Learner Learner { get; set; }
        public TKey LearnerId { get; set; }
    }
}
