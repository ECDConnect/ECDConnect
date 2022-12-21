using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings
{
    public static class SettingGroups
    {
        public static class Notifications
        {
            public const string NotificationGroupBase = "Notifications";

            public static class Email
            {
                public const string EmailGroupBase = "Notifications.EmailProviders";

                public static class SendGrid
                {
                    public const string SendGridGrouping = "Notifications.EmailProviders.SendGrid";

                    public const string User = "Notifications.EmailProviders.SendGrid.User";
                    public const string Key = "Notifications.EmailProviders.SendGrid.Key";
                    public const string DefaultEmail = "Notifications.EmailProviders.SendGrid.FromEmail";
                }
            }

            public static class SMS
            {
                public const string SMSGroupBase = "Notifications.SMSProviders";

                public static class BulkSms
                {
                    public const string BulkSmsGrouping = "Notifications.SMSProviders.BulkSms";
                    public const string Name = "Notifications.SMSProviders.BulkSms.Name";
                    public const string Url = "Notifications.SMSProviders.BulkSms.BaseUrl";
                    public const string TokenId = "Notifications.SMSProviders.BulkSms.TokenId";
                    public const string TokenSecret = "Notifications.SMSProviders.BulkSms.TokenSecret";
                    public const string AuthToken = "Notifications.SMSProviders.BulkSms.BasicAuthToken";
                }
            }
        }

        public static class Proxies
        {
            public const string ProxyGroupBase = "General.Proxies";

            public static class Holiday
            {
                public const string ProxyGroupBase = "General.Proxies.Holiday";

                public static class RapidApi
                {
                    public const string RapidApiGrouping = "General.Proxies.Holiday.RapidApi";
                    public const string Name = "General.Proxies.Holiday.RapidApi.Name";
                    public const string Url = "General.Proxies.Holiday.RapidApi.BaseUrl";
                    public const string Host = "General.Proxies.Holiday.RapidApi.Host";
                    public const string Key = "General.Proxies.Holiday.RapidApi.Key";
                }
            }

            public static class UrlShortner
            {
                public const string UrlShortnerGroupBase = "General.Proxies.UrlShortner";

                public const string RedirectUrl = "General.Proxies.UrlShortner.RedirectUrl";
            }
        }

        public static class Analytics
        {
            public const string AnalyticsGroupBase = "General.Analytics";

            public static class Google
            {
                public const string GoogleGrouping = "General.Analytics.Google";
                public const string GoogleReport = "General.Analytics.Google.DashboardGoogleReport";                

                public const string Tag = "General.Analytics.Google.GoogleAnalyticsTag";
                public const string TagManager = "General.Analytics.Google.GoogleTagManager";
            }
        }

        public static class CallBacks
        {
            public const string CallbackGroupBase = "General.Callback";

            public static class Invitations
            {
                public const string InvitationsGrouping = "General.Callback.Invitations";

                public const string Signup = "General.Callback.Invitations.Signup";
            }

            public static class Security
            {
                public const string SecurityGrouping = "General.Callback.Security";

                public const string ForgotPassword = "General.Callback.Security.ForgotPassword";
                public const string Login = "General.Callback.Security.Login";
            }
        }

        public static class Security
        {
            public const string SecurityGroupBase = "Security";

            public static class Jwt 
            {
                public const string JwtGroup = "Security.Jwts";
                public const string LongToken = "Security.Jwts.LongJwtLifespan";
                public const string ShortToken = "Security.Jwts.ShortJwtLifespan";
            }

            public static class Tokens
            {
                public const string TokenGroup = "Security.Tokens";
                public const string InvitationLinkExpiry = "Security.Tokens.InvitationLinkExpiry";
                public const string OpenAccessInvitationExpiry = "Security.Tokens.OpenAccessInvitationExpiry";
            }            
        }

        public static class Reporting
        {
            public const string ReportGroupBase = "General.Reporting";

            public static class ChildReports
            {
                public const string ReportIntervals = "General.Reporting.ChildProgressReportMonths";
            }
        }

        public static class Children
        {
            public const string ChildrenGroupBase = "General.Children";

            public const string ChildObservationPeriod = "General.Children.ChildInitialObservationPeriod";
            public const string ChildDataExpiry = "General.Children.ChildExpiryTime";
        }

        public static class Azure
        {
            public const string AzureGroupBase = "General.Azure";

            public const string BlobStorageConnection = "General.Azure.BlobStorageConnection";
        }

        public static class Invitation
        {
            public const string InvitationCutoffDelay = "General.InvitationCutoffDelay";
        }

        public static class Absentee
        {
            public const string AbsenteeCutoffDelay = "General.AbsenteeCutoffDelay";
        }

        public static class Sync
        {
            public const string SyncDelay = "General.SyncDelay";
        }
    }
}
