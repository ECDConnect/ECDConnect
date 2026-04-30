using System;

namespace EcdLink.Api.CoreApi.Configuration
{
    public class CorsPolicySettings
    {
        public string Origins { get; set; } = string.Empty;
        public string Methods { get; set; } = string.Empty;
        public string Headers {  get; set; } = string.Empty;
        public string ExposeHeaders { get; set; } = string.Empty;
    }
}
