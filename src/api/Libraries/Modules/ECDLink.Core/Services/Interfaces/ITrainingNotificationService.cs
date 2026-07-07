using System;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface ITrainingNotificationService
    {
        Task SendCourseCompletedNotificationAsync(
            Guid userId,
            string courseName,
            DateTime completedDate);
    }
}