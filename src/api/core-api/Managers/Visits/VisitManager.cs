using EcdLink.Api.CoreApi.GraphApi.Models;
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
                Attended = input.Attended,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                PlannedVisitDate = input.PlannedVisitDate,
                VisitTypeId = input.VisitType.Id,
                MotherId = input.MotherId,
                InfantId = input.InfantId,
                Risk = input.Risk,
                UpdatedBy = applicationUserId
            };
        }

        public string GetFirstMissedVisit(Guid Id, string type)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var message = "";
            Visit missedVisit = null;
            DateTime today = DateTime.Today;

            if (type == "mother")
            {
                missedVisit = (
                    from visit in visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate <= today).OrderBy(x => x.PlannedVisitDate)
                    join visitType in visitTypeRepo.GetAll().Where(y => y.Type.Equals("mother")) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();
            } else
            {
                missedVisit = (
                    from visit in visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate <= today).OrderBy(x => x.PlannedVisitDate)
                    join visitType in visitTypeRepo.GetAll().Where(y => y.Type.Equals("child")) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();
            }

            if (missedVisit != null )
            {
                message = missedVisit.VisitType.NormalizedName + " overdue " + missedVisit.PlannedVisitDate.ToString("dd MMM yyyy");
            }
            return message;
        }

        public string GetNextVisitLessThan7DaysAway(Guid Id, string type)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var message = "";

            Visit nextVisit = null;
            DateTime today = DateTime.Today;
            DateTime next7Days = today.AddDays(7);

            if (type == "mother")
            {
                nextVisit = (
                    from visit in visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate < next7Days).OrderBy(x => x.PlannedVisitDate)
                    join visitType in visitTypeRepo.GetAll().Where(y => y.Type.Equals("mother")) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).LastOrDefault();
            } else
            {
                nextVisit = (
                    from visit in visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate < next7Days).OrderBy(x => x.PlannedVisitDate)
                    join visitType in visitTypeRepo.GetAll().Where(y => y.Type.Equals("child")) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).LastOrDefault();
            }

            if (nextVisit != null)
            {
                message = nextVisit.VisitType.NormalizedName + " due " + nextVisit.PlannedVisitDate.ToString("dd MMM yyyy");
            }

            return message;
        }

        public string GetNextVisitMoreThan7DaysAway(Guid Id, string type)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var message = "";

            Visit nextVisit = null;
            DateTime today = DateTime.Today;
            DateTime next7Days = today.AddDays(7);

            if (type == "mother")
            {
                nextVisit = (
                    from visit in visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate >= next7Days).OrderBy(x => x.PlannedVisitDate)
                    join visitType in visitTypeRepo.GetAll().Where(y => y.Type.Equals("mother")) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();
            }
            else
            {
                nextVisit = (
                    from visit in visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate >= next7Days).OrderBy(x => x.PlannedVisitDate)
                    join visitType in visitTypeRepo.GetAll().Where(y => y.Type.Equals("child")) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();
            }

            if (nextVisit != null)
            {
                message = nextVisit.VisitType.NormalizedName + " due " + nextVisit.PlannedVisitDate.ToString("dd MMM yyyy");
            }

            return message;
        }
    }
}

