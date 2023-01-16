using ECDLink.Security.Filters;
using Microsoft.AspNetCore.Mvc;
using System;

namespace ECDLink.Security.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class BasicAuthAttribute : TypeFilterAttribute
    {
        public BasicAuthAttribute()
            : base(typeof(BasicAuthFilter))
        {
        }
    }
}
