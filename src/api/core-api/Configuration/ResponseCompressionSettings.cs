using System;

namespace EcdLink.Api.CoreApi.Configuration
{
    public class ResponseCompressionSettings
    {
        public bool Enabled { get; set; } = true;
        public string[] ExcludeMimeTypes { get; set; } = Array.Empty<string>();
        public string[] MimeTypes { get; set; } = Array.Empty<string>();
        //public int MinResponseSize { get; set; } = 1024; not supported yet by compression implementation
    }
}
