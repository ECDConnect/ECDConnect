using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
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

        public VisitData AddVisitData(VisitDataModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<VisitData>(userContext: applicationUserId);
            var visitData = GetVisitDataFromInputModel(input, applicationUserId);

            return repository.Insert(visitData);
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
                    else if (property == Constants.GrowGreatSettings.visit_color)
                    {
                        item.Color = value;
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
                    else if (property == Constants.GrowGreatSettings.visit_heading)
                    {
                        item.Heading = value;
                    }
                    else if (property == Constants.GrowGreatSettings.visit_subheading)
                    {
                        item.SubHeading = value;
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

