using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.Security;

namespace ECDLink.DataAccessLayer.Entities.Reports
{
    [Table("ChildProgressReport")]
    [EntityPermission(PermissionGroups.REPORTING)]
    public class ChildProgressReport : ChildProgressReport<Guid>
    {

    }

    public class ChildProgressReport<TKey> : EntityBase<TKey>, IUserScoped, ClassroomGroupJoin<TKey>, ChildJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(ClassroomGroupId))]
        public virtual ClassroomGroup ClassroomGroup { get; set; }
        public TKey ClassroomGroupId { get; set; }

        public DateTime ReportDate { get; set; }
        
        [ForeignKey(nameof(ChildId))]
        public virtual Child Child { get ; set; }
        public TKey ChildId { get; set; }

        public string ReportContent { get; set; }

        public string UserId { get; set; }

        [GraphQLIgnore]
        public string Hierarchy { get; set; }
    }

    public interface ChildProgressReportJoin<TKey>
    {
        [ForeignKey(nameof(ChildProgressReportId))]
        public ChildProgressReport ChildProgressReport { get; set; }
        public TKey ChildProgressReportId { get; set; }
    }
}
