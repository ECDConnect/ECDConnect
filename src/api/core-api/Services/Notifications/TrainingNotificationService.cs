using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Managers;
using HotChocolate;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications
{
    public class TrainingNotificationService : ITrainingNotificationService
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationUserManager _userManager;

        public TrainingNotificationService(
            [Service] INotificationService notificationService,
            [Service] ApplicationUserManager userManager)
        {
            _notificationService = notificationService;
            _userManager = userManager;
        }

        public async Task SendCourseCompletedNotificationAsync(
            Guid userId,
            string courseName,
            DateTime completedDate)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return;
            }

            await _notificationService.SendNotificationAsync(
                null,
                TemplateTypeConstants.CourseCompleted,
                completedDate.Date,
                user,
                null,
                MessageStatusConstants.Green,
                null,
                null,
                false,
                false);
        }
    }
}