using ECDLink.Abstractrions.Constants;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using static EcdLink.Api.CoreApi.Constants;
using Microsoft.EntityFrameworkCore;

namespace EcdLink.Api.CoreApi.Managers.Visits
{
    public class VisitDataStatusManager : BaseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private VisitManager _visitManager;
        private ApplicationUserManager _userManager;
        
        private INotificationService _notificationService;
        private VisitBackReferralManager _visitBackReferralManager;
        private HierarchyEngine _hierarchyEngine;

        private VisitType _additionalVisitType;
        private Guid _applicationUserId;

        private IGenericRepository<Mother, Guid> _motherRepo;
        private IGenericRepository<Infant, Guid> _infantRepo;
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitData, Guid> _visitDataRepo;
        private IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;
        private IGenericRepository<VisitType, Guid> _visitTypeRepo;
        private IGenericRepository<VisitGrowthDataDay, Guid> _visitGrowthDataDay;
        private IGenericRepository<VisitGrowthDataHeight, Guid> _visitGrowthDataHeight;

        // REMOVE THIS !!!!
        private string _visitId;

        public VisitDataStatusManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitManager visitManager,
            [Service] ApplicationUserManager userManager,
            [Service] INotificationService notificationService,
            VisitBackReferralManager visitBackReferralManager,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _visitManager = visitManager;
            _userManager = userManager;
             _notificationService = notificationService;
            _visitBackReferralManager = visitBackReferralManager;
            _hierarchyEngine = hierarchyEngine;

