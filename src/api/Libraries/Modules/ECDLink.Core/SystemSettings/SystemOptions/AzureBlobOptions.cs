using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Azure.AzureGroupBase)]
    public class AzureBlobOptions
    {
        public string BlobStorageConnection { get; set; }
    }
}
