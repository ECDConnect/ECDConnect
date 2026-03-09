using HotChocolate;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.EGraphQL.Diagnostic
{
    public class ErrorFilter : IErrorFilter
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ErrorFilter(System.IServiceProvider services)
        {
            _httpContextAccessor = services.GetService<IHttpContextAccessor>();
        }

        public IError OnError(IError error)
        {
            if (_httpContextAccessor != null && _httpContextAccessor.HttpContext != null && error.Exception != null)
            {
                var context = _httpContextAccessor.HttpContext;
                var requestTelemetry = context.Features.Get<RequestTelemetry>();
                if (requestTelemetry != null)
                {
                    requestTelemetry.Properties.Add("GraphQL Exception", error.Exception.ToString());
                }
            }
            return error;
        }
    }
}
