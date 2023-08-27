using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface INotificationService
    {
        Task<bool> SendNotificationAsync(string userType, string templatetype, DateTime messageDate, ApplicationUser user = null, string message = "", string status = MessageStatusConstants.Blue, List<TagsReplacements> replacements = null, DateTime? messageEndDate = null);
        Task<List<MessageTemplate>> RetrieveTemplate(string template);
        Task CommitNotification(Notification notification, MessageTemplate template);
        Task<bool> DisableNotification(string notificationId);
        Task<bool> ExpireNotification(string notificationId);
    }
}
