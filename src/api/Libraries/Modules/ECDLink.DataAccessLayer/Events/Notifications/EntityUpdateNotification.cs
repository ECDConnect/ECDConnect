using MediatR;

namespace ECDLink.DataAccessLayer.Events.Notifications
{
    public class EntityUpdateNotification : INotification
    {
        public object Entity { get; set; }

        public string UpdatedBy { get; set; }
    }
}
