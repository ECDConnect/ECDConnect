using MediatR;

namespace ECDLink.DataAccessLayer.Events.Notifications
{
    public class EntityDeleteNotification : INotification
    {
        public object Entity { get; set; }

        public string DeletedBy { get; set; }
    }
}
