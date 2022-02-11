using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications.Message;
using System.Threading.Tasks;

namespace ECDLink.Abstractrions.Notifications
{
    public interface INotificationProvider<ProviderContext>
    {
        public INotificationProvider<ProviderContext> AddReceiver(ProviderContext receiver);

        public INotificationProvider<ProviderContext> SetMessageTemplate(TemplateTypeEnum type);

        public INotificationProvider<ProviderContext> SetMessageMetaData<T>(T type) where T : IMessageMetaData;

        public INotificationProvider<ProviderContext> AddFieldReplacement(string key, string value);

        public INotificationProvider<ProviderContext> OverrideSender(string sender);

        public Task SendMessage();
    }
}
