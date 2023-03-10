using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
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

        private string _green;
        private string _amber;
        private string _red;
        private string _none;

        private string _progress;
        private string _referral;
        private string _G4;
        private string _G9;

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

            _green = MetricsColorEnum.Success.ToString();
            _amber = MetricsColorEnum.Warning.ToString();
            _red = MetricsColorEnum.Error.ToString();
            _none = MetricsColorEnum.None.ToString();

            _progress = Constants.GGSettings.visit_data_client_progress;
            _referral = Constants.GGSettings.visit_data_client_referral;
            _G4 = Constants.GGSettings.visit_data_client_dashboard;
            _G9 = Constants.GGSettings.visit_data_client_summary;
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
                    from visit in _visitRepo.GetAll().Where(x => x.MotherId == mother.Id)
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
                    from visit in _visitRepo.GetAll().Where(x => x.InfantId == infant.Id)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    select visitData.Id.ToString()
                ).ToList();

                var motherName = "";
                if (infant.Mother != null) {
                    motherName = infant.Mother.User.FirstName;
                }

                // add additional visit for when we need to add additional visits for the client
                _additionalVisitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_child) &&
                                                                   x.Name == Constants.GGSettings.additional_visits).
                                                                   OrderBy(x => x.NormalizedName).FirstOrDefault();

                ManageVisitDataStatusForInfant(allVisitData, infant.User.FirstName, infant.Id.ToString(), infant.Gender.Description, infant.User.DateOfBirth, motherName);
            }

            return true;
        }

        private Boolean ManageVisitDataStatusForInfant(List<VisitData> allVisitData, string firstName, string infantId, string gender, DateTime dob, string motherName) {

            var comment = "";
            var maternalDistressScreening = new List<VisitData>();
            var developmentScreening = new List<VisitData>();
            var growthData = new List<VisitData>();
            var feedingData = new List<VisitData>();
            var immunisationsData = new List<VisitData>();
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
                        AddVisitDataStatus(vData, comment, _none, _referral, Constants.GGSettings.clinic_referrals, false);

                        // progress: amber - ""Missed clinic visit""
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        AddVisitDataStatus(vData, comment, _amber, _progress, vData.VisitSection, false);

                        // G9 client summary: amber - ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GGSettings.infant_missed_clinic_visit_g9;
                        AddVisitDataStatus(vData, comment, _amber, _G9, vData.VisitSection, false);

                    }
                    else if (vData.QuestionAnswer == Constants.GGSettings.answer_yes) {

                        // progress: green - ""Up to date with clinic visits""
                        comment = Constants.GGSettings.infant_clinic_visit;
                        AddVisitDataStatus(vData, comment, _green, _progress, vData.VisitSection, false);

                        // G9 client summary: green - ""You are up to date with clinic visits"""
                        comment = Constants.GGSettings.infant_clinic_visit_g9;
                        AddVisitDataStatus(vData, comment, _green, _G9, vData.VisitSection, false);

                    }
                }
                else if (vData.Question == Constants.GGSettings.q_postnatal_6_weeks) {
                    if (vData.QuestionAnswer == Constants.GGSettings.answer_no) {

                        // referral: add ""Missed clinic visit"" to referrals list
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        AddVisitDataStatus(vData, comment, _none, _referral, Constants.GGSettings.clinic_referrals, false);

                        // progress: amber - ""Missed clinic visit""
                        comment = Constants.GGSettings.infant_missed_clinic_visit;
                        AddVisitDataStatus(vData, comment, _amber, _progress, vData.VisitSection, false);

                        // G9 client summary: amber - ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GGSettings.infant_missed_clinic_visit_g9;
                        AddVisitDataStatus(vData, comment, _amber, _G9, vData.VisitSection, false);

                    }
                    else if (vData.QuestionAnswer == Constants.GGSettings.answer_yes) {

                        // progress: green - ""Up to date with clinic visits""
                        comment = Constants.GGSettings.infant_clinic_visit;
                        AddVisitDataStatus(vData, comment, _green, _progress, vData.VisitSection, false);

                        // G9 client summary: green - ""You are up to date with clinic visits"""
                        comment = Constants.GGSettings.infant_clinic_visit_g9;
                        AddVisitDataStatus(vData, comment, _green, _G9, vData.VisitSection, false);

                    }
                }
                else if (vData.VisitName == Constants.GGSettings.cfm_name && vData.Question == Constants.GGSettings.q_danger_signs) {

                    if (vData.QuestionAnswer == Constants.GGSettings.none_above) {

                        // Add progress item: ""No danger signs for Lethabo""
                        comment = Constants.GGSettings.no_danger_signs + motherName;
                        AddVisitDataStatus(vData, comment, _green, _progress, vData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = Constants.GGSettings.physical_feeling_well;
                        AddVisitDataStatus(vData, comment, _green, _G9, vData.VisitSection, true);

                    }
                    else {
                        var arrAnswers = vData.QuestionAnswer.Replace("[", "").Replace("]", "").Split(",");
                        var bulletList = FormatBulletList(arrAnswers);

                        if (arrAnswers.Length > 0) {

                            // Add referral item
                            comment = motherName + Constants.GGSettings.was_experiencing + bulletList;
                            AddVisitDataStatus(vData, comment, _none, _referral, Constants.GGSettings.clinic_referrals, false);

                            var hasGroupA = arrAnswers.Any(x => x == Constants.GGSettings.cfm_ds_6 || x == Constants.GGSettings.cfm_ds_7 || x == Constants.GGSettings.cfm_ds_8);
                            var hasGroupB = arrAnswers.Any(x => x == Constants.GGSettings.cfm_ds_1 || x == Constants.GGSettings.cfm_ds_2 || x == Constants.GGSettings.cfm_ds_3 ||
                                                                x == Constants.GGSettings.cfm_ds_4 || x == Constants.GGSettings.cfm_ds_5);

                            // IF danger signs 6, 7, or 8 selected AND no other danger signs selected, add: 
                            if (!hasGroupB && hasGroupA) {
                                comment = motherName + Constants.GGSettings.was_experiencing + bulletList;
                                AddVisitDataStatus(vData, comment, _amber, _progress, vData.VisitSection, false);

                                // Add item to G9 Client summary download - IF danger signs 6, 7, or 8 selected AND no other danger signs selected, add: ""You have some health issues""
                                comment = Constants.GGSettings.health_issues;
                                AddVisitDataStatus(vData, comment, _amber, _G9, vData.VisitSection, false);
                            }
                            else {
                                //  Red -- IF danger signs 1, 2, 3, 4, or 5 selected, add:
                                comment = motherName + Constants.GGSettings.was_experiencing + bulletList;
                                AddVisitDataStatus(vData, comment, _red, _progress, vData.VisitSection, false);

                                // Add G4 secondary alert text: ""Refer to clinic urgently"" if danger signs 1, 2, 3, 4, or 5 selected
                                comment = Constants.GGSettings.refer_to_clinic_urgently;
                                AddVisitDataStatus(vData, comment, _amber, _G4, vData.VisitSection, false);

                                // Add item to G9 Client summary download - IF danger signs 1, 2, 3, 4, or 5 selected, add: ""You need urgent care for some serious health issues""
                                comment = Constants.GGSettings.urgent_care;
                                AddVisitDataStatus(vData, comment, _amber, _G9, vData.VisitSection, false);
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
                        AddVisitDataStatus(vData, comment, _green, _progress, vData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = Constants.GGSettings.physical_feeling_well;
                        AddVisitDataStatus(vData, comment, _green, _G9, vData.VisitSection, true);
                    }
                    else {
                        var arrAnswers = vData.QuestionAnswer.Replace("[", "").Replace("]", "").Split(",");
                        var bulletList = FormatBulletList(arrAnswers);

                        // If the user chooses any of the danger signs (ie user does not select ""None of the above"")
                        comment = firstName + Constants.GGSettings.was_experiencing + bulletList;
                        AddVisitDataStatus(vData, comment, _none, _referral, Constants.GGSettings.clinic_referrals, false);

                        // Add red progress item - where X, Y, Z are each of the danger signs selected by the user.
                        comment = firstName + Constants.GGSettings.was_experiencing + bulletList;
                        AddVisitDataStatus(vData, comment, _red, _progress, vData.VisitSection, false);

                        // Add additional visit item with secondary text: ""Danger signs""
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.danger_signs);

                        // Add G4 secondary alert text: ""Refer to clinic urgently""
                        comment = Constants.GGSettings.refer_to_clinic_urgently;
                        AddVisitDataStatus(vData, comment, _amber, _G4, vData.VisitSection, false);

                        // Add item to G9 Client summary download ""You need urgent care for some serious health issues""
                        comment = Constants.GGSettings.urgent_care;
                        AddVisitDataStatus(vData, comment, _amber, _G9, vData.VisitSection, false);
                    }
                }
                else if (vData.Question == Constants.GGSettings.q_stop_worry ||
                         vData.Question == Constants.GGSettings.q_felt_down ||
                         vData.Question == Constants.GGSettings.q_suicide) {
                    maternalDistressScreening.Add(vData);
                }
                else if (vData.Question == Constants.GGSettings.q_weight) {

                    previousVisitWeight = (
                         from visit in _visitRepo.GetAll().Where(x => x.InfantId.ToString() == infantId && x.Attended == true).OrderBy(x => x.InsertedDate)
                         join visitData in _visitDataRepo.GetAll().Where(y => y.Question == Constants.GGSettings.q_weight) on visit.Id equals visitData.VisitId
                         select visitData.QuestionAnswer
                     ).LastOrDefault();
                    growthData.Add(vData);
                }
                else if (vData.Question == Constants.GGSettings.q_length) {
                    growthData.Add(vData);
                }
                else if (vData.Question == Constants.GGSettings.q_muac) {
                    growthData.Add(vData);
                }
                else if (vData.Question == Constants.GGSettings.q_eat_drink) {
                    feedingData.Add(vData);
                }
                else if (vData.Question == Constants.GGSettings.q_breastfeeding_club) {

                    if (vData.QuestionAnswer == Constants.GGSettings.answer_yes) {
                        // Progress: under the green - ""Breast milk only"" item, add amber text ""Needs support with breastfeeding"" (see in context of progress screen in G3.8)"
                        comment = Constants.GGSettings.breast_milk_only;
                        AddVisitDataStatus(vData, comment, _green, _progress, vData.VisitSection, false);
                    }

                }
                else if (vData.Question == Constants.GGSettings.q_eat_drink_nutrition) {

                    var total_food_groups = 8;
                    if (totalMonthsOld >= 6 && totalMonthsOld < 9) {
                        total_food_groups = 8;
                    }
                    else if (totalMonthsOld >= 9) {
                        total_food_groups = 7;
                    }

                    var answers = 0;
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p1_1) != -1) {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p1_2) != -1) {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p1_3) != -1) {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p1_4) != -1) {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p1_5) != -1) {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p1_6) != -1) {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p1_7) != -1) {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p1_8) != -1) {
                        answers++;
                    }

                    if (answers >= 1 && answers < 4) {
                        // Progress: red - ""Poor dietary diversity: X out of 8 food groups"", where X = the number of items selected(1, 2, or 3)
                        comment = Constants.GGSettings.poor_dietary_diversity.Replace("{x}", answers.ToString()).Replace("{y}", total_food_groups.ToString());
                        AddVisitDataStatus(vData, comment, _red, _progress, vData.VisitSection, false);

                        // G9 Client summary download: red - ""You are giving Themba foods from X out of 8 groups. Try to give Themba a variety of foods!"",  where X = the number of items selected (1, 2, or 3)
                        comment = Constants.GGSettings.give_client_food.Replace("{client}", firstName).Replace("{x}", answers.ToString()).Replace("{y}", total_food_groups.ToString());
                        AddVisitDataStatus(vData, comment, _red, _G9, vData.VisitSection, false);

                    }
                    else if (answers == 4) {

                        // Progress: ""Poor dietary diversity: 4 out of 8 food groups""
                        comment = Constants.GGSettings.poor_dietary_diversity.Replace("{x}", answers.ToString()).Replace("{y}", total_food_groups.ToString());
                        AddVisitDataStatus(vData, comment, _amber, _progress, vData.VisitSection, false);

                        // G9 Client summary: ""You are giving Themba foods from 4 out of 8 groups. Try to give Themba a variety of foods!""
                        comment = Constants.GGSettings.give_client_food.Replace("{client}", firstName).Replace("{x}", answers.ToString()).Replace("{y}", total_food_groups.ToString());
                        AddVisitDataStatus(vData, comment, _amber, _G9, vData.VisitSection, false);

                    }
                    else if (answers >= 5 && answers <= 8) {
                        // Progress: ""Good dietary diversity: X out of 8 food groups!"", where X = the number of items selected (5, 6, 7, 8)
                        comment = Constants.GGSettings.good_dietary_diversity.Replace("{x}", answers.ToString()).Replace("{y}", total_food_groups.ToString());
                        AddVisitDataStatus(vData, comment, _green, _progress, vData.VisitSection, false);

                        // G9 Client summary: ""You are giving Themba foods from most of the groups!""
                        comment = Constants.GGSettings.give_client_food_most.Replace("{client}", firstName);
                        AddVisitDataStatus(vData, comment, _green, _G9, vData.VisitSection, false);
                    }
                }
                else if (vData.Question == Constants.GGSettings.q_hearing ||
                            vData.Question == Constants.GGSettings.q_seeing ||
                            vData.Question == Constants.GGSettings.q_brain ||
                            vData.Question == Constants.GGSettings.q_moving) {
                    if (vData.QuestionAnswer == Constants.GGSettings.answer_no) {
                        developmentScreening.Add(vData);
                    }
                }
                else if (vData.Question == Constants.GGSettings.q_immunisation ||
                            vData.Question == Constants.GGSettings.q_vitamin_a ||
                            vData.Question == Constants.GGSettings.q_deworming) {
                    immunisationsData.Add(vData);

                }
                else if (vData.VisitName == Constants.GGSettings.p4_name && vData.Question == Constants.GGSettings.q_danger_signs) {

                    var answers = 0;
                    var names = "<ul>";
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p4_ds_1) != -1) {
                        answers++;
                        names = names + "<li>" + Constants.GGSettings.p4_ds_1 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p4_ds_2) != -1) {
                        answers++;
                        names = names + "<li>" + Constants.GGSettings.p4_ds_2 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p4_ds_3) != -1) {
                        answers++;
                        names = names + "<li>" + Constants.GGSettings.p4_ds_3 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p4_ds_4) != -1) {
                        answers++;
                        names = names + "<li>" + Constants.GGSettings.p4_ds_4 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p4_ds_5) != -1) {
                        answers++;
                        names = names + "<li>" + Constants.GGSettings.p4_ds_5 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p4_ds_6) != -1) {
                        answers++;
                        names = names + "<li>" + Constants.GGSettings.p4_ds_6 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p4_ds_7) != -1) {
                        answers++;
                        names = names + "<li>" + Constants.GGSettings.p4_ds_7 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(Constants.GGSettings.p4_ds_8) != -1) {
                        answers++;
                        names = names + "<li>" + Constants.GGSettings.p4_ds_8 + "</li>";
                    }
                    names = names + "</ul>";

                    if (answers > 1) {
                        // If any danger signs selected, add referral item: ""Themba was experiencing: * X *Y"" 
                        comment = firstName + Constants.GGSettings.was_experiencing + names;
                        AddVisitDataStatus(vData, comment, _none, _referral, Constants.GGSettings.clinic_referrals, false);

                        // if one or more danger signs selected - red, ""Themba was experiencing: * X *Y""
                        comment = firstName + Constants.GGSettings.was_experiencing + names;
                        AddVisitDataStatus(vData, comment, _red, _progress, vData.VisitSection, false);

                        // Add additional visit item with secondary text: ""Danger signs""
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.danger_signs);

                        // Add G4 secondary alert text: ""Refer to clinic urgently""
                        comment = Constants.GGSettings.refer_to_clinic_urgently;
                        AddVisitDataStatus(vData, comment, _amber, _G4, vData.VisitSection, false);

                        // Add item to G9 Client summary download "Themba needs urgent care for some serious health issues""
                        comment = Constants.GGSettings.urgent_care;
                        AddVisitDataStatus(vData, comment, _red, _G9, vData.VisitSection, false);

                    }
                    else if (answers == 0) {
                        if (vData.QuestionAnswer == Constants.GGSettings.none_above) {
                            // if ""None of the above"" selected - green, ""No danger signs for Themba""
                            comment = Constants.GGSettings.none_above;
                            AddVisitDataStatus(vData, comment, _green, _progress, vData.VisitSection, false);

                            // Add item to G9 Client summary download""Themba is doing well physically!""
                            comment = firstName + Constants.GGSettings.physical_well;
                            AddVisitDataStatus(vData, comment, _green, _G9, vData.VisitSection, false);
                        }
                    }
                }
                else if (vData.Question == Constants.GGSettings.q_birth_certificate) {

                    if (vData.QuestionAnswer == Constants.GGSettings.answer_no) {
                        // Add referral under ""Home Affairs referrals"" = ""Themba does not have a birth certificate""
                        comment = firstName + Constants.GGSettings.no_birth_certificate;
                        AddVisitDataStatus(vData, comment, _none, _referral, Constants.GGSettings.home_affairs_referrals, false);

                        // Add G4 secondary alert text: ""Refer to clinic urgently""
                        comment = Constants.GGSettings.home_affairs_referrals;
                        AddVisitDataStatus(vData, comment, _amber, _G4, vData.VisitSection, false);
                    }
                }
                else if (vData.Question == Constants.GGSettings.q_csg_receiving) {

                    if (vData.QuestionAnswer == Constants.GGSettings.answer_yes) {

                        // green, ""Has applied for a child support grant""
                        comment = Constants.GGSettings.has_csg;
                        AddVisitDataStatus(vData, comment, _green, _progress, vData.VisitSection, false);

                        // G9 Client summary green, ""You applied for the child support grant - this will support Themba's healthy growth!"""
                        comment = firstName + Constants.GGSettings.has_csg2.Replace("{client}", firstName);
                        AddVisitDataStatus(vData, comment, _green, _G9, vData.VisitSection, false);
                    }
                }
            }

            if (maternalDistressScreening.Count > 0) {
                ManageMaternalDistressScreening(maternalDistressScreening, motherName, infantId, Constants.GGSettings.client_child);
            }

            if (growthData.Count > 0) {
                ManageGrowthData(growthData, firstName, infantId, gender, totalMonthsOld, totalDaysOld, previousVisitWeight);
            }

            if (feedingData.Count > 0) {
                ManageFeedingData(feedingData, firstName, infantId);
            }

            if (developmentScreening.Count > 0) {
                ManageDevelopmentScreeningData(developmentScreening, firstName, infantId);
            }

            if (immunisationsData.Count > 0) {
                ManageImmunisationData(immunisationsData, firstName, infantId);
            }

            return true;
        }

        private Boolean ManageVisitDataStatusForMother(List<VisitData> allVisitData, string firstName, string motherId) {
            var maternalDistressScreening = new List<VisitData>();
            var alcoholUse = new List<VisitData>();
            var idDocs = new List<VisitData>();
            var comment = "";

            // loop through data and add status data
            foreach (VisitData visitData in allVisitData) {
                if (visitData.Question == Constants.GGSettings.q_first_antenatal_visit) {
                    if (visitData.QuestionAnswer == Constants.GGSettings.answer_no) {
                        // this should add a referral to the list(""Pregnancy not booked"")
                        comment = Constants.GGSettings.pregnancy_not_booked;
                        AddVisitDataStatus(visitData, comment, _none, _referral, Constants.GGSettings.clinic_referrals, false);

                        // add an ""amber"" item to the progress list: ""Pregnancy not booked"".
                        comment = Constants.GGSettings.pregnancy_not_booked;
                        AddVisitDataStatus(visitData, comment, _amber, _progress, visitData.VisitSection, false);

                        // add flag to G4 secondary alert: red alert, ""Refer to clinic""
                        comment = Constants.GGSettings.refer_to_clinic;
                        AddVisitDataStatus(visitData, comment, _red, _G4, visitData.VisitSection, false);

                        // add amber item to G9 client download summary: ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GGSettings.missed_clinic_visit;
                        AddVisitDataStatus(visitData, comment, _amber, _G9, visitData.VisitSection, false);

                    }
                    else if (visitData.QuestionAnswer == Constants.GGSettings.answer_yes) {
                        // a ""green"" item is added to the client progress list ""Pregnancy booked""
                        comment = Constants.GGSettings.pregnancy_booked;
                        AddVisitDataStatus(visitData, comment, _green, _progress, visitData.VisitSection, true);

                        // a green item is added to G9 client download summary ""You are up to date with your clinic visits!""
                        comment = Constants.GGSettings.clinic_visits_up_to_date_2;
                        AddVisitDataStatus(visitData, comment, _green, _G9, visitData.VisitSection, true);
                    }
                }
                else if (visitData.Question == Constants.GGSettings.q_antenatal_visits) {
                    if (visitData.QuestionAnswer == Constants.GGSettings.answer_no) {
                        // add an ""amber"" item to the progress: ""Clinic visits not up to date""
                        comment = Constants.GGSettings.clinic_visits_not_up_to_date;
                        AddVisitDataStatus(visitData, comment, _none, _referral, Constants.GGSettings.clinic_referrals, false);

                        // add an ""amber"" item to the progress list: Clinic visits not up to date.
                        comment = Constants.GGSettings.clinic_visits_not_up_to_date;
                        AddVisitDataStatus(visitData, comment, _amber, _progress, visitData.VisitSection, false);

                        // add G4 secondary text red alert ""Refer to clinic""
                        comment = Constants.GGSettings.refer_to_clinic;
                        AddVisitDataStatus(visitData, comment, _red, _G4, visitData.VisitSection, false);

                        // add amber item to G9 client download summary: ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GGSettings.missed_clinic_visit;
                        AddVisitDataStatus(visitData, comment, _amber, _G9, visitData.VisitSection, false);
                    }
                    else if (visitData.QuestionAnswer == Constants.GGSettings.answer_yes) {
                        // ""green"" item is added to the progress: "Clinic visits up to date"
                        comment = Constants.GGSettings.clinic_visits_up_to_date;
                        AddVisitDataStatus(visitData, comment, _green, _progress, visitData.VisitSection, true);

                        // add green item to G9 client download summary "You are up to date with your clinic visits!"
                        comment = Constants.GGSettings.all_clinic_visit;
                        AddVisitDataStatus(visitData, comment, _green, _G9, visitData.VisitSection, true);

                    }
                }
                else if (visitData.Question == Constants.GGSettings.q_measurement) {
                    var questionAnswer = Int32.Parse(visitData.QuestionAnswer);

                    if (questionAnswer < 22) {
                        // add to referrals items list(""May be underweight - MUAC less than 22cm"") red
                        comment = Constants.GGSettings.underweight;
                        AddVisitDataStatus(visitData, comment, _none, _referral, Constants.GGSettings.clinic_referrals, false);

                        // add to red items in progress screen(use case 2) (""May be underweight - MUAC less than 22cm"")
                        comment = Constants.GGSettings.underweight;
                        AddVisitDataStatus(visitData, comment, _red, _progress, visitData.VisitSection, false);

                        // add G4 secondary text item: ""Refer to clinic urgently""(this is the highest - priority item & will be shown)
                        comment = Constants.GGSettings.refer_to_clinic_urgently;
                        AddVisitDataStatus(visitData, comment, _red, _G4, visitData.VisitSection, false);

                        // add green item to G9 client summary: ""You might be underweight: eat 3 meals every day""
                        comment = Constants.GGSettings.underweight2;
                        AddVisitDataStatus(visitData, comment, _green, _G9, visitData.VisitSection, false);

                        // add additional visit item with ""Underweight"" secondary text -please see G3.7 Other / Additional visits
                        AddAdditionalVisit(motherId, Constants.GGSettings.client_mother, Constants.GGSettings.underweight3);
                    }
                    else if (questionAnswer >= 22) {
                        // add to green items in progress screen(use case 2) (""MUAC over 22cm"")TenancyMiddleware.cs
                        comment = Constants.GGSettings.muac_over_22;
                        AddVisitDataStatus(visitData, comment, _green, _progress, visitData.VisitSection, true);

                        // add green item to G9 client summary: ""According to your mid-upper arm circumference, you are a healthy weight""
                        comment = Constants.GGSettings.healthy_weight;
                        AddVisitDataStatus(visitData, comment, _green, _G9, visitData.VisitSection, true);
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
                        AddVisitDataStatus(visitData, comment, _green, _progress, visitData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = Constants.GGSettings.physical_feeling_well;
                        AddVisitDataStatus(visitData, comment, _green, _G9, visitData.VisitSection, true);
                    }
                    else {
                        var arrAnswers = visitData.QuestionAnswer.Replace("[", "").Replace("]", "").Split(",");
                        var bulletList = FormatBulletList(arrAnswers);
                        // If the user chooses any of the danger signs (ie user does not select ""None of the above"")
                        comment = firstName + Constants.GGSettings.was_experiencing + bulletList;
                        AddVisitDataStatus(visitData, comment, _none, _referral, Constants.GGSettings.clinic_referrals, false);

                        // Add red progress item - where X, Y, Z are each of the danger signs selected by the user.
                        comment = firstName + Constants.GGSettings.was_experiencing + bulletList;
                        AddVisitDataStatus(visitData, comment, _red, _progress, visitData.VisitSection, false);

                        // Add additional visit item with secondary text: ""Danger signs""
                        AddAdditionalVisit(motherId, Constants.GGSettings.client_mother, Constants.GGSettings.danger_signs);

                        // Add G4 secondary alert text: ""Refer to clinic urgently""
                        comment = Constants.GGSettings.refer_to_clinic_urgently;
                        AddVisitDataStatus(visitData, comment, _amber, _G4, visitData.VisitSection, false);

                        // Add item to G9 Client summary download ""You need urgent care for some serious health issues""
                        comment = Constants.GGSettings.urgent_care;
                        AddVisitDataStatus(visitData, comment, _amber, _G9, visitData.VisitSection, false);
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
            var section = Constants.GGSettings.clinic_referrals;

            var q1 = maternalDistressScreening.Where(x => x.Question == Constants.GGSettings.q_stop_worry).FirstOrDefault();
            var q2 = maternalDistressScreening.Where(x => x.Question == Constants.GGSettings.q_felt_down).FirstOrDefault();
            var q3 = maternalDistressScreening.Where(x => x.Question == Constants.GGSettings.q_suicide).FirstOrDefault();

            // a Constants.GGSettings.answer_yes response to the 3rd question trumps all.
            if (q3.QuestionAnswer == Constants.GGSettings.answer_yes) {
                comment = firstName + Constants.GGSettings.maternal_distress;
                AddVisitDataStatus(q3, comment, _none, _referral, section, false);

                // add to amber items in progress screen(use case 2)(""Lethabo was experiencing maternal distress"")
                comment = firstName + Constants.GGSettings.maternal_distress;
                AddVisitDataStatus(q3, comment, _amber, _progress, q3.VisitSection, false);

                AddAdditionalVisit(clientId, clientType, Constants.GGSettings.maternal_distress2);

                // add G4 secondary text item: Amber - ""Refer to clinic""
                comment = Constants.GGSettings.refer_to_clinic;
                AddVisitDataStatus(q3, comment, _amber, _G4, q3.VisitSection, false);

                // add amber item to G9 client summary: ""You are struggling and need some support""
                comment = Constants.GGSettings.need_support;
                AddVisitDataStatus(q3, comment, _amber, _G9, q3.VisitSection, false);
            } else {
                if (q3.QuestionAnswer == Constants.GGSettings.answer_no && (q1.QuestionAnswer == Constants.GGSettings.answer_yes || q2.QuestionAnswer == Constants.GGSettings.answer_yes)) {
                    comment = firstName + Constants.GGSettings.maternal_distress;
                    AddVisitDataStatus(q3, comment, _none, _referral, section, false);

                    comment = firstName + Constants.GGSettings.maternal_distress;
                    AddVisitDataStatus(q3, comment, _amber, _progress, q3.VisitSection, false);

                    AddAdditionalVisit(clientId, clientType, Constants.GGSettings.maternal_distress2);

                    // add amber item to G9 client summary: ""You are struggling and need some support""
                    comment = Constants.GGSettings.need_support;
                    AddVisitDataStatus(q3, comment, _amber, _G9, q3.VisitSection, false);
                }

                if (q3.QuestionAnswer == Constants.GGSettings.answer_no && q1.QuestionAnswer == Constants.GGSettings.answer_no && q2.QuestionAnswer == Constants.GGSettings.answer_no) {
                    // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                    comment = firstName + Constants.GGSettings.was_coping;
                    AddVisitDataStatus(q3, comment, _amber, _progress, q3.VisitSection, true);

                    //add green item to G9 client summary: You are coping well!
                    comment = Constants.GGSettings.coping_well;
                    AddVisitDataStatus(q3, comment, _amber, _G9, q3.VisitSection, true);
                }
            }
            return true;
        }
        private Boolean ManageAlcoholUse(List<VisitData> alcoholUse, string firstName, string motherId) {
            var comment = "";
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
                AddVisitDataStatus(q1, comment, _none, _referral, section, false);

                // add to red items in progress screen (use case 2) (""Lethabo is at risk of a drinking problem (T-ACE score = X)"", where X = the T-ACE score calculated)
                comment = firstName + Constants.GGSettings.t_ace_score + score + ")";
                AddVisitDataStatus(q1, comment, _red, _progress, q1.VisitSection, false);

                // add G4 secondary text item: Red - ""Refer to clinic urgently""
                comment = Constants.GGSettings.refer_to_clinic_urgently;
                AddVisitDataStatus(q1, comment, _red, _G4, q1.VisitSection, false);

                // add amber item to G9 client summary: ""You may need support to reduce your drinking""
                comment = Constants.GGSettings.support_drinking;
                AddVisitDataStatus(q1, comment, _amber, _G9, q1.VisitSection, false);
            }
            else if (score > 0 && score < 2) {
                // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                comment = firstName + Constants.GGSettings.no_alcohol_abuse;
                AddVisitDataStatus(q1, comment, _green, _progress, q1.VisitSection, true);

            }
            return true;
        }
        private Boolean ManageIdDocs(List<VisitData> idDocs, string firstName) {
            var comment = "";

            var q1 = idDocs.Where(x => x.Question == Constants.GGSettings.q_ID_doc).FirstOrDefault();
            var q2 = idDocs.Where(x => x.Question == Constants.GGSettings.q_citizen).FirstOrDefault();

            if (q1.QuestionAnswer == Constants.GGSettings.answer_no && q2.QuestionAnswer == Constants.GGSettings.answer_yes) {
                // IF this is not already unchecked in the referrals list for this client; add to referrals items list under Department of Home Affairs referrals(""Lethabo doesn't have an ID book)
                comment = firstName + Constants.GGSettings.no_id_book;
                AddVisitDataStatus(q1, comment, _none, _referral, Constants.GGSettings.home_affairs_referrals, false);

                // add to amber items in progress screen(""Lethabo doesn't have an ID book"")
                comment = firstName + Constants.GGSettings.no_id_book;
                AddVisitDataStatus(q1, comment, _amber, _progress, q1.VisitSection, false);

                // add amber item to G9 client summary: ""Go to Home Affairs to apply for your ID book.This will allow you to apply for the child social grant as soon as the baby is born.""
                comment = Constants.GGSettings.go_to_home_affairs;
                AddVisitDataStatus(q1, comment, _amber, _G9, q1.VisitSection, false);
            }

            if (q1.QuestionAnswer == Constants.GGSettings.answer_yes) {
                // add to green items in progress screen(use case 2)(""Lethabo has an ID book"")
                comment = firstName + Constants.GGSettings.id_book;
                AddVisitDataStatus(q1, comment, _green, _progress, q1.VisitSection, true);

                // add green item to G9 client summary: ""You have your ID document & can apply for a child social grant once the baby is born!""
                comment = Constants.GGSettings.apply_social_grant;
                AddVisitDataStatus(q1, comment, _green, _G9, q1.VisitSection, true);
            }
            return true;
        }
        private Boolean ManageGrowthData(List<VisitData> growthData, string firstName, string infantId, string gender, int totalMonthsOld, double totalDaysOld, string previousVisitWeight) {
            var comment = "";

            var wIndicator = "Normal";
            var lIndicator = "Normal";
            var mIndicator = "Normal";

            var wColor = "";
            var lColor = "";
            var mColor = "";

            var q1 = growthData.Where(x => x.Question == Constants.GGSettings.q_weight).FirstOrDefault();
            var q2 = growthData.Where(x => x.Question == Constants.GGSettings.q_length).FirstOrDefault();
            var q3 = growthData.Where(x => x.Question == Constants.GGSettings.q_muac).FirstOrDefault();

            if (q1 != null && q1.Question == Constants.GGSettings.q_weight) {

                var _weight = double.Parse(q1.QuestionAnswer, CultureInfo.InvariantCulture);
                var _height = double.Parse(q2.QuestionAnswer, CultureInfo.InvariantCulture);
                var _prevWeight = double.Parse(previousVisitWeight, CultureInfo.InvariantCulture);

                string ageSection = (gender == Constants.GGSettings.male ? Constants.GGSettings.weightForAgeBoys : Constants.GGSettings.weightForAgeGirls);
                string heightSection = (gender == Constants.GGSettings.male ? Constants.GGSettings.weightForHeightBoys : Constants.GGSettings.weightForHeightGirls);
                wIndicator = GetHeightWeightIndicator(true, totalMonthsOld, totalDaysOld, _weight, _height, ageSection, heightSection);
                Boolean weightIncreased = _weight > _prevWeight;

                if (totalDaysOld < 7 && _prevWeight == 0 && _weight < 2.5) {
                    wIndicator = "Low birth weight";
                    wColor = _amber;
                } else if (totalDaysOld < 7 && _prevWeight == 0 && _weight >= 2.5) {
                    wIndicator = "Normal";
                    wColor = _green;
                } else {
                    if (wIndicator == "Severely underweight") {
                        wColor = _red;

                        // Red progress
                        comment = Constants.GGSettings.severely_underweight + " " + q1.QuestionAnswer;
                        AddVisitDataStatus(q1, comment, wColor, _progress, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.severely_underweight);

                        // Red G4
                        comment = Constants.GGSettings.refer_to_clinic_urgently;
                        AddVisitDataStatus(q1, comment, wColor, _G4, Constants.GGSettings.refer_to_clinic_urgently, false);
                    } else if (wIndicator == "Underweight") {
                        wColor = _amber;

                        // Amber progress
                        comment = wIndicator + " " + q1.QuestionAnswer;
                        AddVisitDataStatus(q1, comment, wColor, _progress, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, wIndicator);

                        // Amber G4
                        comment = Constants.GGSettings.refer_to_clinic;
                        AddVisitDataStatus(q1, comment, wColor, _G4, Constants.GGSettings.refer_to_clinic, false);
                    } else if (wIndicator == "Growth faltering" && !weightIncreased) {
                        wColor = _amber;

                        // Amber progress
                        comment = Constants.GGSettings.growth_faltering + " " + q1.QuestionAnswer;
                        AddVisitDataStatus(q1, comment, wColor, _progress, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.severely_stunted);

                        // Amber G4
                        comment = Constants.GGSettings.refer_to_clinic;
                        AddVisitDataStatus(q1, comment, wColor, _G4, Constants.GGSettings.refer_to_clinic, false);
                    } else if (wIndicator == "Obese") {
                        wColor = _amber;

                        // Amber progress
                        comment = wIndicator + " " + q1.QuestionAnswer;
                        AddVisitDataStatus(q1, comment, wColor, _progress, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, wIndicator);

                        // Amber G4
                        comment = Constants.GGSettings.refer_to_clinic;
                        AddVisitDataStatus(q1, comment, wColor, _G4, Constants.GGSettings.refer_to_clinic, false);
                    } else if (wIndicator == "Overweight") {
                        wColor = _amber;

                        // Amber progress
                        comment = wIndicator + " " + q1.QuestionAnswer;
                        AddVisitDataStatus(q1, comment, wColor, _progress, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, Constants.GGSettings.client_child, wIndicator);

                        // Amber G4
                        comment = Constants.GGSettings.refer_to_clinic;
                        AddVisitDataStatus(q1, comment, wColor, _G4, Constants.GGSettings.refer_to_clinic, false);
                    } else if (wIndicator == "Normal" && weightIncreased) {
                        wColor = _green;

                        // Green progress
                        comment = wIndicator + " " + q1.QuestionAnswer;
                        AddVisitDataStatus(q1, comment, wColor, _progress, q1.VisitSection, false);

                        // Green G4 
                        comment = firstName + Constants.GGSettings.growing_well;
                        AddVisitDataStatus(q1, comment, wColor, _G4, q1.VisitSection, false);
                    }
                }
            }

            if (q2 != null && q2.Question == Constants.GGSettings.q_length) {
                string ageSection = (gender == Constants.GGSettings.male ? Constants.GGSettings.weightForAgeBoys : Constants.GGSettings.weightForAgeGirls);
                lIndicator = GetHeightWeightIndicator(false, totalMonthsOld, totalDaysOld, double.Parse(q2.QuestionAnswer), double.Parse(q1.QuestionAnswer), ageSection, "");

                if (lIndicator == "Severely stunted") {
                    lColor = _red;
                    
                    // Red progress
                    comment = lIndicator + " " + q2.QuestionAnswer;
                    AddVisitDataStatus(q2, comment, lColor, _progress, q2.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, Constants.GGSettings.client_child, lIndicator);

                    // Red G4
                    comment = Constants.GGSettings.refer_to_clinic_urgently;
                    AddVisitDataStatus(q2, comment, lColor, _G4, Constants.GGSettings.refer_to_clinic_urgently, false);

                } else if (lIndicator == "Stunted") {
                    lColor = _amber;

                    // Amber progress
                    comment = lIndicator;
                    AddVisitDataStatus(q2, comment, lColor, _progress, q2.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, Constants.GGSettings.client_child, lIndicator);

                    // Amber G4
                    comment = Constants.GGSettings.refer_to_clinic;
                    AddVisitDataStatus(q2, comment, lColor, _G4, Constants.GGSettings.refer_to_clinic, false);

                } else if (lIndicator == "Normal") {
                    lColor = _green;

                    // Green progress
                    comment = lIndicator;
                    AddVisitDataStatus(q2, comment, lColor, _progress, q2.VisitSection, false);
                }
            }

            if (q3 != null && q3.Question == Constants.GGSettings.q_muac) {
                var questionAnswer = Int32.Parse(q3.QuestionAnswer);
                mIndicator = "Normal";
                if (questionAnswer < 11.5) {
                    mIndicator = "Severe acute malnutrition";
                    mColor = _red;

                    // Red progress
                    comment = mIndicator + " " + q3.QuestionAnswer;
                    AddVisitDataStatus(q3, comment, mColor, _progress, q3.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.moderate_acute_malnutrition);

                    // Red G4
                    comment = Constants.GGSettings.refer_to_clinic_urgently;
                    AddVisitDataStatus(q3, comment, mColor, _G4, Constants.GGSettings.refer_to_clinic_urgently, false);


                } else if (questionAnswer >= 11.5 && questionAnswer < 12.5) {
                    mIndicator = "Moderate acute malnutrition";
                    mColor = _amber;

                    // Amber progress
                    comment = Constants.GGSettings.severely_stunted + " " + q3.QuestionAnswer;
                    AddVisitDataStatus(q3, comment, mColor, _progress, q3.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, Constants.GGSettings.client_child, Constants.GGSettings.moderate_acute_malnutrition);

                    // Amber G4
                    comment = Constants.GGSettings.refer_to_clinic_urgently;
                    AddVisitDataStatus(q3, comment, mColor, _G4, Constants.GGSettings.refer_to_clinic_urgently, false);

                } else if (questionAnswer >= 12.5) {
                    mIndicator = "Normal";
                    mColor = _green;

                    // Green progress
                    comment = mIndicator + " " + q3.QuestionAnswer;
                    AddVisitDataStatus(q3, comment, mColor, _progress, q3.VisitSection, false);

                    // Green G4 
                    comment = firstName + Constants.GGSettings.growing_well;
                    AddVisitDataStatus(q3, comment, mColor, _G4, q3.VisitSection, false);
                }
            }

            // REFERRALS && G9 FOR ALL
            if (wIndicator != "Normal" && lIndicator != "Normal" && mIndicator != "Normal") {
                // Referrals
                comment = firstName + Constants.GGSettings.growth_referral + "<ul><li>" + wIndicator + "</li><li>" + lIndicator + "</li><li>" + mIndicator + "</li></ul>";
                AddVisitDataStatus(q1, comment, _none, _referral, q1.VisitSection, false);
            }

            if (wColor == _green && lColor == _green && mColor == _green) {
                // add green item to G9 client summary: ""Themba is growing well""
                comment = firstName + Constants.GGSettings.growing_well;
                AddVisitDataStatus(q3, comment, _green, _G9, Constants.GGSettings.growth_section, false);
            } else {

                if (wColor == _red || lColor == _red || mColor == _red) {
                    // add red item to G9 client summary: ""Themba is not growing well""
                    comment = firstName + Constants.GGSettings.not_growing;
                    AddVisitDataStatus(q3, comment, _red, _G9, Constants.GGSettings.growth_section, false);
                } else if (wColor == _amber || lColor == _amber || mColor == _amber) {
                    // add amber item to G9 client summary: ""Themba is not growing well""
                    comment = firstName + Constants.GGSettings.not_growing;
                    AddVisitDataStatus(q3, comment, _amber, _G9, Constants.GGSettings.growth_section, false);
                }
            }

            return true;
        }
        private Boolean ManageFeedingData(List<VisitData> feedingData, string firstName, string infantId) {
            var q1 = feedingData.Where(x => x.Question == Constants.GGSettings.q_eat_drink).FirstOrDefault();
            var comment = "";

            if (q1.QuestionAnswer == Constants.GGSettings.breast_milk_only) {

                // Progress: green - ""Breast milk only""
                comment = Constants.GGSettings.breast_milk_only;
                AddVisitDataStatus(q1, comment, _green, _progress, q1.VisitSection, false);

                // G9 Client summary: green - ""You're doing a great job breastfeeding!""
                comment = Constants.GGSettings.great_job_breastfeeding;
                AddVisitDataStatus(q1, comment, _green, _G9, q1.VisitSection, false);

            }
            else if (q1.QuestionAnswer == Constants.GGSettings.formula_milk_only) {

                // Progress: green - ""Formula milk only""
                comment = Constants.GGSettings.formula_milk_only;
                AddVisitDataStatus(q1, comment, _green, _progress, q1.VisitSection, false);

                // G9 Client summary: green - ""You're doing a great job formula feeding!""
                comment = Constants.GGSettings.great_job_formula_feeding;
                AddVisitDataStatus(q1, comment, _green, _G9, q1.VisitSection, false);

            }
            else if (q1.QuestionAnswer == Constants.GGSettings.mixed_feeding) {

                var mixedFoods = "";
                var listFoods = "";
                mixedFoods = (
                    from visit in _visitRepo.GetAll().Where(x => x.InfantId.ToString() == infantId).OrderBy(y => y.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll().Where(y => y.Question == Constants.GGSettings.q_eat_drink_nutrition) on visit.Id equals visitData.VisitId
                    select visitData.QuestionAnswer
                ).FirstOrDefault();
                
                if (mixedFoods != null) {
                    listFoods = FormatNutritionList(mixedFoods);
                } 

                // Progress: amber - ""Mixed feeding: ..."" + bulleted list of items selected on screen G5.3.14 Mixed feeding 1 below(use case 39)
                comment = Constants.GGSettings.formula_milk_only + " " + listFoods;
                AddVisitDataStatus(q1, comment, _amber, _progress, q1.VisitSection, false);

                // G9 Client summary: amber - ""Try to make sure you give Themba only breast milk or only formula milk""
                comment = Constants.GGSettings.try_to_make_sure + firstName + Constants.GGSettings.only_milk;
                AddVisitDataStatus(q1, comment, _amber, _G9, q1.VisitSection, false);

            }

            return true;
        }
        private Boolean ManageDevelopmentScreeningData(List<VisitData> developmentScreening, string firstName, string infantId) {
            var names = "<ul>";
            var comment = "";

            foreach (var item in developmentScreening)
            {
                if (item.Question == Constants.GGSettings.q_hearing) {
                    names = names + "<li>Hearing</li>";
                }
                if (item.Question == Constants.GGSettings.q_seeing) {
                    names = names + "<li>Seeing</li>";
                }
                if (item.Question == Constants.GGSettings.q_brain) {
                    names = names + "<li>Brain</li>";
                }
                if (item.Question == Constants.GGSettings.q_moving) {
                    names = names + "<li>Moving</li>";
                }

            }
            names = names + "</ul>";

            var q1 = developmentScreening.FirstOrDefault();

            // IF the user selected ""No"" to any of the questions, show referral item: ""Themba is struggling with X, Y, Z""
            comment = Constants.GGSettings.dev_is_struggling.Replace("{client}", firstName) + names;
            AddVisitDataStatus(q1, comment, _none, _referral, q1.VisitSection, false);

            // amber ""Themba is struggling with: * X; * Y""
            comment = Constants.GGSettings.dev_is_struggling.Replace("{client}", firstName) + names;
            AddVisitDataStatus(q1, comment, _amber, _progress, q1.VisitSection, false);

            // G9 Client summary: amber - ""Themba might be having issues with: X, Y skills""
            comment = Constants.GGSettings.dev_might_struggling.Replace("{client}", firstName) + names;
            AddVisitDataStatus(q1, comment, _green, _G9, q1.VisitSection, false);

            return true;
        }
        private Boolean ManageImmunisationData(List<VisitData> immunisationsData, string firstName, string infantId) {
            var comment = "";

            List<VisitData> no_answers = immunisationsData.Where(x => x.QuestionAnswer == Constants.GGSettings.answer_no).ToList();
            List<VisitData> yes_answers = immunisationsData.Where(x => x.QuestionAnswer == Constants.GGSettings.answer_yes).ToList();

            // NO Answers
            var q1 = no_answers.FirstOrDefault();
            if (no_answers.Count == 1) {
                if (q1.Question == Constants.GGSettings.q_immunisation) {
                    // - if ""No"" to immunisation question only, add referral: ""Immunisations not up to date""
                    comment = Constants.GGSettings.immunisations_not_up_to_date;
                    AddVisitDataStatus(q1, comment, _none, _referral, q1.VisitSection, false);
                }
                else if (q1.Question == Constants.GGSettings.q_vitamin_a) {
                    // if ""No"" to Vitamin A question only, add referral: ""Vitamin A not up to date""
                    comment = Constants.GGSettings.vitamin_not_up_to_date;
                    AddVisitDataStatus(q1, comment, _none, _referral, q1.VisitSection, false);
                }
                else if (q1.Question == Constants.GGSettings.q_deworming) {
                    // if ""No"" to deworming question only, add referral: ""Deworming not up to date""
                    comment = Constants.GGSettings.deworming_not_up_to_date;
                    AddVisitDataStatus(q1, comment, _none, _referral, q1.VisitSection, false);
                }
            } else if (no_answers.Count > 1) {

                // ""Immunisations, deworming and Vitamin A not up to date"" 
                comment = Constants.GGSettings.not_up_to_date;
                AddVisitDataStatus(q1, comment, _none, _referral, q1.VisitSection, false);

                //amber - if user responded ""No"" to all 3 questions: ""Immunisations, deworming and Vitamin A not up to date""; if user responded ""No"" to 1 or more, please see row 160 here for variations
                comment = Constants.GGSettings.not_up_to_date;
                AddVisitDataStatus(q1, comment, _amber, _progress, q1.VisitSection, false);

                // G9 Client summary: ""Themba missed an immunisation, deworming and Vitamin A supplement
                comment = Constants.GGSettings.missed_immunisations.Replace("{client}", firstName);
                AddVisitDataStatus(q1, comment, _amber, _G9, q1.VisitSection, false);
            }

            // YES answers
            var q2 = yes_answers.FirstOrDefault();
            if (yes_answers.Count == 3) {
                //green - if user responded ""Yes"" to all 3 questions: ""All immunisations, Vitamin A and deworming are up to date""
                comment = Constants.GGSettings.all_up_to_date;
                AddVisitDataStatus(q2, comment, _green, _progress, q2.VisitSection, false);

                // G9 Client summary: green - if ""Yes"" to all questions on screen, show ""All of Themba's immunisations are up to date""
                comment = Constants.GGSettings.all_up_to_date_client.Replace("{client}", firstName);
                AddVisitDataStatus(q2, comment, _green, _G9, q2.VisitSection, false);
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
            if (input != null) {
                var visitDataStatus = GetVisitDataStatusFromInputModel(input);
                visitDataStatus.Id = Guid.NewGuid();
                visitDataStatus.Comment = comment;
                visitDataStatus.Color = color;
                visitDataStatus.Type = type;
                visitDataStatus.Section = section;
                visitDataStatus.IsCompleted = isCompleted;
                InsertVisitDataStatus(visitDataStatus);
            }
            return true;
        }
        private Boolean InsertVisitDataStatus(VisitDataStatus input)
        {
            // Ensure we don't add duplicate records for a client
            if (!ValidateVisitDataStatusRecord(input))
            {
                _visitDataStatusRepo.Insert(input);
            }
            return true;
        }
        private Boolean ValidateVisitDataStatusRecord(VisitDataStatus input)
        {
            var visitStatusRecord = _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Comment == input.Comment && _clientVisitDataIds.Contains(x.VisitDataId.ToString())).FirstOrDefault();

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
        private string FormatBulletList(Array arrData) {
            var result = "<ul>";
            foreach (var item in arrData) {
                result = result + "<li>" + item + "</li>";
            }
            result = result + "<ul>";

            return result;
        }
        private string FormatNutritionList(String options) {
            var result = "<ul>";

            if (options.IndexOf(Constants.GGSettings.p1_1) != -1) {
                result = result + "<li>" + Constants.GGSettings.p1_1 + "</li>";
            }
            if (options.IndexOf(Constants.GGSettings.p1_2) != -1) {
                result = result + "<li>" + Constants.GGSettings.p1_2 + "</li>";
            }
            if (options.IndexOf(Constants.GGSettings.p1_3) != -1) {
                result = result + "<li>" + Constants.GGSettings.p1_3 + "</li>";
            }
            if (options.IndexOf(Constants.GGSettings.p1_4) != -1) {
                result = result + "<li>" + Constants.GGSettings.p1_4 + "</li>";
            }
            if (options.IndexOf(Constants.GGSettings.p1_5) != -1) {
                result = result + "<li>" + Constants.GGSettings.p1_5 + "</li>";
            }
            if (options.IndexOf(Constants.GGSettings.p1_6) != -1) {
                result = result + "<li>" + Constants.GGSettings.p1_6 + "</li>";
            }
            if (options.IndexOf(Constants.GGSettings.p1_7) != -1) {
                result = result + "<li>" + Constants.GGSettings.p1_7 + "</li>";
            }
            if (options.IndexOf(Constants.GGSettings.p1_8) != -1) {
                result = result + "<li>" + Constants.GGSettings.p1_8 + "</li>";
            }

            result = result + "<ul>";

            return result;
        }
        private string GetHeightWeightIndicator(Boolean isWeightCalc, int totalMonthsOld, double totalDaysOld, double weight, double height, string ageSection, string heightSection) {
            var indicator = "Normal";

            List<VisitGrowthData> recordsForAge = _visitGrowthData.GetAll().Where(x => x.Section == ageSection && x.Month == totalMonthsOld).OrderBy(z => z.Weight).ToList();
            VisitGrowthData neg3SD = recordsForAge.Where(x => x.Name == Constants.GGSettings.neg3SD).FirstOrDefault();
            VisitGrowthData neg2SD = recordsForAge.Where(x => x.Name == Constants.GGSettings.neg2SD).FirstOrDefault();

            if (isWeightCalc) {

                if (totalDaysOld < 7) {
                    if (neg2SD != null && weight <= neg2SD.Weight) {
                        indicator = "Low birth length";
                    } else if (neg2SD != null && weight > neg2SD.Weight) {
                        indicator = "Normal";
                    }
                } else {
                    if (neg3SD != null && weight <= neg3SD.Weight) {
                        indicator = "Severely underweight";
                    } else if ((neg2SD != null && neg3SD != null) && weight > neg3SD.Weight && weight <= neg2SD.Weight) {
                        indicator = "Underweight";
                    } else if (neg2SD != null && weight > neg2SD.Weight) {
                        indicator = "Growth faltering";
                    }
                }

                if (heightSection != "") {
                    List<VisitGrowthData> recordsForHeight = _visitGrowthData.GetAll().Where(x => x.Section == heightSection && x.Height == height).OrderBy(z => z.Weight).ToList();
                    VisitGrowthData pos2SD = recordsForHeight.Where(x => x.Name == Constants.GGSettings.pos2SD).FirstOrDefault();
                    VisitGrowthData pos3SD = recordsForHeight.Where(x => x.Name == Constants.GGSettings.pos3SD).FirstOrDefault();


                    if (pos3SD != null && (weight >= pos3SD.Weight)) {
                        indicator = "Obese";
                    }
                    else if ((pos2SD != null && pos3SD != null) && (weight >= pos2SD.Weight && weight < pos3SD.Weight)) {
                        indicator = "Overweight";
                    }
                }

            } else {

                if (neg3SD != null && weight <= neg3SD.Weight) {
                    indicator = "Severely stunted";
                } else if ((neg2SD != null && neg3SD != null) && weight > neg3SD.Weight && weight <= neg2SD.Weight) {
                    indicator = "Stunted";
                } else if (neg2SD != null && weight > neg2SD.Weight) {
                    indicator = "Normal";
                }
            }

            

            return indicator;
        }
        public List<VisitDataStatus> GetReferralDataForClient(string id, string clientType) {
            List<VisitDataStatus> allReferrals = new List<VisitDataStatus>();

            if (clientType == Constants.GGSettings.client_mother) {
                allReferrals = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == _referral) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            } else {
                allReferrals = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == _referral) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allReferrals;
        }
        public List<VisitDataStatus> GetSummaryDataForClient(string id, string clientType) {
            List<VisitDataStatus> allData = new List<VisitDataStatus>();

            if (clientType == Constants.GGSettings.client_mother) {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == _G9) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }
            else {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == _G9) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allData;
        }
        public List<VisitDataStatus> GetDashboardDataForClient(string id, string clientType) {
            List<VisitDataStatus> allData = new List<VisitDataStatus>();

            if (clientType == Constants.GGSettings.client_mother) {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == _G4) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }
            else {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == _G4) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allData;
        }
        public List<VisitDataStatus> GetProgressDataForClient(string id, string clientType) {
            List<VisitDataStatus> allData = new List<VisitDataStatus>();

            if (clientType == Constants.GGSettings.client_mother) {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == _progress) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }
            else {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == _progress) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allData;
        }
        public Progress_VisitDataStatus GetPreviousVisitInformationForClient(string visitId) {
            var totalGreen = 0;
            var totalRed = 0;
            var totalAmber = 0;
            Progress_VisitDataStatus result = new Progress_VisitDataStatus();

            List<VisitDataStatus> visitDataStatus = new List<VisitDataStatus>();
            visitDataStatus = (
                from visitData in _visitDataRepo.GetAll().Where(x => x.VisitId.ToString() == visitId)
                join visitStatusData in _visitDataStatusRepo.GetAll() on visitData.Id equals visitStatusData.VisitDataId
                select visitStatusData
            ).ToList();

            totalGreen = visitDataStatus.Where(x => x.Color == _green).Count();
            totalRed = visitDataStatus.Where(x => x.Color == _red).Count();
            totalAmber = visitDataStatus.Where(x => x.Color == _amber).Count();

            result.Score = totalGreen.ToString() + " / " + (totalGreen + totalRed + totalAmber).ToString();
            result.VisitDataStatus = visitDataStatus;

            return result;
        }
    
    }
}
