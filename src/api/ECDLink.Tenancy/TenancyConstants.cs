namespace ECDLink.Tenancy
{
    public static class TenancyConstants
    {
        public const string TenancyContextItem = "TenancyContext";

        public static class Configuration
        {
            public const string TenantSettings = "TenantSettings";
        }

        public static class Jwt
        {
            public const string TenantJwtClaim = "tenantId";
        }
    }
}
