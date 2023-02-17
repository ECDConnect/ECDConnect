using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
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
        private VisitManager _visitManager;
        private VisitDataStatusManager _visitDataStatusManager;
        private string _applicationUserId;

        public VisitDataManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitManager visitManager,
            VisitDataStatusManager visitDataStatusManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _visitManager = visitManager;

            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            _visitDataStatusManager = visitDataStatusManager;
        }

        public Boolean AddChildVisitData(CMSVisitDataInputModel input)
        {
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            // first add all your questions and answers
            foreach (CMSQuestion obj in input.questions)
            {
                VisitData visitData = (VisitData)GetVisitDataFromInputModel(obj, input.VisitId, input.VisitName, input.VisitSection);
                visitDataRepo.Insert(visitData);
            }

            // then handle status data
            _visitDataStatusManager.ManageVisitDataStatus(input.InfantId, Constants.GrowGreatSettings.client_child, input.VisitId);

            return true;
        }


        public Boolean AddAntenatalVisitData(CMSVisitDataInputModel input)
        {
            var visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);

            // first add all your questions and answers
            foreach (CMSQuestion obj in input.questions)
            {
                VisitData visitData = (VisitData)GetVisitDataFromInputModel(obj, input.VisitId, input.VisitName, input.VisitSection);
                visitDataRepo.Insert(visitData);
            }

            // then handle status data
            _visitDataStatusManager.ManageVisitDataStatus(input.MotherId, Constants.GrowGreatSettings.client_mother, input.VisitId);

            return true;
        }

        private VisitData GetVisitDataFromInputModel(CMSQuestion input, String visitId, String visitName, String visitSection)
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
                UpdatedBy = _applicationUserId,
                VisitId = new Guid(visitId),
                VisitName = visitName,
                VisitSection = visitSection,
                Question = input.Question,
                QuestionAnswer = input.Answer
            };
        }
    }
}

