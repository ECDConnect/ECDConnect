using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Documents
{
    [Table(nameof(Document))]
    [EntityPermission(PermissionGroups.DOCUMENTS)]
    public class Document : Document<Guid>
    {

    }

    public class Document<TKey> : EntityBase<TKey>, ApplicationUserJoin, DocumentTypeJoin<TKey>, WorkflowStatusJoin<TKey>, IUserScoped, ITrackableType
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }

        public string Reference { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        [ForeignKey(nameof(DocumentTypeId))]
        public virtual DocumentType DocumentType { get; set; }
        public TKey DocumentTypeId { get; set; }

        [GraphIgnoreInput]
        [ForeignKey(nameof(WorkflowStatusId))]
        public virtual WorkflowStatus WorkflowStatus { get; set; }
        public TKey WorkflowStatusId { get; set; }

        public string Hierarchy { get; set; }

        [ForeignKey(nameof(CreatedUserId))]
        public Guid? CreatedUserId { get; set; }

        [NotMapped]
        public virtual ApplicationUser CreatedUser { get; set; }
        [NotMapped]
        public string ClientName { get; set; }
        [NotMapped]
        public string CreatedByName { get; set; }
        [NotMapped]
        public string ClientStatus { get; set; }


    }

    public interface DocumentJoin<TKey>
    {
        [ForeignKey(nameof(DocumentId))]
        public Document Document { get; set; }
        public TKey DocumentId { get; set; }
    }
}
