using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Security.Managers
{
    public interface IAuthorizationManager
    {
        bool HasPermission(string[] roles, string permission);
    }
}
