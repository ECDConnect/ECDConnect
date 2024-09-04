using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Telemetry
{
    class GraphqlRequest
    {
        public string query { get; set; }
        //public string variables { get; set; }
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

            if (request?.Body?.CanRead == true && requestTelemetry != null)
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

                    if (context.Request.Path.StartsWithSegments("/graphql") && requestBodyString.Length > 5)
                    {
                        requestBodyString = requestBodyString.Replace("\\n", "");
                        var openBracket = requestBodyString.IndexOf("(");
                        if (openBracket >= 0)
                        {
                            var req = JsonConvert.DeserializeObject<GraphqlRequest>(requestBodyString);

                            openBracket = req.query.IndexOf("(");
                            var operation = req.query.Substring(0, openBracket);
                            operation = operation.Replace("\n", "").Trim();
                            var parts = operation.Split(' ');
                            if (parts.Length == 1)
                            {
                                requestTelemetry.Context.Operation.Name = $"{context.Request.Method} {context.Request.Path}/{parts[0]}";
                            }
                            else
                            {
                                requestTelemetry.Context.Operation.Name = $"{context.Request.Method} {context.Request.Path}/{parts[0]}/{parts[1]}";
                                requestTelemetry.Properties.Add("GraphQL OperationType", parts[0]);
                                requestTelemetry.Properties.Add("GraphQL OperationName", parts[1]);
                            }
                        }
                    }
                    requestTelemetry.Properties.Add("RequestBody", requestBodyString);
                }
            }

            await _next(context);
        }
    }
}
