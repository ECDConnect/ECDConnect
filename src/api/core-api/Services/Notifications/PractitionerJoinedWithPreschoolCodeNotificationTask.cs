using ECDLink.Core.Services.Interfaces;
using HotChocolate;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class PractitionerJoinedWithPreschoolCodeNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;


        public PractitionerJoinedWithPreschoolCodeNotificationTask(
            [Service] INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public bool ShouldRunToday()
        {
            return true;
        }

        public async Task SendNotifications()
        {
            await _notificationService.DisableNotficationsWithEndDateAsToday();

        }
    }
}
