using ECDLink.Security.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Security.AccessModifiers.OpenAccess
{
    public interface IOpenAccessValidator<T> where T : class, IOpenAccessValidator<T>
    {
        AuthState ValidateToken(string token);
    }
}
