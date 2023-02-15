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
            public const string visit1 = "visit_1";
            public const string visit2 = "visit_2";
            public const string visit3 = "visit_3";
            public const string visit4 = "visit_4";

            // The following constants are all cms record constants
            public const string antenatal_healthcare = "Healthcare";
            public const string antenatal_nutrition = "Nutrition";
            public const string antenatal_pregnancy_care = "Pregnancy care";
            public const string antenatal_danger_sings = "Danger signs";

            public const string visit_id = "id";
            public const string visit_name = "name";
            public const string visit_description = "description";
            public const string visit_description_icon = "descriptionIcon";
            public const string visit_icon = "icon";
            public const string visit_image = "image";
            public const string visit_sequence = "sequence";
            public const string visit_primary_color = "primaryColor";
            public const string visit_secondary_color = "secondaryColor";
            public const string visit_type = "type";
            public const string visit_heading = "heading";
            public const string visit_subheading = "subheading";
            public const string visit_heading_icon = "headingIcon";
            public const string visit_heading_color = "headingColor";
            public const string visit_video = "video";

            public const string visit_linkedQuestionnaires = "linkedQuestionnaires";
            public const string visit_linkedQuestions = "linkedQuestions";
            public const string visit_linkedAnswerOptions = "linkedAnswerOptions";

            public const string visit_antenatal_id = "19";

            public const string visit_data_client_dashboard = "ClientDashboard";
            public const string visit_data_client_summary = "ClientSummary";
            public const string visit_data_client_referral = "Referral";
            public const string visit_data_client_progress = "Progress";
        }
    }
}

