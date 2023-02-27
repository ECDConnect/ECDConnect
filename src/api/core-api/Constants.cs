using ECDLink.DataAccessLayer.Entities.Users;
using NPOI.SS.Formula.Functions;
using System.Collections.Generic;
using System.Collections.Immutable;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EcdLink.Api.CoreApi
{
    public static class Constants
    {
        public static class ApplicationSettings
        {
            public const string DefaultDbConnection = "ConnectionStrings:DefaultConnection";

            public const string GraphEndPoint = "GraphQl:EndPoint";
        }

        public static class GGSettings
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

            public const string visit_data_client_dashboard = "ClientDashboard";
            public const string visit_data_client_summary = "ClientSummary";
            public const string visit_data_client_referral = "Referral";
            public const string visit_data_client_progress = "Progress";

            // Mother Questions

            public const string q_first_antenatal_visit = "Has {client} gone to the clinic for her first antenatal visit?";
            public const string q_antenatal_visits = "Is {client} up to date with their antenatal clinic visits?";
            public const string q_measurement = "MUAC measurement";
            public const string q_danger_signs = "Tick the danger signs {client} is experiencing";

            public const string q_stop_worry = "Felt unable to stop worrying or thinking too much?";
            public const string q_felt_down = "Felt down, depressed or hopeless?";
            public const string q_suicide = "Had thoughts and plans to harm yourself or commit suicide?";

            public const string q_T = "(T) Tolerance: how many drinks does it take to make you high?";
            public const string q_A = "(A) Have people annoyed you by critizing your drinking?";
            public const string q_C = "(C) Have you ever felt you need to cut down on your drinking?";
            public const string q_E = "(E) Eye - opener: have you ever had a drink the first thing in the morning to steady your nerves or get rid of a hangover?";

            public const string q_ID_doc = "Does {client} have an ID document?";
            public const string q_citizen = "Is {client} a South African citizen or permanent resident?";

            // Mother referral, progress, G4 (ClientDashboardAlert), G9 (ClientSummaryDownload)
            public const string pregnancy_not_booked = "Pregnancy not booked";
            public const string pregnancy_booked = "Pregnancy booked";
            public const string refer_to_clinic = "Refer to clinic";
            public const string refer_to_clinic_urgently = "Refer to clinic urgently";
            public const string clinic_visits_not_up_to_date = "Clinic visits not up to date";
            public const string clinic_visits_up_to_date = "Clinic visits up to date";
            public const string clinic_visits_up_to_date_2 = "You are up to date with your clinic visits!";
            public const string clinic_referrals = "Clinic referrals";
            public const string home_affairs_referrals = "Department of Home Affairs referrals";
            public const string missed_clinic_visit = "You missed a clinic visit - make sure you go as soon as possible!";
            public const string all_clinic_visit = "You are up to date with your clinic visits!";
            public const string underweight = "May be underweight - MUAC less than 22cm";
            public const string underweight2 = "You might be underweight: eat 3 meals every day";
            public const string underweight3 = "Underweight";
            public const string muac_over_22 = "MUAC over 22cm";
            public const string healthy_weight = "According to your mid-upper arm circumference, you are a healthy weight";
            public const string urgent_care = "You need urgent care for some serious health issues";
            public const string no_danger_signs = "No danger signs for ";
            public const string danger_signs = "Danger signs";
            public const string physical_feeling_well = "You are feeling physically well";
            public const string maternal_distress = " was experiencing maternal distress";
            public const string maternal_distress2 = "Maternal distress";
            public const string need_support = "You are struggling and need some support";
            public const string was_coping = " was coping well";
            public const string coping_well = "You are coping well!";
            public const string was_experiencing = " was experiencing: ";
            public const string t_ace_score = " is at risk of a drinking problem (T-ACE score = ";
            public const string support_drinking = "You may need support to reduce your drinking";
            public const string no_alcohol_abuse = " is not at risk for alcohol abuse";
            public const string no_id_book = " doesn't have an ID book";
            public const string id_book = " has an ID book";
            public const string go_to_home_affairs = "Go to Home Affairs to apply for your ID book.  This will allow you to apply for the child social grant as soon as the baby is born.";
            public const string apply_social_grant = "You have your ID document & can apply for a child social grant once the baby is born!";

            public const string health_issues = "You have some health issues";

            // Infant Questions

            public const string q_postnatal_check_up = "Has {client} been to the clinic for a postnatal check-up?";
            public const string q_postnatal_6_weeks = "Did your client attend her 6-week postnatal clinic visit?";
            public const string q_weight = "Weight";
            public const string q_length = "Length";
            public const string cfm_name = "Care for moms";
            public const string cfb_name = "Care for baby";


            // Infant referral, progress, G4 (ClientDashboardAlert), G9 (ClientSummaryDownload)
            public const string infant_missed_clinic_visit = "Missed clinic visit";
            public const string infant_missed_clinic_visit_g9 = "You missed a clinic visit - make sure you go as soon as possible!";

            public const string infant_clinic_visit = "Up to date with clinic visits";
            public const string infant_clinic_visit_g9 = "You are up to date with clinic visits";

            public const string cfm_ds_1 = "Not feeling physically well";
            public const string cfm_ds_2 = "Abdominal pain";
            public const string cfm_ds_3 = "Heavy bleeding";
            public const string cfm_ds_4 = "Feeling too hot or too cold";
            public const string cfm_ds_5 = "Offensive or bad-smelling vaginal fluid";
            public const string cfm_ds_6 = "Unable to manage the baby";
            public const string cfm_ds_7 = "High stress";
            public const string cfm_ds_8 = "Problems with breastfeeding";

            public const string cfb_ds_1 = "Blue skin colour";
            public const string cfb_ds_2 = "Baby is not alert";
            public const string cfb_ds_3 = "Fast breathing or difficulty breathing";
            public const string cfb_ds_4 = "Poor feeding or repeated vomiting";
            public const string cfb_ds_5 = "Low (below 35 degrees C) or high temperature";
            public const string cfb_ds_6 = "Yellow skin or eyes";
            public const string cfb_ds_7 = "Severe eye infection";
            public const string cfb_ds_8 = "Severe cord infection";

            enum double_3sd { 13.3, 17.1, 20.7, 24.2, 29.5 };
            static const double[] arr = new double[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 };



            // Answers

            public const string answer_yes = "Yes";
            public const string answer_no = "No";
            public const string none_above = "None of the above";
            public const string normal_risk = "normal";
            public const string more_than_2 = "More than 2";
            public const string male = "Boy";
            public const string female = "Girl";

        }
    }
}

