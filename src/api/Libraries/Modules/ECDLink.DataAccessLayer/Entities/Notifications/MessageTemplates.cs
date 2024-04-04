using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Notifications
{
    [Table(nameof(MessageTemplate))]
    public class MessageTemplate : MessageTemplate<Guid>
    {

    }

    public class MessageTemplate<TKey> : EntityBase<TKey>, IMessageTemplate
         where TKey : IEquatable<TKey>
    {
        public string Protocol { get; set; }
        public string TemplateType { get; set; }
        public string Message { get; set; }
        public string Subject { get; set; }
        public string CTA { get; set; }
        public string CTAText { get; set; }
        public int? TypeCode { get; set; }
        public int Ordering { get; set; }
        public string Action { get; set; }

    }

    public interface MessageTemplateJoin<TKey>
    {
        [ForeignKey(nameof(MessageTemplateId))]
        public MessageTemplate MessageTemplate { get; set; }
        public TKey MessageTemplateId { get; set; }
    }

    public class MessageTemplateText
    {
        public string Message { get; set; }
        public string Subject { get; set; }
        public string CTAText { get; set; }
        public string CTA { get; set; }
        public string Action { get; set; }
    }
    public class MessageTemplateAction
    {
        public string URL { get; set; }

    }
}
