using ECDLink.Abstractrions.Notifications.Message;
using System;
using System.Threading.Tasks;

namespace ECDLink.Notifications.MessageLogs
{
    public interface IMessageLogger<TMessage>
    {
        public bool Log(TMessage message, string messageTemplateType);
        public Task<bool> LogAsync(TMessage message, string messageTemplateType);
    }
}