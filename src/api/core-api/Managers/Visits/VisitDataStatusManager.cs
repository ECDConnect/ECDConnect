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
                if (visitData.Question == "Has {client} gone to the clinic for her first antenatal visit?")
                {
                    if (visitData.QuestionAnswer == "No")
                    {
                        // this should add a referral to the list(""Pregnancy not booked"")
                        comment = "Pregnancy not booked";
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, "Clinic referrals");

                        // add an ""amber"" item to the progress list: ""Pregnancy not booked"".
                        comment = "Pregnancy not booked";
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // add flag to G4 secondary alert: red alert, ""Refer to clinic""
                        comment = "Refer to clinic";
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // add amber item to G9 client download summary: ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = "You missed a clinic visit - make sure you go as soon as possible!";
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                    }
                    else if (visitData.QuestionAnswer == "Yes")
                    {
                        // a ""green"" item is added to the client progress list ""Pregnancy booked""
                        comment = "Pregnancy booked";
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // a green item is added to G9 client download summary ""You are up to date with your clinic visits!""
                        comment = "You are up to date with your clinic visits!";
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, "");
                    }
                }
                else if (visitData.Question == "Is {client} up to date with their antenatal clinic visits?")
                {
                    if (visitData.QuestionAnswer == "No")
                    {
                        // add an ""amber"" item to the progress: ""Clinic visits not up to date""
                        comment = "Clinic visits not up to date";
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, "Clinic referrals");

                        // add an ""amber"" item to the progress list: Clinic visits not up to date.
                        comment = "Clinic visits not up to date";
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // add G4 secondary text red alert ""Refer to clinic""
                        comment = "Refer to clinic";
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // add amber item to G9 client download summary: ""You missed a clinic visit - make sure you go as soon as possible!""
                        comment = "You missed a clinic visit - make sure you go as soon as possible!";
                        color = MetricsColorEnum.Warning.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, "");
                    }
                    else if (visitData.QuestionAnswer == "Yes")
                    {
                        // ""green"" item is added to the progress: "Clinic visits up to date"
                        comment = "Clinic visits up to date";
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // add green item to G9 client download summary "You are up to date with your clinic visits!"
                        comment = "You are up to date with your clinic visits!";
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                    }
                }
                else if (visitData.Question == "MUAC measurement")
                {
                    var questionAnswer = Int32.Parse(visitData.QuestionAnswer);

                    if (questionAnswer < 22)
                    {
                        // add to referrals items list(""May be underweight - MUAC less than 22cm"") red
                        comment = "May be underweight - MUAC less than 22cm";
                        color = MetricsColorEnum.None.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_referral;
                        AddVisitDataStatus(visitData, comment, color, type, "Clinic referrals");

                        // add to red items in progress screen(use case 2) (""May be underweight - MUAC less than 22cm"")
                        comment = "May be underweight - MUAC less than 22cm";
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // add G4 secondary text item: ""Refer to clinic urgently""(this is the highest - priority item & will be shown)
                        comment = "Refer to clinic urgently";
                        color = MetricsColorEnum.Error.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // add green item to G9 client summary: ""You might be underweight: eat 3 meals every day""
                        comment = "You might be underweight: eat 3 meals every day";
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // add additional visit item with ""Underweight"" secondary text -please see G3.7 Other / Additional visits
                        VisitModel newVisit = new VisitModel();
                        newVisit.Attended = false;
                        newVisit.VisitType = additionalVisitType;
                        newVisit.MotherId = new Guid(motherId);
                        newVisit.InfantId = null;
                        newVisit.Risk = "normal";
                        newVisit.Comment = "Underweight";

                        _visitManager.AddVisit(newVisit);
                    }
                    else if (questionAnswer >= 22)
                    {
                        // add to green items in progress screen(use case 2) (""MUAC over 22cm"")
                        comment = "MUAC over 22cm";
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // add green item to G9 client summary: ""According to your mid-upper arm circumference, you are a healthy weight""
                        comment = "According to your mid-upper arm circumference, you are a healthy weight";
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, "");
                    }
                }
                else if (visitData.Question == "Felt unable to stop worrying or thinking too much?" ||
                         visitData.Question == "Felt down, depressed or hopeless?" ||
                         visitData.Question == "Had thoughts and plans to harm yourself or commit suicide?")
                {
                    maternalDistressScreening.Add(visitData);
                }
                else if (visitData.Question == "(T) Tolerance: how many drinks does it take to make you high?" ||
                    visitData.Question == "(A) Have people annoyed you by critizing your drinking ?" ||
                    visitData.Question == "(C) Have you ever felt you need to cut down on your drinking?" ||
                    visitData.Question == "(E) Eye - opener: have you ever had a drink the first thing in the morning to steady your nerves or get rid of a hangover?")
                {
                    alcoholUse.Add(visitData);
                }
                else if (visitData.Question == "Does {client} have an ID document?" || visitData.Question == "Is { client} a South African citizen or permanent resident?")
                {
                    idDocs.Add(visitData);
                }
                else if (visitData.Question == "Tick the danger signs {client} is experiencing")
                {

                    if (visitData.QuestionAnswer == "None of the above")
                    {
                        // Add progress item: ""No danger signs for Lethabo""
                        comment = "No danger signs for " + firstName;
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_progress;
                        AddVisitDataStatus(visitData, comment, color, type, "");

                        // Add item to G9 Client summary download: ""You are feeling physically well"""
                        comment = "You are feeling physically well";
                        color = MetricsColorEnum.Success.ToString();
                        type = Constants.GrowGreatSettings.visit_data_client_summary;
                        AddVisitDataStatus(visitData, comment, color, type, "");
                    }
                    else
                    {
                        var arrAnswers = visitData.QuestionAnswer.Split(",");

                        if (arrAnswers.Length >= 3)
                        {
                            // Add referral item - where X, Y, Z are each of the 3 danger signs selected by the user
                            comment = firstName + " was experiencing " + visitData.QuestionAnswer;
                            color = MetricsColorEnum.None.ToString();
                            type = Constants.GrowGreatSettings.visit_data_client_referral;
                            AddVisitDataStatus(visitData, comment, color, type, "Clinic referrals");

                            // Add red progress item - where X, Y, Z are each of the 3 danger signs selected by the user
                            comment = firstName + " was experiencing " + visitData.QuestionAnswer;
                            color = MetricsColorEnum.Warning.ToString();
                            type = Constants.GrowGreatSettings.visit_data_client_progress;
                            AddVisitDataStatus(visitData, comment, color, type, "");

                            // Add additional visit item with secondary text: ""Danger signs""
                            VisitModel newVisit = new VisitModel();
                            newVisit.Attended = false;
                            newVisit.VisitType = additionalVisitType;
                            newVisit.MotherId = new Guid(motherId);
                            newVisit.InfantId = null;
                            newVisit.Risk = "normal";
                            newVisit.Comment = "Danger signs";
                            _visitManager.AddVisit(newVisit);

                            // Add G4 secondary alert text: ""Refer to clinic urgently""
                            comment = "Refer to clinic urgently";
                            color = MetricsColorEnum.Warning.ToString();
                            type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                            AddVisitDataStatus(visitData, comment, color, type, "");

                            // Add item to G9 Client summary download ""You need urgent care for some serious health issues""
                            comment = "You need urgent care for some serious health issues";
                            color = MetricsColorEnum.Warning.ToString();
                            type = Constants.GrowGreatSettings.visit_data_client_summary;
                            AddVisitDataStatus(visitData, comment, color, type, "");
                        }
                    }
                }
            }

            // Manage Maternal Distress Screening
            ManageMaternalDistressScreening(maternalDistressScreening, additionalVisitType, firstName, motherId);
            // Manage alcohol use
            ManageAlcoholUse(alcoholUse, additionalVisitType, firstName, motherId);
            // Manage id questions
            ManageIdDocs(idDocs, firstName);

            return true;
        }
        private Boolean ManageMaternalDistressScreening(List<VisitData> maternalDistressScreening, VisitType visitType, string firstName, string motherId)
        {
            var comment = "";
            var color = "";
            var type = "";
            var section = "Clinic referrals";

            var q1 = new VisitData();
            var q2 = new VisitData();
            var q3 = new VisitData();

            foreach (VisitData obj in maternalDistressScreening)
            {
                if (obj.Question == "Felt unable to stop worrying or thinking too much?")
                {
                    q1 = obj;
                } else if (obj.Question == "Felt down, depressed or hopeless?")
                {
                    q2 = obj;
                } else if (obj.Question == "Had thoughts and plans to harm yourself or commit suicide?")
                {
                    q3 = obj;
                }
            }

            // a "Yes" response to the 3rd question trumps all.
            if (q3.QuestionAnswer == "Yes")
            {
                comment = firstName + " was experiencing maternal distress";
                color = MetricsColorEnum.None.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_referral;
                AddVisitDataStatus(q3, comment, color, type, section);

                // add to amber items in progress screen(use case 2)(""Lethabo was experiencing maternal distress"")
                comment = firstName + " was experiencing maternal distress";
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_progress;
                AddVisitDataStatus(q3, comment, color, type, "");

                VisitModel newVisit = new VisitModel();
                newVisit.Attended = false;
                newVisit.VisitType = visitType;
                newVisit.MotherId = new Guid(motherId);
                newVisit.InfantId = null;
                newVisit.Risk = "normal";
                newVisit.Comment = "Maternal distress";
                _visitManager.AddVisit(newVisit);

                // add G4 secondary text item: Amber - ""Refer to clinic""
                comment = "Refer to clinic";
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                AddVisitDataStatus(q3, comment, color, type, "");

                // add amber item to G9 client summary: ""You are struggling and need some support""
                comment = "You are struggling and need some support";
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_summary;
                AddVisitDataStatus(q3, comment, color, type, section);
            } else
            {
                if (q3.QuestionAnswer == "No" && (q1.QuestionAnswer == "Yes" || q2.QuestionAnswer == "Yes"))
                {
                    comment = firstName + " was experiencing maternal distress";
                    color = MetricsColorEnum.None.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_referral;
                    AddVisitDataStatus(q3, comment, color, type, section);

                    comment = firstName + " was experiencing maternal distress";
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_progress;
                    AddVisitDataStatus(q3, comment, color, type, "");

                    VisitModel newVisit = new VisitModel();
                    newVisit.Attended = false;
                    newVisit.VisitType = visitType;
                    newVisit.MotherId = new Guid(motherId);
                    newVisit.InfantId = null;
                    newVisit.Risk = "normal";
                    newVisit.Comment = "Maternal distress";
                    _visitManager.AddVisit(newVisit);

                    // add amber item to G9 client summary: ""You are struggling and need some support""
                    comment = "You are struggling and need some support";
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_summary;
                    AddVisitDataStatus(q3, comment, color, type, "");
                }

                if (q3.QuestionAnswer == "No" && (q1.QuestionAnswer == "No" || q2.QuestionAnswer == "No"))
                {
                    // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                    comment = firstName + " was coping well";
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_progress;
                    AddVisitDataStatus(q3, comment, color, type, "");

                    //add green item to G9 client summary: You are coping well!
                    comment = "You are coping well!";
                    color = MetricsColorEnum.Warning.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_summary;
                    AddVisitDataStatus(q3, comment, color, type, "");
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
            var section = "Clinic referrals";

            var q1 = new VisitData();
            var q2 = new VisitData();
            var q3 = new VisitData();
            var q4 = new VisitData();

            foreach (VisitData obj in alcoholUse)
            {

                if (obj.Question == "(T) Tolerance: how many drinks does it take to make you high?")
                {
                    q1 = obj;
                }
                else if (obj.Question == "(A) Have people annoyed you by critizing your drinking?")
                {
                    q2 = obj;
                }
                else if (obj.Question == "(C) Have you ever felt you need to cut down on your drinking?")
                {
                    q3 = obj;
                }
                else if (obj.Question == "(E) Eye-opener: have you ever had a drink the first thing in the morning to steady your nerves or get rid of a hangover?")
                {
                    q4 = obj;
                }
            }

            if (q1.QuestionAnswer == "More than 2")
            {
                score = score + 2;
            }
            if (q2.QuestionAnswer == "Yes")
            {
                score = score + 1;
            }
            if (q3.QuestionAnswer == "Yes")
            {
                score = score + 1;
            }
            if (q4.QuestionAnswer == "Yes")
            {
                score = score + 1;
            }

            // If T-ACE score is 2 or more:
            if (score >= 2)
            {
                // IF this is not already unchecked in the referrals list for this client; add to referrals items list (""Lethabo is at risk of a drinking problem (T-ACE score = X)"", where X = the T-ACE score calculated)
                comment = firstName + " is at risk of a drinking problem (T-ACE score = " + score + ")";
                color = MetricsColorEnum.None.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_referral;
                AddVisitDataStatus(q1, comment, color, type, section);

                // add to red items in progress screen (use case 2) (""Lethabo is at risk of a drinking problem (T-ACE score = X)"", where X = the T-ACE score calculated)
                comment = firstName + " is at risk of a drinking problem (T-ACE score = " + score + ")";
                color = MetricsColorEnum.Error.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, "");

                // add G4 secondary text item: Red - ""Refer to clinic urgently""
                comment = "Refer to clinic urgently";
                color = MetricsColorEnum.Error.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_dashboard;
                AddVisitDataStatus(q1, comment, color, type, "");

                // add amber item to G9 client summary: ""You may need support to reduce your drinking""
                comment = "You may need support to reduce your drinking";
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, "");
            }
            else if (score < 2)
            {
                // add to green items in progress screen (use case 2) (""Lethabo was coping well"")
                comment = firstName + " is not at risk for alcohol abuse";
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, "");
               
            }
            return true;
        }
        private Boolean ManageIdDocs(List<VisitData> idDocs, string firstName)
        {
            var comment = "";
            var color = "";
            var type = "";
            var section = "Department of Home Affairs referrals";

            var q1 = new VisitData();
            var q2 = new VisitData();

            foreach (VisitData obj in idDocs)
            {
                if (obj.Question == "Does {client} have an ID document?")
                {
                    q1 = obj;
                }
                else if (obj.Question == "Is {client} a South African citizen or permanent resident?")
                {
                    q2 = obj;
                }
            }

            if (q1.QuestionAnswer == "No" && q2.QuestionAnswer == "Yes")
            {
                // IF this is not already unchecked in the referrals list for this client; add to referrals items list under Department of Home Affairs referrals(""Lethabo doesn't have an ID book)
                comment = firstName + " doesn't have an ID book";
                color = MetricsColorEnum.None.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_referral;
                AddVisitDataStatus(q1, comment, color, type, section);

                // add to amber items in progress screen(""Lethabo doesn't have an ID book"")
                comment = firstName + " doesn't have an ID book";
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, "");

                // add amber item to G9 client summary: ""Go to Home Affairs to apply for your ID book.This will allow you to apply for the child social grant as soon as the baby is born.""
                comment = "Go to Home Affairs to apply for your ID book.This will allow you to apply for the child social grant as soon as the baby is born.";
                color = MetricsColorEnum.Warning.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, "");
            }

            if (q1.QuestionAnswer == "Yes")
            {
                // add to green items in progress screen(use case 2)(""Lethabo has an ID book"")
                comment = firstName + " has an ID book";
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_progress;
                AddVisitDataStatus(q1, comment, color, type, "");

                // add green item to G9 client summary: ""You have your ID document & can apply for a child social grant once the baby is born!""
                comment = "You have your ID document & can apply for a child social grant once the baby is born!";
                color = MetricsColorEnum.Success.ToString();
                type = Constants.GrowGreatSettings.visit_data_client_summary;
                AddVisitDataStatus(q1, comment, color, type, "");
            }
            return true;
        }
        private Boolean AddVisitDataStatus(VisitData input, string comment, string color, string type, string section)
        {
            var visitDataStatus = GetVisitDataStatusFromInputModel(input);
            visitDataStatus.Id = Guid.NewGuid();
            visitDataStatus.Comment = comment;
            visitDataStatus.Color = color;
            visitDataStatus.Type = type;
            visitDataStatus.Section = section;
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

