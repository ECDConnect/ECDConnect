namespace ECDLink.Core.Services.ResourceLinkHealth
{
    public static class ResourceLinkHealthConstants
    {
        public const string ClassroomBusinessResource = "ClassroomBusinessResource";
        public const string ConnectItem = "ConnectItem";

        public const string SectionClassroom = "classroom";
        public const string SectionBusiness = "business";
        public const string SectionCommunity = "community";

        public const string StatusOk = "ok";
        public const string StatusBroken = "broken";
        public const string StatusUnverifiable = "unverifiable";
        public const string StatusTransient = "transient";

        public const int ConsecutiveFailureThreshold = 2;
        public const int MaxConcurrentChecks = 5;
        public const int RequestTimeoutSeconds = 15;
    }
}