            _applicationUserId = _applicationUserId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);

            _motherRepo = _repoFactory.CreateGenericRepository<Mother>(userContext: _applicationUserId);
            _infantRepo = _repoFactory.CreateGenericRepository<Infant>(userContext: _applicationUserId);
            _visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            _visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            _visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);
            _visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: _applicationUserId);
            _visitGrowthDataDay = _repoFactory.CreateGenericRepository<VisitGrowthDataDay>(userContext: _applicationUserId);
            _visitGrowthDataHeight = _repoFactory.CreateGenericRepository<VisitGrowthDataHeight>(userContext: _applicationUserId);
        }

        public Boolean ManageVisitDataStatus(string id, string clientType, string visitId)
        {
            // This should not be set as a class level variable, it should be passed through if needed
            _visitId = visitId; 

            var allVisitData = _visitDataRepo.GetAll().Where(x => x.VisitId.ToString() == visitId).ToList();

            // AVAILABLE TYPES -----------
            // ClientDashboardAlert -> G4
            // ClientSummaryDownload -> G9
            // Referral
            // Progress

            if (clientType == GGSettings.client_mother) {
                var mother = _motherRepo.GetAll().Where(x => x.User.Id == Guid.Parse(id)).OrderBy(x => x.Id).FirstOrDefault();

                // add additional visit for when we need to add additional visits for the client
                // TODO - We should not set this as a class level variable
                _additionalVisitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(GGSettings.client_mother) &&
                                                                   x.Name == GGSettings.VisitTypeAdditionalVisit).
                                                                   OrderBy(x => x.NormalizedName).FirstOrDefault();

                ManageVisitDataStatusForMother(allVisitData, mother.User.FirstName, mother.Id.ToString());
            }
            else
            {
                Infant infant = _infantRepo.GetAll().Where(x => x.User.Id == Guid.Parse(id)).OrderBy(x => x.Id).FirstOrDefault();

                var motherName = "";
                if (infant.Mother != null)
                {
                    motherName = infant.Mother.User.FirstName;
                }
                else
                {
                    motherName = infant.Caregiver.FirstName;
                }

                // add additional visit for when we need to add additional visits for the client
                _additionalVisitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(GGSettings.client_child) &&
                                                                   x.Name == GGSettings.VisitTypeAdditionalVisit).
                                                                   OrderBy(x => x.NormalizedName).FirstOrDefault();

                ManageVisitDataStatusForInfant(allVisitData, infant.User.FirstName, infant.Id.ToString(), infant.Gender.Description, infant.User.DateOfBirth, motherName);
            }

            return true;
        }
        private Boolean ManageVisitDataStatusForInfant(List<VisitData> allVisitData, string firstName, string infantId, string gender, DateTime dob, string motherName)
        {

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
            foreach (VisitData vData in allVisitData)
            {
                if (vData.Question == GGSettings.q_postnatal_check_up)
                {
                    if (vData.QuestionAnswer == GGSettings.answer_no)
                    {

                        // referral: add ""Missed clinic visit"" to referrals list
                        comment = GGSettings.infant_missed_clinic_visit;
                        AddVisitDataStatus(vData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                        // progress: amber - ""Missed clinic visit""
                        comment = GGSettings.infant_missed_clinic_visit;
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                        // G9 client summary: amber - ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = GGSettings.infant_missed_clinic_visit_g9;
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, vData.VisitSection, false);

                    }
                    else if (vData.QuestionAnswer == GGSettings.AnswerYes)
                    {

                        // progress: green - ""Up to date with clinic visits""
                        comment = GGSettings.infant_clinic_visit;
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                        // G9 client summary: green - ""You are up to date with clinic visits"""
                        comment = GGSettings.infant_clinic_visit_g9;
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, vData.VisitSection, false);

                    }
                }
                else if (vData.Question == GGSettings.q_postnatal_6_weeks)
                {
                    if (vData.QuestionAnswer == GGSettings.answer_no)
                    {

                        // referral: add ""Missed clinic visit"" to referrals list
                        comment = GGSettings.infant_missed_clinic_visit;
                        AddVisitDataStatus(vData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                        // progress: amber - ""Missed clinic visit""
                        comment = GGSettings.infant_missed_clinic_visit;
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                        // G9 client summary: amber - ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = GGSettings.infant_missed_clinic_visit_g9;
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, vData.VisitSection, false);

                    }
                    else if (vData.QuestionAnswer == GGSettings.AnswerYes)
                    {

                        // progress: green - ""Up to date with clinic visits""
                        comment = GGSettings.infant_clinic_visit;
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                        // G9 client summary: green - ""You are up to date with clinic visits"""
                        comment = GGSettings.infant_clinic_visit_g9;
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, vData.VisitSection, false);

                    }
                }
                else if (vData.VisitName == GGSettings.cfm_name && vData.Question == GGSettings.q_danger_signs)
                {

                    if (vData.QuestionAnswer == GGSettings.none_above)
                    {

                        // Add progress item: ""No danger signs for Lethabo""
                        comment = GGSettings.no_danger_signs + motherName;
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, vData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = GGSettings.physical_feeling_well;
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, vData.VisitSection, true);

                    }
                    else
                    {
                        var arrAnswers = vData.QuestionAnswer.Replace("[", "").Replace("]", "").Split(",");
                        var bulletList = FormatBulletList(arrAnswers);

                        if (arrAnswers.Length > 0)
                        {

                            // Add referral item
                            comment = motherName + GGSettings.was_experiencing + bulletList;
                            AddVisitDataStatus(vData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                            var hasGroupA = arrAnswers.Any(x => x == GGSettings.cfm_ds_6 || x == GGSettings.cfm_ds_7 || x == GGSettings.cfm_ds_8);
                            var hasGroupB = arrAnswers.Any(x => x == GGSettings.cfm_ds_1 || x == GGSettings.cfm_ds_2 || x == GGSettings.cfm_ds_3 ||
                                                                x == GGSettings.cfm_ds_4 || x == GGSettings.cfm_ds_5);

                            // IF danger signs 6, 7, or 8 selected AND no other danger signs selected, add: 
                            if (!hasGroupB && hasGroupA)
                            {
                                comment = motherName + GGSettings.was_experiencing + bulletList;
                                AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                                // Add item to G9 Client summary download - IF danger signs 6, 7, or 8 selected AND no other danger signs selected, add: ""You have some health issues""
                                comment = GGSettings.health_issues;
                                AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, vData.VisitSection, false);
                            }
                            else
                            {
                                //  Red -- IF danger signs 1, 2, 3, 4, or 5 selected, add:
                                comment = motherName + GGSettings.was_experiencing + bulletList;
                                AddVisitDataStatus(vData, comment, StatusColours.Red, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                                // Add G4 secondary alert text: ""Refer to clinic urgently"" if danger signs 1, 2, 3, 4, or 5 selected
                                comment = GGSettings.refer_to_clinic_urgently;
                                AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_dashboard, vData.VisitSection, false);

                                // Add item to G9 Client summary download - IF danger signs 1, 2, 3, 4, or 5 selected, add: ""You need urgent care for some serious health issues""
                                comment = GGSettings.urgent_care;
                                AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, vData.VisitSection, false);
                            }

                            Infant infant = _infantRepo.GetAll().Where(x => x.Id.ToString() == infantId).FirstOrDefault();
                            List<TagsReplacements> replacements = new List<TagsReplacements>();
                            replacements.Add(new TagsReplacements()
                            {
                                FindValue = "FirstName",
                                ReplacementValue = motherName
                            });
                            replacements.Add(new TagsReplacements()
                            {
                                FindValue = "infantId",
                                ReplacementValue = infant.UserId.ToString()
                            });
                            replacements.Add(new TagsReplacements()
                            {
                                FindValue = "DangerSignsList",
                                ReplacementValue = bulletList
                            });
                            var userToSend = _userManager.FindByIdAsync(_applicationUserId).Result;
                            _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferralDangerSignsInfant, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, null, false, false, null);

                            // Add additional visit item with secondary text: ""Danger signs""
                            AddAdditionalVisit(infantId, GGSettings.client_child, GGSettings.danger_signs);
                        }
                    }
                }
                else if (vData.VisitName == GGSettings.cfb_name && vData.Question == GGSettings.q_danger_signs)
                {

                    if (vData.QuestionAnswer == GGSettings.none_above)
                    {
                        // Add progress item: ""No danger signs for Lethabo""
                        comment = GGSettings.no_danger_signs + firstName;
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, vData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = GGSettings.physical_feeling_well;
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, vData.VisitSection, true);
                    }
                    else
                    {
                        var arrAnswers = vData.QuestionAnswer.Replace("[", "").Replace("]", "").Split(",");
                        var bulletList = FormatBulletList(arrAnswers);

                        // If the user chooses any of the danger signs (ie user does not select ""None of the above"")
                        comment = firstName + GGSettings.was_experiencing + bulletList;
                        AddVisitDataStatus(vData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                        // Add red progress item - where X, Y, Z are each of the danger signs selected by the user.
                        comment = firstName + GGSettings.was_experiencing + bulletList;
                        AddVisitDataStatus(vData, comment, StatusColours.Red, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                        // Add additional visit item with secondary text: ""Danger signs""
                        AddAdditionalVisit(infantId, GGSettings.client_child, GGSettings.danger_signs);

                        // Add G4 secondary alert text: ""Refer to clinic urgently""
                        comment = GGSettings.refer_to_clinic_urgently;
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_dashboard, vData.VisitSection, false);

                        // Add item to G9 Client summary download ""You need urgent care for some serious health issues""
                        comment = GGSettings.urgent_care;
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, vData.VisitSection, false);

                        Infant infant = _infantRepo.GetAll().Where(x => x.Id.ToString() == infantId).FirstOrDefault();
                        List<TagsReplacements> replacements = new List<TagsReplacements>();
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "FirstName",
                            ReplacementValue = firstName
                        });
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "infantId",
                            ReplacementValue = infant.UserId.ToString()
                        });
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "DangerSignsList",
                            ReplacementValue = bulletList
                        });

                        var userToSend = _userManager.FindByIdAsync(_applicationUserId).Result;
                        _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferralDangerSignsInfant, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, null, false, false, null);
                    }
                }
                else if (vData.Question == GGSettings.q_stop_worry ||
                         vData.Question == GGSettings.q_felt_down ||
                         vData.Question == GGSettings.q_suicide)
                {
                    maternalDistressScreening.Add(vData);
                }
                else if (vData.Question == GGSettings.QuestionWeight)
                {

                    previousVisitWeight = (
                         from visit in _visitRepo.GetAll().Where(x => x.InfantId.ToString() == infantId && x.Attended == true).OrderBy(x => x.InsertedDate)
                         join visitData in _visitDataRepo.GetAll().Where(y => y.Question == GGSettings.QuestionWeight) on visit.Id equals visitData.VisitId
                         select visitData.QuestionAnswer
                     ).LastOrDefault();
                    if (previousVisitWeight == null)
                    {
                        previousVisitWeight = "0";
                    }

                    growthData.Add(vData);
                }
                else if (vData.Question == GGSettings.QuestionLength)
                {
                    growthData.Add(vData);
                }
                else if (vData.Question == GGSettings.QuestionMUAC)
                {
                    growthData.Add(vData);
                }
                else if (vData.Question == GGSettings.q_eat_drink)
                {
                    feedingData.Add(vData);
                }
                else if (vData.Question == GGSettings.q_breastfeeding_club)
                {

                    if (vData.QuestionAnswer == GGSettings.AnswerYes)
                    {
                        // Progress: under the green - ""Breast milk only"" item, add amber text ""Needs support with breastfeeding"" (see in context of progress screen in G3.8)"
                        comment = GGSettings.breast_milk_only;
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, vData.VisitSection, false);
                    }

                }
                else if (vData.Question == GGSettings.q_eat_drink_nutrition)
                {

                    var total_food_groups = 8;
                    if (totalMonthsOld >= 6 && totalMonthsOld < 9)
                    {
                        total_food_groups = 8;
                    }
                    else if (totalMonthsOld >= 9)
                    {
                        total_food_groups = 7;
                    }

                    var answers = 0;
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_1) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_2) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_3) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_4) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_5) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_6) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_7) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_8) != -1)
                    {
                        answers++;
                    }

                    if (answers >= 1 && answers < 4)
                    {
                        // Progress: red - ""Poor dietary diversity: X out of 8 food groups"", where X = the number of items selected(1, 2, or 3)
                        comment = GGSettings.poor_dietary_diversity.Replace("{x}", answers.ToString()).Replace("{y}", total_food_groups.ToString());
                        AddVisitDataStatus(vData, comment, StatusColours.Red, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                        // G9 Client summary download: red - ""You are giving Themba foods from X out of 8 groups. Try to give Themba a variety of foods!"",  where X = the number of items selected (1, 2, or 3)
                        comment = GGSettings.give_client_food.Replace("{client}", firstName).Replace("{x}", answers.ToString()).Replace("{y}", total_food_groups.ToString());
                        AddVisitDataStatus(vData, comment, StatusColours.Red, GGSettings.visit_data_client_summary, vData.VisitSection, false);

                    }
                    else if (answers == 4)
                    {

                        // Progress: ""Poor dietary diversity: 4 out of 8 food groups""
                        comment = GGSettings.poor_dietary_diversity.Replace("{x}", answers.ToString()).Replace("{y}", total_food_groups.ToString());
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                        // G9 Client summary: ""You are giving Themba foods from 4 out of 8 groups. Try to give Themba a variety of foods!""
                        comment = GGSettings.give_client_food.Replace("{client}", firstName).Replace("{x}", answers.ToString()).Replace("{y}", total_food_groups.ToString());
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, vData.VisitSection, false);

                    }
                    else if (answers >= 5 && answers <= 8)
                    {
                        // Progress: ""Good dietary diversity: X out of 8 food groups!"", where X = the number of items selected (5, 6, 7, 8)
                        comment = GGSettings.good_dietary_diversity.Replace("{x}", answers.ToString()).Replace("{y}", total_food_groups.ToString());
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                        // G9 Client summary: ""You are giving Themba foods from most of the groups!""
                        comment = GGSettings.give_client_food_most.Replace("{client}", firstName);
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, vData.VisitSection, false);
                    }
                }
                else if (vData.Question == GGSettings.q_hearing1 ||
                        vData.Question == GGSettings.q_hearing2 ||
                        vData.Question == GGSettings.q_hearing3 ||
                        vData.Question == GGSettings.q_hearing4 ||
                        vData.Question == GGSettings.q_hearing5 ||
                        vData.Question == GGSettings.q_hearing6 ||
                        vData.Question == GGSettings.q_hearing7 ||
                        vData.Question == GGSettings.q_hearing8 ||
                        vData.Question == GGSettings.q_hearing9 ||
                        vData.Question == GGSettings.q_seeing1 ||
                        vData.Question == GGSettings.q_seeing2 ||
                        vData.Question == GGSettings.q_seeing3 ||
                        vData.Question == GGSettings.q_seeing4 ||
                        vData.Question == GGSettings.q_seeing5 ||
                        vData.Question == GGSettings.q_seeing6 ||
                        vData.Question == GGSettings.q_seeing7 ||
                        vData.Question == GGSettings.q_brain1 ||
                        vData.Question == GGSettings.q_brain2 ||
                        vData.Question == GGSettings.q_brain3 ||
                        vData.Question == GGSettings.q_brain4 ||
                        vData.Question == GGSettings.q_brain5 ||
                        vData.Question == GGSettings.q_brain6 ||
                        vData.Question == GGSettings.q_brain7 ||
                        vData.Question == GGSettings.q_moving1 ||
                        vData.Question == GGSettings.q_moving2 ||
                        vData.Question == GGSettings.q_moving3 ||
                        vData.Question == GGSettings.q_moving4 ||
                        vData.Question == GGSettings.q_moving5 ||
                        vData.Question == GGSettings.q_moving6 ||
                        vData.Question == GGSettings.q_moving7)
                {
                    if (vData.QuestionAnswer == GGSettings.answer_no)
                    {
                        developmentScreening.Add(vData);
                    }
                }
                else if (vData.Question == GGSettings.q_immunisation ||
                            vData.Question == GGSettings.QuestionVitaminA ||
                            vData.Question == GGSettings.QuestionDeworming)
                {
                    immunisationsData.Add(vData);

                }
                else if (vData.VisitName == GGSettings.p4_name && vData.Question == GGSettings.q_danger_signs)
                {

                    var answers = 0;
                    var names = "";
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p4_ds_1) != -1)
                    {
                        answers++;
                        names = names + "<li>" + GGSettings.p4_ds_1 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p4_ds_2) != -1)
                    {
                        answers++;
                        names = names + "<li>" + GGSettings.p4_ds_2 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p4_ds_3) != -1)
                    {
                        answers++;
                        names = names + "<li>" + GGSettings.p4_ds_3 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p4_ds_4) != -1)
                    {
                        answers++;
                        names = names + "<li>" + GGSettings.p4_ds_4 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p4_ds_5) != -1)
                    {
                        answers++;
                        names = names + "<li>" + GGSettings.p4_ds_5 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p4_ds_6) != -1)
                    {
                        answers++;
                        names = names + "<li>" + GGSettings.p4_ds_6 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p4_ds_7) != -1)
                    {
                        answers++;
                        names = names + "<li>" + GGSettings.p4_ds_7 + "</li>";
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p4_ds_8) != -1)
                    {
                        answers++;
                        names = names + "<li>" + GGSettings.p4_ds_8 + "</li>";
                    }

                    if (answers > 1)
                    {
                        // If any danger signs selected, add referral item: ""Themba was experiencing: * X *Y"" 
                        comment = firstName + GGSettings.was_experiencing + names;
                        AddVisitDataStatus(vData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                        // if one or more danger signs selected - red, ""Themba was experiencing: * X *Y""
                        comment = firstName + GGSettings.was_experiencing + names;
                        AddVisitDataStatus(vData, comment, StatusColours.Red, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                        // Add additional visit item with secondary text: ""Danger signs""
                        AddAdditionalVisit(infantId, GGSettings.client_child, GGSettings.danger_signs);

                        // Add G4 secondary alert text: ""Refer to clinic urgently""
                        comment = GGSettings.refer_to_clinic_urgently;
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_dashboard, vData.VisitSection, false);

                        // Add item to G9 Client summary download "Themba needs urgent care for some serious health issues""
                        comment = GGSettings.urgent_care;
                        AddVisitDataStatus(vData, comment, StatusColours.Red, GGSettings.visit_data_client_summary, vData.VisitSection, false);

                    }
                    else if (answers == 0)
                    {
                        if (vData.QuestionAnswer == GGSettings.none_above)
                        {
                            // if ""None of the above"" selected - green, ""No danger signs for Themba""
                            comment = GGSettings.none_above;
                            AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                            // Add item to G9 Client summary download""Themba is doing well physically!""
                            comment = firstName + GGSettings.physical_well;
                            AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, vData.VisitSection, false);
                        }
                    }
                }
                else if (vData.Question == GGSettings.q_birth_certificate)
                {

                    if (vData.QuestionAnswer == GGSettings.answer_no)
                    {
                        // Add referral under ""Home Affairs referrals"" = ""Themba does not have a birth certificate""
                        comment = firstName + GGSettings.no_birth_certificate;
                        AddVisitDataStatus(vData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.home_affairs_referrals, false);

                        // Add G4 secondary alert text: ""Refer to home affairs""
                        comment = GGSettings.home_affairs_referrals;
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_dashboard, vData.VisitSection, false);
                    }
                }
                else if (vData.Question == GGSettings.QuestionReceivingCSG)
                {

                    if (vData.QuestionAnswer == GGSettings.AnswerYes)
                    {

                        // green, ""Has applied for a child support grant""
                        comment = GGSettings.has_csg;
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, vData.VisitSection, false);

                        // G9 Client summary green, ""You applied for the child support grant - this will support Themba's healthy growth!"""
                        comment = GGSettings.has_csg2.Replace("{client}", firstName);
                        AddVisitDataStatus(vData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, vData.VisitSection, false);
                    }
                }
                else if (vData.Question == GGSettings.q_csg_not_applied)
                {
                    if (!string.IsNullOrWhiteSpace(vData.QuestionAnswer))
                    {
                        comment = GGSettings.has_csg3;
                        AddVisitDataStatus(vData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.sassa_refferals, false);

                        comment = GGSettings.has_csg3;
                        AddVisitDataStatus(vData, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, vData.VisitSection, false);
                    }
                }
            }

            if (maternalDistressScreening.Count > 0)
            {
                ManageMaternalDistressScreening(maternalDistressScreening, motherName, infantId, GGSettings.client_child);
            }

            if (growthData.Count > 0)
            {
                ManageGrowthData(growthData, firstName, infantId, gender, totalMonthsOld, totalDaysOld, previousVisitWeight);
            }

            if (feedingData.Count > 0)
            {
                ManageFeedingData(feedingData, firstName, infantId);
            }

            if (developmentScreening.Count > 0)
            {
                ManageDevelopmentScreeningData(developmentScreening, firstName, infantId);
            }

            if (immunisationsData.Count > 0)
            {
                ManageImmunisationData(immunisationsData, firstName, infantId);
            }

            return true;
        }
        private Boolean ManageVisitDataStatusForMother(List<VisitData> allVisitData, string firstName, string motherId)
        {
            var maternalDistressScreening = new List<VisitData>();
            var alcoholUse = new List<VisitData>();
            var idDocs = new List<VisitData>();
            var comment = "";

            // loop through data and add status data
            foreach (VisitData visitData in allVisitData)
            {
                if (visitData.Question == GGSettings.q_first_antenatal_visit)
                {
                    if (visitData.QuestionAnswer == GGSettings.answer_no)
                    {

                        // this should add a referral to the list(""Pregnancy not booked"")
                        comment = GGSettings.pregnancy_not_booked;
                        AddVisitDataStatus(visitData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                        // add an ""amber"" item to the progress list: ""Pregnancy not booked"".
                        comment = GGSettings.pregnancy_not_booked;
                        AddVisitDataStatus(visitData, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, visitData.VisitSection, false);

                        // add flag to G4 secondary alert: red alert, ""Refer to clinic""
                        comment = GGSettings.refer_to_clinic;
                        AddVisitDataStatus(visitData, comment, StatusColours.Red, GGSettings.visit_data_client_dashboard, visitData.VisitSection, false);

                        // add amber item to G9 client download summary: ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = GGSettings.missed_clinic_visit;
                        AddVisitDataStatus(visitData, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, visitData.VisitSection, false);
                    }

                    if (visitData.QuestionAnswer == GGSettings.AnswerYes)
                    {
                        // a ""green"" item is added to the client progress list ""Pregnancy booked""
                        comment = GGSettings.pregnancy_booked;
                        AddVisitDataStatus(visitData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, visitData.VisitSection, true);

                        // a green item is added to G9 client download summary ""You are up to date with your clinic visits!""
                        comment = GGSettings.clinic_visits_up_to_date_2;
                        AddVisitDataStatus(visitData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, visitData.VisitSection, true);
                    }
                }
                else if (visitData.Question == GGSettings.q_antenatal_visits)
                {
                    if (visitData.QuestionAnswer == GGSettings.answer_no)
                    {
                        // add an ""amber"" item to the progress: ""Clinic visits not up to date""
                        comment = GGSettings.clinic_visits_not_up_to_date;
                        AddVisitDataStatus(visitData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                        // add an ""amber"" item to the progress list: Clinic visits not up to date.
                        comment = GGSettings.clinic_visits_not_up_to_date;
                        AddVisitDataStatus(visitData, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, visitData.VisitSection, false);

                        // add G4 secondary text red alert ""Refer to clinic""
                        comment = GGSettings.refer_to_clinic;
                        AddVisitDataStatus(visitData, comment, StatusColours.Red, GGSettings.visit_data_client_dashboard, visitData.VisitSection, false);

                        // add amber item to G9 client download summary: ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = GGSettings.missed_clinic_visit;
                        AddVisitDataStatus(visitData, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, visitData.VisitSection, false);
                    }
                    if (visitData.QuestionAnswer == GGSettings.AnswerYes)
                    {
                        // ""green"" item is added to the progress: "Clinic visits up to date"
                        comment = GGSettings.clinic_visits_up_to_date;
                        AddVisitDataStatus(visitData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, visitData.VisitSection, true);

                        // add green item to G9 client download summary "You are up to date with your clinic visits!"
                        comment = GGSettings.all_clinic_visit;
                        AddVisitDataStatus(visitData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, visitData.VisitSection, true);

                    }
                }
                else if (visitData.Question == GGSettings.q_measurement)
                {
                    var questionAnswer = visitData.QuestionAnswer != "undefined" ? Int32.Parse(visitData.QuestionAnswer) : 0;

                    if (questionAnswer < 22)
                    {
                        // add to referrals items list(""May be underweight - MUAC less than 22cm"") red
                        comment = GGSettings.underweight;
                        AddVisitDataStatus(visitData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                        // add to red items in progress screen(use case 2) (""May be underweight - MUAC less than 22cm"")
                        comment = GGSettings.underweight;
                        AddVisitDataStatus(visitData, comment, StatusColours.Red, GGSettings.visit_data_client_progress, visitData.VisitSection, false);

                        // add G4 secondary text item: ""Refer to clinic urgently""(this is the highest - priority item & will be shown)
                        comment = GGSettings.refer_to_clinic_urgently;
                        AddVisitDataStatus(visitData, comment, StatusColours.Red, GGSettings.visit_data_client_dashboard, visitData.VisitSection, false);

                        // add green item to G9 client summary: ""You might be underweight: eat 3 meals every day""
                        comment = GGSettings.underweight2;
                        AddVisitDataStatus(visitData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, visitData.VisitSection, false);

                        // add additional visit item with ""Underweight"" secondary text -please see G3.7 Other / Additional visits
                        AddAdditionalVisit(motherId, GGSettings.client_mother, GGSettings.underweight3);
                    }
                    if (questionAnswer >= 22)
                    {
                        // add to green items in progress screen(use case 2) (""MUAC over 22cm"")TenancyMiddleware.cs
                        comment = GGSettings.muac_over_22;
                        AddVisitDataStatus(visitData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, visitData.VisitSection, true);

                        // add green item to G9 client summary: ""According to your mid-upper arm circumference, you are a healthy weight""
                        comment = GGSettings.healthy_weight;
                        AddVisitDataStatus(visitData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, visitData.VisitSection, true);
                    }
                }
                else if (visitData.Question == GGSettings.q_stop_worry ||
                         visitData.Question == GGSettings.q_felt_down ||
                         visitData.Question == GGSettings.q_suicide)
                {
                    maternalDistressScreening.Add(visitData);
                }
                else if (visitData.Question == GGSettings.q_T ||
                    visitData.Question == GGSettings.q_A ||
                    visitData.Question == GGSettings.q_C ||
                    visitData.Question == GGSettings.q_E)
                {
                    alcoholUse.Add(visitData);
                }
                else if (visitData.Question == GGSettings.q_ID_doc || visitData.Question == GGSettings.q_citizen)
                {
                    idDocs.Add(visitData);
                }
                else if (visitData.Question == GGSettings.q_danger_signs)
                {

                    if (visitData.QuestionAnswer == GGSettings.none_above)
                    {
                        // Add progress item: ""No danger signs for Lethabo""
                        comment = GGSettings.no_danger_signs + firstName;
                        AddVisitDataStatus(visitData, comment, StatusColours.Green, GGSettings.visit_data_client_progress, visitData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = GGSettings.physical_feeling_well;
                        AddVisitDataStatus(visitData, comment, StatusColours.Green, GGSettings.visit_data_client_summary, visitData.VisitSection, true);
                    }
                    else
                    {
                        var arrAnswers = visitData.QuestionAnswer.Replace("[", "").Replace("]", "").Split(",");
                        var bulletList = FormatBulletList(arrAnswers);
                        // If the user chooses any of the danger signs (ie user does not select ""None of the above"")
                        comment = firstName + GGSettings.was_experiencing + bulletList;
                        AddVisitDataStatus(visitData, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                        // Add red progress item - where X, Y, Z are each of the danger signs selected by the user.
                        comment = firstName + GGSettings.was_experiencing + bulletList;
                        AddVisitDataStatus(visitData, comment, StatusColours.Red, GGSettings.visit_data_client_progress, visitData.VisitSection, false);

                        // Add additional visit item with secondary text: ""Danger signs""
                        AddAdditionalVisit(motherId, GGSettings.client_mother, GGSettings.danger_signs);

                        // Add G4 secondary alert text: ""Refer to clinic urgently""
                        comment = GGSettings.refer_to_clinic_urgently;
                        AddVisitDataStatus(visitData, comment, StatusColours.Amber, GGSettings.visit_data_client_dashboard, visitData.VisitSection, false);

                        // Add item to G9 Client summary download ""You need urgent care for some serious health issues""
                        comment = GGSettings.urgent_care;
                        AddVisitDataStatus(visitData, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, visitData.VisitSection, false);

                        Mother mother = _motherRepo.GetAll().Where(x => x.Id.ToString() == motherId).FirstOrDefault();
                        List<TagsReplacements> replacements = new List<TagsReplacements>();
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "FirstName",
                            ReplacementValue = firstName
                        });
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "motherId",
                            ReplacementValue = mother.UserId.ToString()
                        });
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "DangerSignsList",
                            ReplacementValue = bulletList
                        });
                        var userToSend = _userManager.FindByIdAsync(_applicationUserId).Result;
                        _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferralDangerSignsMother, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements);
                    }
                }
            }

            // Manage Maternal Distress Screening
            if (maternalDistressScreening.Count > 0)
            {
                ManageMaternalDistressScreening(maternalDistressScreening, firstName, motherId, GGSettings.client_mother);
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
        private Boolean ManageMaternalDistressScreening(List<VisitData> maternalDistressScreening, string firstName, string clientId, string clientType)
        {
            var comment = "";

            var q1 = maternalDistressScreening.Where(x => x.Question == GGSettings.q_stop_worry).OrderBy(x => x.Id).FirstOrDefault();
            var q2 = maternalDistressScreening.Where(x => x.Question == GGSettings.q_felt_down).OrderBy(x => x.Id).FirstOrDefault();
            var q3 = maternalDistressScreening.Where(x => x.Question == GGSettings.q_suicide).OrderBy(x => x.Id).FirstOrDefault();

            // a GGSettings.answer_yes response to the 3rd question trumps all.
            if (q3.QuestionAnswer == GGSettings.AnswerYes)
            {
                comment = firstName + GGSettings.maternal_distress;
                AddVisitDataStatus(q3, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                // add to amber items in progress screen(use case 2)(""Lethabo was experiencing maternal distress"")
                comment = firstName + GGSettings.maternal_distress;
                AddVisitDataStatus(q3, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, q3.VisitSection, false);

                AddAdditionalVisit(clientId, clientType, GGSettings.maternal_distress2);

                // add G4 secondary text item: Amber - ""Refer to clinic""
                comment = GGSettings.refer_to_clinic;
                AddVisitDataStatus(q3, comment, StatusColours.Amber, GGSettings.visit_data_client_dashboard, q3.VisitSection, false);

                // add amber item to G9 client summary: ""You are struggling and need some support""
                comment = GGSettings.need_support;
                AddVisitDataStatus(q3, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, q3.VisitSection, false);

                Mother mother = _motherRepo.GetAll().Where(x => x.Id.ToString() == clientId).FirstOrDefault();
                List<TagsReplacements> replacements = new List<TagsReplacements>();
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "ClientFirstName",
                    ReplacementValue = firstName
                 });
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "motherId",
                    ReplacementValue = mother.UserId.ToString()
                });
                var userToSend = _userManager.FindByIdAsync(_applicationUserId).Result;
                _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGRedAlertMaternalDistress, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
            }
            else
            {
                if (q3.QuestionAnswer == GGSettings.answer_no && (q1.QuestionAnswer == GGSettings.AnswerYes || q2.QuestionAnswer == GGSettings.AnswerYes))
                {
                    comment = firstName + GGSettings.maternal_distress;
                    AddVisitDataStatus(q3, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                    comment = firstName + GGSettings.maternal_distress;
                    AddVisitDataStatus(q3, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, q3.VisitSection, false);

                    AddAdditionalVisit(clientId, clientType, GGSettings.maternal_distress2);

                    // add amber item to G9 client summary: ""You are struggling and need some support""
                    comment = GGSettings.need_support;
                    AddVisitDataStatus(q3, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, q3.VisitSection, false);
                }

                if (q3.QuestionAnswer == GGSettings.answer_no && q1.QuestionAnswer == GGSettings.answer_no && q2.QuestionAnswer == GGSettings.answer_no)
                {
                    // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                    comment = firstName + GGSettings.was_coping;
                    AddVisitDataStatus(q3, comment, StatusColours.Green, GGSettings.visit_data_client_progress, q3.VisitSection, true);

                    //add green item to G9 client summary: You are coping well!
                    comment = GGSettings.coping_well;
                    AddVisitDataStatus(q3, comment, StatusColours.Green, GGSettings.visit_data_client_summary, q3.VisitSection, true);
                }
                if (q3.QuestionAnswer == GGSettings.answer_no) {
                    _notificationService.ExpireNotificationsTypesForUser(_applicationUserId.ToString(), TemplateTypeConstants.GGRedAlertMaternalDistress);
                }
            }
            return true;
        }
        private Boolean ManageAlcoholUse(List<VisitData> alcoholUse, string firstName, string motherId)
        {
            var comment = "";
            var score = 0;

            var q1 = alcoholUse.Where(x => x.Question == GGSettings.q_T).OrderBy(x => x.Id).FirstOrDefault();
            var q2 = alcoholUse.Where(x => x.Question == GGSettings.q_A).OrderBy(x => x.Id).FirstOrDefault();
            var q3 = alcoholUse.Where(x => x.Question == GGSettings.q_C).OrderBy(x => x.Id).FirstOrDefault();
            var q4 = alcoholUse.Where(x => x.Question == GGSettings.q_E).OrderBy(x => x.Id).FirstOrDefault();

            if (q1.QuestionAnswer == GGSettings.more_than_2)
            {
                score++;
                score++;
            }
            if (q2.QuestionAnswer == GGSettings.AnswerYes)
            {
                score++;
            }
            if (q3.QuestionAnswer == GGSettings.AnswerYes)
            {
                score++;
            }
            if (q4.QuestionAnswer == GGSettings.AnswerYes)
            {
                score++;
            }

            // If T-ACE score is 2 or more:
            if (score >= 2)
            {
                // IF this is not already unchecked in the referrals list for this client; add to referrals items list (""Lethabo is at risk of a drinking problem (T-ACE score = X)"", where X = the T-ACE score calculated)
                comment = firstName + GGSettings.t_ace_score + score + ")";
                AddVisitDataStatus(q1, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

                // add to red items in progress screen (use case 2) (""Lethabo is at risk of a drinking problem (T-ACE score = X)"", where X = the T-ACE score calculated)
                comment = firstName + GGSettings.t_ace_score + score + ")";
                AddVisitDataStatus(q1, comment, StatusColours.Red, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                // add G4 secondary text item: Red - ""Refer to clinic urgently""
                comment = GGSettings.refer_to_clinic_urgently;
                AddVisitDataStatus(q1, comment, StatusColours.Red, GGSettings.visit_data_client_dashboard, q1.VisitSection, false);

                // add amber item to G9 client summary: ""You may need support to reduce your drinking""
                comment = GGSettings.support_drinking;
                AddVisitDataStatus(q1, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, q1.VisitSection, false);
            }
            else if (score > 0 && score < 2)
            {
                // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                comment = firstName + GGSettings.no_alcohol_abuse;
                AddVisitDataStatus(q1, comment, StatusColours.Green, GGSettings.visit_data_client_progress, q1.VisitSection, true);

            }
            return true;
        }
        private Boolean ManageIdDocs(List<VisitData> idDocs, string firstName)
        {
            var comment = "";

            var q1 = idDocs.Where(x => x.Question == GGSettings.q_ID_doc).OrderBy(x => x.Id).FirstOrDefault();
            var q2 = idDocs.Where(x => x.Question == GGSettings.q_citizen).OrderBy(x => x.Id).FirstOrDefault();

            if (q1.QuestionAnswer == GGSettings.answer_no && q2.QuestionAnswer == GGSettings.AnswerYes)
            {
                // IF this is not already unchecked in the referrals list for this client; add to referrals items list under Department of Home Affairs referrals(""Lethabo doesn't have an ID book)
                comment = firstName + GGSettings.no_id_book;
                AddVisitDataStatus(q1, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.home_affairs_referrals, false);

                // add to amber items in progress screen(""Lethabo doesn't have an ID book"")
                comment = firstName + GGSettings.no_id_book;
                AddVisitDataStatus(q1, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                // add amber item to G9 client summary: ""Go to Home Affairs to apply for your ID book.This will allow you to apply for the child social grant as soon as the baby is born.""
                comment = GGSettings.go_to_home_affairs;
                AddVisitDataStatus(q1, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, q1.VisitSection, false);
            }

            if (q1.QuestionAnswer == GGSettings.AnswerYes)
            {
                // add to green items in progress screen(use case 2)(""Lethabo has an ID book"")
                comment = firstName + GGSettings.id_book;
                AddVisitDataStatus(q1, comment, StatusColours.Green, GGSettings.visit_data_client_progress, q1.VisitSection, true);

                // add green item to G9 client summary: ""You have your ID document & can apply for a child social grant once the baby is born!""
                comment = GGSettings.apply_social_grant;
                AddVisitDataStatus(q1, comment, StatusColours.Green, GGSettings.visit_data_client_summary, q1.VisitSection, true);
            }
            return true;
        }
        private Boolean ManageGrowthData(List<VisitData> growthData, string firstName, string infantId, string gender, int totalMonthsOld, double totalDaysOld, string previousVisitWeight)
        {
            var comment = "";

            var wIndicator = "Normal";
            var lIndicator = "Normal";
            var mIndicator = "Normal";

            var wColor = "";
            var lColor = "";
            var mColor = "";

            var q1 = growthData.Where(x => x.Question == GGSettings.QuestionWeight && x.VisitName != GGSettings.CareForBaby).OrderBy(x => x.Id).FirstOrDefault();
            var q2 = growthData.Where(x => x.Question == GGSettings.QuestionLength && x.VisitName != GGSettings.CareForBaby).OrderBy(x => x.Id).FirstOrDefault();
            var q3 = growthData.Where(x => x.Question == GGSettings.QuestionMUAC).OrderBy(x => x.Id).FirstOrDefault();

            if (q1 != null && q1.Question == GGSettings.QuestionWeight)
            {

                var _weight = q1.QuestionAnswer != "undefined" && q1.QuestionAnswer != "" ? double.Parse(q1.QuestionAnswer, CultureInfo.InvariantCulture) : 0.0;
                var _height = q2 != null && q2.QuestionAnswer != "undefined" && q2.QuestionAnswer != "" ? double.Parse(q2.QuestionAnswer, CultureInfo.InvariantCulture) : 0.0;
                var _prevWeight = 0.0;
                if (previousVisitWeight != "undefined" && previousVisitWeight != "")
                {
                    _prevWeight = double.Parse(previousVisitWeight, CultureInfo.InvariantCulture);
                }

                Boolean weightIncreased = _weight >= _prevWeight;
                wIndicator = GetHeightWeightIndicator(true, totalDaysOld, _weight, _height, gender, weightIncreased);

                if (totalDaysOld < 7 && _prevWeight == 0 && _weight < 2.5)
                {
                    wIndicator = "Low birth weight";
                    wColor = StatusColours.Amber;

                    // Is this meant to save any data?
                }
                else if (totalDaysOld < 7 && _prevWeight == 0 && _weight >= 2.5)
                {
                    wIndicator = "Normal";
                    wColor = StatusColours.Green;

                    // Is this meant to save any data?
                }
                else
                {
                    if (wIndicator == "Severely underweight")
                    {
                        wColor = StatusColours.Red;

                        // Red progress
                        comment = GGSettings.severely_underweight;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, GGSettings.client_child, GGSettings.severely_underweight);

                        // Red G4
                        comment = GGSettings.refer_to_clinic_urgently;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_dashboard, GGSettings.refer_to_clinic_urgently, false);
                    }
                    else if (wIndicator == "Underweight")
                    {
                        wColor = StatusColours.Amber;

                        // Amber progress
                        comment = wIndicator;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, GGSettings.client_child, wIndicator);

                        // Amber G4
                        comment = GGSettings.refer_to_clinic;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_dashboard, GGSettings.refer_to_clinic, false);
                    }
                    else if (wIndicator == "Growth faltering" && !weightIncreased)
                    {
                        wColor = StatusColours.Amber;

                        // Amber progress
                        comment = GGSettings.growth_faltering;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, GGSettings.client_child, wIndicator);

                        // Amber G4
                        comment = GGSettings.refer_to_clinic;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_dashboard, GGSettings.refer_to_clinic, false);
                    }
                    else if (wIndicator == "Obese")
                    {
                        wColor = StatusColours.Amber;

                        // Amber progress
                        comment = wIndicator;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, GGSettings.client_child, wIndicator);

                        // Amber G4
                        comment = GGSettings.refer_to_clinic;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_dashboard, GGSettings.refer_to_clinic, false);
                    }
                    else if (wIndicator == "Overweight")
                    {
                        wColor = StatusColours.Amber;

                        // Amber progress
                        comment = wIndicator;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                        // additional visit
                        AddAdditionalVisit(infantId, GGSettings.client_child, wIndicator);

                        // Amber G4
                        comment = GGSettings.refer_to_clinic;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_dashboard, GGSettings.refer_to_clinic, false);
                    }
                    else if (wIndicator == "Normal" && weightIncreased)
                    {
                        wColor = StatusColours.Green;

                        // Green progress
                        comment = wIndicator;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                        // Green G4 
                        comment = firstName + GGSettings.growing_well;
                        AddVisitDataStatus(q1, comment, wColor, GGSettings.visit_data_client_dashboard, q1.VisitSection, false);
                    }
                }
            }

            if (q2 != null && q2.Question == GGSettings.QuestionLength)
            {

                var _weight = q1.QuestionAnswer != "undefined" && q1.QuestionAnswer != "" ? double.Parse(q1.QuestionAnswer, CultureInfo.InvariantCulture) : 0.0;
                var _height = q2.QuestionAnswer != "undefined" && q2.QuestionAnswer != "" ? double.Parse(q2.QuestionAnswer, CultureInfo.InvariantCulture) : 0.0;

                lIndicator = GetHeightWeightIndicator(false, totalDaysOld, _weight, _height, gender, false);

                if (lIndicator == "Severely stunted")
                {
                    lColor = StatusColours.Red;

                    // Red progress
                    comment = lIndicator;
                    AddVisitDataStatus(q2, comment, lColor, GGSettings.visit_data_client_progress, q2.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, GGSettings.client_child, lIndicator);

                    // Red G4
                    comment = GGSettings.refer_to_clinic_urgently;
                    AddVisitDataStatus(q2, comment, lColor, GGSettings.visit_data_client_dashboard, GGSettings.refer_to_clinic_urgently, false);

                }
                else if (lIndicator == "Stunted")
                {
                    lColor = StatusColours.Amber;

                    // Amber progress
                    comment = lIndicator;
                    AddVisitDataStatus(q2, comment, lColor, GGSettings.visit_data_client_progress, q2.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, GGSettings.client_child, lIndicator);

                    // Amber G4
                    comment = GGSettings.refer_to_clinic;
                    AddVisitDataStatus(q2, comment, lColor, GGSettings.visit_data_client_dashboard, GGSettings.refer_to_clinic, false);

                }
                else if (lIndicator == "Normal")
                {
                    lColor = StatusColours.Green;

                    // Green progress
                    comment = lIndicator;
                    AddVisitDataStatus(q2, comment, lColor, GGSettings.visit_data_client_progress, q2.VisitSection, false);
                }
            }

            if (q3 != null && q3.Question == GGSettings.QuestionMUAC)
            {
                var questionAnswer = q3.QuestionAnswer != "undefined" ? Int32.Parse(q3.QuestionAnswer) : 0;
                mIndicator = "Normal";
                if (questionAnswer < 11.5)
                {
                    mIndicator = GGSettings.severe_acute_malnutrition;
                    mColor = StatusColours.Red;

                    // Red progress
                    AddVisitDataStatus(q3, mIndicator, mColor, GGSettings.visit_data_client_progress, q3.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, GGSettings.client_child, GGSettings.severe_acute_malnutrition);

                    // Red G4
                    comment = GGSettings.refer_to_clinic_urgently;
                    AddVisitDataStatus(q3, comment, mColor, GGSettings.visit_data_client_dashboard, GGSettings.refer_to_clinic_urgently, false);


                }
                else if (questionAnswer >= 11.5 && questionAnswer < 12.5)
                {
                    mIndicator = GGSettings.moderate_acute_malnutrition;
                    mColor = StatusColours.Amber;

                    // Amber progress
                    AddVisitDataStatus(q3, mIndicator, mColor, GGSettings.visit_data_client_progress, q3.VisitSection, false);

                    // additional visit
                    AddAdditionalVisit(infantId, GGSettings.client_child, GGSettings.moderate_acute_malnutrition);

                    // Amber G4
                    comment = GGSettings.refer_to_clinic_urgently;
                    AddVisitDataStatus(q3, comment, mColor, GGSettings.visit_data_client_dashboard, GGSettings.refer_to_clinic_urgently, false);

                }
                else if (questionAnswer >= 12.5)
                {
                    mIndicator = "Normal";
                    mColor = StatusColours.Green;

                    // Green progress
                    AddVisitDataStatus(q3, mIndicator, mColor, GGSettings.visit_data_client_progress, q3.VisitSection, false);
                }
            }

            // REFERRALS && G9 FOR ALL
            if (wIndicator != "Normal" || lIndicator != "Normal" || mIndicator != "Normal")
            {
                // Referrals
                comment = firstName + GGSettings.growth_referral;
                if (wIndicator != "Normal")
                {
                    comment += "<li>" + wIndicator + "</li>";
                }
                if (lIndicator != "Normal")
                {
                    comment += "<li>" + lIndicator + "</li>";
                }
                if (mIndicator != "Normal")
                {
                    comment += "<li>" + mIndicator + "</li>";
                }
                AddVisitDataStatus(q1, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);
            }

            if (wColor == StatusColours.Green && lColor == StatusColours.Green && mColor == StatusColours.Green)
            {
                // add green item to G9 client summary: ""Themba is growing well""
                comment = firstName + GGSettings.growing_well;
                AddVisitDataStatus(q3, comment, StatusColours.Green, GGSettings.visit_data_client_summary, GGSettings.growth_section, false);

                // Green G4 
                comment = firstName + GGSettings.growing_well;
                AddVisitDataStatus(q3, comment, mColor, GGSettings.visit_data_client_dashboard, q3.VisitSection, false);
            }
            else
            {

                if (wColor == StatusColours.Red || lColor == StatusColours.Red || mColor == StatusColours.Red)
                {
                    // add red item to G9 client summary: ""Themba is not growing well""
                    comment = firstName + GGSettings.not_growing;
                    AddVisitDataStatus(q3, comment, StatusColours.Red, GGSettings.visit_data_client_summary, GGSettings.growth_section, false);
                }
                else if (wColor == StatusColours.Amber || lColor == StatusColours.Amber || mColor == StatusColours.Amber)
                {
                    // add amber item to G9 client summary: ""Themba is not growing well""
                    comment = firstName + GGSettings.not_growing;
                    AddVisitDataStatus(q3, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, GGSettings.growth_section, false);
                }
            }

            return true;
        }
        private Boolean ManageFeedingData(List<VisitData> feedingData, string firstName, string infantId)
        {
            var q1 = feedingData.Where(x => x.Question == GGSettings.q_eat_drink).OrderBy(x => x.Id).FirstOrDefault();
            var comment = "";

            if (q1.QuestionAnswer == GGSettings.breast_milk_only)
            {

                // Progress: green - ""Breast milk only""
                comment = GGSettings.breast_milk_only;
                AddVisitDataStatus(q1, comment, StatusColours.Green, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                // G9 Client summary: green - ""You're doing a great job breastfeeding!""
                comment = GGSettings.great_job_breastfeeding;
                AddVisitDataStatus(q1, comment, StatusColours.Green, GGSettings.visit_data_client_summary, q1.VisitSection, false);

            }
            else if (q1.QuestionAnswer == GGSettings.formula_milk_only)
            {

                // Progress: green - ""Formula milk only""
                comment = GGSettings.formula_milk_only;
                AddVisitDataStatus(q1, comment, StatusColours.Green, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                // G9 Client summary: green - ""You're doing a great job formula feeding!""
                comment = GGSettings.great_job_formula_feeding;
                AddVisitDataStatus(q1, comment, StatusColours.Green, GGSettings.visit_data_client_summary, q1.VisitSection, false);

            }
            else if (q1.QuestionAnswer == GGSettings.mixed_feeding)
            {

                var mixedFoods = "";
                var listFoods = "";
                mixedFoods = (
                    from visit in _visitRepo.GetAll().Where(x => x.InfantId.ToString() == infantId).OrderBy(y => y.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll().Where(y => y.Question == GGSettings.q_eat_drink_nutrition) on visit.Id equals visitData.VisitId
                    select visitData.QuestionAnswer
                ).FirstOrDefault();

                if (mixedFoods != null)
                {
                    listFoods = FormatNutritionList(mixedFoods);
                }

                // Progress: amber - ""Mixed feeding: ..."" + bulleted list of items selected on screen G5.3.14 Mixed feeding 1 below(use case 39)
                comment = GGSettings.mixed_feeding + " " + listFoods;
                AddVisitDataStatus(q1, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, q1.VisitSection, false);

                // G9 Client summary: amber - ""Try to make sure you give Themba only breast milk or only formula milk""
                comment = GGSettings.try_to_make_sure + firstName + GGSettings.only_milk;
                AddVisitDataStatus(q1, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, q1.VisitSection, false);

            }

            return true;
        }
        private Boolean ManageDevelopmentScreeningData(List<VisitData> developmentScreening, string firstName, string infantId)
        {
            var names = "";
            var comment = "";
            string _hearing = "<li>Hearing</li>";
            string _seeing = "<li>Seeing</li>";
            string _brain = "<li>Brain</li>";
            string _moving = "<li>Moving</li>";

            foreach (var item in developmentScreening)
            {
                if (item.Question == GGSettings.q_hearing1 ||
                    item.Question == GGSettings.q_hearing2 ||
                    item.Question == GGSettings.q_hearing3 ||
                    item.Question == GGSettings.q_hearing4 ||
                    item.Question == GGSettings.q_hearing5 ||
                    item.Question == GGSettings.q_hearing6 ||
                    item.Question == GGSettings.q_hearing7 ||
                    item.Question == GGSettings.q_hearing8 ||
                    item.Question == GGSettings.q_hearing9)
                {
                    if (names.IndexOf(_hearing) == -1)
                    {
                        names += _hearing;
                    }
                }
                if (item.Question == GGSettings.q_seeing1 ||
                    item.Question == GGSettings.q_seeing2 ||
                    item.Question == GGSettings.q_seeing3 ||
                    item.Question == GGSettings.q_seeing4 ||
                    item.Question == GGSettings.q_seeing5 ||
                    item.Question == GGSettings.q_seeing6 ||
                    item.Question == GGSettings.q_seeing7)
                {
                    if (names.IndexOf(_seeing) == -1)
                    {
                        names += _seeing;
                    }
                }
                if (item.Question == GGSettings.q_brain1 ||
                    item.Question == GGSettings.q_brain2 ||
                    item.Question == GGSettings.q_brain3 ||
                    item.Question == GGSettings.q_brain4 ||
                    item.Question == GGSettings.q_brain5 ||
                    item.Question == GGSettings.q_brain6 ||
                    item.Question == GGSettings.q_brain7)
                {
                    if (names.IndexOf(_brain) == -1)
                    {
                        names += _brain;
                    }
                }
                if (item.Question == GGSettings.q_moving1 ||
                    item.Question == GGSettings.q_moving2 ||
                    item.Question == GGSettings.q_moving3 ||
                    item.Question == GGSettings.q_moving4 ||
                    item.Question == GGSettings.q_moving5 ||
                    item.Question == GGSettings.q_moving6 ||
                    item.Question == GGSettings.q_moving7)
                {
                    if (names.IndexOf(_moving) == -1)
                    {
                        names += _moving;
                    }
                }
            }

            var q1 = developmentScreening.FirstOrDefault();

            // IF the user selected ""No"" to any of the questions, show referral item: ""Themba is struggling with X, Y, Z""
            comment = GGSettings.dev_is_struggling.Replace("{client}", firstName) + names;
            AddVisitDataStatus(q1, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);

            // amber ""Themba is struggling with: * X; * Y""
            comment = GGSettings.dev_is_struggling.Replace("{client}", firstName) + names;
            AddVisitDataStatus(q1, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, q1.VisitSection, false);

            // G9 Client summary: amber - ""Themba might be having issues with: X, Y skills""
            comment = GGSettings.dev_might_struggling.Replace("{client}", firstName) + names;
            AddVisitDataStatus(q1, comment, StatusColours.Green, GGSettings.visit_data_client_summary, q1.VisitSection, false);

            return true;
        }
        private Boolean ManageImmunisationData(List<VisitData> immunisationsData, string firstName, string infantId)
        {
            var comment = "";
            var hasImmunisation = false;
            var hasDeworm = false;
            var hasVitaminA = false;
            var no_comment = "";
            var yes_comment = "";
            var answeredItems = new List<VisitData>();

            foreach (var item in immunisationsData)
            {
                if (item.QuestionAnswer != "undefined")
                {
                    answeredItems.Add(item);

                    if (item.Question == GGSettings.q_immunisation)
                    {
                        if (item.QuestionAnswer == GGSettings.answer_no)
                        {
                            hasImmunisation = false;
                            // - if ""No"" to immunisation question only, add referral: ""Immunisations not up to date""
                            comment = GGSettings.immunisations_not_up_to_date;
                            AddVisitDataStatus(item, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);
                            if (no_comment != "")
                            {
                                no_comment += ", Immunisations";
                            }
                            else
                            {
                                no_comment += "Immunisations";
                            }
                        }
                        else
                        {
                            hasImmunisation = true;

                            if (yes_comment != "")
                            {
                                yes_comment += ", Immunisations";
                            }
                            else
                            {
                                yes_comment += "Immunisations";
                            }
                        }
                    }
                    if (item.Question == GGSettings.QuestionVitaminA)
                    {
                        if (item.QuestionAnswer == GGSettings.answer_no)
                        {
                            hasVitaminA = false;
                            // if ""No"" to Vitamin A question only, add referral: ""Vitamin A not up to date""
                            comment = GGSettings.vitamin_not_up_to_date;
                            AddVisitDataStatus(item, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);
                            if (no_comment != "")
                            {
                                no_comment += ", Vitamin A";
                            }
                            else
                            {
                                no_comment += "Vitamin A";
                            }
                        }
                        else
                        {
                            hasVitaminA = true;
                            if (yes_comment != "")
                            {
                                yes_comment += ", Vitamin A";
                            }
                            else
                            {
                                yes_comment += "vitamin A";
                            }
                        }
                    }
                    if (item.Question == GGSettings.QuestionDeworming)
                    {
                        if (item.QuestionAnswer == GGSettings.answer_no)
                        {
                            hasDeworm = false;
                            // if ""No"" to deworming question only, add referral: ""Deworming not up to date""
                            comment = GGSettings.deworming_not_up_to_date;
                            AddVisitDataStatus(item, comment, StatusColours.None, GGSettings.visit_data_client_referral, GGSettings.clinic_referrals, false);
                            if (no_comment != "")
                            {
                                no_comment += ", Deworming";
                            }
                            else
                            {
                                no_comment += "Deworming";
                            }
                        }
                        else
                        {
                            hasDeworm = true;

                            if (yes_comment != "")
                            {
                                yes_comment += ", Deworming";
                            }
                            else
                            {
                                yes_comment += "Deworming";
                            }
                        }
                    }
                }
            }

            var _item = answeredItems.FirstOrDefault();

            if (hasImmunisation == true && hasVitaminA == true && hasDeworm == true)
            {
                //green - if user responded ""Yes"" to all 3 questions: ""All immunisations, Vitamin A and deworming are up to date""
                comment = GGSettings.all_up_to_date;
                AddVisitDataStatus(_item, comment, StatusColours.Green, GGSettings.visit_data_client_progress, _item.VisitSection, false);

                // G9 Client summary: green - if ""Yes"" to all questions on screen, show ""All of Themba's immunisations are up to date""
                comment = GGSettings.all_up_to_date_client.Replace("{client}", firstName);
                AddVisitDataStatus(_item, comment, StatusColours.Green, GGSettings.visit_data_client_summary, _item.VisitSection, false);
            }
            else
            {
                if (yes_comment != "")
                {
                    //green - if user responded ""Yes"" to all 3 questions: ""All immunisations, Vitamin A and deworming are up to date""
                    comment = yes_comment + " are up to date";
                    AddVisitDataStatus(_item, comment, StatusColours.Green, GGSettings.visit_data_client_progress, _item.VisitSection, false);

                    // G9 Client summary: green - if ""Yes"" to all questions on screen, show ""All of Themba's immunisations are up to date""
                    comment = firstName + "'s " + yes_comment + " are up to date";
                    AddVisitDataStatus(_item, comment, StatusColours.Green, GGSettings.visit_data_client_summary, _item.VisitSection, false);
                }

                if (no_comment != "")
                {
                    //amber - if user responded ""No"" to all 3 questions: ""Immunisations, deworming and Vitamin A not up to date""; if user responded ""No"" to 1 or more, please see row 160 here for variations
                    comment = no_comment + " not up to date";
                    AddVisitDataStatus(_item, comment, StatusColours.Amber, GGSettings.visit_data_client_progress, _item.VisitSection, false);

                    // G9 Client summary: ""Themba missed an immunisation, deworming and Vitamin A supplement
                    comment = firstName + " missed an " + no_comment;
                    AddVisitDataStatus(_item, comment, StatusColours.Amber, GGSettings.visit_data_client_summary, _item.VisitSection, false);
                }
            }


            return true;
        }
        private Boolean AddAdditionalVisit(string clientId, string userType, string comment)
        {
            Visit visitRecord = _visitRepo.GetById(new Guid(_visitId));
            //Only add additional visits if the visit is not already an additional visit
            if (visitRecord != null && visitRecord.VisitType.Name != _additionalVisitType.Name)
            {
                // Only 1 additional visit per planned visit allowed
                Visit record = _visitRepo.GetAll().Where(x => x.LinkedVisitId == new Guid(_visitId) &&
                                                          x.VisitType.Name == _additionalVisitType.Name &&
                                                          x.MotherId == (GGSettings.client_mother == userType ? new Guid(clientId) : null) &&
                                                          x.InfantId == (GGSettings.client_child == userType ? new Guid(clientId) : null)).FirstOrDefault();
                if (record == null)
                {
                    DateTime nextVisitDate = (DateTime)_visitManager.GetClientsNextVisitDate(new Guid(clientId), userType);
                    if (nextVisitDate == default(DateTime))
                    {
                        nextVisitDate = DateTime.Now.Date;
                    }
                    DateTime nextVisitDueDate = (DateTime)_visitManager.GetClientsNextDueVisitDate(new Guid(clientId), userType);
                    if (nextVisitDueDate == default(DateTime))
                    {
                        nextVisitDueDate = DateTime.Now.Date;
                    }

                    VisitModel newVisit = new VisitModel();
                    newVisit.Attended = false;
                    newVisit.VisitType = _additionalVisitType;
                    newVisit.MotherId = (GGSettings.client_mother == userType ? new Guid(clientId) : null);
                    newVisit.InfantId = (GGSettings.client_child == userType ? new Guid(clientId) : null);
                    newVisit.Risk = GGSettings.normal_risk;
                    newVisit.Comment = comment;
                    newVisit.LinkedVisitId = new Guid(_visitId);
                    newVisit.PlannedVisitDate = nextVisitDate;
                    newVisit.DueDate = nextVisitDueDate;
                    _visitManager.AddAdditionalVisit(newVisit);
                }
            }

            return true;
        }
        private Boolean AddVisitDataStatus(VisitData input, string comment, string color, string type, string section, Boolean isCompleted)
        {
            if (input != null)
            {
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
            var visitStatusRecord = _visitDataStatusRepo.GetAll().Where(x => x.Comment == input.Comment && x.Type == input.Type && x.VisitDataId == input.VisitDataId).OrderBy(x => x.Id).FirstOrDefault();

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
                UpdatedBy = _applicationUserId.ToString(),
                VisitDataId = input.Id,
                Comment = "",
                Color = "",
                Type = "",
                Section = ""
            };
        }
        private string FormatNutritionList(String options)
        {
            var result = "";

            if (options.IndexOf(GGSettings.p1_1) != -1)
            {
                result = result + "<li>" + GGSettings.p1_1 + "</li>";
            }
            if (options.IndexOf(GGSettings.p1_2) != -1)
            {
                result = result + "<li>" + GGSettings.p1_2 + "</li>";
            }
            if (options.IndexOf(GGSettings.p1_3) != -1)
            {
                result = result + "<li>" + GGSettings.p1_3 + "</li>";
            }
            if (options.IndexOf(GGSettings.p1_4) != -1)
            {
                result = result + "<li>" + GGSettings.p1_4 + "</li>";
            }
            if (options.IndexOf(GGSettings.p1_5) != -1)
            {
                result = result + "<li>" + GGSettings.p1_5 + "</li>";
            }
            if (options.IndexOf(GGSettings.p1_6) != -1)
            {
                result = result + "<li>" + GGSettings.p1_6 + "</li>";
            }
            if (options.IndexOf(GGSettings.p1_7) != -1)
            {
                result = result + "<li>" + GGSettings.p1_7 + "</li>";
            }
            if (options.IndexOf(GGSettings.p1_8) != -1)
            {
                result = result + "<li>" + GGSettings.p1_8 + "</li>";
            }

            return result;
        }
        public string GetHeightWeightIndicator(Boolean isWeightCalc, double totalDaysOld, double weight, double height, string gender, Boolean weightIncreased)
        {
            var indicator = "Normal";

            if (isWeightCalc)
            {
                if (weight > 0)
                {
                    string ageSection_primary = (gender == GGSettings.male ? GGSettings.weightForAgeBoys : GGSettings.weightForAgeGirls);
                    var ageSection_secondary = "";
                    if (totalDaysOld < 730)
                    {
                        ageSection_secondary = (gender == GGSettings.male ? GGSettings.weightForLengthBoys : GGSettings.weightForLengthGirls);
                    }
                    else
                    {
                        ageSection_secondary = (gender == GGSettings.male ? GGSettings.weightForHeightBoys : GGSettings.weightForHeightGirls);
                    }

                    VisitGrowthDataDay recordsForAge = _visitGrowthDataDay.GetAll().Where(x => x.Section == ageSection_primary && x.Day == (int)totalDaysOld).OrderBy(x => x.Id).FirstOrDefault();

                    if (recordsForAge != null)
                    {
                        if (weight <= recordsForAge.SD3neg)
                        {
                            indicator = "Severely underweight"; // priority 1
                        }
                        else if (weight > recordsForAge.SD3neg && weight <= recordsForAge.SD2neg)
                        {
                            indicator = "Underweight"; // priority 2
                        }
                        else if (weight > recordsForAge.SD2neg && weightIncreased == false)
                        {
                            indicator = "Growth faltering"; // priority 3
                        }

                        if (indicator == "Normal")  // priority 6
                        {
                            VisitGrowthDataHeight recordsForWeight = _visitGrowthDataHeight.GetAll().Where(x => x.Section == ageSection_secondary && x.Height == height).OrderBy(x => x.Id).FirstOrDefault();

                            if (recordsForWeight != null)
                            {
                                if (weight >= recordsForWeight.SD3)
                                {
                                    indicator = "Obese"; // priority 4
                                }
                                else if (weight >= recordsForWeight.SD2 && weight < recordsForWeight.SD3)
                                {
                                    indicator = "Overweight"; // priority 5
                                }
                            }
                        }

                    }
                }

            }
            else
            {
                if (height > 0)
                {
                    string heightSection = (gender == GGSettings.male ? GGSettings.lengthHeightForAgeBoys : GGSettings.lengthHeightForAgeGirls);
                    var recordsForHeight = _visitGrowthDataDay.GetAll().Where(x => x.Section == heightSection && x.Day == (int)totalDaysOld).OrderBy(x => x.Id).FirstOrDefault();

                    if (recordsForHeight != null)
                    {
                        if (height <= recordsForHeight.SD3neg)
                        {
                            indicator = "Severely stunted"; // priority 1
                        }
                        else if (height > recordsForHeight.SD3neg && height <= recordsForHeight.SD2neg)
                        {
                            indicator = "Stunted"; // priority 2
                        }
                        else if (height > recordsForHeight.SD2neg)
                        {
                            indicator = "Normal"; // priority 3
                        }
                    }
                }
            }

            return indicator;
        }

        /* ALL METHODS BELOW ARE RETURNING DATA FOR FE VIA INFANT AND MOTHER MANAGERS/QUERY EXTENSIONS*/
        public List<VisitDataStatus> GetReferralDataForClient(string id, string clientType, string visitId)
        {
            // This data is for the past 6 months
            List<VisitDataStatus> allReferrals = new List<VisitDataStatus>();
            DateTime today = DateTime.Today;
            var sixMonthsBack = today.AddMonths(-6);

            if (clientType == GGSettings.client_mother)
            {
                if (visitId == "" || visitId == null)
                {
                    allReferrals = (
                        from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.PlannedVisitDate.Date >= sixMonthsBack.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                        join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                        select visitStatusData
                    ).ToList();
                }
                else
                {
                    allReferrals = (
                        from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.Id.ToString() == visitId && x.PlannedVisitDate.Date >= sixMonthsBack.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                        join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                        select visitStatusData
                    ).ToList();
                }
            }
            else
            {
                if (visitId == "" || visitId == null)
                {
                    allReferrals = (
                        from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id && x.PlannedVisitDate.Date >= sixMonthsBack.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                        join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                        select visitStatusData
                    ).ToList();
                }
                else
                {
                    allReferrals = (
                        from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id && x.Id.ToString() == visitId && x.PlannedVisitDate.Date >= sixMonthsBack.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                        join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                        select visitStatusData
                    ).ToList();
                }
            }
            return allReferrals;
        }
        public List<VisitDataStatus> GetCompletedReferralDataForClient(string id, string clientType, string visitId)
        {
            // This data is for the past 6 months
            List<VisitDataStatus> allReferrals = new List<VisitDataStatus>();
            DateTime today = DateTime.Today;
            var sixMonthsBack = today.AddMonths(-6);

            if (clientType == GGSettings.client_mother)
            {
                if (visitId == "" && visitId == null)
                {
                    allReferrals = (
                        from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.PlannedVisitDate.Date >= sixMonthsBack.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                        join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == true && x.Type == GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                        select visitStatusData
                    ).ToList();
                }
                else
                {
                    allReferrals = (
                        from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.Id.ToString() == visitId && x.PlannedVisitDate.Date >= sixMonthsBack.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                        join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == true && x.Type == GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                        select visitStatusData
                    ).ToList();
                }
            }
            else
            {
                if (visitId == "" && visitId == null)
                {
                    allReferrals = (
                        from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id && x.PlannedVisitDate.Date >= sixMonthsBack.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                        join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == true && x.Type == GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                        select visitStatusData
                    ).ToList();
                }
                else
                {
                    allReferrals = (
                        from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id && x.Id.ToString() == visitId && x.PlannedVisitDate.Date >= sixMonthsBack.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                        join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == true && x.Type == GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                        select visitStatusData
                    ).ToList();
                }
            }

            foreach (var item in allReferrals)
            {
                item.BackReferral = _visitBackReferralManager.GetBackReferralDataForId(item.Id);
            }

            return allReferrals;
        }
        public List<VisitDataStatus> GetReferralDataForVisitId(string visitId)
        {
            List<VisitDataStatus> allReferrals = new List<VisitDataStatus>();

            allReferrals = (
                from visit in _visitRepo.GetAll().Where(x => x.Id.ToString() == visitId)
                join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_referral) on visitData.Id equals visitStatusData.VisitDataId
                select visitStatusData
            ).ToList();

            return allReferrals;
        }
        public List<VisitDataStatus> GetSummaryDataForClient(string id, string clientType)
        {
            List<VisitDataStatus> allData = new List<VisitDataStatus>();

            if (clientType == GGSettings.client_mother)
            {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_summary) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }
            else
            {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_summary) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allData;
        }
        public List<VisitDataStatus> GetDashboardDataForClient(string id, string clientType)
        {
            List<VisitDataStatus> allData = new List<VisitDataStatus>();

            if (clientType == GGSettings.client_mother)
            {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_dashboard) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }
            else
            {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_dashboard) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allData;
        }
        public List<VisitDataStatus> GetProgressDataForClient(string id, string clientType)
        {
            List<VisitDataStatus> allData = new List<VisitDataStatus>();

            if (clientType == GGSettings.client_mother)
            {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_progress) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }
            else
            {
                allData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.IsCompleted == false && x.Type == GGSettings.visit_data_client_progress) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();
            }

            return allData;
        }
        public Progress_VisitDataStatus GetPreviousVisitInformationForClient(Guid visitId)
        {
            var totalGreen = 0;
            var totalRed = 0;
            var totalAmber = 0;
            var fScore = 0.0;
            var scoreColor = "";

            Progress_VisitDataStatus result = new Progress_VisitDataStatus();
            result.VisitId = visitId.ToString();

            List<VisitDataStatus> visitDataStatus = new List<VisitDataStatus>();
            visitDataStatus = (
                from visitData in _visitDataRepo.GetAll().Where(x => x.VisitId == visitId).OrderBy(x => x.InsertedDate)
                join visitStatusData in _visitDataStatusRepo.GetAll().Where(y => y.Type == GGSettings.visit_data_client_progress) on visitData.Id equals visitStatusData.VisitDataId
                select visitStatusData
            ).ToList();

            if (visitDataStatus.Count == 0)
            {
                VisitData record = _visitDataRepo.GetAll().Where(x => x.VisitId == visitId).FirstOrDefault();
                result.ScoreComment = record == null ? "No data available for visit" : "Data available, but no client progress flags available";
            }

            VisitDataStatus growthStatus;
            growthStatus = (
                from visitData in _visitDataRepo.GetAll().Where(x => x.VisitId == visitId && x.Question == GGSettings.QuestionMUAC)
                join visitStatusData in _visitDataStatusRepo.GetAll().Where(y => y.Type == GGSettings.visit_data_client_summary) on visitData.Id equals visitStatusData.VisitDataId
                select visitStatusData
            ).FirstOrDefault();

            totalGreen = visitDataStatus.Where(x => x.Color == StatusColours.Green).Count();
            totalRed = visitDataStatus.Where(x => x.Color == StatusColours.Red).Count();
            totalAmber = visitDataStatus.Where(x => x.Color == StatusColours.Amber).Count();

            var totalItems = totalGreen + totalRed + totalAmber;

            if (totalItems != 0)
            {
                fScore = (double)totalGreen / (double)totalItems * 100;
            }

            if (fScore > 80)
            {
                scoreColor = StatusColours.Green;
            }
            else if (fScore >= 51 && fScore <= 80)
            {
                scoreColor = StatusColours.Amber;
            }
            else if (fScore > 0 && fScore < 51)
            {
                scoreColor = StatusColours.Red;
            }

            result.GrowComment = growthStatus?.Comment;
            result.GrowCommentColor = growthStatus?.Color;

            var weightData = visitDataStatus?.Where(y => y.VisitData.Question == GGSettings.QuestionWeight).OrderByDescending(x => x.InsertedDate).FirstOrDefault();

            result.Weight = weightData?.VisitData.QuestionAnswer == "undefined" ? "0" : weightData?.VisitData.QuestionAnswer;
            result.WeightColor = weightData?.Color;
            result.WeightComment = weightData?.Comment;

            var lengthData = visitDataStatus?.Where(y => y.VisitData.Question == GGSettings.QuestionLength).OrderByDescending(x => x.InsertedDate).FirstOrDefault();

            result.Length = lengthData?.VisitData.QuestionAnswer == "undefined" ? "0" : lengthData?.VisitData.QuestionAnswer;
            result.LengthColor = lengthData?.Color;
            result.LengthComment = lengthData?.Comment;

            var muacData = visitDataStatus?.Where(y => y.VisitData.Question == GGSettings.QuestionMUAC).OrderByDescending(x => x.InsertedDate).FirstOrDefault();

            result.Muac = muacData?.VisitData.QuestionAnswer;
            result.MuacColor = muacData?.Color;
            result.MuacComment = muacData?.Comment;

            result.Score = totalGreen.ToString() + " / " + (totalGreen + totalRed + totalAmber).ToString();
            result.ScoreColor = scoreColor;
            // EC-877: remove weigth, length and muac from list, because they are already handled above
            result.VisitDataStatus = visitDataStatus?.Where(y => y.VisitData.Question != GGSettings.QuestionWeight &&
                                                                 y.VisitData.Question != GGSettings.QuestionLength &&
                                                                 y.VisitData.Question != GGSettings.QuestionMUAC).ToList();

            return result;
        }
        public List<VisitDataStatus> GetSummaryDataForVisitByGroup(Guid visitId, string visitName)
        {
            List<VisitDataStatus> allData = (
                    from visitData in _visitDataRepo.GetAll().Where(x => x.VisitId == visitId && x.VisitName == visitName).OrderBy(x => x.InsertedDate)
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.Type == GGSettings.visit_data_client_summary) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();

            return allData;
        }
        public List<VisitDataStatus> GetSummaryDataForVisitByPriority(Guid visitId, string color)
        {
            List<VisitDataStatus> allData = (
                    from visitData in _visitDataRepo.GetAll().Where(x => x.VisitId == visitId).OrderBy(x => x.InsertedDate)
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.Type == GGSettings.visit_data_client_summary && x.Color == color) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).OrderByDescending(y => y.InsertedDate).Distinct().ToList();

            //allData = allData.Take(3);

            return allData;
        }
        public List<VisitDataStatus> GetIDDocSummaryDataForVisit(Guid visitId, string color)
        {
            List<VisitDataStatus> allData = (
                    from visitData in _visitDataRepo.GetAll().Where(x => x.VisitId == visitId && x.Question == GGSettings.q_ID_doc).OrderBy(x => x.InsertedDate)
                    join visitStatusData in _visitDataStatusRepo.GetAll().Where(x => x.Type == GGSettings.visit_data_client_summary && x.Color == color) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();

            return allData;
        }
        public string GetGrowthStatusForInfant(string id, string firstName, string color)
        {
            var status = "";

            List<VisitDataStatus> vData = new List<VisitDataStatus>();
            vData = (
                from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                join visitData in _visitDataRepo.GetAll().Where(y => y.Question == GGSettings.QuestionWeight ||
                                                                     y.Question == GGSettings.QuestionLength ||
                                                                     y.Question == GGSettings.QuestionMUAC).OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                join visitDataStatus in _visitDataStatusRepo.GetAll() on visitData.Id equals visitDataStatus.VisitDataId
                select visitDataStatus
            ).ToList();

            // Success/normal
            if (color == MetricsIconEnum.Success.ToString())
            {
                string green_comment = firstName + GGSettings.growing_well;
                VisitDataStatus result = vData.Where(x => x.Color == green_comment).FirstOrDefault();
                if (result == null)
                {
                    status = "";
                }
            }

            // Warning - Underweight, Growth faltering, Stunted, Obese, Overweight
            if (color == MetricsIconEnum.Warning.ToString())
            {
                List<VisitDataStatus> amberData = vData.Where(x => x.Color == color).OrderByDescending(x => x.InsertedDate).ToList();
                if (amberData.Count > 0)
                {
                    status = amberData.Select(x => x.Comment).FirstOrDefault();
                }

            }
            return status;
        }
        public string GetRedAlertsForUser(string id, string type)
        {
            var status = "";
            VisitDataStatus vData = new VisitDataStatus();

            if (type == GGSettings.client_mother)
            {

                vData =  (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll().OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                    join visitDataStatus in _visitDataStatusRepo.GetAll().Where(z => z.Color == MetricsIconEnum.Error.ToString() && z.Comment == GGSettings.refer_to_clinic_urgently && z.IsCompleted == false) on visitData.Id equals visitDataStatus.VisitDataId
                    select visitDataStatus
                ).FirstOrDefault();

            }
            else
            {
                vData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll().OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                    join visitDataStatus in _visitDataStatusRepo.GetAll().Where(z => z.Color == MetricsIconEnum.Error.ToString() && z.Comment == GGSettings.refer_to_clinic_urgently) on visitData.Id equals visitDataStatus.VisitDataId
                    select visitDataStatus
                ).FirstOrDefault();
            }

            if (vData != null)
            {
                status = GGSettings.refer_to_clinic_urgently;
            }

            return status;
        }
        public string GetAlertsForMother(string id)
        {
            var status = "";

            VisitDataStatus vData = (
                   from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                   join visitData in _visitDataRepo.GetAll().OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                   join visitDataStatus in _visitDataStatusRepo.GetAll().Where(z => z.Color == MetricsIconEnum.Error.ToString() || z.Color == MetricsIconEnum.Warning.ToString()) on visitData.Id equals visitDataStatus.VisitDataId
                   select visitDataStatus
               ).FirstOrDefault();

            if (vData != null)
            {
                status = vData.Comment;
            }

            return status;
        }
        public string GetClinicReferralForUser(string id, string type)
        {
            var status = "";
            VisitDataStatus vData = new VisitDataStatus();

            if (type == GGSettings.client_mother)
            {

                vData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll().OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                    join visitDataStatus in _visitDataStatusRepo.GetAll().Where(z => z.Section == GGSettings.clinic_referrals && z.IsCompleted == false) on visitData.Id equals visitDataStatus.VisitDataId
                    select visitDataStatus
                ).FirstOrDefault();

            }
            else
            {
                vData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll().OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                    join visitDataStatus in _visitDataStatusRepo.GetAll().Where(z => z.Section == GGSettings.clinic_referrals && z.IsCompleted == false) on visitData.Id equals visitDataStatus.VisitDataId
                    select visitDataStatus
                ).FirstOrDefault();
            }

            if (vData != null)
            {
                status = GGSettings.clinic_referrals;
            }

            return status;
        }
        public string GetHomeAffairsReferralForUser(string id, string type)
        {
            var status = "";
            VisitDataStatus vData = new VisitDataStatus();

            if (type == GGSettings.client_mother)
            {

                vData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll().OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                    join visitDataStatus in _visitDataStatusRepo.GetAll().Where(z => z.Section == GGSettings.home_affairs_referrals && z.IsCompleted == false) on visitData.Id equals visitDataStatus.VisitDataId
                    select visitDataStatus
                ).FirstOrDefault();

            }
            else
            {
                vData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll().OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                    join visitDataStatus in _visitDataStatusRepo.GetAll().Where(z => z.Section == GGSettings.home_affairs_referrals && z.IsCompleted == false) on visitData.Id equals visitDataStatus.VisitDataId
                    select visitDataStatus
                ).FirstOrDefault();
            }

            if (vData != null)
            {
                status = GGSettings.home_affairs_referrals;
            }

            return status;
        }
        public string GetSassaReferralForUser(string id, string type)
        {
            var status = "";
            VisitDataStatus vData = new VisitDataStatus();

            if (type == GGSettings.client_mother)
            {

                vData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll().OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                    join visitDataStatus in _visitDataStatusRepo.GetAll().Where(z => z.Section == GGSettings.sassa_refferals && z.IsCompleted == false) on visitData.Id equals visitDataStatus.VisitDataId
                    select visitDataStatus
                ).FirstOrDefault();

            }
            else
            {
                vData = (
                    from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                    join visitData in _visitDataRepo.GetAll().OrderByDescending(y => y.InsertedDate) on visit.Id equals visitData.VisitId
                    join visitDataStatus in _visitDataStatusRepo.GetAll().Where(z => z.Section == GGSettings.sassa_refferals && z.IsCompleted == false) on visitData.Id equals visitDataStatus.VisitDataId
                    select visitDataStatus
                ).FirstOrDefault();
            }

            if (vData != null)
            {
                status = GGSettings.sassa_refferals;
            }

            return status;
        }

    }
}
