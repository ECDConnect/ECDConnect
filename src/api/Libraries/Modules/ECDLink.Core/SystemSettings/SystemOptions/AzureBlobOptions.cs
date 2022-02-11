using ECDLink.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Azure.AzureGroupBase)]
    public class AzureBlobOptions
    {
        public string BlobStorageConnection { get; set; }
    }
}
