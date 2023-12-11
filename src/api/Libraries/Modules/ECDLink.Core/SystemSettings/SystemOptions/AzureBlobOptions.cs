using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Azure.AzureGroupBase)]
    public class AzureBlobOptions
    {
        public string BlobStorageConnection { get; set; }

        public string BlobStorageDisplayUrl { get; set; }

        public string BlobStorageActualUrl { get; set; }
    }
}
