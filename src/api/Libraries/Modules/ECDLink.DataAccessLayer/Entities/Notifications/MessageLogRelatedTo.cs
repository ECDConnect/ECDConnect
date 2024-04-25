using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Notifications
{
    [Table(nameof(MessageLogRelatedTo))]    
    public class MessageLogRelatedTo
    {
        public Guid MessageLogId { get; set; }
        public Guid RelatedEntityId { get; set; }
        public string EntityType { get; set; }
    }
}
