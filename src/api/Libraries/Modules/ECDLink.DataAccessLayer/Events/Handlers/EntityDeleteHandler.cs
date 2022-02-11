using ECDLink.DataAccessLayer.Events.Notifications;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Events.Handlers
{
    public class EntityDeleteHandler : INotificationHandler<EntityDeleteNotification>
    {
        public EntityDeleteHandler()
        {
        }

        public Task Handle(EntityDeleteNotification notification, CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
