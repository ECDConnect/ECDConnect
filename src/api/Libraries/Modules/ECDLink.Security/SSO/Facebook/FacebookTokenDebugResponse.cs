using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ECDLink.Security.SSO.Facebook
{
    public class FacebookTokenDebugResponse
    {
        [JsonPropertyName("data")]
        [JsonProperty("data")]
        public FacebookTokenData? Data { get; set; }
    }

    public class FacebookTokenData
    {
        [JsonPropertyName("app_id")]
        [JsonProperty("app_id")]
        public string AppId { get; set; } = string.Empty;

        [JsonPropertyName("user_id")]
        [JsonProperty("user_id")]
        public string UserId { get; set; } = string.Empty;

        [JsonPropertyName("is_valid")]
        [JsonProperty("is_valid")]
        public bool IsValid { get; set; }

        [JsonPropertyName("expires_at")]
        [JsonProperty("expires_at")]
        public long ExpiresAt { get; set; }  // Unix timestamp

        [JsonPropertyName("scopes")]
        [JsonProperty("scopes")]
        public string[] Scopes { get; set; } = Array.Empty<string>();
    }
}
