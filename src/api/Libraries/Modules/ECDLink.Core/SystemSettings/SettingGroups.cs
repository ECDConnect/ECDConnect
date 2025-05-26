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

                public static class Smtp
                {
                    public const string SmtpGrouping = "Notifications.EmailProviders.Smtp";

                    public const string User = "Notifications.EmailProviders.Smtp.User";
                    public const string Key = "Notifications.EmailProviders.Smtp.Key";
                    public const string DefaultEmail = "Notifications.EmailProviders.Smtp.FromEmail";
                    public const string DefaultEmailDisplayName = "Notifications.EmailProviders.Smtp.FromEmailDisplayName";
                    public const string SmtpServerAddress = "Notifications.EmailProviders.Smtp.SmtpServerAddress";
                    public const string SmtpServerPort = "Notifications.EmailProviders.Smtp.SmtpServerPort";
                    public const string SmtpServerSecondaryAddress = "Notifications.EmailProviders.Smtp.SmtpServerSecondaryAddress";
                    public const string SmtpServerSecondaryPort = "Notifications.EmailProviders.Smtp.SmtpServerSecondaryPort";
                    public const string RetryCount = "Notifications.EmailProviders.Smtp.RetryCount";
                    public const string DevOverrideEmailAddress = "Notifications.EmailProviders.Smtp.DevOverrideEmailAddress";
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

                public static class Sms
                {
                    public const string SmsGrouping = "Notifications.SMSProviders.Sms";
                    public const string Provider = "Notifications.SMSProviders.Sms.Provider";
                }

                public static class SMSPortal
                {
                    public const string SMSPortalGrouping = "Notifications.SMSProviders.SMSPortal";
                    public const string Url = "Notifications.SMSProviders.SMSPortal.BaseUrl";
                    public const string ApiKey = "Notifications.SMSProviders.SMSPortal.ApiKey";
                    public const string ApiSecret = "Notifications.SMSProviders.SMSPortal.ApiSecret";
                }

                public static class iTouch
                {
                    public const string iTouchGrouping = "Notifications.SMSProviders.iTouch";
                    public const string Url = "Notifications.SMSProviders.iTouch.BaseUrl";
                    public const string Username = "Notifications.SMSProviders.iTouch.Username";
                    public const string Password = "Notifications.SMSProviders.iTouch.Password";
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
            }

            public static class Grafana
            {
                public const string GrafanaGrouping = "General.Analytics.Grafana";
                public const string GrafanaGeneralReport = "General.Analytics.Grafana.GeneralDashboard";
            }
        }

        public static class CallBacks
        {
            public const string CallbackGroupBase = "General.Callback";

            public static class Invitations
            {
                public const string InvitationsGrouping = "General.Callback.Invitations";

                public const string Signup = "General.Callback.Invitations.Signup";
                public const string AdminSignup = "General.Callback.Invitations.AdminSignup";
                public const string PreSchoolInvitation = "General.Callback.Invitations.PreSchoolInvitation";
            }

            public static class Security
            {
                public const string SecurityGrouping = "General.Callback.Security";

                public const string ForgotPassword = "General.Callback.Security.ForgotPassword";
                public const string ForgotPasswordPortal = "General.Callback.Security.ForgotPasswordPortal";
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

            public const string BlobStorageDisplayUrl = "General.Azure.BlobStorageDisplayUrl";

            public const string BlobStorageActualUrl = "General.Azure.BlobStorageActualUrl";
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

        public static class IncomeStatements
        {
            public const string IncomeStatementSubmitStart = "General.IncomeStatementSubmitStart";
            public const string IncomeStatementSubmitEnd = "General.IncomeStatementSubmitEnd";
        }
    }
}
