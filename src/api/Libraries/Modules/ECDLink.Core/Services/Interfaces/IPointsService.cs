using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IPointsService
    {
        void CalculateCompleteChildProgressReports();
        void CalculateLeaveNoOneBehind();
        void CalculateCompleteCaregiverReportBack();
        void CalculateClubChildAttendance();
    }
}
