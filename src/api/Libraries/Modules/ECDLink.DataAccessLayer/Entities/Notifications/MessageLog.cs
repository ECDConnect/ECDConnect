using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace ECDLink.DataAccessLayer.Entities.Notifications
{
    [Table(nameof(MessageLog))]
    public class MessageLog : MessageLog<Guid>
    {

    }

    public class MessageLog<TKey> : EntityBase<TKey>, IMessageLog<TKey> where TKey : IEquatable<TKey>
    {
        public string MessageTemplateType { get; set; }
        public string MessageProtocol { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public string CTAText { get; set; }
        public string CTA { get; set; }
        public Guid FromUserId { get; set; }
        public Guid SentByUserId { get; set; }
        public DateTime? MessageDate { get; set; }
        public DateTime? MessageEndDate { get; set; }
        public DateTime? ReadDate { get; set; }
        public string ToGroups { get; set; }
        public string Action { get; set; }
        public Guid? GroupingId { get; set; }
        public int? NotificationResult { get; set; }

        [ForeignKey(nameof(Id))]
        public virtual MessageTemplate MessageTemplate { get; set; }
        public virtual List<MessageLogRelatedTo> MessageLogRelatedTos { get; set; }
    }

    // Circular Reference?
    public interface MessageLogJoin<TKey>
    {
        [ForeignKey(nameof(MessageTemplateId))]
        public MessageTemplate MessageTemplate { get; set; }
        public TKey MessageTemplateId { get; set; }
    }


    public class Notification
    {
        public Guid Id { get; set; }
        public string MessageTemplateType { get; set; }
        public string MessageProtocol { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Subject { get; set; }
        public string CTAText { get; set; }
        public string CTA { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public Guid FromUserId { get; set; }
        public Guid SentByUserId { get; set; }
        public MessageTemplate MessageTemplate { get; set; }
        public DateTime? MessageDate { get; set; }
        public DateTime? MessageEndDate { get; set; }
        public DateTime? ReadDate { get; set; }
        public string ToGroups { get; set; }
        public int Ordering { get; set; }
        public string Action { get; set; }
        public Guid? GroupingId { get; set; }
        public Guid? RelatedToUserId { get {  return RelatedEntities != null ? RelatedEntities.FirstOrDefault()?.RelatedToEntityId : null; } }
        public List<RelatedEntity> RelatedEntities { get; set; }
    }

    public class TagsReplacements
    {
        public string FindValue { get; set; }
        public string ReplacementValue { get; set; }
    }

    public class RelatedEntity
    {
        public Guid RelatedToEntityId { get; set; }
        public string EntityType { get; set; }

        public RelatedEntity(Guid entityId, string entityType)
        { 
            RelatedToEntityId = entityId;
            EntityType = entityType;
        }
    }
}
