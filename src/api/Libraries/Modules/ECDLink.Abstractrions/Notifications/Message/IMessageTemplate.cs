namespace ECDLink.Abstractrions.Notifications.Message
{
    public interface IMessageTemplate
    {
        string TemplateType { get; set; }
        string Message { get; set; }
        string Subject { get; set; }
    }
}
