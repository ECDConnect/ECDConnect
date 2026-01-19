using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface ITelemetryService
    {
        void TrackCustomEvent(string customEvent, Dictionary<string, string> properties, Dictionary<string, double> metrics);
    }
}
