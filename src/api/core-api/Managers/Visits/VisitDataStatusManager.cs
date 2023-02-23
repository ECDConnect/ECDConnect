using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Users;
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
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            var visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);

            List<VisitData> allVisitData = visitDataRepo.GetAll().Where(x => x.VisitId.ToString() == visitId).ToList();

            var maternalDistressScreening = new List<CMSQuestion>();
            var alcoholUse = new List<CMSQuestion>();
            var idDocs = new List<CMSQuestion>();
            var firstName = "";

            if (type == Constants.GrowGreatSettings.client_mother)
            {
                Mother mother = motherRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();
                firstName = mother.User.FirstName;

                _clientVisitDataIds = (
                    from visit in visitRepo.GetAll().Where(x => x.MotherId.ToString() == id)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    select visitData.Id.ToString()
                ).ToList();

                ManageVisitDataStatusForMother(allVisitData, firstName, id);
            } else
            {
                Infant infant = infantRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();
                firstName = infant.User.FirstName;

                _clientVisitDataIds = (
                    from visit in visitRepo.GetAll().Where(x => x.InfantId.ToString() == id)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    select visitData.Id.ToString()
                ).ToList();
            }

            return true;
        }
        private Boolean ManageVisitDataStatusForMother(List<VisitData> allVisitData, string firstName, string motherId)
        {
            var visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: _applicationUserId);

            var maternalDistressScreening = new List<VisitData>();
            var alcoholUse = new List<VisitData>();
            var idDocs = new List<VisitData>();
            var comment = "";
            var color = "";
            var type = "";

            // AVAILABLE TYPES -----------
            // ClientDashboardAlert -> G4
            // ClientSummaryDownload -> G9
            // Referral
            // Progress

            // add additional visit for when we need to add additional visits for the client
            VisitType additionalVisitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GrowGreatSettings.client_mother) &&
                                                               x.Name == Constants.GrowGreatSettings.additional_visits).
                                                               OrderBy(x => x.NormalizedName).FirstOrDefault();

            // loop through data and add status data
            foreach (VisitData visitData in allVisitData)
            {
                if (visitData.Question == Constants.GrowGreatSettings.q_first_antenatal_visit)
                {
                    if (visitData.QuestionAnswer == Constants.GrowGreatSettings.answer_no)
                    {
                        // this should add a referral to the list(""Pregnancy not booked"")
                        comment = Constants.GrowGreatSettings.pregnancy_not_booked;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, Constants.GrowGreatSettings.clinic_referrals, false);

                        // add an ""amber"" item to the progress list: ""Pregnancy not booked"".
                        comment = Constants.GrowGreatSettings.pregnancy_not_booked;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add flag to G4 secondary alert: red alert, ""Refer to clinic""
                        comment = Constants.GrowGreatSettings.refer_to_clinic;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add amber item to G9 client download summary: ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GrowGreatSettings.missed_clinic_visit;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                    }
                    else if (visitData.QuestionAnswer == Constants.GrowGreatSettings.answer_yes)
                    {
                        // a ""green"" item is added to the client progress list ""Pregnancy booked""
                        comment = Constants.GrowGreatSettings.pregnancy_booked;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                        // a green item is added to G9 client download summary ""You are up to date with your clinic visits!""
                        comment = Constants.GrowGreatSettings.clinic_visits_up_to_date_2;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);
                    }
                }
                else if (visitData.Question == Constants.GrowGreatSettings.q_antenatal_visits)
                {
                    if (visitData.QuestionAnswer == Constants.GrowGreatSettings.answer_no)
                    {
                        // add an ""amber"" item to the progress: ""Clinic visits not up to date""
                        comment = Constants.GrowGreatSettings.clinic_visits_not_up_to_date;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, Constants.GrowGreatSettings.clinic_referrals, false);

                        // add an ""amber"" item to the progress list: Clinic visits not up to date.
                        comment = Constants.GrowGreatSettings.clinic_visits_not_up_to_date;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add G4 secondary text red alert ""Refer to clinic""
                        comment = Constants.GrowGreatSettings.refer_to_clinic;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add amber item to G9 client download summary: ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = Constants.GrowGreatSettings.missed_clinic_visit;
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);
                    }
                    else if (visitData.QuestionAnswer == Constants.GrowGreatSettings.answer_yes)
                    {
                        // ""green"" item is added to the progress: "Clinic visits up to date"
                        comment = Constants.GrowGreatSettings.clinic_visits_up_to_date;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                        // add green item to G9 client download summary "You are up to date with your clinic visits!"
                        comment = Constants.GrowGreatSettings.all_clinic_visit;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                    }
                }
                else if (visitData.Question == Constants.GrowGreatSettings.q_measurement)
                {
                    var questionAnswer = Int32.Parse(visitData.QuestionAnswer);

                    if (questionAnswer < 22)
                    {
                        // add to referrals items list(""May be underweight - MUAC less than 22cm"") red
                        comment = Constants.GrowGreatSettings.underweight;
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, Constants.GrowGreatSettings.clinic_referrals, false);

                        // add to red items in progress screen(use case 2) (""May be underweight - MUAC less than 22cm"")
                        comment = Constants.GrowGreatSettings.underweight;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add G4 secondary text item: ""Refer to clinic urgently""(this is the highest - priority item & will be shown)
                        comment = Constants.GrowGreatSettings.refer_to_clinic_urgently;
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add green item to G9 client summary: ""You might be underweight: eat 3 meals every day""
                        comment = Constants.GrowGreatSettings.underweight2;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                        // add additional visit item with ""Underweight"" secondary text -please see G3.7 Other / Additional visits
                        VisitModel newVisit = new VisitModel();
                        newVisit.Attended = false;
                        newVisit.VisitType = additionalVisitType;
                        newVisit.MotherId = new Guid(motherId);
                        newVisit.InfantId = null;
                        newVisit.Risk = Constants.GrowGreatSettings.normal_risk;
                        newVisit.Comment = Constants.GrowGreatSettings.underweight3;

                        _visitManager.AddVisit(newVisit);
                    }
                    else if (questionAnswer >= 22)
                    {
                        // add to green items in progress screen(use case 2) (""MUAC over 22cm"")TenancyMiddleware.cs
                        comment = Constants.GrowGreatSettings.muac_over_22;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                        // add green item to G9 client summary: ""According to your mid-upper arm circumference, you are a healthy weight""
                        comment = Constants.GrowGreatSettings.healthy_weight;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);
                    }
                }
                else if (visitData.Question == Constants.GrowGreatSettings.q_stop_worry ||
                         visitData.Question == Constants.GrowGreatSettings.q_felt_down ||
                         visitData.Question == Constants.GrowGreatSettings.q_suicide)
                {
                    maternalDistressScreening.Add(visitData);
                }
                else if (visitData.Question == Constants.GrowGreatSettings.q_T ||
                    visitData.Question == Constants.GrowGreatSettings.q_A ||
                    visitData.Question == Constants.GrowGreatSettings.q_C ||
                    visitData.Question == Constants.GrowGreatSettings.q_E)
                {
                    alcoholUse.Add(visitData);
                }
                else if (visitData.Question == Constants.GrowGreatSettings.q_ID_doc || visitData.Question == Constants.GrowGreatSettings.q_citizen)
                {
                    idDocs.Add(visitData);
                }
                else if (visitData.Question == Constants.GrowGreatSettings.q_danger_signs)
                {

                    if (visitData.QuestionAnswer == Constants.GrowGreatSettings.none_above)
                    {
                        // Add progress item: ""No danger signs for Lethabo""
                        comment = Constants.GrowGreatSettings.no_danger_signs + firstName;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = Constants.GrowGreatSettings.physical_feeling_well;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, true);
                    }
                    else
                    {
                        var arrAnswers = visitData.QuestionAnswer.Split(",");

                        if (arrAnswers.Length >= 3)
                        {
                            // Add referral item - where X, Y, Z are each of the 3 danger signs selected by the user
                            comment = firstName + Constants.GrowGreatSettings.was_experiencing + visitData.QuestionAnswer;
                            color = MetricsColorEnum.None.ToString();
                            type = Constants.GrowGreatSettings.visit_data_client_referral;
                            AddVisitDataStatus(visitData, comment, color, type, Constants.GrowGreatSettings.clinic_referrals, false);

                            // Add red progress item - where X, Y, Z are each of the 3 danger signs selected by the user
                            comment = firstName + Constants.GrowGreatSettings.was_experiencing + visitData.QuestionAnswer;
                            color = MetricsColorEnum.Warning.ToString();
                            type = Constants.GrowGreatSettings.visit_data_client_progress;
                            AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                            // Add additional visit item with secondary text: ""Danger signs""
                            VisitModel newVisit = new VisitModel();
                            newVisit.Attended = false;
                            newVisit.VisitType = additionalVisitType;
                            newVisit.MotherId = new Guid(motherId);
                            newVisit.InfantId = null;
                            newVisit.Risk = Constants.GrowGreatSettings.normal_risk;
                            newVisit.Comment = Constants.GrowGreatSettings.danger_signs;
                            _visitManager.AddVisit(newVisit);

                            // Add G4 secondary alert text: ""Refer to clinic urgently""
                            comment = Constants.GrowGreatSettings.refer_to_clinic_urgently;
                            color = MetricsColorEnum.Warning.ToString();
                            type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                            AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);

                            // Add item to G9 Client summary download ""You need urgent care for some serious health issues""
                            comment = Constants.GrowGreatSettings.urgent_care;
                            color = MetricsColorEnum.Warning.ToString();
                            type = Constants.GrowGreatSettings.visit_data_client_summary;
                            AddVisitDataStatus(visitData, comment, color, type, visitData.VisitSection, false);
                        }
                    }
                }
            }

            // Manage Maternal Distress Screening
            if (maternalDistressScreening.Count > 0) 
            { 
                ManageMaternalDistressScreening(maternalDistressScreening, additionalVisitType, firstName, motherId);
            }
            // Manage alcohol use
            if (alcoholUse.Count > 0)
            {
                ManageAlcoholUse(alcoholUse, additionalVisitType, firstName, motherId);
            }
            // Manage id questions
            if (idDocs.Count > 0)
            {
                ManageIdDocs(idDocs, firstName);
            }

            return true;
        }
        private Boolean ManageMaternalDistressScreening(List<VisitData> maternalDistressScreening, VisitType visitType, string firstName, string motherId)
        {
            var comment = "";
            var color = "";
            var type = "";
            var section = Constants.GrowGreatSettings.clinic_referrals;

            var q1 = new VisitData();
            var q2 = new VisitData();
            var q3 = new VisitData();

            foreach (VisitData obj in maternalDistressScreening)
            {
                if (obj.Question == Constants.GrowGreatSettings.q_stop_worry)
                {
                    q1 = obj;
                } else if (obj.Question == Constants.GrowGreatSettings.q_felt_down)
                {
                    q2 = obj;
                } else if (obj.Question == Constants.GrowGreatSettings.q_suicide)
                {
                    q3 = obj;
                }
            }

            // a Constants.GrowGreatSettings.answer_yes response to the 3rd question trumps all.
            if (q3.QuestionAnswer == Constants.GrowGreatSettings.answer_yes)
            {
                comment = firstName + Constants.GrowGreatSettings.maternal_distress;
                color = MetricsColorEnum.None.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_referral;
                AddVisitDataStatus(q3, comment, color, type, section, false);

                // add to amber items in progress screen(use case 2)(""Lethabo was experiencing maternal distress"")
                comment = firstName + Constants.GrowGreatSettings.maternal_distress;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_progress;
                AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);

                VisitModel newVisit = new VisitModel();
                newVisit.Attended = false;
                newVisit.VisitType = visitType;
                newVisit.MotherId = new Guid(motherId);
                newVisit.InfantId = null;
                newVisit.Risk = Constants.GrowGreatSettings.normal_risk;
                newVisit.Comment = Constants.GrowGreatSettings.maternal_distress2;
                _visitManager.AddVisit(newVisit);

                // add G4 secondary text item: Amber - ""Refer to clinic""
                comment = Constants.GrowGreatSettings.refer_to_clinic;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);

                // add amber item to G9 client summary: ""You are struggling and need some support""
                comment = Constants.GrowGreatSettings.need_support;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_summary;
                AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);
            } else
            {
                if (q3.QuestionAnswer == Constants.GrowGreatSettings.answer_no && (q1.QuestionAnswer == Constants.GrowGreatSettings.answer_yes || q2.QuestionAnswer == Constants.GrowGreatSettings.answer_yes))
                {
                    comment = firstName + Constants.GrowGreatSettings.maternal_distress;
                    color = MetricsColorEnum.None.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_referral;
                    AddVisitDataStatus(q3, comment, color, type, section, false);

                    comment = firstName + Constants.GrowGreatSettings.maternal_distress;
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_progress;
                    AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);

                    VisitModel newVisit = new VisitModel();
                    newVisit.Attended = false;
                    newVisit.VisitType = visitType;
                    newVisit.MotherId = new Guid(motherId);
                    newVisit.InfantId = null;
                    newVisit.Risk = Constants.GrowGreatSettings.normal_risk;
                    newVisit.Comment = Constants.GrowGreatSettings.maternal_distress2;
                    _visitManager.AddVisit(newVisit);

                    // add amber item to G9 client summary: ""You are struggling and need some support""
                    comment = Constants.GrowGreatSettings.need_support;
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_summary;
                    AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, false);
                }

                if (q3.QuestionAnswer == Constants.GrowGreatSettings.answer_no && (q1.QuestionAnswer == Constants.GrowGreatSettings.answer_no || q2.QuestionAnswer == Constants.GrowGreatSettings.answer_no))
                {
                    // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                    comment = firstName + Constants.GrowGreatSettings.was_coping;
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_progress;
                    AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, true);

                    //add green item to G9 client summary: You are coping well!
                    comment = Constants.GrowGreatSettings.coping_well;
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_summary;
                    AddVisitDataStatus(q3, comment, color, type, q3.VisitSection, true);
                }
            }
            return true;
        }
        private Boolean ManageAlcoholUse(List<VisitData> alcoholUse, VisitType visitType, string firstName, string motherId)
        {

            var comment = "";
            var color = "";
            var type = "";
            var score = 0;
            var section = Constants.GrowGreatSettings.clinic_referrals;

            var q1 = new VisitData();
            var q2 = new VisitData();
            var q3 = new VisitData();
            var q4 = new VisitData();

            foreach (VisitData obj in alcoholUse)
            {

                if (obj.Question == Constants.GrowGreatSettings.q_T)
                {
                    q1 = obj;
                }
                else if (obj.Question == Constants.GrowGreatSettings.q_A)
                {
                    q2 = obj;
                }
                else if (obj.Question == Constants.GrowGreatSettings.q_C)
                {
                    q3 = obj;
                }
                else if (obj.Question == Constants.GrowGreatSettings.q_E)
                {
                    q4 = obj;
                }
            }

            if (q1.QuestionAnswer == Constants.GrowGreatSettings.more_than_2)
            {
                score++;
                score++;
            }
            if (q2.QuestionAnswer == Constants.GrowGreatSettings.answer_yes)
            {
                score++;
            }
            if (q3.QuestionAnswer == Constants.GrowGreatSettings.answer_yes)
            {
                score++;
            }
            if (q4.QuestionAnswer == Constants.GrowGreatSettings.answer_yes)
            {
                score++;
            }

            // If T-ACE score is 2 or more:
            if (score >= 2)
            {
                // IF this is not already unchecked in the referrals list for this client; add to referrals items list (""Lethabo is at risk of a drinking problem (T-ACE score = X)"", where X = the T-ACE score calculated)
                comment = firstName + Constants.GrowGreatSettings.t_ace_score + score + ")";
                color = MetricsColorEnum.None.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_referral;
                AddVisitDataStatus(q1, comment, color, type, section, false);

                // add to red items in progress screen (use case 2) (""Lethabo is at risk of a drinking problem (T-ACE score = X)"", where X = the T-ACE score calculated)
                comment = firstName + Constants.GrowGreatSettings.t_ace_score + score + ")";
                color = MetricsColorEnum.Error.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

                // add G4 secondary text item: Red - ""Refer to clinic urgently""
                comment = Constants.GrowGreatSettings.refer_to_clinic_urgently;
                color = MetricsColorEnum.Error.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

                // add amber item to G9 client summary: ""You may need support to reduce your drinking""
                comment = Constants.GrowGreatSettings.support_drinking;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);
            }
            else if (score > 0 && score < 2)
            {
                // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                comment = firstName + Constants.GrowGreatSettings.no_alcohol_abuse;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_progress;
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
                if (obj.Question == Constants.GrowGreatSettings.q_ID_doc)
                {
                    q1 = obj;
                }
                else if (obj.Question == Constants.GrowGreatSettings.q_citizen)
                {
                    q2 = obj;
                }
            }

            if (q1.QuestionAnswer == Constants.GrowGreatSettings.answer_no && q2.QuestionAnswer == Constants.GrowGreatSettings.answer_yes)
            {
                // IF this is not already unchecked in the referrals list for this client; add to referrals items list under Department of Home Affairs referrals(""Lethabo doesn't have an ID book)
                comment = firstName + Constants.GrowGreatSettings.no_id_book;
                color = MetricsColorEnum.None.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_referral;
                AddVisitDataStatus(q1, comment, color, type, Constants.GrowGreatSettings.home_affairs_referrals, false);

                // add to amber items in progress screen(""Lethabo doesn't have an ID book"")
                comment = firstName + Constants.GrowGreatSettings.no_id_book;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);

                // add amber item to G9 client summary: ""Go to Home Affairs to apply for your ID book.This will allow you to apply for the child social grant as soon as the baby is born.""
                comment = Constants.GrowGreatSettings.go_to_home_affairs;
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, false);
            }

            if (q1.QuestionAnswer == Constants.GrowGreatSettings.answer_yes)
            {
                // add to green items in progress screen(use case 2)(""Lethabo has an ID book"")
                comment = firstName + Constants.GrowGreatSettings.id_book;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, true);

                // add green item to G9 client summary: ""You have your ID document & can apply for a child social grant once the baby is born!""
                comment = Constants.GrowGreatSettings.apply_social_grant;
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, q1.VisitSection, true);
            }
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

    }
}

