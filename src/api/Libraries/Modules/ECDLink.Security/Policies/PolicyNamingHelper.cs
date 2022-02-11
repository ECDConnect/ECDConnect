namespace ECDLink.Security.Policies
{
    public static class PolicyNamingHelper
    {
        public static string PolicyFactory(string name, PolicyEnum policyType)
        {
            switch (policyType)
            {
                case PolicyEnum.Create:
                    return $"create_{name}";
                case PolicyEnum.Update:
                    return $"update_{name}";
                case PolicyEnum.View:
                    return $"view_{name}";
                case PolicyEnum.Delete:
                    return $"delete_{name}";
                default:
                    return string.Empty;
            }
        }
    }
}
