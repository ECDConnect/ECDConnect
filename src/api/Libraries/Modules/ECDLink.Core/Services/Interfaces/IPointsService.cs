using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IPointsService
    {
        void CalculateCompleteOnlineTrainingCourse(Guid userId); // called from moodle module
        void CalculatePreschoolFeesGreaterThan0ForEachChild(); // called from monthly runner
    }
}
