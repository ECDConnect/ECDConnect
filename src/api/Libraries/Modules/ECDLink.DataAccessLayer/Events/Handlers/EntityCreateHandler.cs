using ECDLink.DataAccessLayer.Events.Notifications;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Events.Handlers
{
    public class EntityCreateHandler : INotificationHandler<EntityCreateNotification>
    {
        public EntityCreateHandler()
        {
        }

        public Task Handle(EntityCreateNotification notification, CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
