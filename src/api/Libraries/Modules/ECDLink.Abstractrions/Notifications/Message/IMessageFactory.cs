using ECDLink.Abstractrions.Enums;

namespace ECDLink.Abstractrions.Notifications.Message
{
    public interface IMessageFactory
    {
        public IMessageTemplate GetMessageTemplate(MessageProtocolEnum messageType, TemplateTypeEnum templateType);
    }
}
