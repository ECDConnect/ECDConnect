using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DotLiquid;
using Ganss.XSS;
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

        public async Task Invoke(HttpContext httpContext)
        {
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

