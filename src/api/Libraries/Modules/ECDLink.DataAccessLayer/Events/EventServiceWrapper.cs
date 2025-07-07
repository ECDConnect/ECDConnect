using ECDLink.DataAccessLayer.Events.Notifications;
using MediatR;

namespace ECDLink.DataAccessLayer.Events
{
    public class EventServiceWrapper : IDomainEventService
    {
        private readonly IMediator _mediator;

        public EventServiceWrapper(IMediator mediator)
        {
            _mediator = mediator;
        }

        public void NotifyCreate<T>(string createdById, T entity)
        {
            _mediator.Publish(new EntityCreateNotification
            {
                Entity = entity,
                CreatedBy = createdById
            });
        }

        public void NotifyDelete<T>(string deletedById, T entity)
        {
            _mediator.Publish(new EntityDeleteNotification
            {
                Entity = entity,
                DeletedBy = deletedById
            });
        }

        public void NotifyUpdate<T>(string updatedById, T entity)
        {
            _mediator.Publish(new EntityUpdateNotification
            {
                Entity = entity,
                UpdatedBy = updatedById
            });
        }
    }
}
