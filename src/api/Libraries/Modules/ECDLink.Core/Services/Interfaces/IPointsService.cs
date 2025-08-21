using System;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IPointsService
    {
        Task CalculateCompleteOnlineTrainingCourse(Guid userId); // called from moodle module
        void CalculatePreschoolFeesGreaterThan0ForEachChild(); // called from monthly runner
    }
}
