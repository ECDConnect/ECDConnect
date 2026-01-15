using HotChocolate;
using HotChocolate.AspNetCore.Instrumentation;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.EGraphQL.Diagnostic
{
    public class AppServerDiagnosticEventListener : ServerDiagnosticEventListener
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AppServerDiagnosticEventListener(IServiceProvider services) 
        {
            _httpContextAccessor = services.GetService<IHttpContextAccessor>();
        }

        public override void HttpRequestError(HttpContext context, Exception exception)
        {
            AddErrorTelemetry("Http Request Error", exception);
            base.HttpRequestError(context, exception);
        }

        public override void HttpRequestError(HttpContext context, IError error)
        {
            AddErrorTelemetry("Http Request Error", error.Exception);
            base.HttpRequestError(context, error);
        }

        public override void ParserErrors(HttpContext context, IReadOnlyList<IError> errors)
        {
            var error = errors.FirstOrDefault();
            AddErrorTelemetry("Parser Errors", error?.Exception);
            base.ParserErrors(context, errors);
        }

        private void AddErrorTelemetry(string type, Exception ex)
        {
            if (_httpContextAccessor == null || _httpContextAccessor.HttpContext == null || ex == null) return;

            var context = _httpContextAccessor.HttpContext;
            var requestTelemetry = context.Features.Get<RequestTelemetry>();
            if (requestTelemetry != null)
            {
                requestTelemetry.Properties.Add("GraphQL Error Type", type);
                requestTelemetry.Properties.Add("GraphQL Exception", ex.ToString());
            }
        }

    }
}
