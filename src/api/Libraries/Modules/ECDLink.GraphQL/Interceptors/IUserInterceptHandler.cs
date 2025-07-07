using ECDLink.Core.Models;
using Microsoft.AspNetCore.Http;

namespace ECDLink.EGraphQL.Interceptors
{
    public interface IUserInterceptHandler
    {
        public void OnUserIntercept(HttpContext context, ApplicationIdentityUser user);
    }
}
