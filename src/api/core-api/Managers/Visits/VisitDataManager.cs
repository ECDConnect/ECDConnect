using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.Managers.Visits
{
    public class VisitDataManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;

        public VisitDataManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
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
                 CmsVisitNameTypeId = input.CmsVisitNameTypeId,
                 CmsVisitQuestionnaireTypeId = input.CmsVisitQuestionnaireTypeId,
                 CmsVisitQuestionTypeId = input.CmsVisitQuestionTypeId,
                 CmsVisitAnswerTypeId = input.CmsVisitAnswerTypeId,
                 CmsContentId = input.CmsContentId,
                 CmsContentTypeFieldId = input.CmsContentTypeFieldId,
                 CmsContentValue = input.CmsContentValue,
                 QuestionAnswer = input.QuestionAnswer
             };
         }
    }
}

