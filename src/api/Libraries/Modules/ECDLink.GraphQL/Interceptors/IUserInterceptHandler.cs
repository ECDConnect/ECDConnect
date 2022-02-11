using ECDLink.Core.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.EGraphQL.Interceptors
{
    public interface IUserInterceptHandler
    {
        public void OnUserIntercept(HttpContext context, ApplicationIdentityUser user);
    }
}
