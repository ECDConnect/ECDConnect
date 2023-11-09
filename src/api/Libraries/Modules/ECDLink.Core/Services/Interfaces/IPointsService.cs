using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IPointsService
    {
        public bool CalculateCompleteChildProgressReports();
        public bool CalculateLeaveNoOneBehind();
    }
}
