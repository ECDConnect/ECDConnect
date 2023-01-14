using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyModel;
using NPOI.OpenXmlFormats.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Visits
{
    public class VisitManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;

        public VisitManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
        }

        public Visit AddVisit(VisitModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var visit = GetVisitFromInputModel(input, applicationUserId);

            return repository.Insert(visit);
        }

        private Visit GetVisitFromInputModel(VisitModel input, string applicationUserId)
        {
            if (input == null)
            {
                return null;
            }

            return new Visit()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                PlannedVisitDate = input.PlannedVisitDate,
                VisitTypeId = input.VisitType.Id,
                MotherId = input.MotherId,
                InfantId = null,
                Risk = input.Risk,
                UpdatedBy = applicationUserId
            };
        }

        public string GetFirstMissedVisitForMother(Guid motherId)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var message = "";

            var missedVisit = (
                from visit in visitRepo.GetAll().Where(x => x.MotherId.Equals(motherId) && !x.Attended).OrderBy(x => x.PlannedVisitDate)
                join visitType in visitTypeRepo.GetAll().Where(y => y.Type.Equals("mother"))
                on visit.VisitTypeId equals visitType.Id
                select visit
            ).FirstOrDefault();

            if (missedVisit != null )
            {
                message = missedVisit.VisitType.NormalizedName + " overdue";
            }

            return message;
        }
    }
}

