using ECDLink.DataAccessLayer.Repositories;
using ECDLink.Security.Managers;

namespace EcdLink.Api.CoreApi.Security.Managers
{
    public class AuthorizationManager : IAuthorizationManager
    {
        private readonly RolePermissionRepository _rolePermissionRepository;

        public AuthorizationManager(RolePermissionRepository rolePermissionRepository)
        {
            _rolePermissionRepository = rolePermissionRepository;
        }

        public bool HasPermission(string role, string permission)
        {
            return true;
        }

        public bool HasPermission(string[] roles, string permission)
        {
            return _rolePermissionRepository.IsPermissionInRoles(roles, permission);
        }
    }
}
