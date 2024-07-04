using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    [Table(nameof(Classroom))]
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class Classroom : Classroom<Guid>
    {
    }

    public class Classroom<TKey> : EntityBase<TKey>, IUserScoped, IReversedHierarchy, SiteAddressJoin<Guid?>, ApplicationUserJoin, ITrackableType
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        [Column("ClassroomOwner")]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        public Guid? SiteAddressId { get; set; }

        [ForeignKey(nameof(SiteAddressId))]
        public virtual SiteAddress SiteAddress { get; set; }

        public virtual ICollection<ClassroomGroup> ClassroomGroups { get; set; }

        public virtual ICollection<Programme> Programmes { get; set; }

        public string Name { get; set; }
        public string ClassroomImageUrl { get; set; }

        public bool? IsPrinciple { get; set; }

        public int? NumberPractitioners { get; set; }

        public int? NumberOfAssistants { get; set; }

        public int? NumberOfOtherAssistants { get; set; }

        public bool? DoesOwnerTeach { get; set; }

        [GraphQLIgnore]
        public string Hierarchy { get; set; }

        public string PreschoolCode { get; set; }
        public bool? IsDummySchool { get; set; } = false;

        public virtual ICollection<ChildProgressReportPeriod> ChildProgressReportPeriods { get; set; }
    }

    public interface ClassroomJoin<TKey>
    {
        [ForeignKey(nameof(ClassroomId))]
        public Classroom Classroom { get; set; }
        public TKey ClassroomId { get; set; }
    }
}
