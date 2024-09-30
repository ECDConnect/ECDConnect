using System;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface INotificationTasksService
    {
        Task DailyUserOfflineNotification();
        Task RemoveCoachNotification(Guid coachUserId);
    }
}
