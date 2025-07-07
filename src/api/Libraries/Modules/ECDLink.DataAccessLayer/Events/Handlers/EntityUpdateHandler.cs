using ECDLink.DataAccessLayer.Events.Notifications;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Events.Handlers
{
    public class EntityUpdateHandler : INotificationHandler<EntityUpdateNotification>
    {
        public Task Handle(EntityUpdateNotification notification, CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
