using DotLiquid.Tags;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.VisitGrowthDatas;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Visits
{
    public class VisitDataStatusManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private VisitManager _visitManager;
        private string _applicationUserId;
        private List<string> _clientVisitDataIds;
        private VisitType _additionalVisitType;

        public VisitDataStatusManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitManager visitManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _visitManager = visitManager;
        }

        public Boolean ManageVisitDataStatus(string id, string type, string visitId)
        {
            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;

            var motherRepo = _repoFactory.CreateGenericRepository<Mother>(userContext: _applicationUserId);
            var infantRepo = _repoFactory.CreateGenericRepository<Infant>(userContext: _applicationUserId);
            var visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: _applicationUserId);
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            var visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);

            List<VisitData> allVisitData = visitDataRepo.GetAll().Where(x => x.VisitId.ToString() == visitId).ToList();

            var maternalDistressScreening = new List<CMSQuestion>();
            var alcoholUse = new List<CMSQuestion>();
            var idDocs = new List<CMSQuestion>();

            // AVAILABLE TYPES -----------
            // ClientDashboardAlert -> G4
            // ClientSummaryDownload -> G9
            // Referral
            // Progress

            if (type == Constants.GGSettings.client_mother)
            {
                Mother mother = motherRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();

                _clientVisitDataIds = (
                    from visit in visitRepo.GetAll().Where(x => x.MotherId.ToString() == id)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    select visitData.Id.ToString()
                ).ToList();

                // add additional visit for when we need to add additional visits for the client
                _additionalVisitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_child) &&
                                                                   x.Name == Constants.GGSettings.additional_visits).
                                                                   OrderBy(x => x.NormalizedName).FirstOrDefault();

                ManageVisitDataStatusForMother(allVisitData, mother.User.FirstName, mother.Id.ToString());
            } else
            {
                Infant infant = infantRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();

                _clientVisitDataIds = (
                    from visit in visitRepo.GetAll().Where(x => x.InfantId.ToString() == id)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    select visitData.Id.ToString()
                ).ToList();

                // add additional visit for when we need to add additional visits for the client
                _additionalVisitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_mother) &&
                                                                   x.Name == Constants.GGSettings.additional_visits).
                                                                   OrderBy(x => x.NormalizedName).FirstOrDefault();

                ManageVisitDataStatusForChild(allVisitData, infant.User.FirstName, infant.Id.ToString(), infant.Gender.Description, infant.User.DateOfBirth);
            }

            return true;
        }

        private Boolean ManageVisitDataStatusForChild(List<VisitData> allVisitData, string firstName, string infantId, string gender, DateTime dob) {

            var comment = "";
            var color = "";
            var type = "";
            DateTime today = DateTime.Today;
            var totalMonths = ((today.Year - dob.Year) * 12) + today.Month - dob.Month;

            // loop through data and add status data
            foreach (VisitData visitData in allVisitData) 
            {
                if (visitData.Question == Constants.GGSettings.q_postnatal_check_up) {
                    if (visitData.QuestionAnswer == Constants.GGSettings.answer_no) {

                        // referral: add ""Missed clinic visit"" to referrals list
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GGSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                        // progress: amber - ""Missed clinic visit""
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // G9 client summary: amber - ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GGSettings.infant_missed_clinic_visit_g9;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                    } else if (visitData.QuestionAnswer == Constants.GGSettings.answer_yes) {

                        // progress: green - ""Up to date with clinic visits""
                        comment = Constants.GGSettings.infant_clinic_visit;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // G9 client summary: green - ""You are up to date with clinic visits"""
                        comment = Constants.GGSettings.infant_clinic_visit_g9;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                    }
                } else if (visitData.Question == Constants.GGSettings.q_postnatal_6_weeks) {
                    if (visitData.QuestionAnswer == Constants.GGSettings.answer_no) {

                        // referral: add ""Missed clinic visit"" to referrals list
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GGSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                        // progress: amber - ""Missed clinic visit""
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // G9 client summary: amber - ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GGSettings.infant_missed_clinic_visit_g9;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                    } else if (visitData.QuestionAnswer == Constants.GGSettings.answer_yes) {

                        // progress: green - ""Up to date with clinic visits""
                        comment = Constants.GGSettings.infant_clinic_visit;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // G9 client summary: green - ""You are up to date with clinic visits"""
                        comment = Constants.GGSettings.infant_clinic_visit_g9;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                    }
                } else if (visitData.VisitName == Constants.GGSettings.cfm_name && visitData.Question == Constants.GGSettings.q_danger_signs) {

                    if (visitData.QuestionAnswer == Constants.GGSettings.none_above) {

                        // Add progress item: ""No danger signs for Lethabo""
                        comment = Constants.GGSettings.no_danger_signs + firstName;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = Constants.GGSettings.physical_feeling_well;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                    } else {
                      var arrAnswers = visitData.QuestionAnswer.Split(",");

                      if (arrAnswers.Length <= 3) {

                        // IF danger signs 6, 7, or 8 selected AND no other danger signs selected, add: 
                        if (arrAnswers.Any(x => x == Constants.GGSettings.cfm_ds_6 ||
                                                x == Constants.GGSettings.cfm_ds_7 ||
                                                x == Constants.GGSettings.cfm_ds_8)) {

                            comment = firstName + Constants.GGSettings.was_experiencing + visitData.QuestionAnswer;
                            color = MetricsColorEnum.None.ToString();
                            type = Constants.GGSettings.visit_data_client_referral;
                            AddVisitDataStatus(visitData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                            // Amber -- IF danger signs 6, 7, or 8 selected AND no other danger signs selected, add: 
                            comment = firstName + Constants.GGSettings.was_experiencing + visitData.QuestionAnswer;
                            color = MetricsColorEnum.Warning.ToString();
                            type = Constants.GGSettings.visit_data_client_progress;
                            AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                            // Add item to G9 Client summary download - IF danger signs 6, 7, or 8 selected AND no other danger signs selected, add: ""You have some health issues""
                            comment = Constants.GGSettings.health_issues;
                            color = MetricsColorEnum.Warning.ToString();
                            type = Constants.GGSettings.visit_data_client_summary;
                            AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        } else if (arrAnswers.Any(x => x == Constants.GGSettings.cfm_ds_1 ||
                                                           x == Constants.GGSettings.cfm_ds_2 ||
                                                           x == Constants.GGSettings.cfm_ds_3 ||
                                                           x == Constants.GGSettings.cfm_ds_4 ||
                                                           x == Constants.GGSettings.cfm_ds_5)) {

                            comment = firstName + Constants.GGSettings.was_experiencing + visitData.QuestionAnswer;
                            color = MetricsColorEnum.None.ToString();
                            type = Constants.GGSettings.visit_data_client_referral;
                            AddVisitDataStatus(visitData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                            //  Red -- IF danger signs 1, 2, 3, 4, or 5 selected, add:
                            comment = firstName + Constants.GGSettings.was_experiencing + visitData.QuestionAnswer;
                            color = MetricsColorEnum.Error.ToString();
                            type = Constants.GGSettings.visit_data_client_progress;
                            AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                            // Add G4 secondary alert text: ""Refer to clinic urgently"" if danger signs 1, 2, 3, 4, or 5 selected
                            comment = Constants.GGSettings.refer_to_clinic_urgently;
                            color = MetricsColorEnum.Warning.ToString();
                            type = Constants.GGSettings.visit_data_client_dashboard;
                            AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                            // Add item to G9 Client summary download - IF danger signs 1, 2, 3, 4, or 5 selected, add: ""You need urgent care for some serious health issues""
                            comment = Constants.GGSettings.urgent_care;
                            color = MetricsColorEnum.Warning.ToString();
                            type = Constants.GGSettings.visit_data_client_summary;
                            AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);
                        }

                        // Add additional visit item with secondary text: ""Danger signs""
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.danger_signs);
                      }
                    }
                } else if (visitData.VisitName == Constants.GGSettings.cfb_name && visitData.Question == Constants.GGSettings.q_danger_signs) {

                    if (visitData.QuestionAnswer == Constants.GGSettings.none_above) {
                        // Add progress item: ""No danger signs for Lethabo""
                        comment = Constants.GGSettings.no_danger_signs + firstName;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = Constants.GGSettings.physical_feeling_well;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);
                    } else {
                        var arrAnswers = visitData.QuestionAnswer.Split(",");

                        // If the user chooses any of the danger signs (ie user does not select ""None of the above"")
                        comment = firstName + Constants.GGSettings.was_experiencing + visitData.QuestionAnswer;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GGSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                        // Add red progress item - where X, Y, Z are each of the danger signs selected by the user.
                        comment = firstName + Constants.GGSettings.was_experiencing + visitData.QuestionAnswer;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // Add additional visit item with secondary text: ""Danger signs""
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.danger_signs);

                        // Add G4 secondary alert text: ""Refer to clinic urgently""
                        comment = Constants.GGSettings.refer_to_clinic_urgently;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // Add item to G9 Client summary download ""You need urgent care for some serious health issues""
                        comment = Constants.GGSettings.urgent_care;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);
                    }
                } else if (visitData.Question == Constants.GGSettings.q_weight) {
                    // TODO
                    if (gender == Constants.GGSettings.male) {

                        var indicator = GetWeightForAgeBoys(totalMonths, double.Parse(visitData.QuestionAnswer));



                    } else {

                    }


                } else if (visitData.Question == Constants.GGSettings.q_length) {
                    // TODO
                }
            }
             
            return true;
        }


        private Boolean ManageVisitDataStatusForMother(List<VisitData> allVisitData, string firstName, string motherId)
        {
            var maternalDistressScreening = new List<VisitData>();
            var alcoholUse = new List<VisitData>();
            var idDocs = new List<VisitData>();
            var comment = "";
            var color = "";
            var type = "";
            
            // loop through data and add status data
            foreach (VisitData visitData in allVisitData)
            {
                if (visitData.Question == Constants.GGSettings.q_first_antenatal_visit)
                {
                    if (visitData.QuestionAnswer == Constants.GGSettings.answer_no)
                    {
                        // this should add a referral to the list(""Pregnancy not booked"")
                        comment = Constants.GGSettings.pregnancy_not_booked;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GGSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                        // add an ""amber"" item to the progress list: ""Pregnancy not booked"".
                        comment = Constants.GGSettings.pregnancy_not_booked;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add flag to G4 secondary alert: red alert, ""Refer to clinic""
                        comment = Constants.GGSettings.refer_to_clinic;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add amber item to G9 client download summary: ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GGSettings.missed_clinic_visit;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                    }
                    else if (visitData.QuestionAnswer == Constants.GGSettings.answer_yes)
                    {
                        // a ""green"" item is added to the client progress list ""Pregnancy booked""
                        comment = Constants.GGSettings.pregnancy_booked;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                        // a green item is added to G9 client download summary ""You are up to date with your clinic visits!""
                        comment = Constants.GGSettings.clinic_visits_up_to_date_2;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);
                    }
                }
                else if (visitData.Question == Constants.GGSettings.q_antenatal_visits)
                {
                    if (visitData.QuestionAnswer == Constants.GGSettings.answer_no)
                    {
                        // add an ""amber"" item to the progress: ""Clinic visits not up to date""
                        comment = Constants.GGSettings.clinic_visits_not_up_to_date;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GGSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                        // add an ""amber"" item to the progress list: Clinic visits not up to date.
                        comment = Constants.GGSettings.clinic_visits_not_up_to_date;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add G4 secondary text red alert ""Refer to clinic""
                        comment = Constants.GGSettings.refer_to_clinic;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add amber item to G9 client download summary: ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GGSettings.missed_clinic_visit;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);
                    }
                    else if (visitData.QuestionAnswer == Constants.GGSettings.answer_yes)
                    {
                        // ""green"" item is added to the progress: "Clinic visits up to date"
                        comment = Constants.GGSettings.clinic_visits_up_to_date;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                        // add green item to G9 client download summary "You are up to date with your clinic visits!"
                        comment = Constants.GGSettings.all_clinic_visit;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                    }
                }
                else if (visitData.Question == Constants.GGSettings.q_measurement)
                {
                    var questionAnswer = Int32.Parse(visitData.QuestionAnswer);

                    if (questionAnswer < 22)
                    {
                        // add to referrals items list(""May be underweight - MUAC less than 22cm"") red
                        comment = Constants.GGSettings.underweight;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GGSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                        // add to red items in progress screen(use case 2) (""May be underweight - MUAC less than 22cm"")
                        comment = Constants.GGSettings.underweight;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add G4 secondary text item: ""Refer to clinic urgently""(this is the highest - priority item & will be shown)
                        comment = Constants.GGSettings.refer_to_clinic_urgently;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add green item to G9 client summary: ""You might be underweight: eat 3 meals every day""
                        comment = Constants.GGSettings.underweight2;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add additional visit item with ""Underweight"" secondary text -please see G3.7 Other / Additional visits
                        AddAdditionalVisit(motherId, Constants.GGSettings.client_mother, Constants.GGSettings.underweight3);
                    }
                    else if (questionAnswer >= 22)
                    {
                        // add to green items in progress screen(use case 2) (""MUAC over 22cm"")TenancyMiddleware.cs
                        comment = Constants.GGSettings.muac_over_22;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                        // add green item to G9 client summary: ""According to your mid-upper arm circumference, you are a healthy weight""
                        comment = Constants.GGSettings.healthy_weight;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);
                    }
                }
                else if (visitData.Question == Constants.GGSettings.q_stop_worry ||
                         visitData.Question == Constants.GGSettings.q_felt_down ||
                         visitData.Question == Constants.GGSettings.q_suicide)
                {
                    maternalDistressScreening.Add(visitData);
                }
                else if (visitData.Question == Constants.GGSettings.q_T ||
                    visitData.Question == Constants.GGSettings.q_A ||
                    visitData.Question == Constants.GGSettings.q_C ||
                    visitData.Question == Constants.GGSettings.q_E)
                {
                    alcoholUse.Add(visitData);
                }
                else if (visitData.Question == Constants.GGSettings.q_ID_doc || visitData.Question == Constants.GGSettings.q_citizen)
                {
                    idDocs.Add(visitData);
                }
                else if (visitData.Question == Constants.GGSettings.q_danger_signs)
                {

                    if (visitData.QuestionAnswer == Constants.GGSettings.none_above)
                    {
                        // Add progress item: ""No danger signs for Lethabo""
                        comment = Constants.GGSettings.no_danger_signs + firstName;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = Constants.GGSettings.physical_feeling_well;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);
                    }
                    else
                    {
                        var arrAnswers = visitData.QuestionAnswer.Split(",");
                        // If the user chooses any of the danger signs (ie user does not select ""None of the above"")
                        comment = firstName + Constants.GGSettings.was_experiencing + visitData.QuestionAnswer;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GGSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                        // Add red progress item - where X, Y, Z are each of the danger signs selected by the user.
                        comment = firstName + Constants.GGSettings.was_experiencing + visitData.QuestionAnswer;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // Add additional visit item with secondary text: ""Danger signs""
                        AddAdditionalVisit(motherId, Constants.GGSettings.client_mother, Constants.GGSettings.danger_signs);

                        // Add G4 secondary alert text: ""Refer to clinic urgently""
                        comment = Constants.GGSettings.refer_to_clinic_urgently;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // Add item to G9 Client summary download ""You need urgent care for some serious health issues""
                        comment = Constants.GGSettings.urgent_care;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);
                    }
                }
            }

            // Manage Maternal Distress Screening
            if (maternalDistressScreening.Count > 0) 
            { 
                ManageMaternalDistressScreening(maternalDistressScreening, firstName, motherId);
            }
            // Manage alcohol use
            if (alcoholUse.Count > 0)
            {
                ManageAlcoholUse(alcoholUse, firstName, motherId);
            }
            // Manage id questions
            if (idDocs.Count > 0)
            {
                ManageIdDocs(idDocs, firstName);
            }

            return true;
        }
        private Boolean ManageMaternalDistressScreening(List<VisitData> maternalDistressScreening, string firstName, string motherId)
        {
            var comment = "";
            var color = "";
            var type = "";
            var section = Constants.GGSettings.clinic_referrals;

            var q1 = new VisitData();
            var q2 = new VisitData();
            var q3 = new VisitData();

            foreach (VisitData obj in maternalDistressScreening)
            {
                if (obj.Question == Constants.GGSettings.q_stop_worry)
                {
                    q1 = obj;
                } else if (obj.Question == Constants.GGSettings.q_felt_down)
                {
                    q2 = obj;
                } else if (obj.Question == Constants.GGSettings.q_suicide)
                {
                    q3 = obj;
                }
            }

            // a Constants.GGSettings.answer_yes response to the 3rd question trumps all.
            if (q3.QuestionAnswer == Constants.GGSettings.answer_yes)
            {
                comment = firstName + Constants.GGSettings.maternal_distress;
                color = MetricsColorEnum.None.ToString();
                type = Constants.GGSettings.visit_data_client_referral;
                AddVisitDataStatus(q3, comment, color, type, section, false);

                // add to amber items in progress screen(use case 2)(""Lethabo was experiencing maternal distress"")
                comment = firstName + Constants.GGSettings.maternal_distress;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GGSettings.visit_data_client_progress;
                AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);

                AddAdditionalVisit(motherId, Constants.GGSettings.client_mother, Constants.GGSettings.maternal_distress2);

                // add G4 secondary text item: Amber - ""Refer to clinic""
                comment = Constants.GGSettings.refer_to_clinic;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GGSettings.visit_data_client_dashboard;
                AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);

                // add amber item to G9 client summary: ""You are struggling and need some support""
                comment = Constants.GGSettings.need_support;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GGSettings.visit_data_client_summary;
                AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);
            } else
            {
                if (q3.QuestionAnswer == Constants.GGSettings.answer_no && (q1.QuestionAnswer == Constants.GGSettings.answer_yes || q2.QuestionAnswer == Constants.GGSettings.answer_yes))
                {
                    comment = firstName + Constants.GGSettings.maternal_distress;
                    color = MetricsColorEnum.None.ToString();
                    type = Constants.GGSettings.visit_data_client_referral;
                    AddVisitDataStatus(q3, comment, color, type, section, false);

                    comment = firstName + Constants.GGSettings.maternal_distress;
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GGSettings.visit_data_client_progress;
                    AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);

                    AddAdditionalVisit(motherId, Constants.GGSettings.client_mother, Constants.GGSettings.maternal_distress2);

                    // add amber item to G9 client summary: ""You are struggling and need some support""
                    comment = Constants.GGSettings.need_support;
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GGSettings.visit_data_client_summary;
                    AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);
                }

                if (q3.QuestionAnswer == Constants.GGSettings.answer_no && (q1.QuestionAnswer == Constants.GGSettings.answer_no || q2.QuestionAnswer == Constants.GGSettings.answer_no))
                {
                    // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                    comment = firstName + Constants.GGSettings.was_coping;
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GGSettings.visit_data_client_progress;
                    AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, true);

                    //add green item to G9 client summary: You are coping well!
                    comment = Constants.GGSettings.coping_well;
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GGSettings.visit_data_client_summary;
                    AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, true);
                }
            }
            return true;
        }
        private Boolean ManageAlcoholUse(List<VisitData> alcoholUse, string firstName, string motherId)
        {

            var comment = "";
            var color = "";
            var type = "";
            var score = 0;
            var section = Constants.GGSettings.clinic_referrals;

            var q1 = new VisitData();
            var q2 = new VisitData();
            var q3 = new VisitData();
            var q4 = new VisitData();

            foreach (VisitData obj in alcoholUse)
            {

                if (obj.Question == Constants.GGSettings.q_T)
                {
                    q1 = obj;
                }
                else if (obj.Question == Constants.GGSettings.q_A)
                {
                    q2 = obj;
                }
                else if (obj.Question == Constants.GGSettings.q_C)
                {
                    q3 = obj;
                }
                else if (obj.Question == Constants.GGSettings.q_E)
                {
                    q4 = obj;
                }
            }

            if (q1.QuestionAnswer == Constants.GGSettings.more_than_2)
            {
                score++;
                score++;
            }
            if (q2.QuestionAnswer == Constants.GGSettings.answer_yes)
            {
                score++;
            }
            if (q3.QuestionAnswer == Constants.GGSettings.answer_yes)
            {
                score++;
            }
            if (q4.QuestionAnswer == Constants.GGSettings.answer_yes)
            {
                score++;
            }

            // If T-ACE score is 2 or more:
            if (score >= 2)
            {
                // IF this is not already unchecked in the referrals list for this client; add to referrals items list (""Lethabo is at risk of a drinking problem (T-ACE score = X)"", where X = the T-ACE score calculated)
                comment = firstName + Constants.GGSettings.t_ace_score + score + ")";
                color = MetricsColorEnum.None.ToString();
                type = Constants.GGSettings.visit_data_client_referral;
                AddVisitDataStatus(q1, comment, color, type, section, false);

                // add to red items in progress screen (use case 2) (""Lethabo is at risk of a drinking problem (T-ACE score = X)"", where X = the T-ACE score calculated)
                comment = firstName + Constants.GGSettings.t_ace_score + score + ")";
                color = MetricsColorEnum.Error.ToString();
                type = Constants.GGSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

                // add G4 secondary text item: Red - ""Refer to clinic urgently""
                comment = Constants.GGSettings.refer_to_clinic_urgently;
                color = MetricsColorEnum.Error.ToString();
                type = Constants.GGSettings.visit_data_client_dashboard;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

                // add amber item to G9 client summary: ""You may need support to reduce your drinking""
                comment = Constants.GGSettings.support_drinking;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GGSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);
            }
            else if (score > 0 && score < 2)
            {
                // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                comment = firstName + Constants.GGSettings.no_alcohol_abuse;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GGSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, true);
               
            }
            return true;
        }
        private Boolean ManageIdDocs(List<VisitData> idDocs, string firstName)
        {
            var comment = "";
            var color = "";
            var type = "";

            var q1 = new VisitData();
            var q2 = new VisitData();

            foreach (VisitData obj in idDocs)
            {
                if (obj.Question == Constants.GGSettings.q_ID_doc)
                {
                    q1 = obj;
                }
                else if (obj.Question == Constants.GGSettings.q_citizen)
                {
                    q2 = obj;
                }
            }

            if (q1.QuestionAnswer == Constants.GGSettings.answer_no && q2.QuestionAnswer == Constants.GGSettings.answer_yes)
            {
                // IF this is not already unchecked in the referrals list for this client; add to referrals items list under Department of Home Affairs referrals(""Lethabo doesn't have an ID book)
                comment = firstName + Constants.GGSettings.no_id_book;
                color = MetricsColorEnum.None.ToString();
                type = Constants.GGSettings.visit_data_client_referral;
                AddVisitDataStatus(q1, comment, color, type, Constants.GGSettings.home_affairs_referrals, false);

                // add to amber items in progress screen(""Lethabo doesn't have an ID book"")
                comment = firstName + Constants.GGSettings.no_id_book;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GGSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

                // add amber item to G9 client summary: ""Go to Home Affairs to apply for your ID book.This will allow you to apply for the child social grant as soon as the baby is born.""
                comment = Constants.GGSettings.go_to_home_affairs;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GGSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);
            }

            if (q1.QuestionAnswer == Constants.GGSettings.answer_yes)
            {
                // add to green items in progress screen(use case 2)(""Lethabo has an ID book"")
                comment = firstName + Constants.GGSettings.id_book;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GGSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, true);

                // add green item to G9 client summary: ""You have your ID document & can apply for a child social grant once the baby is born!""
                comment = Constants.GGSettings.apply_social_grant;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GGSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, true);
            }
            return true;
        }
        private Boolean AddAdditionalVisit(string userId, string userType, string comment) {

            VisitModel newVisit = new VisitModel();
            newVisit.Attended = false;
            newVisit.VisitType = _additionalVisitType;
            newVisit.MotherId = (Constants.GGSettings.client_mother == userType ? new Guid(userId) : null);
            newVisit.InfantId = (Constants.GGSettings.client_child == userType ? new Guid(userId) : null);
            newVisit.Risk = Constants.GGSettings.normal_risk;
            newVisit.Comment = comment;
            _visitManager.AddVisit(newVisit);

            return true;
        }
        private Boolean AddVisitDataStatus(VisitData input, string comment, string color, string type, string section, Boolean isCompleted)
        {
            var visitDataStatus = GetVisitDataStatusFromInputModel(input);
            visitDataStatus.Id = Guid.NewGuid();
            visitDataStatus.Comment = comment;
            visitDataStatus.Color = color;
            visitDataStatus.Type = type;
            visitDataStatus.Section = section;
            visitDataStatus.IsCompleted = isCompleted;
            InsertVisitDataStatus(visitDataStatus);
            return true;
        }
        private Boolean InsertVisitDataStatus(VisitDataStatus input)
        {
            // Ensure we don't add duplicate records for a client
            if (!ValidateVisitDataStatusRecord(input))
            {
                var repository = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);
                repository.Insert(input);
            }
            return true;
        }
        private Boolean ValidateVisitDataStatusRecord(VisitDataStatus input)
        {
            var repository = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);
            var visitStatusRecord = repository.GetAll().Where(x => x.IsCompleted == false && x.Comment == input.Comment && _clientVisitDataIds.Contains(x.VisitDataId.ToString())).FirstOrDefault();

            if (visitStatusRecord != null)
            {
                return true;
            }
            return false;
        }
        private VisitDataStatus GetVisitDataStatusFromInputModel(VisitData input)
        {
            if (input == null)
            {
                return null;
            }

            return new VisitDataStatus()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId,
                VisitDataId = input.Id,
                Comment = "",
                Color = "",
                Type = "",
                Section = ""
            };
        }

        private string GetWeightForAgeBoys(int month, double weight) {
            var repository = _repoFactory.CreateGenericRepository<VisitGrowthData>(userContext: _applicationUserId);
            var name = repository.GetAll().Where(x => x.Section == "weightForAgeBoys" && x.Month == month && x.Weight == weight).Select(y => y.Name).Distinct().FirstOrDefault();
            var indicator = "Normal";

            // less than -3SD (severely stunted - red)
            // greater than -3SD and less than -2SD (stunted - amber)
            // greater than -2SD (normal - green)


            /*-1 SD
            - 2 SD
            - 3 SD

            median
            1 SD
            2 SD
            3 SD
            */


           

            return indicator;
        }
    }
}

