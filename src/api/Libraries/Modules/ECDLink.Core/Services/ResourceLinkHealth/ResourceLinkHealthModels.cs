namespace ECDLink.Core.Services.ResourceLinkHealth
{
    public class ResourceLinkHttpCheckResult
    {
        public bool IsValidUrl { get; set; } = true;
        public int? StatusCode { get; set; }
        public string Error { get; set; }
        public bool TimedOut { get; set; }
        public bool NetworkError { get; set; }

        public static ResourceLinkHttpCheckResult Invalid(string error = "Invalid URL")
        {
            return new ResourceLinkHttpCheckResult
            {
                IsValidUrl = false,
                Error = error
            };
        }
    }

    public class ResourceLinkCheckOutcome
    {
        public string Kind { get; set; }
        public int? StatusCode { get; set; }
        public string Detail { get; set; }

        public static ResourceLinkCheckOutcome Ok(int? statusCode = null)
        {
            return new ResourceLinkCheckOutcome
            {
                Kind = ResourceLinkHealthConstants.StatusOk,
                StatusCode = statusCode
            };
        }

        public static ResourceLinkCheckOutcome Broken(string detail, int? statusCode = null)
        {
            return new ResourceLinkCheckOutcome
            {
                Kind = ResourceLinkHealthConstants.StatusBroken,
                StatusCode = statusCode,
                Detail = detail
            };
        }

        public static ResourceLinkCheckOutcome Unverifiable(string detail, int? statusCode = null)
        {
            return new ResourceLinkCheckOutcome
            {
                Kind = ResourceLinkHealthConstants.StatusUnverifiable,
                StatusCode = statusCode,
                Detail = detail
            };
        }

        public static ResourceLinkCheckOutcome Transient(string detail, int? statusCode = null)
        {
            return new ResourceLinkCheckOutcome
            {
                Kind = ResourceLinkHealthConstants.StatusTransient,
                StatusCode = statusCode,
                Detail = detail
            };
        }
    }

    public class ResourceLinkHealthTransition
    {
        public string ConfirmedStatus { get; set; }
        public string LastCheckStatus { get; set; }
        public int ConsecutiveFailureCount { get; set; }
        public bool IsNewlyBroken { get; set; }
        public bool IsRecovered { get; set; }
        public bool IsStillBroken { get; set; }
    }
}
