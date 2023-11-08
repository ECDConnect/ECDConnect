using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IPointsService
    {
        public bool CalculateCompleteChildProgressReports(DateTime today);
        public bool CalculateLeaveNoOneBehind(DateTime today);
    }
}
