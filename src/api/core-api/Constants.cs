namespace EcdLink.Api.CoreApi
{
    public static class Constants
    {
        public static class ApplicationSettings
        {
            public const string DefaultDbConnection = "ConnectionStrings:DefaultConnection";

            public const string GraphEndPoint = "GraphQl:EndPoint";
        }

        public static class GrowGreatSettings
        {
            public const string visitType_all = "all";
            public const string visitType_overdue = "overdue";
            public const string visitType_due = "due";

            public const string client_mother = "mother";
            public const string client_infant = "infant";
            public const string client_child = "child";

            public const string client_pregnant_mom = "Pregnant mom";
            public const string client_pregnant_mom_and_child = "Pregnant mom and child";
            public const string client_pregnant_mom_multiple_children = "Multiple children";

            public const string additional_visits = "additional_visits";
        }
    }
}
