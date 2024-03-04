using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Child))]
    [EntityPermission(PermissionGroups.USER)]
    public class Child : Child<Guid>
    {
    }

    public class Child<TKey> : EntityBase<TKey>,
        ApplicationUserJoin,
        IDocumentQueryable,
        CaregiverJoin<Guid?>,
        LanguageJoin<Guid?>,
        ReasonForLeavingJoin<Guid?>,
        WorkflowStatusJoin<Guid?>,
        IUserType,
        ITrackableType
         where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        [ForeignKey(nameof(LanguageId))]
        public virtual Language Language { get; set; }
        public Guid? LanguageId { get; set; }

        [ForeignKey(nameof(CaregiverId))]
        public virtual Caregiver Caregiver { get; set; }
        public Guid? CaregiverId { get; set; }

        public string Allergies { get; set; }

        public string Disabilities { get; set; }

        public string OtherHealthConditions { get; set; }

        public virtual ICollection<Document> Documents { get; set; }

        [ForeignKey(nameof(ReasonForLeavingId))]
        public virtual ReasonForLeaving ReasonForLeaving { get; set; }

        public Guid? ReasonForLeavingId { get; set; }

        [ForeignKey(nameof(WorkflowStatusId))]
        public virtual WorkflowStatus WorkflowStatus { get; set; }
        public Guid? WorkflowStatusId { get; set; }

        [GraphQLIgnore]
        public string Hierarchy { get; set; }
        public string InsertedBy { get; set; }
        public DateTime? StartDate { get; set; }
        public string PlaygroupGroup { get; set; }
        public string InactiveReason { get; set; }
        public DateTime? InactiveDate { get; set; }
        public string InactivityComments { get; set; }
    }

    public interface ChildJoin<TKey>
    {
        [ForeignKey(nameof(ChildId))]
        public Child Child { get; set; }
        public TKey ChildId { get; set; }
    }
}
