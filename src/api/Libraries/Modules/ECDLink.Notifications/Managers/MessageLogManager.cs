using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Managers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.Notifications.Managers
{
    public class MessageLogManager
    {
       
        private readonly AuthenticationDbContext _dbContext;
        private readonly ApplicationUserManager _userManager;

        public MessageLogManager(AuthenticationDbContext dbContext, ApplicationUserManager userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task UpdateMessageNotificationResult(Guid userId, string messageType, int notificationResult, string notificationResultProviderCode, string notificationResultProviderMessage, Guid? messageLogId = null)
        {
            if (messageLogId.HasValue)
            {
                await _dbContext.MessageLogs
                    .Where(x => x.Id == messageLogId.Value)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(m => m.NotificationResult, notificationResult)
                        .SetProperty(m => m.NotificationResultProviderCode, notificationResultProviderCode)
                        .SetProperty(m => m.NotificationResultProviderMessage, notificationResultProviderMessage));
            }
            else
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null)
                {
                    var message = await (from ml in _dbContext.MessageLogs
                                         where ml.MessageTemplateType == messageType
                                              && ml.IsActive
                                              && (ml.To == user.Id.ToString() || ml.To == user.PhoneNumber || ml.To == user.Email)
                                         select ml).FirstOrDefaultAsync();
                    if (message != null)
                    {
                        message.NotificationResult = notificationResult;
                        await _dbContext.SaveChangesAsync();
                    }
                }
            }
        }
    }
}
