using HotChocolate;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace ECDLink.EGraphQL.Diagnostic
{
    public class ErrorFilter : IErrorFilter
    {
        private static readonly string[] _passthroughCodes = new[]
        {
            "AUTH_NOT_AUTHORIZED",
            "AUTH_NOT_AUTHENTICATED"
        };

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<ErrorFilter> _logger;
        private readonly bool _isDevelopment;

        public ErrorFilter(System.IServiceProvider services)
        {
            _httpContextAccessor = services.GetService<IHttpContextAccessor>();
            _logger = services.GetService<ILogger<ErrorFilter>>();
            _isDevelopment = services.GetService<IWebHostEnvironment>()?.IsDevelopment() ?? false;
        }

        public IError OnError(IError error)
        {
            // Always log to Application Insights when available
            if (_httpContextAccessor?.HttpContext != null)
            {
                var requestTelemetry = _httpContextAccessor.HttpContext.Features.Get<RequestTelemetry>();
                if (requestTelemetry != null)
                {
                    var detail = error.Exception?.ToString() ?? error.Message;
                    requestTelemetry.Properties["GraphQL Error"] = detail;
                }
            }

            if (_isDevelopment)
                return error;

            // Auth errors must pass through so clients can handle 401/403 correctly
            if (error.Code != null && System.Array.Exists(_passthroughCodes, c => c == error.Code))
                return error;

            // Log verbose detail server-side before sanitizing
            _logger?.LogWarning("GraphQL error suppressed in production. Code: {Code} Message: {Message} Path: {Path}",
                error.Code, error.Message, string.Join(".", error.Path?.ToList() ?? new List<object>()));

            return error.WithMessage("An error occurred. Please try again.");
        }
    }
}
