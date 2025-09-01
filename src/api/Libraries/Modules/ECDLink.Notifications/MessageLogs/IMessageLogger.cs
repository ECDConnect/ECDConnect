using ECDLink.Abstractrions.Notifications.Message;
using System;
using System.Threading.Tasks;

namespace ECDLink.Notifications.MessageLogs
{
    public interface IMessageLogger<TMessage>
    {
        public Guid? Log(TMessage message, string messageTemplateType, Guid? messageLogId = null);
        public Task<Guid?> LogAsync(TMessage message, string messageTemplateType, Guid? messageLogId = null);
    }
}