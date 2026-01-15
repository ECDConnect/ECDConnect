using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Execution.Instrumentation;
using HotChocolate.Resolvers;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;


namespace ECDLink.EGraphQL.Diagnostic
{
    public class AppExecutionDiagnosticEventListener : ExecutionDiagnosticEventListener
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AppExecutionDiagnosticEventListener(IServiceProvider services) 
        {
            _httpContextAccessor = services.GetService<IHttpContextAccessor>();
        }

        public override void RequestError(IRequestContext context, Exception exception)
        {
            AddErrorTelemetry("Request Error", exception);
            base.RequestError(context, exception);
        }

        public override void ResolverError(IMiddlewareContext context, IError error)
        {
            AddErrorTelemetry("Resolver Error", error.Exception);
            base.ResolverError(context, error);
        }

        public override void SyntaxError(IRequestContext context, IError error)
        {
            AddErrorTelemetry("Syntax Error", error.Exception);
            base.SyntaxError(context, error);
        }

        public override void TaskError(IExecutionTask task, IError error)
        {
            AddErrorTelemetry("Task Error", error.Exception);
            base.TaskError(task, error);
        }

        public override void ValidationErrors(IRequestContext context, IReadOnlyList<IError> errors)
        {
            var error = errors.FirstOrDefault();
            AddErrorTelemetry("Validation Errors", error?.Exception);
            base.ValidationErrors(context, errors);
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
