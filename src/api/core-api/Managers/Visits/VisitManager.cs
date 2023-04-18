using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Integration;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using iTextSharp.text;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Visits
{
    public class VisitManager: BaseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitType, Guid> _visitTypeRepo;

        private string _applicationUserId;

        public VisitManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;

            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            _visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            _visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: _applicationUserId);
        }

        public Visit AddVisit(VisitModel input)
        {
            var visit = GetVisitFromInputModel(input);
            return _visitRepo.Insert(visit);
        }

        private Visit GetVisitFromInputModel(VisitModel input)
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
                Risk = input.Risk == null ? Constants.GGSettings.normal_risk : input.Risk,
                Comment = input.Comment,
                UpdatedBy = _applicationUserId
            };
        }

        public Visit AddAdditionalVisit(VisitModel input)
        {
            var visit = GetAdditionalVisitFromInputModel(input);
            return _visitRepo.Insert(visit);
        }

        private Visit GetAdditionalVisitFromInputModel(VisitModel input)
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
                VisitTypeId = input.VisitType.Id,
                MotherId = input.MotherId,
                InfantId = input.InfantId,
                Risk = input.Risk == null ? Constants.GGSettings.normal_risk : input.Risk,
                Comment = input.Comment,
                UpdatedBy = _applicationUserId,
                LinkedVisitId = input.LinkedVisitId
            };
        }
        public string GetFirstMissedVisit(Guid Id, string type)
        {
            var message = "";
            Visit missedVisit = null;
            DateTime today = DateTime.Today;

            if (type == Constants.GGSettings.client_mother)
            {
                missedVisit = (
                    from visit in _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date <= today.Date).OrderBy(x => x.PlannedVisitDate)
                    join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_mother)) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();
            } else
            {
                missedVisit = (
                    from visit in _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date <= today.Date).OrderBy(x => x.PlannedVisitDate)
                    join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_child)) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();
            }

            if (missedVisit != null)
            {
                message = missedVisit.VisitType.NormalizedName + " overdue " + missedVisit.PlannedVisitDate.ToString("dd MMM yyyy");
            }
            return message;
        }
        public string GetNextVisitLessThan7DaysAway(Guid Id, string type, Boolean withinWeek)
        {
            var message = "";

            Visit nextVisit = null;
            DateTime today = DateTime.Today;

            if (withinWeek)
            {
                DateTime monday = StartOfWeek(today, DayOfWeek.Monday);
                DateTime next7Days = monday.AddDays(6);

                if (type == Constants.GGSettings.client_mother)
                {
                    nextVisit = (
                        from visit in _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_mother)) on visit.VisitTypeId equals visitType.Id
                        select visit
                    ).LastOrDefault();
                }
                else
                {
                    nextVisit = (
                        from visit in _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_child)) on visit.VisitTypeId equals visitType.Id
                        select visit
                    ).LastOrDefault();
                }

            }
            else
            {
                DateTime next7Days = today.AddDays(7);

                if (type == Constants.GGSettings.client_mother)
                {
                    nextVisit = (
                        from visit in _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date < next7Days.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_mother)) on visit.VisitTypeId equals visitType.Id
                        select visit
                    ).LastOrDefault();
                }
                else
                {
                    nextVisit = (
                        from visit in _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date < next7Days.Date).OrderBy(x => x.PlannedVisitDate)
                        join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_child)) on visit.VisitTypeId equals visitType.Id
                        select visit
                    ).LastOrDefault();
                }
            }

            if (nextVisit != null)
            {
                message = nextVisit.VisitType.NormalizedName + " due " + nextVisit.PlannedVisitDate.ToString("dd MMM yyyy");
            }

            return message;
        }
        public string GetNextVisitMoreThan7DaysAway(Guid Id, string type)
        {
            var message = "";

            Visit nextVisit = null;
            DateTime today = DateTime.Today;
            DateTime next7Days = today.AddDays(7);

            if (type == Constants.GGSettings.client_mother)
            {
                nextVisit = (
                    from visit in _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= next7Days.Date).OrderBy(x => x.PlannedVisitDate)
                    join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_mother)) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();
            }
            else
            {
                nextVisit = (
                    from visit in _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= next7Days.Date).OrderBy(x => x.PlannedVisitDate)
                    join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_child)) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();
            }

            if (nextVisit != null)
            {
                message = nextVisit.VisitType.NormalizedName + " due " + nextVisit.PlannedVisitDate.ToString("dd MMM yyyy");
            }

            return message;
        }
        public int GetMissedVisitsForHCWCount(string HCWId, string type)
        {
            var visitCount = 0;
            DateTime today = DateTime.Today;
            DateTime monday = StartOfWeek(today, DayOfWeek.Monday);
            DateTime friday = StartOfWeek(today, DayOfWeek.Friday);

            if (type == Constants.GGSettings.client_mother)
            {
                visitCount = _visitRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.Equals(HCWId) && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= today.Date).Count();
            }

            return visitCount;
        }
        public int GetVisitsDueForHCWCount(string HCWId, string type)
        {
            var visitCount = 0;
            DateTime today = DateTime.Today;
            DateTime monday = StartOfWeek(today, DayOfWeek.Monday);
            DateTime sunday = monday.AddDays(6);

            if (type == Constants.GGSettings.client_mother)
            {
                visitCount = _visitRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.Equals(HCWId) && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= sunday.Date).Count();
            }
            else
            {
                visitCount = _visitRepo.GetAll().Where(x => x.Infant.Caregiver.HealthCareWorker.UserId.Equals(HCWId) && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= sunday.Date).Count();
            }

            return visitCount;
        }
        public DateTime? GetClientsNextVisitDate(Guid Id, string type)
        {
            Visit nextVisit = null;
            DateTime today = DateTime.Today;

            if (type == Constants.GGSettings.client_mother)
            {
                nextVisit = (
                    from visit in _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= today.Date).OrderBy(x => x.PlannedVisitDate)
                    join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_mother)) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();
            }
            else
            {
                nextVisit = (
                    from visit in _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= today.Date).OrderBy(x => x.PlannedVisitDate)
                    join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_child)) on visit.VisitTypeId equals visitType.Id
                    select visit
                ).FirstOrDefault();
            }

            if (nextVisit != null)
            {
                return nextVisit.PlannedVisitDate.Date;
            }
            return null;
        }
        public List<Visit> GetVisitsForClient(string id, string type) {

            List<Visit> allVisits = new List<Visit>();
            if (type == Constants.GGSettings.client_mother) {
                allVisits = (
                    from visit in _visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitType in _visitTypeRepo.GetAll().Where(y => y.Type == Constants.GGSettings.client_mother) on visit.VisitTypeId equals visitType.Id
                    select visit 
                ).ToList();
            } else {
               allVisits = (
                   from visit in _visitRepo.GetAll().Where(x => x.Infant.UserId == id).OrderBy(x => x.PlannedVisitDate)
                   join visitType in _visitTypeRepo.GetAll().Where(y => y.Type == Constants.GGSettings.client_child) on visit.VisitTypeId equals visitType.Id
                   select visit
               ).ToList();
            }
            foreach (var _visit in allVisits)
            {
                _visit.OrderDate = (_visit.VisitType.Name == Constants.GGSettings.additional_visits ? _visit.InsertedDate : _visit.PlannedVisitDate);
            }

            return allVisits.OrderBy(x => x.OrderDate).ToList();

        }
        public int GetTotalVisitsForWeek(String id, string type, Boolean currentWeek)
        {
            DateTime today = DateTime.Today;
            var monday = StartOfWeek(today, DayOfWeek.Monday);
            var next7Days = monday.AddDays(6);
            var totalVisits = 0;

            if (!currentWeek)
            {
                int days = DateTime.Now.DayOfWeek - DayOfWeek.Sunday;
                DateTime pastDate = DateTime.Now.AddDays(-days);
                monday = StartOfWeek(pastDate, DayOfWeek.Monday);
                next7Days = monday.AddDays(6);
            } 

            if (type == Constants.GGSettings.client_mother)
            {
                totalVisits = _visitRepo.GetAll().Where(x => x.MotherId.ToString() == id && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date).OrderBy(x => x.PlannedVisitDate).Count();
            }
            else
            {
                totalVisits = _visitRepo.GetAll().Where(x => x.InfantId.ToString() == id && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date).OrderBy(x => x.PlannedVisitDate).Count();
            }
            return totalVisits;
        }
        public Guid GetLastCompletedVisitId(String id, string type)
        {
            Guid visitId;

            if (type == Constants.GGSettings.client_mother)
            {
                visitId = (
                    from visit in _visitRepo.GetAll().Where(x => x.MotherId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                    join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_mother)) on visit.VisitTypeId equals visitType.Id
                    select visit.Id
                ).FirstOrDefault();
            }
            else
            {
                visitId = (
                    from visit in _visitRepo.GetAll().Where(x => x.InfantId.ToString() == id && x.Attended == true).OrderBy(x => x.PlannedVisitDate)
                    join visitType in _visitTypeRepo.GetAll().Where(y => y.Type.Equals(Constants.GGSettings.client_child)) on visit.VisitTypeId equals visitType.Id
                    select visit.Id
                ).FirstOrDefault();
            }
            return visitId;
        }

    }
}

