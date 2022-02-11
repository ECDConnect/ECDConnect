using ECDLink.Abstractrions.Enums;

namespace ECDLink.Abstractrions.Notifications.Message
{
    public interface IMessageFactory
    {
        public IMessageTemplate GetMessage(MessageTypeEnum messageType, TemplateTypeEnum templateType);
    }
}
