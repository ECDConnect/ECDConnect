using ECDLink.Core.Services.Interfaces;
using Microsoft.ApplicationInsights;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Telemetry
{
    public class TelemetryService : ITelemetryService
    {
        private readonly TelemetryClient _telemetryClient;

        public TelemetryService(TelemetryClient telemetryClient)
        {
            _telemetryClient = telemetryClient;
        }

        public bool Enabled { get {  return _telemetryClient != null; } }

        public void TrackCustomEvent(string customEvent, Dictionary<string, string> properties, Dictionary<string, double> metrics)
        {
            if (!Enabled) return;
            _telemetryClient.TrackEvent(customEvent, properties, metrics);
        }
    }
}
