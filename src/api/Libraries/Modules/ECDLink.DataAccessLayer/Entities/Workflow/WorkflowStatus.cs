using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Workflow
{
    [Table(nameof(WorkflowStatus))]
    [EntityPermission(PermissionGroups.WORKFLOW)]
    public class WorkflowStatus : WorkflowStatus<Guid>
    {
    }

    public class WorkflowStatus<TKey> : EntityBase<TKey>, WorkflowStatusTypeJoin<TKey>, IEnumType<WorkflowStatusEnum>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }

        [ForeignKey(nameof(WorkflowStatusTypeId))]
        public virtual WorkflowStatusType WorkflowStatusType { get; set; }
        public TKey WorkflowStatusTypeId { get; set; }
        public WorkflowStatusEnum EnumId { get; set; }
    }

    public interface WorkflowStatusJoin<TKey>
    {
        [ForeignKey(nameof(WorkflowStatusId))]
        public WorkflowStatus WorkflowStatus { get; set; }
        public TKey WorkflowStatusId { get; set; }
    }
}
