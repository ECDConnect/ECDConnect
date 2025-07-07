using ECDLink.Tenancy.Enums;
using System;

namespace ECDLink.Tenancy.Model
{
    public class TenantModel
    {
        public TenantModel()
        {
        }

        public TenantModel(TenantInternalModel model)
        {
            Id = model.Id;
            SiteAddress = model.SiteAddress;
            SiteAddress2 = model.SiteAddress2;
            AdminSiteAddress = model.AdminSiteAddress;
            ApplicationName = model.ApplicationName;
            OrganisationName = model.OrganisationName;
            TenantType = model.TenantType;
            ThemePath = model.ThemePath;
            MoodleUrl = model.MoodleUrl;
            Modules = model.Modules;
            GoogleAnalyticsTag = model.GoogleAnalyticsTag;
            GoogleTagManager = model.GoogleTagManager;
            OrganisationEmail = model.OrganisationEmail;
            BlobStorageAddress = model.BlobStorageAddress;
        }

        public Guid Id { get; set; }
        public string SiteAddress { get; set; }
        public string SiteAddress2 { get; set; }
        public string AdminSiteAddress { get; set; }
        public string ApplicationName { get; set; }
        public string OrganisationName { get; set; }
        public TenantType TenantType { get; set; } = TenantType.WhiteLabel;
        public string ThemePath { get; set; }
        public string MoodleUrl { get; set; }
        public TenantModuleModel Modules { get; set; }
        public string GoogleAnalyticsTag { get; set; }
        public string GoogleTagManager { get; set; }
        public string OrganisationEmail { get; set; }
        public string BlobStorageAddress { get; set; }
    }

    public class TenantModelAPI
    {
        public TenantModelAPI()
        {
        }

        public TenantModelAPI(TenantModel model)
        {
            Id = model.Id;
            SiteAddress = model.SiteAddress;
            AdminSiteAddress = model.AdminSiteAddress;
            ApplicationName = model.ApplicationName;
            OrganisationName = model.OrganisationName;
            ThemePath = model.ThemePath;
            MoodleUrl = model.MoodleUrl;
            switch (model.TenantType)
            {
                case Enums.TenantType.CHWConnect: TenantType = "CHW_CONNECT"; break;
                case Enums.TenantType.Host: TenantType = "HOST"; break;
                case Enums.TenantType.OpenAccess: TenantType = "OPEN_ACCESS"; break;
                case Enums.TenantType.WhiteLabel: TenantType = "WHITE_LABEL"; break;
                case Enums.TenantType.WhiteLabelTemplate: TenantType = "WHITE_LABEL_TEMPLATE"; break;
                case Enums.TenantType.FundaApp: TenantType = "FUNDA_APP"; break;
                default: TenantType = ""; break;
            }
            Modules = model.Modules;
            GoogleAnalyticsTag = model.GoogleAnalyticsTag;
            GoogleTagManager = model.GoogleTagManager;
            OrganisationEmail = model.OrganisationEmail;
            BlobStorageAddress = model.BlobStorageAddress;
        }

        public Guid Id { get; set; }
        public string SiteAddress { get; set; }
        public string AdminSiteAddress { get; set; }
        public string ApplicationName { get; set; }
        public string OrganisationName { get; set; }
        public string TenantType { get; set; }
        public string ThemePath { get; set; }
        public string MoodleUrl { get; set; }
        public TenantModuleModel Modules { get; set; }
        public string GoogleAnalyticsTag { get; set; }
        public string GoogleTagManager { get; set; }
        public string OrganisationEmail { get; set; }
        public string BlobStorageAddress { get; set; }
    }
}
