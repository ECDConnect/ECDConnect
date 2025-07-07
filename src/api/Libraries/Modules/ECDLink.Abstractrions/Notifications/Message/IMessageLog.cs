using System;

namespace ECDLink.Abstractrions.Notifications.Message
{
    public interface IMessageLog<TKey> where TKey : IEquatable<TKey>
    {
        string MessageTemplateType { get; set; }
        string MessageProtocol { get; set; }
        string From { get; set; }
        string To { get; set; }
        string Subject { get; set; }
        string Message { get; set; }
        Guid FromUserId { get; set; }
        Guid SentByUserId { get; set; }
    }
}
