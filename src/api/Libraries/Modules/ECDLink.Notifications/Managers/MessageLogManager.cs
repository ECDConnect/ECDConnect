using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Managers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace ECDLink.Notifications.Managers
{
    public class MessageLogManager
    {
       
        private readonly AuthenticationDbContext _dbContext;
        private readonly DbSet<MessageLog> _entities;
        private readonly ApplicationUserManager _userManager;

        public MessageLogManager(AuthenticationDbContext dbContext, ApplicationUserManager userManager)
        {
            _dbContext = dbContext;
            _entities = dbContext.MessageLogs;
            _userManager = userManager;
        }

        public void UpdateMessageNotificationResult(Guid userId, string messageType, int notificationResult)
        {
            var user = _userManager.FindByIdAsync(userId).Result;
            if (user != null)
            {
                var message = _entities.Where(x => (x.To == user.Id.ToString() || x.To == user.PhoneNumber || x.To == user.Email) &&
                                    string.Equals(x.MessageTemplateType, messageType) & x.IsActive).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
                if (message != null)
                {
                    message.NotificationResult = notificationResult;
                    _dbContext.SaveChangesAsync();
                }
            }
        }
    }
}
