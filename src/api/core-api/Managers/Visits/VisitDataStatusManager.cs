using DotLiquid.Tags;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.VisitGrowthDatas;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Visits {
    public class VisitDataStatusManager {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private VisitManager _visitManager;

        private VisitType _additionalVisitType;
        private string _applicationUserId;
        private List<string> _clientVisitDataIds;

        private IGenericRepository<Mother, Guid> _motherRepo;
        private IGenericRepository<Infant, Guid> _infantRepo;
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitData, Guid> _visitDataRepo;
        private IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;
        private IGenericRepository<VisitType, Guid> _visitTypeRepo;
        private IGenericRepository<VisitGrowthData, Guid> _visitGrowthData;

        public VisitDataStatusManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitManager visitManager) {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _visitManager = visitManager;

            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;

            _motherRepo = _repoFactory.CreateGenericRepository<Mother>(userContext: _applicationUserId);
            _infantRepo = _repoFactory.CreateGenericRepository<Infant>(userContext: _applicationUserId);
            _visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            _visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            _visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);
            _visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: _applicationUserId);
            _visitGrowthData = _repoFactory.CreateGenericRepository<VisitGrowthData>(userContext: _applicationUserId);
        }

        public Boolean ManageVisitDataStatus(string id, string clientType, string visitId) {
            List<VisitData> allVisitData = _visitDataRepo.GetAll().Where(x => x.VisitId.ToString() == visitId).ToList();

            var maternalDistressScreening = new List<CMSQuestion>();
            var alcoholUse = new List<CMSQuestion>();
            var idDocs = new List<CMSQuestion>();

            // AVAILABLE TYPES -----------
            // ClientDashboardAlert -> G4
            // ClientSummaryDownload -> G9
            // Referral
            // Progress

            if (clientType == Constants.GGSettings.client_mother) {
                Mother mother = _motherRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();

                _clientVisitDataIds = (
                    from visit in _visitRepo.GetAll().Where(x => x.MotherId.ToString() == id)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    select visitData.Id.ToString()
                ).ToList();

                // add additional visit for when we need to add additional visits for the client
                _additionalVisitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_mother) &&
                                                                   x.Name == Constants.GGSettings.additional_visits).
                                                                   OrderBy(x => x.NormalizedName).FirstOrDefault();

                ManageVisitDataStatusForMother(allVisitData, mother.User.FirstName, mother.Id.ToString());
            } else {
                Infant infant = _infantRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();

                _clientVisitDataIds = (
                    from visit in _visitRepo.GetAll().Where(x => x.InfantId.ToString() == id)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    select visitData.Id.ToString()
                ).ToList();

                // add additional visit for when we need to add additional visits for the client
                _additionalVisitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_child) &&
                                                                   x.Name == Constants.GGSettings.additional_visits).
                                                                   OrderBy(x => x.NormalizedName).FirstOrDefault();

                ManageVisitDataStatusForInfant(allVisitData, infant.User.FirstName, infant.Id.ToString(), infant.Gender.Description, infant.User.DateOfBirth);
            }

            return true;
        }

        private Boolean ManageVisitDataStatusForInfant(List<VisitData> allVisitData, string firstName, string infantId, string gender, DateTime dob) {

            var comment = "";
            var color = "";
            var type = "";
            var maternalDistressScreening = new List<VisitData>();
            var growthData = new List<VisitData>();
            var feedingData = new List<VisitData>();
            var previousVisitWeight = "";
            DateTime today = DateTime.Today;
            var totalMonthsOld = ((today.Year - dob.Year) * 12) + today.Month - dob.Month;
            var totalDaysOld = (today - dob).TotalDays;

            // loop through data and add status data
            foreach (VisitData vData in allVisitData) {
                if (vData.Question == Constants.GGSettings.q_postnatal_check_up) {
                    if (vData.QuestionAnswer == Constants.GGSettings.answer_no) {

                        // referral: add ""Missed clinic visit"" to referrals list
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GGSettings.visit_data_client_referral;
                        AddVisitDataStatus(vData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                        // progress: amber - ""Missed clinic visit""
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                        // G9 client summary: amber - ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GGSettings.infant_missed_clinic_visit_g9;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                    }
                    else if (vData.QuestionAnswer == Constants.GGSettings.answer_yes) {

                        // progress: green - ""Up to date with clinic visits""
                        comment = Constants.GGSettings.infant_clinic_visit;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                        // G9 client summary: green - ""You are up to date with clinic visits"""
                        comment = Constants.GGSettings.infant_clinic_visit_g9;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                    }
                }
                else if (vData.Question == Constants.GGSettings.q_postnatal_6_weeks) {
                    if (vData.QuestionAnswer == Constants.GGSettings.answer_no) {

                        // referral: add ""Missed clinic visit"" to referrals list
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GGSettings.visit_data_client_referral;
                        AddVisitDataStatus(vData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                        // progress: amber - ""Missed clinic visit""
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                        // G9 client summary: amber - ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GGSettings.infant_missed_clinic_visit_g9;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                    }
                    else if (vData.QuestionAnswer == Constants.GGSettings.answer_yes) {

                        // progress: green - ""Up to date with clinic visits""
                        comment = Constants.GGSettings.infant_clinic_visit;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                        // G9 client summary: green - ""You are up to date with clinic visits"""
                        comment = Constants.GGSettings.infant_clinic_visit_g9;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                    }
                }
                else if (vData.VisitName == Constants.GGSettings.cfm_name && vData.Question == Constants.GGSettings.q_danger_signs) {

                    if (vData.QuestionAnswer == Constants.GGSettings.none_above) {

                        // Add progress item: ""No danger signs for Lethabo""
                        comment = Constants.GGSettings.no_danger_signs + firstName;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = Constants.GGSettings.physical_feeling_well;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, true);

                    }
                    else {
                        var arrAnswers = vData.QuestionAnswer.Split(",");

                        if (arrAnswers.Length <= 3) {

                            // IF danger signs 6, 7, or 8 selected AND no other danger signs selected, add: 
                            if (arrAnswers.Any(x => x == Constants.GGSettings.cfm_ds_6 ||
                                                    x == Constants.GGSettings.cfm_ds_7 ||
                                                    x == Constants.GGSettings.cfm_ds_8)) {

                                comment = firstName + Constants.GGSettings.was_experiencing + vData.QuestionAnswer;
                                color = MetricsColorEnum.None.ToString();
                                type = Constants.GGSettings.visit_data_client_referral;
                                AddVisitDataStatus(vData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                                // Amber -- IF danger signs 6, 7, or 8 selected AND no other danger signs selected, add: 
                                comment = firstName + Constants.GGSettings.was_experiencing + vData.QuestionAnswer;
                                color = MetricsColorEnum.Warning.ToString();
                                type = Constants.GGSettings.visit_data_client_progress;
                                AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                                // Add item to G9 Client summary download - IF danger signs 6, 7, or 8 selected AND no other danger signs selected, add: ""You have some health issues""
                                comment = Constants.GGSettings.health_issues;
                                color = MetricsColorEnum.Warning.ToString();
                                type = Constants.GGSettings.visit_data_client_summary;
                                AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                            }
                            else if (arrAnswers.Any(x => x == Constants.GGSettings.cfm_ds_1 ||
                                                               x == Constants.GGSettings.cfm_ds_2 ||
                                                               x == Constants.GGSettings.cfm_ds_3 ||
                                                               x == Constants.GGSettings.cfm_ds_4 ||
                                                               x == Constants.GGSettings.cfm_ds_5)) {

                                comment = firstName + Constants.GGSettings.was_experiencing + vData.QuestionAnswer;
                                color = MetricsColorEnum.None.ToString();
                                type = Constants.GGSettings.visit_data_client_referral;
                                AddVisitDataStatus(vData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                                //  Red -- IF danger signs 1, 2, 3, 4, or 5 selected, add:
                                comment = firstName + Constants.GGSettings.was_experiencing + vData.QuestionAnswer;
                                color = MetricsColorEnum.Error.ToString();
                                type = Constants.GGSettings.visit_data_client_progress;
                                AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                                // Add G4 secondary alert text: ""Refer to clinic urgently"" if danger signs 1, 2, 3, 4, or 5 selected
                                comment = Constants.GGSettings.refer_to_clinic_urgently;
                                color = MetricsColorEnum.Warning.ToString();
                                type = Constants.GGSettings.visit_data_client_dashboard;
                                AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                                // Add item to G9 Client summary download - IF danger signs 1, 2, 3, 4, or 5 selected, add: ""You need urgent care for some serious health issues""
                                comment = Constants.GGSettings.urgent_care;
                                color = MetricsColorEnum.Warning.ToString();
                                type = Constants.GGSettings.visit_data_client_summary;
                                AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);
                            }

                            // Add additional visit item with secondary text: ""Danger signs""
                            AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.danger_signs);
                        }
                    }
                }
                else if (vData.VisitName == Constants.GGSettings.cfb_name && vData.Question == Constants.GGSettings.q_danger_signs) {

                    if (vData.QuestionAnswer == Constants.GGSettings.none_above) {
                        // Add progress item: ""No danger signs for Lethabo""
                        comment = Constants.GGSettings.no_danger_signs + firstName;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = Constants.GGSettings.physical_feeling_well;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, true);
                    } else {
                        var arrAnswers = vData.QuestionAnswer.Split(",");

                        // If the user chooses any of the danger signs (ie user does not select ""None of the above"")
                        comment = firstName + Constants.GGSettings.was_experiencing + vData.QuestionAnswer;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GGSettings.visit_data_client_referral;
                        AddVisitDataStatus(vData, comment, color, type, Constants.GGSettings.clinic_referrals, false);

                        // Add red progress item - where X, Y, Z are each of the danger signs selected by the user.
                        comment = firstName + Constants.GGSettings.was_experiencing + vData.QuestionAnswer;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                        // Add additional visit item with secondary text: ""Danger signs""
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.danger_signs);

                        // Add G4 secondary alert text: ""Refer to clinic urgently""
                        comment = Constants.GGSettings.refer_to_clinic_urgently;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                        // Add item to G9 Client summary download ""You need urgent care for some serious health issues""
                        comment = Constants.GGSettings.urgent_care;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);
                    }
                } else if (vData.Question == Constants.GGSettings.q_stop_worry ||
                         vData.Question == Constants.GGSettings.q_felt_down ||
                         vData.Question == Constants.GGSettings.q_suicide) {
                    maternalDistressScreening.Add(vData);
                } else if (vData.Question == Constants.GGSettings.q_weight) {

                    previousVisitWeight = (
                         from visit in _visitRepo.GetAll().Where(x => x.InfantId.ToString() == infantId && x.Attended == true).OrderBy(x => x.InsertedDate)
                         join visitData in _visitDataRepo.GetAll().Where(y => y.Question == Constants.GGSettings.q_weight) on visit.Id equals visitData.VisitId
                         select visitData.QuestionAnswer
                     ).LastOrDefault();

                    growthData.Add(vData);
                } else if (vData.Question == Constants.GGSettings.q_length) {
                    growthData.Add(vData);
                } else if (vData.Question == Constants.GGSettings.q_muac) {
                    growthData.Add(vData);
                } else if (vData.Question == Constants.GGSettings.q_eat_drink) {
                    feedingData.Add(vData);                    
                } else if (vData.Question == Constants.GGSettings.q_breastfeeding_club) {
                   
                    if (vData.QuestionAnswer == Constants.GGSettings.answer_yes) {
                        // Progress: under the green - ""Breast milk only"" item, add amber text ""Needs support with breastfeeding"" (see in context of progress screen in G3.8)"
                        comment = Constants.GGSettings.breast_milk_only;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);
                    }

                } else if (vData.Question == Constants.GGSettings.q_tick_foods) {

                    var answers = vData.QuestionAnswer.Split(",");
                    if (answers.Length < 4) {
                        // Progress: red - ""Poor dietary diversity: X out of 8 food groups"", where X = the number of items selected(1, 2, or 3)
                        comment = Constants.GGSettings.poor_dietary_diversity + answers.Length + Constants.GGSettings.out_of_8_groups;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                        // G9 Client summary download: red - ""You are giving Themba foods from X out of 8 groups. Try to give Themba a variety of foods!"",  where X = the number of items selected (1, 2, or 3)
                        var _comment = Constants.GGSettings.give_client_food.Replace("{client}", firstName);
                        comment = _comment.Replace("{x}", answers.Length.ToString());
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                    }
                    else if (answers.Length == 4) {

                        // Progress: ""Poor dietary diversity: 4 out of 8 food groups""
                        comment = Constants.GGSettings.poor_dietary_diversity + answers.Length + Constants.GGSettings.out_of_8_groups;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                        // G9 Client summary: ""You are giving Themba foods from 4 out of 8 groups. Try to give Themba a variety of foods!""
                        var _comment = Constants.GGSettings.give_client_food_most.Replace("{client}", firstName);
                        comment = _comment.Replace("{x}", answers.Length.ToString());
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);
                    }
                    else if (answers.Length >= 5 && answers.Length <= 7) {
                        // Progress: ""Good dietary diversity: X out of 8 food groups!"", where X = the number of items selected (5, 6, 7, 8)
                        comment = Constants.GGSettings.good_dietary_diversity.Replace("{x}", answers.Length.ToString());
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                        // G9 Client summary: ""You are giving Themba foods from most of the groups!""
                        comment = Constants.GGSettings.give_client_food_most.Replace("{client}", firstName);
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);
                    } else if (answers.Length == 8) {
                        // Progress: ""Good dietary diversity: X out of 8 food groups!"", where X = the number of items selected (5, 6, 7, 8)
                        comment = Constants.GGSettings.good_dietary_diversity.Replace("{x}", answers.Length.ToString());
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);

                        // G9 Client summary: ""You are giving Themba foods from all groups!""
                        comment = Constants.GGSettings.give_client_food_most.Replace("{client}", firstName);
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GGSettings.visit_data_client_summary;
                        AddVisitDataStatus(vData, comment, color, type, vData.VisitSection, false);
                    }
                }
            }

            // Manage Maternal Distress Screening
            if (maternalDistressScreening.Count > 0) {
                ManageMaternalDistressScreening(maternalDistressScreening, firstName, infantId, Constants.GGSettings.client_child);
            }

            if (growthData.Count > 0) {
                ManageGrowthData(growthData, firstName, infantId, gender, totalMonthsOld, totalDaysOld, previousVisitWeight);
            }

            if (feedingData.Count > 0) {
                ManageFeedingData(feedingData, firstName, infantId);
            }

            return true;
        }
        private Boolean ManageVisitDataStatusForMother(List<VisitData> allVisitData, string firstName, string motherId) {
            var maternalDistressScreening = new List<VisitData>();
            var alcoholUse = new List<VisitData>();
            var idDocs = new List<VisitData>();
            var comment = "";
            var color = "";
            var type = "";

            // loop through data and add status data
            foreach (VisitData visitData in allVisitData) {
                if (visitData.Question == Constants.GGSettings.q_first_antenatal_visit) {
                    if (visitData.QuestionAnswer == Constants.GGSettings.answer_no) {
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
                    else if (visitData.QuestionAnswer == Constants.GGSettings.answer_yes) {
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
                else if (visitData.Question == Constants.GGSettings.q_antenatal_visits) {
                    if (visitData.QuestionAnswer == Constants.GGSettings.answer_no) {
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
                    else if (visitData.QuestionAnswer == Constants.GGSettings.answer_yes) {
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
                else if (visitData.Question == Constants.GGSettings.q_measurement) {
                    var questionAnswer = Int32.Parse(visitData.QuestionAnswer);

                    if (questionAnswer < 22) {
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
                    else if (questionAnswer >= 22) {
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
                         visitData.Question == Constants.GGSettings.q_suicide) {
                    maternalDistressScreening.Add(visitData);
                }
                else if (visitData.Question == Constants.GGSettings.q_T ||
                    visitData.Question == Constants.GGSettings.q_A ||
                    visitData.Question == Constants.GGSettings.q_C ||
                    visitData.Question == Constants.GGSettings.q_E) {
                    alcoholUse.Add(visitData);
                }
                else if (visitData.Question == Constants.GGSettings.q_ID_doc || visitData.Question == Constants.GGSettings.q_citizen) {
                    idDocs.Add(visitData);
                }
                else if (visitData.Question == Constants.GGSettings.q_danger_signs) {

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
                    }
                    else {
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
            if (maternalDistressScreening.Count > 0) {
                ManageMaternalDistressScreening(maternalDistressScreening, firstName, motherId, Constants.GGSettings.client_mother);
            }
            // Manage alcohol use
            if (alcoholUse.Count > 0) {
                ManageAlcoholUse(alcoholUse, firstName, motherId);
            }
            // Manage id questions
            if (idDocs.Count > 0) {
                ManageIdDocs(idDocs, firstName);
            }

            return true;
        }
        private Boolean ManageMaternalDistressScreening(List<VisitData> maternalDistressScreening, string firstName, string clientId, string clientType) {
            var comment = "";
            var color = "";
            var type = "";
            var section = Constants.GGSettings.clinic_referrals;

            var q1 = maternalDistressScreening.Where(x => x.Question == Constants.GGSettings.q_stop_worry).FirstOrDefault();
            var q2 = maternalDistressScreening.Where(x => x.Question == Constants.GGSettings.q_felt_down).FirstOrDefault();
            var q3 = maternalDistressScreening.Where(x => x.Question == Constants.GGSettings.q_suicide).FirstOrDefault();

            // a Constants.GGSettings.answer_yes response to the 3rd question trumps all.
            if (q3.QuestionAnswer == Constants.GGSettings.answer_yes) {
                comment = firstName + Constants.GGSettings.maternal_distress;
                color = MetricsColorEnum.None.ToString();
                type = Constants.GGSettings.visit_data_client_referral;
                AddVisitDataStatus(q3, comment, color, type, section, false);

                // add to amber items in progress screen(use case 2)(""Lethabo was experiencing maternal distress"")
                comment = firstName + Constants.GGSettings.maternal_distress;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GGSettings.visit_data_client_progress;
                AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);

                AddAdditionalVisit(clientId, clientType, Constants.GGSettings.maternal_distress2);

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
            } else {
                if (q3.QuestionAnswer == Constants.GGSettings.answer_no && (q1.QuestionAnswer == Constants.GGSettings.answer_yes || q2.QuestionAnswer == Constants.GGSettings.answer_yes)) {
                    comment = firstName + Constants.GGSettings.maternal_distress;
                    color = MetricsColorEnum.None.ToString();
                    type = Constants.GGSettings.visit_data_client_referral;
                    AddVisitDataStatus(q3, comment, color, type, section, false);

                    comment = firstName + Constants.GGSettings.maternal_distress;
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GGSettings.visit_data_client_progress;
                    AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);

                    AddAdditionalVisit(clientId, clientType, Constants.GGSettings.maternal_distress2);

                    // add amber item to G9 client summary: ""You are struggling and need some support""
                    comment = Constants.GGSettings.need_support;
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GGSettings.visit_data_client_summary;
                    AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);
                }

                if (q3.QuestionAnswer == Constants.GGSettings.answer_no && (q1.QuestionAnswer == Constants.GGSettings.answer_no || q2.QuestionAnswer == Constants.GGSettings.answer_no)) {
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
        private Boolean ManageAlcoholUse(List<VisitData> alcoholUse, string firstName, string motherId) {
            var comment = "";
            var color = "";
            var type = "";
            var score = 0;
            var section = Constants.GGSettings.clinic_referrals;

            var q1 = alcoholUse.Where(x => x.Question == Constants.GGSettings.q_T).FirstOrDefault();
            var q2 = alcoholUse.Where(x => x.Question == Constants.GGSettings.q_A).FirstOrDefault();
            var q3 = alcoholUse.Where(x => x.Question == Constants.GGSettings.q_C).FirstOrDefault();
            var q4 = alcoholUse.Where(x => x.Question == Constants.GGSettings.q_E).FirstOrDefault();

            if (q1.QuestionAnswer == Constants.GGSettings.more_than_2) {
                score++;
                score++;
            }
            if (q2.QuestionAnswer == Constants.GGSettings.answer_yes) {
                score++;
            }
            if (q3.QuestionAnswer == Constants.GGSettings.answer_yes) {
                score++;
            }
            if (q4.QuestionAnswer == Constants.GGSettings.answer_yes) {
                score++;
            }

            // If T-ACE score is 2 or more:
            if (score >= 2) {
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
            else if (score > 0 && score < 2) {
                // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                comment = firstName + Constants.GGSettings.no_alcohol_abuse;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GGSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, true);

            }
            return true;
        }
        private Boolean ManageIdDocs(List<VisitData> idDocs, string firstName) {
            var comment = "";
            var color = "";
            var type = "";

            var q1 = idDocs.Where(x => x.Question == Constants.GGSettings.q_ID_doc).FirstOrDefault();
            var q2 = idDocs.Where(x => x.Question == Constants.GGSettings.q_citizen).FirstOrDefault();

            if (q1.QuestionAnswer == Constants.GGSettings.answer_no && q2.QuestionAnswer == Constants.GGSettings.answer_yes) {
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

            if (q1.QuestionAnswer == Constants.GGSettings.answer_yes) {
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
        private Boolean ManageGrowthData(List<VisitData> growthData, string firstName, string infantId, string gender, int totalMonthsOld, double totalDaysOld, string previousVisitWeight) {
            var comment = "";
            var type = "";

            var wIndicator = "Normal";
            var lIndicator = "Normal";
            var mIndicator = "Normal";

            var wColor = "";
            var lColor = "";
            var mColor = "";

            var q1 = growthData.Where(x => x.Question == Constants.GGSettings.q_weight).FirstOrDefault();
            var q2 = growthData.Where(x => x.Question == Constants.GGSettings.q_length).FirstOrDefault();
            var q3 = growthData.Where(x => x.Question == Constants.GGSettings.q_muac).FirstOrDefault();

            if (q1.Question == Constants.GGSettings.q_weight) {

                string ageSection = (gender == Constants.GGSettings.male ? Constants.GGSettings.weightForAgeBoys : Constants.GGSettings.weightForAgeGirls);
                string heightSection = (gender == Constants.GGSettings.male ? Constants.GGSettings.weightForHeightBoys : Constants.GGSettings.weightForHeightGirls);
                wIndicator = GetHeightWeightIndicator(totalMonthsOld, totalDaysOld, double.Parse(q1.QuestionAnswer), double.Parse(q2.QuestionAnswer), ageSection, heightSection);
                Boolean weightIncreased = Double.Parse(q1.QuestionAnswer) > Double.Parse(previousVisitWeight);

                if (totalDaysOld < 7 && Double.Parse(previousVisitWeight) == 0 && Double.Parse(q1.QuestionAnswer) < 2.5) {
                    wIndicator = "Low birth weight";
                    wColor = MetricsColorEnum.Warning.ToString();
                } else if (totalDaysOld < 7 && Double.Parse(previousVisitWeight) == 0 && Double.Parse(q1.QuestionAnswer) >= 2.5) {
                    wIndicator = "Normal";
                    wColor = MetricsColorEnum.Success.ToString();
                } else {
                    if (wIndicator == "Severely stunted") {
                        wColor = MetricsColorEnum.Error.ToString();

                        // Red progress
                        comment = Constants.GGSettings.severely_underweight + " " + q1.QuestionAnswer;
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(q1, comment, wColor, type, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.severely_underweight);

                        // Red G4
                        comment = Constants.GGSettings.refer_to_clinic_urgently;
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(q1, comment, wColor, type, Constants.GGSettings.refer_to_clinic_urgently, false);
                    }
                    else if (wIndicator == "Underweight") {
                        wColor = MetricsColorEnum.Warning.ToString();

                        // Amber progress
                        comment = wIndicator + " " + q1.QuestionAnswer;
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(q1, comment, wColor, type, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, wIndicator);

                        // Amber G4
                        comment = Constants.GGSettings.refer_to_clinic;
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(q1, comment, wColor, type, Constants.GGSettings.refer_to_clinic, false);
                    }
                    else if (wIndicator == "Growth faltering" && !weightIncreased) {
                        wColor = MetricsColorEnum.Warning.ToString();

                        // Amber progress
                        comment = Constants.GGSettings.growth_faltering + " " + q1.QuestionAnswer;
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(q1, comment, wColor, type, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.severely_stunted);

                        // Amber G4
                        comment = Constants.GGSettings.refer_to_clinic;
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(q1, comment, wColor, type, Constants.GGSettings.refer_to_clinic, false);
                    }
                    else if (wIndicator == "Obese") {
                        wColor = MetricsColorEnum.Warning.ToString();

                        // Amber progress
                        comment = wIndicator + " " + q1.QuestionAnswer;
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(q1, comment, wColor, type, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, wIndicator);

                        // Amber G4
                        comment = Constants.GGSettings.refer_to_clinic;
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(q1, comment, wColor, type, Constants.GGSettings.refer_to_clinic, false);
                    }
                    else if (wIndicator == "Overweight") {
                        wColor = MetricsColorEnum.Warning.ToString();

                        // Amber progress
                        comment = wIndicator + " " + q1.QuestionAnswer;
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(q1, comment, wColor, type, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, wIndicator);

                        // Amber G4
                        comment = Constants.GGSettings.refer_to_clinic;
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(q1, comment, wColor, type, Constants.GGSettings.refer_to_clinic, false);
                    }
                    else if (wIndicator == "Normal" && weightIncreased) {
                        wColor = MetricsColorEnum.Success.ToString();

                        // Green progress
                        comment = wIndicator + " " + q1.QuestionAnswer;
                        type = Constants.GGSettings.visit_data_client_progress;
                        AddVisitDataStatus(q1, comment, wColor, type, q1.VisitSection, false);

                        // Green G4 
                        comment = Constants.GGSettings.growing_well;
                        type = Constants.GGSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(q1, comment, wColor, type, q1.VisitSection, false);
                    }
                }
            }

            if (q2.Question == Constants.GGSettings.q_length) {
                string ageSection = (gender == Constants.GGSettings.male ? Constants.GGSettings.weightForAgeBoys : Constants.GGSettings.weightForAgeGirls);
                lIndicator = GetHeightWeightIndicator(totalMonthsOld, totalDaysOld, double.Parse(q2.QuestionAnswer), double.Parse(q1.QuestionAnswer), ageSection, "");

                if (lIndicator == "Severely stunted") {
                    lColor = MetricsColorEnum.Error.ToString();
                    
                    // Red progress
                    comment = lIndicator + " " + q2.QuestionAnswer;
                    type = Constants.GGSettings.visit_data_client_progress;
                    AddVisitDataStatus(q2, comment, lColor, type, q2.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, Constants.GGSettings.client_child, lIndicator);

                    // Red G4
                    comment = Constants.GGSettings.refer_to_clinic_urgently;
                    type = Constants.GGSettings.visit_data_client_dashboard;
                    AddVisitDataStatus(q2, comment, lColor, type, Constants.GGSettings.refer_to_clinic_urgently, false);

                }
                else if (lIndicator == "Stunted") {
                    lColor = MetricsColorEnum.Warning.ToString();

                    // Amber progress
                    comment = lIndicator;
                    type = Constants.GGSettings.visit_data_client_progress;
                    AddVisitDataStatus(q2, comment, lColor, type, q2.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, Constants.GGSettings.client_child, lIndicator);

                    // Amber G4
                    comment = Constants.GGSettings.refer_to_clinic;
                    type = Constants.GGSettings.visit_data_client_dashboard;
                    AddVisitDataStatus(q2, comment, lColor, type, Constants.GGSettings.refer_to_clinic, false);

                } else if (lIndicator == "Normal") {
                    lColor = MetricsColorEnum.Success.ToString();

                    // Green progress
                    comment = lIndicator;
                    type = Constants.GGSettings.visit_data_client_progress;
                    AddVisitDataStatus(q2, comment, lColor, type, q2.VisitSection, false);
                }
            }

            if (q3.Question == Constants.GGSettings.q_measurement) {
                var questionAnswer = Int32.Parse(q3.QuestionAnswer);
                mIndicator = "Normal";
                if (questionAnswer < 11.5) {
                    mIndicator = "Severe acute malnutrition";
                    mColor = MetricsColorEnum.Error.ToString();

                    // Red progress
                    comment = mIndicator + " " + q3.QuestionAnswer;
                    type = Constants.GGSettings.visit_data_client_progress;
                    AddVisitDataStatus(q3, comment, mColor, type, q3.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.moderate_acute_malnutrition);

                    // Red G4
                    comment = Constants.GGSettings.refer_to_clinic_urgently;
                    type = Constants.GGSettings.visit_data_client_dashboard;
                    AddVisitDataStatus(q3, comment, mColor, type, Constants.GGSettings.refer_to_clinic_urgently, false);


                } else if (questionAnswer >= 11.5 && questionAnswer < 12.5) {
                    mIndicator = "Moderate acute malnutrition";
                    mColor = MetricsColorEnum.Warning.ToString();

                    // Red progress
                    comment = Constants.GGSettings.severely_stunted + " " + q3.QuestionAnswer;
                    type = Constants.GGSettings.visit_data_client_progress;
                    AddVisitDataStatus(q3, comment, mColor, type, q3.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.moderate_acute_malnutrition);

                    // Red G4
                    comment = Constants.GGSettings.refer_to_clinic_urgently;
                    type = Constants.GGSettings.visit_data_client_dashboard;
                    AddVisitDataStatus(q3, comment, mColor, type, Constants.GGSettings.refer_to_clinic_urgently, false);

                } else if (questionAnswer >= 12.5) {
                    mIndicator = "Normal";
                    mColor = MetricsColorEnum.Success.ToString();

                    // Green progress
                    comment = mIndicator + " " + q3.QuestionAnswer;
                    type = Constants.GGSettings.visit_data_client_progress;
                    AddVisitDataStatus(q3, comment, mColor, type, q3.VisitSection, false);

                    // Green G4 
                    comment = Constants.GGSettings.growing_well;
                    type = Constants.GGSettings.visit_data_client_dashboard;
                    AddVisitDataStatus(q3, comment, mColor, type, q3.VisitSection, false);
                }
            }

            // REFERRALS && G9 FOR ALL
            if (wIndicator != "Normal" || lIndicator != "Normal" || mIndicator != "Normal") {
                // Referrals
                comment = firstName + Constants.GGSettings.growth_referral + "<ul><li>" + wIndicator + "</li><li>" + lIndicator + "</li><li>" + mIndicator + "</li></ul>";
                type = Constants.GGSettings.visit_data_client_referral;
                AddVisitDataStatus(q1, comment, MetricsColorEnum.None.ToString(), type, q1.VisitSection, false);
            }

            if (wColor == MetricsColorEnum.Success.ToString() && lColor == MetricsColorEnum.Success.ToString() && mColor == MetricsColorEnum.Success.ToString()) {
                // add green item to G9 client summary: ""Themba is growing well""
                comment = firstName + Constants.GGSettings.growing_well;
                type = Constants.GGSettings.visit_data_client_summary;
                AddVisitDataStatus(q3, comment, MetricsColorEnum.Success.ToString(), type, Constants.GGSettings.growth_section, false);
            } else {

                if (wColor == MetricsColorEnum.Error.ToString() || lColor == MetricsColorEnum.Error.ToString() || mColor == MetricsColorEnum.Error.ToString()) {
                    // add red item to G9 client summary: ""Themba is not growing well""
                    comment = Constants.GGSettings.not_growing;
                    type = Constants.GGSettings.visit_data_client_summary;
                    AddVisitDataStatus(q3, comment, MetricsColorEnum.Error.ToString(), type, Constants.GGSettings.growth_section, false);
                } else if (wColor == MetricsColorEnum.Warning.ToString() || lColor == MetricsColorEnum.Warning.ToString() || mColor == MetricsColorEnum.Warning.ToString()) {
                    // add amber item to G9 client summary: ""Themba is not growing well""
                    comment = Constants.GGSettings.not_growing;
                    type = Constants.GGSettings.visit_data_client_summary;
                    AddVisitDataStatus(q3, comment, MetricsColorEnum.Warning.ToString(), type, Constants.GGSettings.growth_section, false);
                }
            }

            return true;
        }
        private Boolean ManageFeedingData(List<VisitData> feedingData, string firstName, string infantId) {
            var q1 = feedingData.Where(x => x.Question == Constants.GGSettings.q_eat_drink).FirstOrDefault();
            var comment = "";
            var type = "";
            var color = "";

            if (q1.QuestionAnswer == Constants.GGSettings.breast_milk_only) {

                // Progress: green - ""Breast milk only""
                comment = Constants.GGSettings.breast_milk_only;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GGSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

                // G9 Client summary: green - ""You're doing a great job breastfeeding!""
                comment = Constants.GGSettings.great_job_breastfeeding;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GGSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

            }
            else if (q1.QuestionAnswer == Constants.GGSettings.formula_milk_only) {

                // Progress: green - ""Formula milk only""
                comment = Constants.GGSettings.formula_milk_only;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GGSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

                // G9 Client summary: green - ""You're doing a great job formula feeding!""
                comment = Constants.GGSettings.great_job_formula_feeding;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GGSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

            }
            else if (q1.QuestionAnswer == Constants.GGSettings.mixed_feeding) {

                var mixedFoods = "";
                var listFoods = "";
                mixedFoods = (
                    from visit in _visitRepo.GetAll().Where(x => x.InfantId.ToString() == infantId)
                    join visitData in _visitDataRepo.GetAll().Where(y => y.Question == Constants.GGSettings.q_mixed_foods) on visit.Id equals visitData.VisitId
                    select visitData.QuestionAnswer
                ).FirstOrDefault();
                
                if (mixedFoods != "") {
                    var arrFood = mixedFoods.Split(",");
                    listFoods = "<ul>";
                    foreach ( var food in arrFood ) {
                        listFoods = listFoods + "<li>" + food + "</li>";
                    }
                    listFoods = listFoods + "</ul>";
                }

                // Progress: amber - ""Mixed feeding: ..."" + bulleted list of items selected on screen G5.3.14 Mixed feeding 1 below(use case 39)
                comment = Constants.GGSettings.formula_milk_only + " " + listFoods;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GGSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

                // G9 Client summary: amber - ""Try to make sure you give Themba only breast milk or only formula milk""
                comment = Constants.GGSettings.try_to_make_sure + firstName + Constants.GGSettings.only_milk;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GGSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

            }

            return true;
        }
        private Boolean AddAdditionalVisit(string clientId, string userType, string comment) {

            VisitModel newVisit = new VisitModel();
            newVisit.Attended = false;
            newVisit.VisitType = _additionalVisitType;
            newVisit.MotherId = (Constants.GGSettings.client_mother == userType ? new Guid(clientId) : null);
            newVisit.InfantId = (Constants.GGSettings.client_child == userType ? new Guid(clientId) : null);
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
        private string GetHeightWeightIndicator(int totalMonthsOld, double totalDaysOld, double weight, double height, string ageSection, string heightSection) {

            var indicator = "Normal";

            List<VisitGrowthData> recordsForAge = recordsForAge = _visitGrowthData.GetAll().Where(x => x.Section == ageSection && x.Month == totalMonthsOld).OrderBy(z => z.Weight).ToList();
            VisitGrowthData neg3SD = recordsForAge.Where(x => x.Name == Constants.GGSettings.neg3SD).FirstOrDefault();
            VisitGrowthData neg2SD = recordsForAge.Where(x => x.Name == Constants.GGSettings.neg2SD).FirstOrDefault();
            
            if (totalDaysOld < 7) {
                if (weight <= neg2SD.Weight) {
                    indicator = "Low birth length";
                } else if (weight > neg2SD.Weight) {
                    indicator = "Normal";
                } 
            } else {
                if (weight <= neg3SD.Weight) {
                    indicator = "Severely underweight";
                } else if (weight > neg3SD.Weight && weight <= neg2SD.Weight) {
                    indicator = "Underweight";
                } else if (weight > neg2SD.Weight) {
                    indicator = "Growth faltering";
                }
            }

            if (heightSection != "") {
                List<VisitGrowthData> recordsForHeight = recordsForAge = _visitGrowthData.GetAll().Where(x => x.Section == heightSection && x.Height == height).OrderBy(z => z.Weight).ToList();
                VisitGrowthData pos2SD = recordsForHeight.Where(x => x.Name == Constants.GGSettings.pos2SD).FirstOrDefault();
                VisitGrowthData pos3SD = recordsForHeight.Where(x => x.Name == Constants.GGSettings.pos3SD).FirstOrDefault();
            
                if (weight >= pos3SD.Weight) {
                    indicator = "Obese";
                } else if (weight >= pos2SD.Weight && weight < pos3SD.Weight) {
                    indicator = "Overweight";
                }
            }

            return indicator;
        }
        public List<VisitDataStatus> GetReferralDataForClient(string id, string clientType) {
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            var visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);

            List<VisitDataStatus> allReferrals = new List<VisitDataStatus>();

            if (clientType == Constants.GGSettings.client_mother) {
                allReferrals = (
                    from visit in visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == Constants.GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            } else {
                allReferrals = (
                    from visit in visitRepo.GetAll().Where(x => x.Infant.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == Constants.GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allReferrals;
        }
        public List<VisitDataStatus> GetSummaryDataForClient(string id, string clientType) {
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            var visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);

            List<VisitDataStatus> allData = new List<VisitDataStatus>();

            if (clientType == Constants.GGSettings.client_mother) {
                allData = (
                    from visit in visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == Constants.GGSettings.visit_data_client_summary) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }
            else {
                allData = (
                    from visit in visitRepo.GetAll().Where(x => x.Infant.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == Constants.GGSettings.visit_data_client_summary) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allData;
        }
        public List<VisitDataStatus> GetDashboardDataForClient(string id, string clientType) {
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            var visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);

            List<VisitDataStatus> allData = new List<VisitDataStatus>();

            if (clientType == Constants.GGSettings.client_mother) {
                allData = (
                    from visit in visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == Constants.GGSettings.visit_data_client_dashboard) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }
            else {
                allData = (
                    from visit in visitRepo.GetAll().Where(x => x.Infant.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == Constants.GGSettings.visit_data_client_dashboard) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allData;
        }
        public List<VisitDataStatus> GetProgressDataForClient(string id, string clientType) {
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            var visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);

            List<VisitDataStatus> allData = new List<VisitDataStatus>();

            if (clientType == Constants.GGSettings.client_mother) {
                allData = (
                    from visit in visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == Constants.GGSettings.visit_data_client_progress) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }
            else {
                allData = (
                    from visit in visitRepo.GetAll().Where(x => x.Infant.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == Constants.GGSettings.visit_data_client_progress) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allData;
        }
        public Progress_VisitDataStatus GetPreviousVisitInformationForClient(string visitId) {
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            var visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);

            var totalGreen = 0;
            var totalRed = 0;
            var totalAmber = 0;
            Progress_VisitDataStatus result = new Progress_VisitDataStatus();

            List<VisitDataStatus> visitDataStatus = new List<VisitDataStatus>();
            visitDataStatus = (
                from visitData in visitDataRepo.GetAll().Where(x => x.VisitId.ToString() == visitId)
                join visitStatusData in visitDataStatusRepo.GetAll() on visitData.Id equals visitStatusData.VisitDataId
                select visitStatusData
            ).ToList();

            totalGreen = visitDataStatus.Where(x => x.Color == MetricsColorEnum.Success.ToString()).Count();
            totalRed = visitDataStatus.Where(x => x.Color == MetricsColorEnum.Error.ToString()).Count();
            totalAmber = visitDataStatus.Where(x => x.Color == MetricsColorEnum.Warning.ToString()).Count();

            result.Score = totalGreen.ToString() + " / " + (totalGreen + totalRed + totalAmber).ToString();
            result.VisitDataStatus = visitDataStatus;

            return result;
        }
    
    }
}
