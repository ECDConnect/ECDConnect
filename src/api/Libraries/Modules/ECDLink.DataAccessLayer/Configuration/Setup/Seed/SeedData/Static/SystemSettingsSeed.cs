using ECDLink.Core.SystemSettings;
using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class SystemSettingsSeed<T>
       where T : SystemSetting, new()
    {
        internal static IList<T> GetSeed()
        {
            return new List<T>()
            {
                // Reporting
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Reporting.ReportGroupBase,
                    FullPath = SettingGroups.Reporting.ChildReports.ReportIntervals,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Reporting.ChildReports.ReportIntervals),
                    Value = "6, 12",
                    IsActive = true,
                    IsSystemValue = true
                },
                // Child
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Children.ChildrenGroupBase,
                    FullPath = SettingGroups.Children.ChildObservationPeriod,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Children.ChildObservationPeriod),
                    Value = "30",
                    IsActive = true,
                    IsSystemValue = true
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Children.ChildrenGroupBase,
                    FullPath = SettingGroups.Children.ChildDataExpiry,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Children.ChildDataExpiry),
                    Value = "24",
                    IsActive = true,
                    IsSystemValue = true
                },
                // JWT Token
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Security.Jwt.JwtGroup,
                    FullPath = SettingGroups.Security.Jwt.LongToken,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Security.Jwt.LongToken),
                    Value = "800",
                    IsActive = true,
                    IsSystemValue = true
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Security.Jwt.JwtGroup,
                    FullPath = SettingGroups.Security.Jwt.ShortToken,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Security.Jwt.ShortToken),
                    Value = "1",
                    IsActive = true,
                    IsSystemValue = true
                },
                // Token Expiries
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Security.Tokens.TokenGroup,
                    FullPath = SettingGroups.Security.Tokens.InvitationLinkExpiry,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Security.Tokens.InvitationLinkExpiry),
                    Value = "24",
                    IsActive = true,
                    IsSystemValue = true
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Security.Tokens.TokenGroup,
                    FullPath = SettingGroups.Security.Tokens.OpenAccessInvitationExpiry,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Security.Tokens.OpenAccessInvitationExpiry),
                    Value = "800",
                    IsActive = true,
                    IsSystemValue = true
                },
                // Google Analytics
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Analytics.Google.GoogleGrouping,
                    FullPath = SettingGroups.Analytics.Google.GoogleReport,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Analytics.Google.GoogleReport),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Analytics.Google.GoogleGrouping,
                    FullPath = SettingGroups.Analytics.Google.Tag,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Analytics.Google.Tag),
                    Value = "G-H92H3LLH2D",
                    IsActive = true,
                    IsSystemValue = true
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Analytics.Google.GoogleGrouping,
                    FullPath = SettingGroups.Analytics.Google.TagManager,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Analytics.Google.TagManager),
                    Value = "GTM-NV6FSTF",
                    IsActive = true,
                    IsSystemValue = true
                },
                // BulkSMS
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Notifications.SMS.BulkSms.BulkSmsGrouping,
                    FullPath = SettingGroups.Notifications.SMS.BulkSms.Name,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Notifications.SMS.BulkSms.Name),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Notifications.SMS.BulkSms.BulkSmsGrouping,
                    FullPath = SettingGroups.Notifications.SMS.BulkSms.Url,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Notifications.SMS.BulkSms.Url),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Notifications.SMS.BulkSms.BulkSmsGrouping,
                    FullPath = SettingGroups.Notifications.SMS.BulkSms.TokenId,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Notifications.SMS.BulkSms.TokenId),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Notifications.SMS.BulkSms.BulkSmsGrouping,
                    FullPath = SettingGroups.Notifications.SMS.BulkSms.TokenSecret,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Notifications.SMS.BulkSms.TokenSecret),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Notifications.SMS.BulkSms.BulkSmsGrouping,
                    FullPath = SettingGroups.Notifications.SMS.BulkSms.AuthToken,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Notifications.SMS.BulkSms.AuthToken),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },

                // RapidApi 
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Proxies.Holiday.RapidApi.RapidApiGrouping,
                    FullPath = SettingGroups.Proxies.Holiday.RapidApi.Name,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Proxies.Holiday.RapidApi.Name),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Proxies.Holiday.RapidApi.RapidApiGrouping,
                    FullPath = SettingGroups.Proxies.Holiday.RapidApi.Url,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Proxies.Holiday.RapidApi.Url),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Proxies.Holiday.RapidApi.RapidApiGrouping,
                    FullPath = SettingGroups.Proxies.Holiday.RapidApi.Host,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Proxies.Holiday.RapidApi.Host),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Proxies.Holiday.RapidApi.RapidApiGrouping,
                    FullPath = SettingGroups.Proxies.Holiday.RapidApi.Key,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Proxies.Holiday.RapidApi.Key),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                // URL Shortner
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Proxies.UrlShortner.UrlShortnerGroupBase,
                    FullPath = SettingGroups.Proxies.UrlShortner.RedirectUrl,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Proxies.UrlShortner.RedirectUrl),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                // Azure Storage
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.Azure.AzureGroupBase,
                    FullPath = SettingGroups.Azure.BlobStorageConnection,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.Azure.BlobStorageConnection),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                // Callbacks
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.CallBacks.Invitations.InvitationsGrouping,
                    FullPath = SettingGroups.CallBacks.Invitations.Signup,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.CallBacks.Invitations.Signup),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.CallBacks.Security.SecurityGrouping,
                    FullPath = SettingGroups.CallBacks.Security.ForgotPassword,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.CallBacks.Security.ForgotPassword),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
                new T
                {
                    Id = Guid.NewGuid(),
                    Grouping = SettingGroups.CallBacks.Security.SecurityGrouping,
                    FullPath = SettingGroups.CallBacks.Security.Login,
                    Name = SettingGroupHelper.GetSettingName(SettingGroups.CallBacks.Security.Login),
                    Value = "",
                    IsActive = true,
                    IsSystemValue = true,
                },
            };
        }
    }
}
