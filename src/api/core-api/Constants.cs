using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi {
    public static class Constants
    {
        public static class ApplicationSettings
        {
            public const string DefaultDbConnection = "ConnectionStrings:DefaultConnection";

            public const string GraphEndPoint = "GraphQl:EndPoint";
        }

        public static class GGSettings
        {
            public const int recordsPerPage = 40;
            public const int pageNumber = 0;

            public const string visitType_all = "all";
            public const string visitType_overdue = "overdue";
            public const string visitType_due = "due";

            public const string client_mother = "mother";
            public const string client_child = "child";
            public const string client_new = "New client";
            public const string client_teenager = "Teenager";

            public const string client_pregnant_mom = "Pregnant mom";
            public const string client_pregnant_mom_and_child = "Pregnant mom and child";
            public const string client_pregnant_mom_multiple_children = "Multiple children";

            public const string maternal_record_name = "maternalcaserecord.png";
            public const string upload_maternal_case_record = "Upload maternal case record";

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
            public const string q_measurement = "What is {client} mid-upper arm circumference (MUAC) today?";
            public const string q_danger_signs = "Tick the danger signs {client} is experiencing:";

            public const string q_stop_worry = "Felt unable to stop worrying or thinking too much?";
            public const string q_felt_down = "Felt down, depressed or hopeless?";
            public const string q_suicide = "Had thoughts and plans to harm yourself or commit suicide?";

            public const string q_T = "(T) Tolerance: how many drinks does it take to make you high?";
            public const string q_A = "(A) Have people annoyed you by criticizing your drinking?";
            public const string q_C = "(C) Have you ever felt you need to cut down on your drinking?";
            public const string q_E = "(E) Eye-opener: have you ever had a drink the first thing in the morning to steady your nerves or get rid of a hangover?";

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
            public const string sassa_refferals = "Refer to SASSA";
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
            public const string growth_referral = " is not growing well: ";
            public const string not_growing = " is not growing well";
            public const string growing_well = " is growing well";
            public const string health_issues = "You have some health issues";
            public const string severely_underweight= "Severely underweight";
            public const string severely_stunted = "Severely stunted";
            public const string growth_faltering = "Growth faltering: weight has not increased ";
            public const string moderate_acute_malnutrition = "Moderate acute malnutrition";
            public const string great_job_breastfeeding = "You're doing a great job breastfeeding!";
            public const string great_job_formula_feeding = "You're doing a great job formula feeding!";
            public const string try_to_make_sure = "Try to make sure you give ";
            public const string only_milk = " only breast milk or only formula milk";
            public const string poor_dietary_diversity = "Poor dietary diversity: {x} out of {y} food groups";
            public const string give_client_food = "You are giving {client} foods from {x} out of {y} groups. Try to give {client} a variety of foods!";
            public const string good_dietary_diversity = "Good dietary diversity: {x} out of {y} food groups!";
            public const string give_client_food_most = "You are giving {client} foods from most of the groups!";
            public const string dev_is_struggling = "{client} is struggling with ";
            public const string dev_might_struggling = "{client} might be having issues with: ";
            public const string immunisations_not_up_to_date = "Immunisations not up to date";
            public const string vitamin_not_up_to_date = "Vitamin A not up to date";
            public const string deworming_not_up_to_date = "Deworming not up to date";
            public const string not_up_to_date = "Immunisations, deworming and Vitamin A not up to date";
            public const string missed_immunisations = "{client} missed an immunisation, deworming and Vitamin A supplement";
            public const string all_up_to_date = "All immunisations, Vitamin A and deworming are up to date";
            public const string all_up_to_date_client = "All of {client}'s immunisations are up to date";
            public const string physical_well = " is doing well physically";
            public const string no_birth_certificate = " does not have a birth certificate";
            public const string has_birth_certificate = "Has applied for a birth certificate";
            public const string has_csg = "Has applied for a child support grant";
            public const string has_csg2 = "You applied for the child support grant - this will support {client}'s healthy growth!";

            // Infant Questions
            public const string q_postnatal_check_up = "Has {client} been to the clinic for a postnatal check-up?";
            public const string q_postnatal_6_weeks = "Did your client attend her 6-week postnatal clinic visit?";
            public const string q_weight = "Weight";
            public const string q_length = "Length";
            public const string q_muac = "What is {client}’s MUAC today?";
            public const string q_eat_drink = "What did {client} eat or drink in the last 24 hours?";
            public const string q_eat_drink_nutrition = "What did you give {client} to eat or drink in the last 24 hours?";
            public const string q_breastfeeding_club = "Would you like to join a breastfeeding club?";
            public const string q_mixed_foods = "Which of these foods have you given {client}?  You can choose more than one.";
            public const string q_check_can_do = "Check what {client} can do:";
            public const string q_hearing = "Gets a fright when they hear a loud sound";
            public const string q_seeing = "Follows faces or close objects with their eyes";
            public const string q_brain = "Smiles at people";
            public const string q_moving = "Holds their head upright when held against shoulder";
            public const string q_immunisation = "Did the baby have the 6 month immunisation?";
            public const string q_vitamin_a = "Is Vitamin A up to date?";
            public const string q_deworming = "Is deworming up to date?";
            public const string q_birth_certificate = "Does {client} have a birth certificate?";
            public const string q_csg_receiving = "Is {client} receiving the CSG?";
            public const string q_csg_applied = "Has {client} applied for a CSG?";

            public const string cfm_name = "Care for mom";
            public const string cfb_name = "Care for baby";
            public const string p4_name = "Pillar 4: Healthcare";
            public const string low_birth_weight = "Low birth weight";

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

            public const string p4_ds_1 = "Not moving or does not wake up";
            public const string p4_ds_2 = "Shaking (convulsions)";
            public const string p4_ds_3 = "Diarrhoea, sunken eyes and a sunken fontanelle";
            public const string p4_ds_4 = "Coughing and breathing fast (more than 50 breaths per minute)";
            public const string p4_ds_5 = "Signs of malnutrition (swollen ankles and feet)";
            public const string p4_ds_6 = "Vomiting everything";
            public const string p4_ds_7 = "Fever and not feeding";
            public const string p4_ds_8 = "Unable to breastfeed";

            public const string p1_1 = "Breast milk";
            public const string p1_2 = "Starch";
            public const string p1_3 = "Nuts, beans, peas, lentils";
            public const string p1_4 = "Dairy";
            public const string p1_5 = "Meat";
            public const string p1_6 = "Eggs";
            public const string p1_7 = "Vitamin A rich fruit & vegetables";
            public const string p1_8 = "Other fruits & vegetables";

            // Answers
            public const string answer_yes = "true";
            public const string answer_no = "false";
            public const string none_above = "None of the above";
            public const string normal_risk = "normal";
            public const string more_than_2 = "More than 2";
            public const string male = "Boy";
            public const string female = "Girl";
            public const string growth_section = "Growth";
            public const string breast_milk_only = "Breast milk only";
            public const string formula_milk_only = "Formula milk only";
            public const string mixed_feeding = "Mixed feeding";

            // Growth names
            public const string weightForAgeBoys = "weight-for-age-boys";
            public const string weightForAgeGirls = "weight-for-age-girls";
            public const string weightForLengthGirls = "weight-for-length-girls";
            public const string weightForLengthBoys = "weight-for-length-boys";
            public const string weightForHeightGirls = "weight-for-height-girls";
            public const string weightForHeightBoys = "weight-for-height-boys";

            public const string lengthHeightForAgeGirls = "length-height-for-age-girls";
            public const string lengthHeightForAgeBoys = "length-height-for-age-boys";

            // Visit names
            public const string careForMom = "Care for mom";
            public const string careForBaby = "Care for baby";

            public const string pillar1_report = "Nutrition";
            public const string pillar1_db = "Pillar 1: Nutrition";

            public const string pillar2_report = "Love, talk and play";
            public const string pillar2_db = "Pillar 2: Love, talk and play";

            public const string pillar3_report = "Protection";
            public const string pillar3_db = "Pillar 3: Protection";
            public const string pillar3_section = "Immunisations, supplements & deworming";

            public const string pillar4_report = "Healthcare";
            public const string pillar4_db = "Pillar 4: Healthcare";

            public const string pillar5_report = "Extra care";
            public const string pillar5_db = "Pillar 5: Extra care";

            public const string antenatalCare = "Antenatal care";
            public const string nutrition = "Nutrition";
            public const string pregnancyCare = "Pregnancy care";
            public const string dangerSigns = "Danger signs";

            public const string doingWell = "You are doing well in these areas:";
            public const string needSupport = "You need support in these areas:";
            public const string needUrgentSupport = "You need urgent support with these areas:";

            public const string idDocSection = "ID document";

            // Infant Dates
            public const string day_3 = "day_3";
            public const string day_7 = "day_7";
            public const string week_2 = "week_2";
            public const string week_4 = "week_4";
            public const string week_7_to_8 = "week_7_to_8";
            public const string months_3 = "3_months";
            public const string months_4 = "4_months";
            public const string months_5 = "5_months";
            public const string months_6 = "6_months";
            public const string months_9 = "9_months";
            public const string months_12 = "12_months";
            public const string months_15 = "15_months";
            public const string months_18 = "18_months";
            public const string months_21 = "21_months";
            public const string months_24 = "24_months";
            public const string years_5 = "5_years";

        }
    }
}

