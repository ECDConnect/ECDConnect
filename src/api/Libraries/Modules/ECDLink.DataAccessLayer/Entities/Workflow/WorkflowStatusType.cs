using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Workflow
{
    [Table(nameof(WorkflowStatusType))]
    [EntityPermission(PermissionGroups.WORKFLOW)]
    public class WorkflowStatusType : WorkflowStatusType<Guid>
    {
    }

    public class WorkflowStatusType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }

    }

    public interface WorkflowStatusTypeJoin<TKey>
    {
        [ForeignKey(nameof(WorkflowStatusTypeId))]
        public WorkflowStatusType WorkflowStatusType { get; set; }
        public TKey WorkflowStatusTypeId { get; set; }
    }
}
