using DotLiquid;
using ECDLink.Tenancy;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using static ECDLink.Security.SecurityConstants.Strings;

namespace EcdLink.Api.CoreApi.Telemetry
{
    class GraphqlRequest
    {
        public string query { get; set; }

        public Dictionary<string, object> variables { get; set; }
    }

    static class CustomRequestProperties
    {
        // Tenant
        public const string AppTenantId = "App TenantId";

        // User
        public const string AppUserId = "App UserId";
        public const string AppRole = "App Roles";

        // Http Header
        public const string HttpHeaderReferer = "HTTP Header Referer";
        public const string HttpHeaderOrigin = "HTTP Header Origin";
        public const string HttpHeaderContentLength = "HTTP Header ContentLength";

        // Http Request
        public const string HttpRequestBody = "HTTP Request Body";

        // GraphQL
        public const string GraphQLOperationType = "GraphQL OperationType";
        public const string GraphQLOperationName = "GraphQL OperationName";
        public const string GraphQLVariable = "GraphQL Variable - ";
    }

    public class TelemetryMiddleware
    {
        private readonly RequestDelegate _next;

        public TelemetryMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            //context.Request.EnableBuffering(); // Enable buffering to allow multiple reads
            //var bodyStream = new StreamReader(context.Request.Body);
            //var bodyText = await bodyStream.ReadToEndAsync();
            //context.Request.Body.Position = 0; // Reset stream position for further processing
            //// Store the request body in a property bag or a place where it can be accessed by the TelemetryInitializer
            //context.Items["RequestBody"] = bodyText;

            var request = context.Request;
            var requestTelemetry = context.Features.Get<RequestTelemetry>();

            if (requestTelemetry != null)
            {
                AddTenantProperties(requestTelemetry, context);
                AddAppUserProperties(requestTelemetry, context);
                AddHttpHeaderProperties(requestTelemetry, context);

                if (request?.Body?.CanRead == true)
                {
                    request.EnableBuffering();

                    var bodySize = (int)(request.ContentLength ?? request.Body.Length);
                    if (bodySize > 0)
                    {
                        request.Body.Position = 0;

                        byte[] body;

                        using (var ms = new MemoryStream(bodySize))
                        {
                            await request.Body.CopyToAsync(ms);

                            body = ms.ToArray();
                        }

                        request.Body.Position = 0;

                        var requestBodyString = Encoding.UTF8.GetString(body);
                        AddHttpRequestProperties(requestTelemetry, context, requestBodyString);

                        if (context.Request.Path.StartsWithSegments("/graphql") && requestBodyString.Length > 5)
                        {
                            AddGraphQLProperties(requestTelemetry, context, requestBodyString);
                        }
                    }
                }
            }

            await _next(context);
        }

        private void AddTenantProperties(RequestTelemetry requestTelemetry, HttpContext context)
        {
            if (requestTelemetry == null) return;
            string tenantId = "";
            if (context.User != null)
            {
                var tenantClaim = context.User.Claims.FirstOrDefault(x => string.Equals(x.Type, JwtClaimIdentifiers.TenantId));
                tenantId = tenantClaim?.Value ?? "";
            }
            requestTelemetry.Properties.Add(CustomRequestProperties.AppTenantId, tenantId);
        }

        private void AddAppUserProperties(RequestTelemetry requestTelemetry, HttpContext context)
        {
            if (requestTelemetry == null) return;
            string userId = "", roles = "";
            if (context.User != null)
            {
                var roleClaim = context.User.Claims.FirstOrDefault(x => string.Equals(x.Type, JwtClaimIdentifiers.Rol));
                if (context.User != null && context.User.Identity != null && context.User.Identity.IsAuthenticated)
                {
                    userId = context.User.Identity.Name;
                    roles = roleClaim?.Value ?? "";
                    requestTelemetry.Context.User.Id = userId; // User's unique identifier
                    requestTelemetry.Context.User.AuthenticatedUserId = userId; // Authenticated user ID
                }
                else
                {
                    userId = "none";
                }
            }
            requestTelemetry.Properties.Add(CustomRequestProperties.AppUserId, userId);
            requestTelemetry.Properties.Add(CustomRequestProperties.AppRole, roles);
        }

        private void AddHttpHeaderProperties(RequestTelemetry requestTelemetry, HttpContext context)
        {
            if (requestTelemetry == null) return;
            var request = context.Request;
            requestTelemetry.Properties.Add(CustomRequestProperties.HttpHeaderReferer, request.Headers?.Referer.ToString() ?? "");
            requestTelemetry.Properties.Add(CustomRequestProperties.HttpHeaderOrigin, request.Headers?.Origin.ToString() ?? "");
            requestTelemetry.Properties.Add(CustomRequestProperties.HttpHeaderContentLength, (request.ContentLength ?? 0).ToString());
        }

        private void AddHttpRequestProperties(RequestTelemetry requestTelemetry, HttpContext context, string requestBodyString)
        {
            if (requestTelemetry == null) return;
            var request = context.Request;
            requestTelemetry.Properties.Add(CustomRequestProperties.HttpRequestBody, requestBodyString);
        }

        private void AddGraphQLProperties(RequestTelemetry requestTelemetry, HttpContext context, string requestBodyString)
        {
            requestBodyString = requestBodyString.Replace("\\n", "").Trim();
            try
            {
                var req = JsonConvert.DeserializeObject<GraphqlRequest>(requestBodyString);
                var s = 0;
                var i = req.query.IndexOfAny(new char[] { ' ', '(', '{' }, s);
                var operation = req.query.Substring(s, i - s).Trim();
                if (operation == "query" || operation == "mutation")
                {
                    requestTelemetry.Properties.Add(CustomRequestProperties.GraphQLOperationType, operation);
                    var name = "";
                    int c = 0;
                    while (name == "" && c < 30)
                    {
                        c++;
                        s = i + 1;
                        i = req.query.IndexOfAny(new char[] { ' ', '(', '{' }, s);
                        name = req.query.Substring(s, i - s).Trim();
                    }
                    requestTelemetry.Properties.Add(CustomRequestProperties.GraphQLOperationName, name);
                    requestTelemetry.Context.Operation.Name = $"{context.Request.Method} {context.Request.Path}{operation}/{name}";
                    if (req.variables != null)
                    {
                        foreach (var variable in req.variables)
                        {
                            requestTelemetry.Properties.Add($"{CustomRequestProperties.GraphQLVariable}{variable.Key}", variable.Value?.ToString() ?? "<null>");
                        }
                    }
                }
                else
                {
                    requestTelemetry.Properties.Add(CustomRequestProperties.GraphQLOperationType, "");
                    requestTelemetry.Properties.Add(CustomRequestProperties.GraphQLOperationName, "");
                }
            }
            catch (Exception)
            {
                requestTelemetry.Properties.Add(CustomRequestProperties.GraphQLOperationType, "unable to parse");
                requestTelemetry.Properties.Add(CustomRequestProperties.GraphQLOperationName, "unable to parse");
            }
        }
    }
}
