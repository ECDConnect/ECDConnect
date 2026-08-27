using System;

namespace ECDLink.Core.Services.ResourceLinkHealth
{
    public static class ResourceLinkHealthEvaluator
    {
        public static bool TryNormalizeUrl(string url, out string normalized)
        {
            normalized = null;
            if (string.IsNullOrWhiteSpace(url))
            {
                return false;
            }

            var trimmed = url.Trim();
            if (!trimmed.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
                && !trimmed.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            {
                trimmed = "https://" + trimmed;
            }

            if (!Uri.TryCreate(trimmed, UriKind.Absolute, out var uri)
                || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)
                || string.IsNullOrWhiteSpace(uri.Host)
                || !uri.Host.Contains('.'))
            {
                return false;
            }

            normalized = uri.ToString();
            return true;
        }

        public static ResourceLinkCheckOutcome Classify(ResourceLinkHttpCheckResult result)
        {
            if (result == null || !result.IsValidUrl)
            {
                return ResourceLinkCheckOutcome.Broken(result?.Error ?? "Invalid URL");
            }

            if (result.TimedOut)
            {
                return ResourceLinkCheckOutcome.Transient(result.Error ?? "Timed out");
            }

            if (result.NetworkError)
            {
                return ResourceLinkCheckOutcome.Broken(result.Error ?? "Network error");
            }

            if (!result.StatusCode.HasValue)
            {
                return ResourceLinkCheckOutcome.Transient(result.Error ?? "No HTTP status");
            }

            var code = result.StatusCode.Value;
            if (code >= 200 && code < 400)
            {
                return ResourceLinkCheckOutcome.Ok(code);
            }

            if (code == 404 || code == 410)
            {
                return ResourceLinkCheckOutcome.Broken($"HTTP {code}", code);
            }

            if (code == 401 || code == 403 || code == 429)
            {
                return ResourceLinkCheckOutcome.Unverifiable($"HTTP {code}", code);
            }

            if (code >= 500 && code < 600)
            {
                return ResourceLinkCheckOutcome.Transient($"HTTP {code}", code);
            }

            if (code >= 400 && code < 500)
            {
                return ResourceLinkCheckOutcome.Broken($"HTTP {code}", code);
            }

            return ResourceLinkCheckOutcome.Unverifiable($"HTTP {code}", code);
        }

        public static bool ShouldFallbackToGet(int? statusCode)
        {
            return statusCode == 400
                || statusCode == 403
                || statusCode == 405
                || statusCode == 501;
        }

        public static ResourceLinkHealthTransition ApplyCheck(
            string previousConfirmedStatus,
            int previousConsecutiveFailureCount,
            string previousUrl,
            string currentUrl,
            ResourceLinkCheckOutcome outcome)
        {
            if (outcome == null)
            {
                throw new ArgumentNullException(nameof(outcome));
            }

            var urlChanged = !string.IsNullOrEmpty(previousUrl)
                && !string.Equals(previousUrl, currentUrl, StringComparison.OrdinalIgnoreCase);

            var consecutive = urlChanged ? 0 : Math.Max(0, previousConsecutiveFailureCount);
            var previousConfirmed = urlChanged || string.IsNullOrWhiteSpace(previousConfirmedStatus)
                ? ResourceLinkHealthConstants.StatusOk
                : previousConfirmedStatus;

            var lastCheckStatus = outcome.Kind;
            string confirmedStatus;

            if (lastCheckStatus == ResourceLinkHealthConstants.StatusOk)
            {
                consecutive = 0;
                confirmedStatus = ResourceLinkHealthConstants.StatusOk;
            }
            else if (lastCheckStatus == ResourceLinkHealthConstants.StatusUnverifiable)
            {
                confirmedStatus = previousConfirmed == ResourceLinkHealthConstants.StatusBroken
                    ? ResourceLinkHealthConstants.StatusBroken
                    : ResourceLinkHealthConstants.StatusUnverifiable;
            }
            else
            {
                consecutive++;
                if (consecutive >= ResourceLinkHealthConstants.ConsecutiveFailureThreshold)
                {
                    confirmedStatus = ResourceLinkHealthConstants.StatusBroken;
                }
                else if (previousConfirmed == ResourceLinkHealthConstants.StatusBroken)
                {
                    confirmedStatus = ResourceLinkHealthConstants.StatusBroken;
                }
                else
                {
                    confirmedStatus = ResourceLinkHealthConstants.StatusOk;
                }
            }

            var newlyBroken = previousConfirmed != ResourceLinkHealthConstants.StatusBroken
                && confirmedStatus == ResourceLinkHealthConstants.StatusBroken;
            var recovered = previousConfirmed == ResourceLinkHealthConstants.StatusBroken
                && confirmedStatus == ResourceLinkHealthConstants.StatusOk;

            return new ResourceLinkHealthTransition
            {
                ConfirmedStatus = confirmedStatus,
                LastCheckStatus = lastCheckStatus,
                ConsecutiveFailureCount = consecutive,
                IsNewlyBroken = newlyBroken,
                IsRecovered = recovered,
                IsStillBroken = confirmedStatus == ResourceLinkHealthConstants.StatusBroken && !newlyBroken
            };
        }

        public static string FormatSectionLabel(string sectionType)
        {
            if (string.Equals(sectionType, ResourceLinkHealthConstants.SectionClassroom, StringComparison.OrdinalIgnoreCase))
            {
                return "Classroom";
            }

            if (string.Equals(sectionType, ResourceLinkHealthConstants.SectionBusiness, StringComparison.OrdinalIgnoreCase))
            {
                return "Business";
            }

            if (string.Equals(sectionType, ResourceLinkHealthConstants.SectionCommunity, StringComparison.OrdinalIgnoreCase))
            {
                return "Community";
            }

            return string.IsNullOrWhiteSpace(sectionType) ? "Resource" : sectionType;
        }

        public static string FormatDigestLine(string sectionType, string title, string url, string detail)
        {
            var section = FormatSectionLabel(sectionType);
            var name = string.IsNullOrWhiteSpace(title) ? "Untitled" : title.Trim();
            var suffix = string.IsNullOrWhiteSpace(detail) ? string.Empty : $" ({detail})";
            return $"- [{section}] {name}: {url}{suffix}";
        }
    }
}
