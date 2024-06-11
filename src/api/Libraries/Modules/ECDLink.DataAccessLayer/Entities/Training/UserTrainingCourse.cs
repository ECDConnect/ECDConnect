using ECDLink.Security.Attributes;
using ECDLink.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.DataAccessLayer.Entities.Base;

namespace ECDLink.DataAccessLayer.Entities.Training
{
    [Table(nameof(UserTrainingCourse))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class UserTrainingCourse : UserTrainingCourse<Guid>
    {
    }

    public class UserTrainingCourse<TKey> : EntityBase<TKey> where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid UserId { get; set; }

        public string CourseName { get; set; }

        public DateTime CompletedDate { get; set; }
    }

    public interface UserTrainingCourseJoin<TKey>
    {
        [ForeignKey(nameof(UserTrainingCourseId))]
        public UserTrainingCourse UserTrainingCourse { get; set; }
        public TKey UserTrainingCourseId { get; set; }
    }

}
