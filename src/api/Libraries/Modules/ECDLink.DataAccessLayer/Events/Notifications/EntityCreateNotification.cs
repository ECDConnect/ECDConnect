using MediatR;

namespace ECDLink.DataAccessLayer.Events.Notifications
{
    public class EntityCreateNotification : INotification
    {
        public object Entity { get; set; }

        public string CreatedBy { get; set; }
    }
}
