using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AngleSharp.Html.Dom;
using DotLiquid;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using Ganss.Xss;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using SendGrid.Helpers.Errors.Model;

namespace EcdLink.Api.CoreApi.Middleware
{
    public class InputSanitizerMiddleware
    {
        private readonly RequestDelegate _next;

        public InputSanitizerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext, ISystemSetting<AzureBlobOptions> _options)
        {
            //var urlParts = _options.Value.BlobStorageConnection.Split(';').Select(item => item.Split('=')).ToDictionary(s => s[0], s => s[1]);
            //var url = new Uri($"{urlParts["DefaultEndpointsProtocol"]}://{urlParts["AccountName"]}.blob.{urlParts["EndpointSuffix"]}");

            if (httpContext.Request.Method == "POST")
            {
                StreamReader reader = new StreamReader(httpContext.Request.Body);
                string text = await reader.ReadToEndAsync();
                text = new HtmlSanitizer().Sanitize(text);
                byte[] requestData = Encoding.UTF8.GetBytes(text);
                httpContext.Request.Body = new MemoryStream(requestData);
            }
            await _next.Invoke(httpContext);
        }
    }

    public static class InputSanitizerMiddlewareExtensions
    {
        public static IApplicationBuilder UseInputSanitizer(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<InputSanitizerMiddleware>();
        }
    }
}

