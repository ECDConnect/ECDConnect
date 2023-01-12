using ECDLink.Security.Enums;

namespace ECDLink.Security.AccessModifiers.OpenAccess
{
    public interface IOpenAccessValidator<T> where T : class, IOpenAccessValidator<T>
    {
        AuthState ValidateToken(string token);
    }
}
