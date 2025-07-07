using ECDLink.Abstractrions.Notifications;
using ECDLink.DataAccessLayer.Entities;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Development.Notifications
{
    public class DevNotificationProviderFactory : INotificationProviderFactory<ApplicationUser>
    {
        private readonly IEnumerable<INotificationProvider<ApplicationUser>> _providers;

        public DevNotificationProviderFactory(IEnumerable<INotificationProvider<ApplicationUser>> providers)
        {
            _providers = providers;
        }

        public INotificationProvider<ApplicationUser> Create(ApplicationUser user, string overrideMessageType = null)
        {
            var provider = _providers.FirstOrDefault(p => p.GetType() == typeof(DevNotificationProvider));
            provider.AddReceiver(user);

            return provider;
        }
    }
}
