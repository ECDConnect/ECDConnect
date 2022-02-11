using Newtonsoft.Json;
using System;

namespace ECDLink.Core.Models
{
    public class Holiday
    {
        [JsonProperty("date")]
        public DateTime Day { get; set; }
    }
}
