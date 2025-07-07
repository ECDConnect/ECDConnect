namespace ECDLink.Security
{
    public static class SecurityConstants
    {
        public static class ApiActions
        {
            public const string VIEW = "View";
            public const string DELETE = "Delete";
            public const string CREATE = "Create";
            public const string UPDATE = "Update";
        }

        public static class Strings
        {
            public static class JwtClaimIdentifiers
            {
                public const string Rol = "rol", Id = "id", Type = "type", TenantId = "tenantId";
            }

            public static class JwtTokenTypes
            {
                public const string OneTimeToken = "SingleUse";
            }

            public static class JwtClaims
            {
                public const string ApiAccess = "api_access";

                public const string AdminAccess = "admin_access";
            }
        }

        public static class RolePolicy
        {
            public const string RequiresAdmin = "RequireAdminRole";

            public const string ApiAccess = "API_ACCESS";
        }

        public static class ContextKeys
        {
            public const string User = "ApplicationUser";

            public const string Permissions = "Permissions";
        }

        public static class InvitationQueryParams
        {
            public const string token = "confirmationToken";

            public const string Email = "emailAddress";
        }
    }
}
