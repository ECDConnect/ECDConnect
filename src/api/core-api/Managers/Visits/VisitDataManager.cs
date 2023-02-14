using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.Enums;
using ECDLink.ContentManagement.Repositories;
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
    public class VisitDataManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private ContentManagementRepository _contentManagementRepository;

        public VisitDataManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            ContentManagementRepository contentManagementRepository)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _contentManagementRepository = contentManagementRepository;
        }

        public VisitData AddVisitData(VisitDataModel input, string localeId)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: applicationUserId);
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);

            var visitData = GetVisitDataFromInputModel(input, applicationUserId);

            if (visitData != null)
            {

                Visit visitRecord = (
                    from visit in visitRepo.GetAll().Where(x => x.Id == visitData.Id)
                    join visitType in visitTypeRepo.GetAll().Where(y => y.Type == Constants.GrowGreatSettings.client_mother) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();


                ManageVisitReferrals(visitData, applicationUserId, localeId, visitRecord.VisitType.Name);
            }

            return visitDataRepo.Insert(visitData);
        }

        private VisitData GetVisitDataFromInputModel(VisitDataModel input, string applicationUserId)
         {
             if (input == null)
             {
                 return null;
             }

             return new VisitData()
             {
                 Id = Guid.NewGuid(),
                 IsActive = true,
                 InsertedDate = DateTime.Now,
                 UpdatedDate = DateTime.Now,
                 UpdatedBy = applicationUserId,
                 VisitId = input.Visit.Id,
                 CmsVisitNameContentId = input.CmsVisitNameContentId,
                 CmsQuestionnaireContentId = input.CmsQuestionnaireContentId,
                 CmsQuestionContentId = input.CmsQuestionContentId,
                 CmsAnswerContentId = input.CmsAnswerContentId,
                 QuestionAnswer = input.QuestionAnswer
             };
         }

        private Boolean ManageVisitReferrals(VisitData input, string applicationUserId, string localeId, string visitName)
        {
            var _localeId = new Guid(localeId);
            // Available types

            // ClientDashboardAlert -> G4
            // ClientSummaryDownload -> G9
            // Referral
            // Progress

            CMSQuestion question = (CMSQuestion)_contentManagementRepository.GetById(input.CmsQuestionContentId, _localeId);
            
            var comment = "";
            var color = "";
            var type = "";
            var visitDataStatus = GetVisitDataStatusFromInputModel(input, applicationUserId);

            // Health care
            if (question.Name == "Has {client} gone to the clinic for her first antenatal visit?")
            {
                if (input.QuestionAnswer == "No")
                {
                    // this should add a referral to the list(""Pregnancy not booked"") AND
                    comment = "Pregnancy not booked";
                    color = MetricsIconEnum.Warning.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_referral;
                    
                    visitDataStatus.Comment = comment;
                    visitDataStatus.Color = color;
                    visitDataStatus.Type = type;

                    AddVisitDataStatus(visitDataStatus);

                    // add flag to G4 secondary alert: red alert, ""Refer to clinic""
                    comment = "Refer to clinic";
                    color = MetricsIconEnum.Error.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_dashboard;

                    visitDataStatus.Comment = comment;
                    visitDataStatus.Color = color;
                    visitDataStatus.Type = type;

                    AddVisitDataStatus(visitDataStatus);
                } 
                else if (input.QuestionAnswer == "Yes")
                {
                    // a ""green"" item is added to the client progress list ""Pregnancy booked""
                    comment = "Pregnancy booked";
                    color = MetricsIconEnum.Success.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_progress;

                    visitDataStatus.Comment = comment;
                    visitDataStatus.Color = color;
                    visitDataStatus.Type = type;
                    AddVisitDataStatus(visitDataStatus);

                    // a green item is added to G9 client download summary ""You are up to date with your clinic visits!""
                    comment = "You are up to date with your clinic visits!";
                    color = MetricsIconEnum.Success.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_summary;

                    visitDataStatus.Comment = comment;
                    visitDataStatus.Color = color;
                    visitDataStatus.Type = type;
                    AddVisitDataStatus(visitDataStatus);
                }
            } 
            else if (question.Name == "MUAC measurement")
            {
                var questionAnswer = Int32.Parse(input.QuestionAnswer);

                if (questionAnswer < 22)
                {
                    // add to referrals items list(""May be underweight - MUAC less than 22cm"") red
                    comment = "May be underweight - MUAC less than 22cm";
                    color = MetricsIconEnum.Error.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_referral;

                    visitDataStatus.Comment = comment;
                    visitDataStatus.Color = color;
                    visitDataStatus.Type = type;
                    AddVisitDataStatus(visitDataStatus);

                    // add G4 secondary text item: ""Refer to clinic urgently""(this is the highest - priority item & will be shown)
                    comment = "Refer to clinic urgently";
                    color = MetricsIconEnum.Error.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_dashboard;

                    visitDataStatus.Comment = comment;
                    visitDataStatus.Color = color;
                    visitDataStatus.Type = type;
                    AddVisitDataStatus(visitDataStatus);

                    // add green item to G9 client summary: ""You might be underweight: eat 3 meals every day""
                    comment = "You might be underweight: eat 3 meals every day";
                    color = MetricsIconEnum.Success.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_summary;

                    visitDataStatus.Comment = comment;
                    visitDataStatus.Color = color;
                    visitDataStatus.Type = type;
                    AddVisitDataStatus(visitDataStatus);

                    // TODO: add additional visit item with ""Underweight"" secondary text -please see G3.7 Other / Additional visits

                }
                else if (questionAnswer >= 22)
                {
                    // add to green items in progress screen(use case 2) (""MUAC over 22cm"")
                    comment = "MUAC over 22cm";
                    color = MetricsIconEnum.Success.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_referral;

                    visitDataStatus.Comment = comment;
                    visitDataStatus.Color = color;
                    visitDataStatus.Type = type;
                    AddVisitDataStatus(visitDataStatus);

                    // add green item to G9 client summary: ""According to your mid-upper arm circumference, you are a healthy weight""
                    comment = "According to your mid-upper arm circumference, you are a healthy weight";
                    color = MetricsIconEnum.Success.ToString();
                    type = Constants.GrowGreatSettings.visit_data_client_summary;

                    visitDataStatus.Comment = comment;
                    visitDataStatus.Color = color;
                    visitDataStatus.Type = type;
                    AddVisitDataStatus(visitDataStatus);
                }

                // TODO: IF the user enters a MUAC less than 22cm, ask this question again at the first visit 3 months after the MUAC measurement was entered."

            }
            return true;
        }

        private VisitDataStatus GetVisitDataStatusFromInputModel(VisitData input, string applicationUserId)
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
                UpdatedBy = applicationUserId,
                VisitDataId = input.Id
            };

        }

        private VisitDataStatus AddVisitDataStatus(VisitDataStatus input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: applicationUserId);
            return repository.Insert(input);
        }

        public List<CMSVisit> GetAllAntenatalVisits(Guid visitId, string contentTypeId, string localeId, string names)
        {
            var _contentTypeId = Int32.Parse(contentTypeId);
            var _localeId = new Guid(localeId);

            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<VisitData>(userContext: applicationUserId);

            List<CMSVisit> visits = new List<CMSVisit>();
            var linkedRecords = _contentManagementRepository.GetAll(_contentTypeId, _localeId);

            foreach (var obj in linkedRecords)
            {
                IDictionary<string, object> propData = (IDictionary<string, object>)obj;
                var item = new CMSVisit();

                foreach (var property in propData.Keys)
                {
                    string value = propData[property] == null ? "" : propData[property].ToString();
                    if (property == Constants.GrowGreatSettings.visit_id)
                    {
                        item.Id = value;

                    } else if (property == Constants.GrowGreatSettings.visit_name)
                    {
                        item.Name = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_description)
                    {
                        item.Description = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_icon)
                    {
                        item.Icon = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_sequence)
                    {
                        item.Sequence = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_primary_color)
                    {
                        item.PrimaryColor = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_secondary_color)
                    {
                        item.SecondaryColor = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_linkedQuestionnaires)
                    {
                        int[] arrIds = value.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                        item.LinkedQuestionnaires = GetCMSLinkedQuestionnaires(visitId, arrIds, _localeId);
                    }
                }

                // only add and fetch status if part of names
                if (names.IndexOf(item.Name) != -1)
                {
                    VisitData visitData = repository.GetAll().Where(x => x.VisitId == visitId && x.CmsVisitNameContentId.ToString() == item.Id).FirstOrDefault();
                    if (visitData != null)
                    {
                        item.IsCompleted = true;
                    }
                    visits.Add(item);
                }
            }
            return visits;
        }

        public List<CMSQuestionnaire> GetCMSLinkedQuestionnaires(Guid visitId, int[] contentIds, Guid localeId)
        {
            List<CMSQuestionnaire> items = new List<CMSQuestionnaire>();
            var item = new CMSQuestionnaire();

            var linkedRecords = _contentManagementRepository.GetByIds(localeId, contentIds);
            foreach (var obj in linkedRecords)
            {
                IDictionary<string, object> propData = (IDictionary<string, object>)obj;
                item = new CMSQuestionnaire();
                foreach (var property in propData.Keys)
                {
                    string value = propData[property] == null ? "" : propData[property].ToString();
                    if (property == Constants.GrowGreatSettings.visit_id)
                    {
                        item.Id = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_name)
                    {
                        item.Name = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_description)
                    {
                        item.Description = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_description_icon)
                    {
                        item.DescriptionIcon = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_image)
                    {
                        item.Image = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_type)
                    {
                        item.Type = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_heading)
                    {
                        item.Heading = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_subheading)
                    {
                        item.SubHeading = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_heading_icon)
                    {
                        item.HeadingIcon = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_heading_color)
                    {
                        item.HeadingColor = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_linkedQuestions)
                    {
                        if (value != "")
                        {
                            int[] arrIds = value.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                            item.LinkedQuestions = GetCMSLinkedQuestions(visitId, arrIds, localeId);
                        }
                    }
                }
                items.Add(item);
            }

            return items;
        }

        public List<CMSQuestion> GetCMSLinkedQuestions(Guid visitId, int[] contentIds, Guid localeId)
        {
            List<CMSQuestion> items = new List<CMSQuestion>();
            var item = new CMSQuestion();

            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<VisitData>(userContext: applicationUserId);

            var linkedRecords = _contentManagementRepository.GetByIds(localeId, contentIds);
            foreach (var obj in linkedRecords)
            {
                IDictionary<string, object> propData = (IDictionary<string, object>)obj;
                item = new CMSQuestion();
                foreach (var property in propData.Keys)
                {
                    string value = propData[property] == null ? "" : propData[property].ToString();
                    if (property == Constants.GrowGreatSettings.visit_id)
                    {
                        item.Id = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_name)
                    {
                        item.Name = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_description)
                    {
                        item.Description = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_image)
                    {
                        item.Image = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_type)
                    {
                        item.Type = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_sequence)
                    {
                        item.Sequence = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_linkedAnswerOptions)
                    {
                        if (value != "")
                        {
                            int[] arrIds = value.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                            item.LinkedAnswerOptions = GetCMSLinkedAnswers(arrIds, localeId);
                        }
                    }
                }

                VisitData visitData = repository.GetAll().Where(x => x.VisitId == visitId && x.CmsQuestionContentId.ToString() == item.Id).FirstOrDefault();
                if (visitData != null)
                {
                    item.QuestionAnswer = visitData.QuestionAnswer;
                }

                items.Add(item);
            }

            return items;
        }

        public List<CMSAnswerOption> GetCMSLinkedAnswers(int[] contentIds, Guid localeId)
        {
            List<CMSAnswerOption> items = new List<CMSAnswerOption>();
            var item = new CMSAnswerOption();

            var linkedRecords = _contentManagementRepository.GetByIds(localeId, contentIds);
            foreach (var obj in linkedRecords)
            {
                IDictionary<string, object> propData = (IDictionary<string, object>)obj;
                item = new CMSAnswerOption();
                foreach (var property in propData.Keys)
                {
                    string value = propData[property] == null ? "" : propData[property].ToString();
                    if (property == Constants.GrowGreatSettings.visit_id)
                    {
                        item.Id = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_name)
                    {
                        item.Name = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_description)
                    {
                        item.Description = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_image)
                    {
                        item.Image = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_type)
                    {
                        item.Type = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_sequence)
                    {
                        item.Sequence = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_video)
                    {
                        item.Video = value;
                    }
                }
                items.Add(item);
            }
            return items;
        }
    }
}

