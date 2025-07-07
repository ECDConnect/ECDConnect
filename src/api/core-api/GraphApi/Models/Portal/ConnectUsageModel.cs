using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class ConnectUsageModel
    {
        public string ConnectUsage { get; set; }
        public string ConnectUsageColor { get; set; }

        public ConnectUsageModel(bool isActive, bool isRegistered, DateTime lastSeenDate, DateTime? updatedDate, DateTime? invitationDate)
        {
            if (isActive == false)
            {
                ConnectUsage = "Removed: " + updatedDate?.ToString("dd/MM/yyyy");
                ConnectUsageColor = Constants.PortalSettings.usage_red;
                return;
            }

            if (isRegistered == false)
            {
                ConnectUsage = Constants.PortalSettings.usage_invitation_expired;
                ConnectUsageColor = Constants.PortalSettings.usage_red;

                if (invitationDate.HasValue)
                {
                    var expiredDate = invitationDate.Value.AddDays(30);
                    if (expiredDate > DateTime.Now)
                    {
                        ConnectUsage = Constants.PortalSettings.usage_invitation_active;
                        // User has not registered yet, invite is active - blue
                        ConnectUsageColor = Constants.PortalSettings.usage_blue;
                    }
                    else if (expiredDate < DateTime.Now)
                    {
                        ConnectUsage = Constants.PortalSettings.usage_invitation_expired;
                        // User has not registered yet, invite is expired - red
                        ConnectUsageColor = Constants.PortalSettings.usage_red;
                    }
                    return;
                } 
            }
            
            ConnectUsage = "Online: " + lastSeenDate.ToString("dd/MM/yyyy");

            var fourteenDays = DateTime.Now.AddDays(-14);
            var twentyDays = DateTime.Now.AddDays(-20);

            // User last online less than 14 days ago - green
            if (lastSeenDate.Date >= fourteenDays.Date)
            {
                ConnectUsageColor = Constants.PortalSettings.usage_green;
                return;
            }

            // User last online less than 14 days to 20 days ago - orange
            if (lastSeenDate.Date >= twentyDays.Date)
            {
                ConnectUsageColor = Constants.PortalSettings.usage_orange;
                return;
            }

            // User last online more than 20 days ago - red
            if (lastSeenDate.Date <= twentyDays.Date)
            {
                ConnectUsageColor = Constants.PortalSettings.usage_red;
                return;
            }
        }
    }
}
