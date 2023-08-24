using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface INotificationService
    {
        Task<bool> SendNotificationAsync(string userType, string templatetype, ApplicationUser user = null, string message = "");
        Task<List<MessageTemplate>> RetrieveTemplate(string template);
        Task<bool> DisableNotification(string notificationId);
    }
}
