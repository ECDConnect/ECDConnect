namespace ECDLink.Abstractrions.Notifications
{
    public interface INotificationProviderFactory<ProviderContext>
    {
        public INotificationProvider<ProviderContext> Create(ProviderContext obj, string overrideMessageType = null);
    }
}
