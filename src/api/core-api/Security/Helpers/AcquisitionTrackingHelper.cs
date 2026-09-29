using ECDLink.DataAccessLayer.Entities;

namespace ECDLink.Security.Api.Helpers
{
    public static class AcquisitionTrackingHelper
    {
        public const string Unknown = "Unknown";

        public static void Apply(
            ApplicationUser user,
            string acquisitionUrl,
            string utmSource,
            string utmMedium,
            string utmCampaign)
        {
            if (user == null)
            {
                return;
            }

            user.AcquisitionUrl = string.IsNullOrWhiteSpace(acquisitionUrl)
                ? null
                : acquisitionUrl.Trim();
            user.UtmSource = Normalize(utmSource);
            user.UtmMedium = Normalize(utmMedium);
            user.UtmCampaign = Normalize(utmCampaign);
        }

        private static string Normalize(string value)
        {
            return string.IsNullOrWhiteSpace(value) ? Unknown : value.Trim();
        }
    }
}
