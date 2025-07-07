using EcdLink.Api.CoreApi.GraphApi.Models;
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
        Task<bool> SendNotificationAsync(
            string userType,
            string templatetype,
            DateTime messageDate,
            ApplicationUser user = null,
            string message = "",
            string status = MessageStatusConstants.Blue,
            List<TagsReplacements> replacements = null,
            DateTime? messageEndDate = null,
            bool expireOldMessagesOfType = false,
            bool dontSendIfExists = false,
            string searchCriteria = null,
            List<RelatedEntity> relatedEntities = null,
            Guid? groupingId = null,
            string protocol = "");

        Task<List<MessageTemplate>> RetrieveTemplate(string template, string protocol = "");
        Task<MessageLog> CommitNotification(Notification notification, MessageTemplate template);
        Task<bool> DisableNotification(string notificationId);
        Task<bool> ExpireNotification(string notificationId);
        Task<bool> ExpireNotificationsTypesForUser(string userId, string templateType, string searchCriteria = null, string protocol = null, Guid? relatedToUserId = null);
        Task<bool> MarkAsReadNotification(string notificationId);
        MessageTemplateText RemapFields(MessageTemplate template, ApplicationUser user, List<TagsReplacements> replacements);
        Task<bool> SendGenericMessage(string to, string toGroups, string message, string subject, DateTime sendDate, MessageTemplate template, DateTime? messageEndDate = null);
        MessageLogModel RetrieveToGroupItems(string toGroups);
        Task<bool> NotificationExists(Notification notification, bool excludeDates = false, string searchCriteria = null);
        Task<bool> DeleteAllNotificationsForUser(string userId);
        Task<bool> DeleteAllNotificationsForTypeAndDate(string userId, string templatetype, DateTime? messageDate);
        Task<bool> DeleteAllNotificationsRelatedToEntity(Guid entityId);
        Task<bool> DisableNotficationsWithEndDateAsToday();
        void DeleteGroupNotifications(string templateType, Guid relatedToEntityId);
        List<MessageLog> GetMessages(string templateType, Guid relatedEntityId);
        List<MessageLog> GetMessagesForUser(string userId, string templateType, Guid relatedEntityId);
        void DeleteGroupNotifications(Guid groupingId);
    }
}
