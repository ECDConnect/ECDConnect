using ECDLink.Core.Models;
using ECDLink.Security;
using ECDLink.Security.Managers;
using HotChocolate.AspNetCore;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Interceptors
{
    public class UserContextInterceptor : DefaultHttpRequestInterceptor
    {
        public override ValueTask OnCreateAsync(HttpContext context, IRequestExecutor requestExecutor, IQueryRequestBuilder requestBuilder, CancellationToken cancellationToken)
        {
            var contextManager = context.RequestServices.GetService<IClaimsManager>();
            var contextHandler = context.RequestServices.GetService<IUserInterceptHandler>();

            var user = contextManager.GetClaimUser<ApplicationIdentityUser>(context.User);

            if (user != default(ApplicationIdentityUser))
            {
                context.Items[SecurityConstants.ContextKeys.User] = user;

                if (contextHandler != default)
                {
                    contextHandler.OnUserIntercept(context, user);
                }
            }

            return base.OnCreateAsync(context, requestExecutor, requestBuilder,
                  cancellationToken);
        }
    }
}
