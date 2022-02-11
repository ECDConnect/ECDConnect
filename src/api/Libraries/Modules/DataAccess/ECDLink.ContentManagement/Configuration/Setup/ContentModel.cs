using Newtonsoft.Json;
using System.Collections.Generic;

namespace ECDLink.ContentManagement.Configuration.Setup
{
    public class JsonContentSeed
    {
        [JsonProperty("contentDefinition")]
        public SeedContentDefinition ContentDefinition { get; set; }

        [JsonProperty("dataSeed")]
        public IEnumerable<DataSeed> Seed { get; set; }
    }

    public class SeedContentDefinition
    {
        [JsonProperty("contentName")]
        public string ContentName { get; set; }
        [JsonProperty("description")]
        public string ContentDescription { get; set; }

        [JsonProperty("fields")]
        public List<SeedField> SeedFields { get; set; }
    }

    public class DataSeed
    {
        [JsonProperty("Id")]
        public string Id { get; set; }

        [JsonProperty("data")]
        public List<Dictionary<string, string>> Data { get; set; }
    }

    public class SeedField
    {
        [JsonProperty("fieldOrder")]
        public int Order { get; set; }
        [JsonProperty("fieldName")]
        public string Name { get; set; }

        [JsonProperty("fieldType")]
        public string Type { get; set; }

        [JsonProperty("dataLink")]
        public string dataLink { get; set; }

        [JsonProperty("isRequired")]
        public bool IsRequired { get; set; }
    }
}
