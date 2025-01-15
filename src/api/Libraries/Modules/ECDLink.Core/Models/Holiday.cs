using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace ECDLink.Core.Models
{
    public class Holiday
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [JsonProperty("date")]
        public DateTime Day { get; set; }
        public DateTime CheckedDate { get; set; }
        public string Locale { get; set; }
    }
}
