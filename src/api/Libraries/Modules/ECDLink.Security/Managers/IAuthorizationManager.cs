namespace ECDLink.Security.Managers
{
    public interface IAuthorizationManager
    {
        bool HasPermission(string[] roles, string permission);
    }
}
