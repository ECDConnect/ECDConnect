using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface INotificationTask
    {
        bool ShouldRunToday();

        Task SendNotifications();
    }
}
