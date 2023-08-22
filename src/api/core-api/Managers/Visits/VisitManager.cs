using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Users;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Visits
{
    public class VisitManager : BaseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitType, Guid> _visitTypeRepo;
        private IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;
        private IGenericRepository<VisitData, Guid> _visitDataRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private UserLicenseManager _userLicenseManager;
        private HierarchyEngine _hierarchyEngine;

        private string _applicationUserId;

        public VisitManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            UserLicenseManager userLicenseManager, HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _userLicenseManager = userLicenseManager;
            _hierarchyEngine = hierarchyEngine;

            _applicationUserId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetIntegrationUserId());
            _visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            _visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: _applicationUserId);
            _visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            _visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);
            _practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
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
                PractitionerId = input.PractitionerId,
                Risk = input.Risk ?? Constants.GGSettings.normal_risk,
                Comment = input.Comment,
                UpdatedBy = _applicationUserId,
                LinkedVisitId = input.LinkedVisitId != null ? input.LinkedVisitId : null
            };
        }
        public Visit AddAdditionalVisit(VisitModel input)
        {
            var visit = GetAdditionalVisitFromInputModel(input);
            return _visitRepo.Insert(visit);
        }
        public Visit AddVisitForPractitioner(VisitModel input)
        {
            var visit = GetPractitionerVisitFromInputModel(input);
            return _visitRepo.Insert(visit);
        }
        private Visit GetPractitionerVisitFromInputModel(VisitModel input)
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
                PractitionerId = input.PractitionerId,
                Risk = input.Risk ?? Constants.GGSettings.normal_risk,
                Comment = input.Comment,
                UpdatedBy = _applicationUserId,
                LinkedVisitId = input.LinkedVisitId,
                ActualVisitDate = input.ActualVisitDate,
                PlannedVisitDate = input.PlannedVisitDate
            };
        }

        public Visit AddVisitForCoach(VisitModel input)
        {
            var visit = GetCoachVisitFromInputModel(input);
            return _visitRepo.Insert(visit);
        }
        private Visit GetCoachVisitFromInputModel(VisitModel input)
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
                TraineeId = input.TraineeId,
                PractitionerId = input.PractitionerId,
                CoachId = input.CoachId,
                Risk = input.Risk ?? Constants.GGSettings.normal_risk,
                Comment = input.Comment,
                UpdatedBy = _applicationUserId,
                LinkedVisitId = input.LinkedVisitId,
                ActualVisitDate = input.ActualVisitDate,
                PlannedVisitDate = input.PlannedVisitDate
            };
        }

        public Visit AddVisitForTrainee(VisitModel input)
        {
            var visit = GetTraineeVisitFromInputModel(input);
            return _visitRepo.Insert(visit);
        }

        private Visit GetTraineeVisitFromInputModel(VisitModel input)
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
                TraineeId = input.TraineeId,
                Risk = input.Risk ?? Constants.GGSettings.normal_risk,
                UpdatedBy = _applicationUserId,
                LinkedVisitId = input.LinkedVisitId,
                ActualVisitDate = input.ActualVisitDate,
                PlannedVisitDate = input.PlannedVisitDate
            };
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
                PractitionerId = input.PractitionerId,
                Risk = input.Risk ?? Constants.GGSettings.normal_risk,
                Comment = input.Comment,
                UpdatedBy = _applicationUserId,
                LinkedVisitId = input.LinkedVisitId,
                ActualVisitDate = input.ActualVisitDate,
                PlannedVisitDate = input.PlannedVisitDate
            };
        }

        #region Reporting
        public string GetFirstMissedVisit(Guid Id, string type)
        {
            var message = "";
            Visit missedVisit = null;
            DateTime today = DateTime.Today;

            if (type == Constants.GGSettings.client_mother)
            {
                missedVisit = _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date <= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.GGSettings.client_child)
            {
                missedVisit = _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date <= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                missedVisit = _visitRepo.GetAll().Where(x => x.PractitionerId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date <= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }

            if (missedVisit != null)
            {
                message = missedVisit.VisitType.NormalizedName + " overdue " + missedVisit.PlannedVisitDate.ToString("dd MMM yyyy");
            }
            return message;
        }
        public string GetNextVisitLessThan7DaysAway(Guid Id, string type, bool withinWeek)
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
                    nextVisit = _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
                else if (type == Constants.GGSettings.client_child)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
                else if (type == Constants.SSSettings.client_practitioner)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
            }
            else
            {
                DateTime next7Days = today.AddDays(7);

                if (type == Constants.GGSettings.client_mother)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date < next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
                else if (type == Constants.GGSettings.client_child)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date < next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
                else if (type == Constants.SSSettings.client_practitioner)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date < next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
            }

            if (nextVisit != null)
            {
                if (nextVisit.DueDate == null)
                {
                    message = nextVisit.VisitType.NormalizedName + " due " + nextVisit.PlannedVisitDate.Date.ToString("dd MMM yyyy");
                }
                else
                {
                    message = nextVisit.VisitType.NormalizedName + " due " + nextVisit.DueDate.Value.Date.ToString("dd MMM yyyy");
                }
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
                nextVisit = _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date >= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.GGSettings.client_child)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date >= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date >= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }

            if (nextVisit != null)
            {
                if (nextVisit.DueDate == null)
                {
                    message = nextVisit.VisitType.NormalizedName + " due " + nextVisit.PlannedVisitDate.Date.ToString("dd MMM yyyy");
                }
                else
                {
                    message = nextVisit.VisitType.NormalizedName + " due " + nextVisit.DueDate.Value.Date.ToString("dd MMM yyyy");
                }
            }

            return message;
        }
        public int GetMissedVisitsForHCWCount(string HCWId, string type)
        {
            var visitCount = 0;
            DateTime today = DateTime.Today;

            if (type == Constants.GGSettings.client_mother)
            {
                visitCount = _visitRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.Equals(HCWId) && x.Mother.IsActive && !x.Attended && x.PlannedVisitDate.Date <= today.Date).Count();
            }
            else
            {
                visitCount = _visitRepo.GetAll().Where(x => x.Infant.Caregiver.HealthCareWorker.UserId.Equals(HCWId) && x.Infant.IsActive && !x.Attended && x.PlannedVisitDate.Date <= today.Date).Count();
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
                visitCount = _visitRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.Equals(HCWId) && x.Mother.IsActive && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= sunday.Date && x.VisitType.Type == type).Count();
            }
            else
            {
                visitCount = _visitRepo.GetAll().Where(x => x.Infant.Caregiver.HealthCareWorker.UserId.Equals(HCWId) && x.Infant.IsActive && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= sunday.Date && x.VisitType.Type == type).Count();
            }

            return visitCount;
        }
        public DateTime? GetClientsNextVisitDate(Guid Id, string type)
        {
            Visit nextVisit = null;
            DateTime today = DateTime.Today;

            if (type == Constants.GGSettings.client_mother)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();

            }
            else if (type == Constants.GGSettings.client_child)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }

            if (nextVisit != null)
            {
                return nextVisit.PlannedVisitDate.Date;
            }
            return null;
        }

        public DateTime? GetClientsNextDueVisitDate(Guid Id, string type)
        {
            Visit nextVisit = null;
            DateTime today = DateTime.Today;

            if (type == Constants.GGSettings.client_mother)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.MotherId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.GGSettings.client_child)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.InfantId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId.Equals(Id) && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }

            if (nextVisit != null)
            {
                return nextVisit.DueDate != null ? nextVisit.DueDate.Value.Date : nextVisit.PlannedVisitDate.Date;
            }
            return null;
        }

        public List<Visit> GetVisitsForClient(string id, string type)
        {

            List<Visit> allVisits = new List<Visit>();
            if (type == Constants.GGSettings.client_mother)
            {
                allVisits = _visitRepo.GetAll().Where(x => x.Mother.UserId == id && x.VisitType.Type == Constants.GGSettings.client_mother).OrderBy(y => y.PlannedVisitDate).ToList();
            }
            else if (type == Constants.GGSettings.client_child)
            {
                // returning visits only applicable after infant was registered
                var child_visits = _visitRepo.GetAll().Where(x => x.Infant.UserId == id && 
                                                      x.VisitType.Type == Constants.GGSettings.client_child && 
                                                      x.VisitType.Name != Constants.GGSettings.additional_visits &&
                                                     (x.DueDate.HasValue && x.DueDate.Value.Date.AddDays(1).Date >= x.Infant.InsertedDate.Date)).
                                                     OrderBy(y => y.PlannedVisitDate).ToList();
                var other_visits_due_date = _visitRepo.GetAll().Where(x => x.Infant.UserId == id &&
                                                                 x.VisitType.Type == Constants.GGSettings.client_child &&
                                                                 x.VisitType.Name == Constants.GGSettings.additional_visits &&
                                                                (x.DueDate.HasValue && x.DueDate.Value.Date.AddDays(1).Date >= x.Infant.InsertedDate.Date)).
                                                                OrderBy(y => y.PlannedVisitDate).ToList();
                var other_visits_no_due_date = _visitRepo.GetAll().Where(x => x.Infant.UserId == id &&
                                                                 x.VisitType.Type == Constants.GGSettings.client_child &&
                                                                 x.VisitType.Name == Constants.GGSettings.additional_visits && x.DueDate.HasValue == false &&
                                                                (x.PlannedVisitDate.Date >= x.Infant.InsertedDate.Date)).
                                                                OrderBy(y => y.PlannedVisitDate).ToList();

                allVisits.AddRange(child_visits);
                allVisits.AddRange(other_visits_due_date);
                allVisits.AddRange(other_visits_no_due_date);
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                allVisits = _visitRepo.GetAll().Where(x => x.Practitioner.UserId == id && x.VisitType.Type == Constants.SSSettings.client_practitioner).OrderBy(y => y.PlannedVisitDate).ToList();
            }
            else if (type == Constants.SSSettings.client_trainee)
            {
                allVisits = _visitRepo.GetAll().Where(x => x.Trainee.UserId == id && x.CoachId == null && x.VisitType.Type == Constants.SSSettings.client_trainee).OrderBy(y => y.PlannedVisitDate).ToList();
            }
            else if (type == Constants.SSSettings.client_coach)
            {
                allVisits = _visitRepo.GetAll().Where(x => x.Coach.UserId == id && x.VisitType.Type == Constants.SSSettings.client_coach).OrderBy(y => y.PlannedVisitDate).ToList();
            }

            foreach (var _visit in allVisits)
            {
                // Adding this 1 day to match the next visit's planned date.
                _visit.DueDate = _visit.DueDate != null ? _visit.DueDate.Value.Date.AddDays(1) : _visit.PlannedVisitDate;

                if (_visit.Attended == false)
                {
                    _visit.VisitInProgress = _visitDataRepo.GetAll().Where(x => x.VisitId == _visit.Id).Count() > 0;
                }
                _visit.OrderDate = _visit.DueDate != null ? _visit.DueDate.Value.Date : _visit.PlannedVisitDate;
            }

            var additional_visits = allVisits.Where(x => x.VisitType.Name == Constants.GGSettings.additional_visits).ToList();
            foreach (var item in additional_visits)
            {
                if (item.DueDate == null)
                {
                    var linkedVisit = allVisits.Where(x => x.Id == item.LinkedVisitId).FirstOrDefault();
                    if (linkedVisit != null)
                    {
                        item.OrderDate = linkedVisit.DueDate?.Date;

                    }
                    else
                    {
                        if (item.PlannedVisitDate == default(DateTime))
                        {
                            item.OrderDate = item.InsertedDate.Date;
                        }
                        else
                        {
                            item.OrderDate = item.PlannedVisitDate.Date;
                        }
                    }
                }
            }

            return allVisits.OrderBy(x => x.OrderDate).ToList();
        }
        public int GetTotalVisitsForWeek(string id, string type, bool currentWeek)
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
                totalVisits = _visitRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId == id && x.Mother.IsActive && x.Attended && x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Date >= monday.Date && x.ActualVisitDate.Value.Date <= next7Days.Date).OrderBy(x => x.ActualVisitDate).Distinct().Count();
            }
            else
            {
                totalVisits = _visitRepo.GetAll().Where(x => x.Infant.Caregiver.HealthCareWorker.UserId == id && x.Infant.IsActive && x.Attended && x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Date >= monday.Date && x.ActualVisitDate.Value.Date <= next7Days.Date).OrderBy(x => x.ActualVisitDate).Distinct().Count();
            }
            return totalVisits;
        }

        public int GetTotalVisitsPlannedForPeriod(
            string heathCareWorkerId,
            string clientType,
            DateTime startDate,
            DateTime endDate)
        {
            IQueryable<Visit> totalPlannedVisits = _visitRepo.GetAll()
                    .Where(x => !x.Attended
                    && x.PlannedVisitDate.Date >= startDate.Date
                    && x.PlannedVisitDate.Date <= endDate.Date);

            if (clientType == Constants.GGSettings.client_mother)
            {
                totalPlannedVisits = totalPlannedVisits.Where(x => x.Mother.IsActive
                    // TODO: Performance impact of multiple joins:     
                    && x.Mother.HealthCareWorker.UserId == heathCareWorkerId);
            }
            else if (clientType == Constants.GGSettings.client_child)
            {
                totalPlannedVisits = totalPlannedVisits.Where(i => i.Infant.IsActive
                    // TODO: Performance impact of multiple joins:
                    && i.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerId);
            }
            else
            {
                totalPlannedVisits = totalPlannedVisits.Where(i => i.IsActive
                    // TODO: Performance impact of multiple joins:
                    && i.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerId);
            }

            return totalPlannedVisits.Count(); ;
        }

        public int GetTotalVisitsCompletedForPeriod(
            string heathCareWorkerId,
            List<string> types,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            IQueryable<Visit> totalVisitsCompleted = _visitRepo.GetAll()
                    .Where(x => x.Attended == true);

            if (startDate is not null)
                totalVisitsCompleted.Where(x => x.PlannedVisitDate.Date >= startDate);
            if (startDate is not null)
                totalVisitsCompleted.Where(x => x.PlannedVisitDate.Date <= endDate);

            if (types?.Count > 0)
                totalVisitsCompleted = totalVisitsCompleted.Where(x =>
                    types.Contains(x.VisitType.Type)
                );

            totalVisitsCompleted = totalVisitsCompleted.Where(x =>
                (x.Mother.IsActive
                    && x.Mother.HealthCareWorker.UserId == heathCareWorkerId)
                || (x.Infant.IsActive
                    && x.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerId));

            return totalVisitsCompleted.Count();
        }

        public int GetTotalVisitsMissedForPeriod(
            string heathCareWorkerId,
            string type,
            DateTime startDate,
            DateTime endDate)
        {
            IQueryable<Visit> totalVisitsMissed = _visitRepo.GetAll()
                    .Where(x => x.Attended == false
                    && x.IsActive == true
                    && x.DueDate >= x.Infant.InsertedDate
                    && x.DueDate <= DateTime.UtcNow
                    && (x.PlannedVisitDate >= startDate.Date
                        && x.PlannedVisitDate <= endDate.Date));

            if (type == Constants.GGSettings.client_mother)
            {
                totalVisitsMissed = totalVisitsMissed.Where(m =>
                    m.VisitType.Type == type
                    && m.IsActive == true
                    && m.Mother.IsActive == true
                    // TODO: Performance impact of multiple joins:     
                    && m.Mother.HealthCareWorker.UserId == heathCareWorkerId);
            }
            else if (type == Constants.GGSettings.client_child)
            {
                totalVisitsMissed = totalVisitsMissed.Where(i =>
                    i.VisitType.Type == type
                    && i.IsActive == true
                    && i.Infant.IsActive == true
                    // TODO: Performance impact of multiple joins:     
                    && i.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerId);
            }
            else
            {
                totalVisitsMissed = totalVisitsMissed.Where(i =>
                    i.VisitType.Type == type
                    && i.IsActive == true
                    // TODO: Performance impact of multiple joins:     
                    && i.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerId);
            }
            return totalVisitsMissed.Count();
        }

        public int GetTotalVisitsOverdueForPeriod(
            string heathCareWorkerId,
            string type,
            DateTime startDate,
            DateTime endDate)
        {
            IQueryable<Visit> totalVisitsOverdue = _visitRepo.GetAll()
                    .Where(x => x.Attended == false
                    && x.DueDate >= startDate.Date
                    && x.DueDate <= endDate.Date);

            if (type == Constants.GGSettings.client_mother)
            {
                totalVisitsOverdue = totalVisitsOverdue.Where(m =>
                    m.VisitType.Type == type
                    && m.IsActive == true
                    && m.Mother.IsActive == true
                    && m.Mother.HealthCareWorker.UserId == heathCareWorkerId);
            }
            else if (type == Constants.GGSettings.client_child)
            {
                totalVisitsOverdue = totalVisitsOverdue.Where(i =>
                    i.VisitType.Type == type
                    && i.IsActive == true
                    && i.Infant.IsActive == true
                    && i.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerId);
            }
            else
            {
                totalVisitsOverdue = totalVisitsOverdue.Where(v =>
                    v.VisitType.Type == type
                    && v.IsActive == true
                    && ((v.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerId)
                        || (v.Mother.HealthCareWorker.UserId == heathCareWorkerId))
                    );
            }

            return totalVisitsOverdue.Count(); ;
        }


        public int GetTotalPregnantMothersWithUrgentIssues(
            string heathCareWorkerUserId,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            var allMothers = _visitDataStatusRepo.GetAll()
                .Include(vsd => vsd.VisitData)
                    .ThenInclude(vd => vd.Visit.Mother)
                        .ThenInclude(m => m.HealthCareWorker)
                .Where(vsd => vsd.IsActive == true
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.UserId == heathCareWorkerUserId
                    && vsd.Type == Constants.GGSettings.visit_data_client_progress
                    && vsd.Color == MetricsColorEnum.Error.ToString()
                    && vsd.IsActive
                    && vsd.VisitData.IsActive
                    && vsd.VisitData.Visit.IsActive
                    && vsd.VisitData.Visit.Mother.IsActive
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.IsActive);

            if (startDate is not null)
                allMothers = allMothers.Where(vsd => vsd.InsertedDate >= startDate);

            if (endDate is not null)
                allMothers = allMothers.Where(vsd => vsd.InsertedDate <= endDate);

            return allMothers.Select(x => x.VisitData.Visit.Mother.Id)
                .Distinct()
                .Count();
        }

        public int GetTotalPregnantMothersWithIssues(
            string heathCareWorkerUserId,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            // Filter these out:
            var allUrgentMothers = _visitDataStatusRepo.GetAll()
                .Include(vsd => vsd.VisitData)
                    .ThenInclude(vd => vd.Visit.Mother)
                        .ThenInclude(m => m.HealthCareWorker)
                .Where(vsd => vsd.IsActive == true
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.UserId == heathCareWorkerUserId
                    && vsd.Type == Constants.GGSettings.visit_data_client_progress
                    && vsd.Color == MetricsColorEnum.Error.ToString()
                    && vsd.IsActive
                    && vsd.VisitData.IsActive
                    && vsd.VisitData.Visit.IsActive
                    && vsd.VisitData.Visit.Mother.IsActive
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.IsActive);

            if (startDate is not null)
                allUrgentMothers = allUrgentMothers.Where(vsd => vsd.InsertedDate >= startDate);

            if (endDate is not null)
                allUrgentMothers = allUrgentMothers.Where(vsd => vsd.InsertedDate <= endDate);

            var allUrgentMotherIds = allUrgentMothers.Select(vsd => vsd.VisitData.Visit.Mother.Id)
                .ToList()
                .Distinct();

            var allMothers = _visitDataStatusRepo.GetAll()
                .Include(vsd => vsd.VisitData)
                    .ThenInclude(vd => vd.Visit.Mother)
                        .ThenInclude(m => m.HealthCareWorker)
                .Where(vsd => vsd.IsActive == true
                    && !allUrgentMotherIds.Contains(vsd.VisitData.Visit.MotherId ?? Guid.Empty)
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.UserId == heathCareWorkerUserId
                    && vsd.Type == Constants.GGSettings.visit_data_client_progress
                    && vsd.Color == MetricsColorEnum.Warning.ToString()
                    && vsd.IsActive
                    && vsd.VisitData.IsActive
                    && vsd.VisitData.Visit.IsActive
                    && vsd.VisitData.Visit.Mother.IsActive
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.IsActive);

            if (startDate is not null)
                allMothers = allMothers.Where(vsd => vsd.InsertedDate >= startDate);

            if (endDate is not null)
                allMothers = allMothers.Where(vsd => vsd.InsertedDate <= endDate);

            return allMothers
                .GroupBy(vsd => vsd.VisitData.Visit.Mother.Id)
                .Count();
        }
        
        public int GetTotalPregnantMothersWithNoIssues(
            string heathCareWorkerUserId,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            var allMothers = _visitDataStatusRepo.GetAll()
                .Include(vsd => vsd.VisitData)
                    .ThenInclude(vd => vd.Visit.Mother)
                        .ThenInclude(m => m.HealthCareWorker)
                .Where(vsd => vsd.IsActive == true
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.UserId == heathCareWorkerUserId
                    && vsd.Type == Constants.GGSettings.visit_data_client_progress
                    && vsd.IsActive
                    && vsd.VisitData.IsActive
                    && vsd.VisitData.Visit.IsActive
                    && vsd.VisitData.Visit.Mother.IsActive
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.IsActive
                    );

            if (startDate is not null)
                allMothers = allMothers.Where(vsd => vsd.InsertedDate >= startDate);

            if (endDate is not null)
                allMothers = allMothers.Where(vsd => vsd.InsertedDate <= endDate);
            
            var groupedMothers = allMothers.GroupBy(vsd => vsd.VisitData.Visit.Mother.Id);
            
            int noIssuesCount = 0;
            foreach (var i in groupedMothers)
            {
                if (i.Any(i => i.Color == MetricsColorEnum.Error.ToString() || i.Color == MetricsColorEnum.Warning.ToString()))
                    continue;

                noIssuesCount++;
            }

            return noIssuesCount;
        }

        public int GetTotalCaregiversAndChildrenWithUrgentIssues(
            string heathCareWorkerUserId,
            DateTime startDate,
            DateTime endDate)
        {
            var totalCaregiversAndChildrenWithIssues = _visitDataStatusRepo.GetAll()
                .Include(vsd => vsd.VisitData)
                    .ThenInclude(vd => vd.Visit.Infant)
                        .ThenInclude(m => m.Caregiver)
                            .ThenInclude(m => m.HealthCareWorker)
                .Where(vsd =>
                    vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerUserId
                    && vsd.Type == Constants.GGSettings.visit_data_client_progress
                    && vsd.VisitData.Visit.Attended == true
                    && vsd.Color == MetricsColorEnum.Error.ToString()
                    && vsd.InsertedDate >= startDate
                    && vsd.InsertedDate <= endDate
                    && vsd.IsActive
                    && vsd.VisitData.IsActive
                    && vsd.VisitData.Visit.IsActive
                    && vsd.VisitData.Visit.Infant.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.User.IsActive
                    // Things that have been painted error color more urgent than the ones painted warning color...
                    && vsd.Color == MetricsColorEnum.Error.ToString())
                .Select(x => x.VisitData.Visit.Infant.Id)
                .Distinct()
                .Count();

            return totalCaregiversAndChildrenWithIssues;
        }

        public int GetTotalCaregiversAndChildrenWithIssues(
            string heathCareWorkerUserId,
            DateTime startDate,
            DateTime endDate)
        {
            // Filter out these:
            var urgentInfantIds = _visitDataStatusRepo.GetAll()
                .Include(vsd => vsd.VisitData)
                    .ThenInclude(vd => vd.Visit.Infant)
                        .ThenInclude(m => m.Caregiver)
                            .ThenInclude(m => m.HealthCareWorker)
                .Where(vsd =>
                    vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerUserId
                    && vsd.Type == Constants.GGSettings.visit_data_client_progress
                    && vsd.VisitData.Visit.Attended == true
                    && vsd.Color == MetricsColorEnum.Error.ToString()
                    && vsd.InsertedDate >= startDate
                    && vsd.InsertedDate <= endDate
                    && vsd.IsActive
                    && vsd.VisitData.IsActive
                    && vsd.VisitData.Visit.IsActive
                    && vsd.VisitData.Visit.Infant.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.User.IsActive)
                .Select(x => x.VisitData.Visit.InfantId)
                .Distinct()
                .ToList();

            var totalCaregiversAndChildrenWithIssues = _visitDataStatusRepo.GetAll()
                .Include(vsd => vsd.VisitData)
                    .ThenInclude(vd => vd.Visit.Infant)
                        .ThenInclude(m => m.Caregiver)
                            .ThenInclude(m => m.HealthCareWorker)
                .Where(vsd =>
                    vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerUserId
                    && !urgentInfantIds.Contains(vsd.VisitData.Visit.InfantId)
                    && vsd.Type == Constants.GGSettings.visit_data_client_progress
                    && vsd.VisitData.Visit.Attended == true
                    && vsd.Color == MetricsColorEnum.Warning.ToString()
                    && vsd.InsertedDate >= startDate
                    && vsd.InsertedDate <= endDate
                    && vsd.IsActive
                    && vsd.VisitData.IsActive
                    && vsd.VisitData.Visit.IsActive
                    && vsd.VisitData.Visit.Infant.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.User.IsActive)
                .Select(x => x.VisitData.Visit.Infant.Id)
                .Distinct()
                .Count();

            return totalCaregiversAndChildrenWithIssues;
        }

        public int GetTotalCaregiversAndChildrenWithNoIssues(
            string heathCareWorkerUserId,
            DateTime startDate,
            DateTime endDate)
        {
            var caregiversAndChildren = _visitDataStatusRepo.GetAll()
                .Include(vsd => vsd.VisitData)
                    .ThenInclude(vd => vd.Visit.Infant)
                        .ThenInclude(m => m.Caregiver)
                            .ThenInclude(m => m.HealthCareWorker)
                .Where(vsd =>
                    vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == heathCareWorkerUserId
                    && vsd.Type == Constants.GGSettings.visit_data_client_progress
                    && vsd.VisitData.Visit.Attended == true
                    && vsd.InsertedDate >= startDate
                    && vsd.InsertedDate <= endDate
                    && vsd.IsActive
                    && vsd.VisitData.IsActive
                    && vsd.VisitData.Visit.IsActive
                    && vsd.VisitData.Visit.Infant.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.IsActive
                    && vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.User.IsActive)
                .ToList();

            var groupedInfants = caregiversAndChildren.GroupBy(vsd => vsd.VisitData.Visit.Infant.Id);
            int noIssuesCount = 0;
            foreach (var i in groupedInfants)
            {
                if (i.Any(i => i.Color == MetricsColorEnum.Error.ToString() || i.Color == MetricsColorEnum.Warning.ToString()))
                    continue;

                noIssuesCount++;
            }
            
            return noIssuesCount;
        }

        public Guid GetLastCompletedVisitId(string id, string type)
        {
            Guid visitId = Guid.Empty;

            if (type == Constants.GGSettings.client_mother)
            {
                visitId = _visitRepo.GetAll().Where(x => x.MotherId.ToString() == id && x.Attended == true && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).Select(x => x.Id).FirstOrDefault();
            }
            else if (type == Constants.GGSettings.client_child)
            {
                visitId = _visitRepo.GetAll().Where(x => x.InfantId.ToString() == id && x.Attended == true && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).Select(x => x.Id).FirstOrDefault();
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                visitId = _visitRepo.GetAll().Where(x => x.PractitionerId.ToString() == id && x.Attended == true && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).Select(x => x.Id).FirstOrDefault();
            }
            return visitId;
        }
        public Visit GetVisitForUserForType(string id, string userType, string vType)
        {
            if (userType == Constants.SSSettings.client_trainee)
            {
                if (vType == Constants.SSSettings.visitType_trainee_visit)
                {
                    return _visitRepo.GetAll().Where(x => x.TraineeId.ToString() == id && x.VisitType.Name == vType && x.VisitType.Type == Constants.SSSettings.client_coach).FirstOrDefault();
                }
                else
                {
                    return _visitRepo.GetAll().Where(x => x.TraineeId.ToString() == id && x.VisitType.Name == vType && x.VisitType.Type == Constants.SSSettings.client_trainee).FirstOrDefault();
                }
            }

            if (userType == Constants.SSSettings.client_practitioner)
            {
                return _visitRepo.GetAll().Where(x => x.PractitionerId.ToString() == id && x.VisitType.Name == vType && x.VisitType.Type == Constants.SSSettings.client_practitioner).FirstOrDefault();
            }

            return null;
        }

        public List<Visit> GetPQAVisitsForPractitioner(string userId)
        {
           return _visitRepo.GetAll().Where(x => x.Practitioner.UserId == userId && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.Attended == true &&
                                                (x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1 ||
                                                x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_2 ||
                                                x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_3 ||
                                                x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up)).OrderByDescending(x => x.PlannedVisitDate).ToList();
        }

        public List<Visit> GetReAccreditationVisitsForPractitioner(string userId)
        {
            return _visitRepo.GetAll().Where(x => x.Practitioner.UserId == userId && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.Attended == true &&
                                                 (x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1 ||
                                                 x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_2 ||
                                                 x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_3 ||
                                                 x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up)).OrderByDescending(x => x.PlannedVisitDate).ToList();
        }

        #endregion


        public Visit AddNextPQAOrFollowUpVisit(string color, Guid practitionerId, Visit linkedVisit)
        {
            // saving the color to the visit's comment
            linkedVisit.Comment = color;
            _visitRepo.Update(linkedVisit);

            Visit newVisit = new Visit();
            VisitType visitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_pqa_visit_1).FirstOrDefault();
            VisitType followUpVisitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).FirstOrDefault();

            Visit lastPQAVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.Attended == true &&
                                                        x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1).OrderByDescending(x => x.PlannedVisitDate).FirstOrDefault();
            
            // total follow-ups linked to pqa visit
            int totalVisits = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                           x.LinkedVisitId == lastPQAVisit.Id && x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).OrderByDescending(x => x.PlannedVisitDate).Count();

            // if visit is pqa_visit_1 and rating is green, we add an re-accreditation visit for next year
            if (linkedVisit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
            {
                DateTime deadlineDate = linkedVisit.ActualVisitDate.Value.AddYears(1);
                VisitType reVisitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();
                // check to see if visit exists
                Visit visit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.PlannedVisitDate.Date == deadlineDate.Date && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.VisitType.Name == reVisitType.Name).FirstOrDefault();
                if (visit == null)
                {
                    var visitModel = new VisitModel();
                    visitModel.VisitType = reVisitType;
                    visitModel.MotherId = null;
                    visitModel.InfantId = null;
                    visitModel.LinkedVisitId = linkedVisit.Id;
                    visitModel.PractitionerId = practitionerId;
                    visitModel.Attended = false;
                    visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                    visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                    newVisit = AddVisitForPractitioner(visitModel);
                    AddSelfAssessmentVisit(newVisit);
                }

            } else
            {
                // If rating is green add new pqa visit 60 days from previous one
                if (color == MetricsColorEnum.Success.ToString())
                {
                    DateTime deadlineDate = lastPQAVisit.ActualVisitDate.Value.AddDays(60);

                    // check to see if visit exists
                    Visit visit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.PlannedVisitDate.Date == deadlineDate.Date && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1).FirstOrDefault();
                    if (visit == null)
                    {
                        var visitModel = new VisitModel();
                        visitModel.VisitType = visitType;
                        visitModel.MotherId = null;
                        visitModel.InfantId = null;
                        visitModel.LinkedVisitId = lastPQAVisit.Id;
                        visitModel.PractitionerId = practitionerId;
                        visitModel.Attended = false;
                        visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        newVisit = AddVisitForPractitioner(visitModel);
                        AddSelfAssessmentVisit(newVisit);
                    }
                } 
                else if (color == MetricsColorEnum.Error.ToString())
                {
                    // Red rating follow up
                    // the coach must schedule another First PQA visit; deadline = date of the initial First PQA visit +14 days
                    DateTime deadlineDate = lastPQAVisit.ActualVisitDate.Value.AddDays(14);

                    // check to see if visit exists
                    Visit visit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.PlannedVisitDate.Date == deadlineDate.Date && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1).FirstOrDefault();
                    if (visit == null)
                    {
                        var visitModel = new VisitModel();
                        visitModel.VisitType = visitType;
                        visitModel.MotherId = null;
                        visitModel.InfantId = null;
                        visitModel.LinkedVisitId = lastPQAVisit.Id;
                        visitModel.PractitionerId = practitionerId;
                        visitModel.Attended = false;
                        visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        newVisit = AddVisitForPractitioner(visitModel);
                        AddSelfAssessmentVisit(newVisit);
                    }
                }
                else if (color == MetricsColorEnum.Warning.ToString())
                {
                    // Follow-up visit 1 is handled within VisitDataManager when pqa data is added and rating is not green (AddPractitionerVisitData)

                    // can conduct up to 3 follow up visits if needed; 
                    // deadline for follow up visit 1 = 14 days from First PQA;
                    // deadline for follow up visit 2 = 14 days from follow up visit 1;
                    // deadline for follow up visit 3(if added) = 14 days from follow up visit 2
                    if (totalVisits < 3)
                    {
                        DateTime deadlineDate = linkedVisit.ActualVisitDate.Value.AddDays(14);

                        // check to see if visit exists
                        Visit visit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.PlannedVisitDate.Date == deadlineDate.Date && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).FirstOrDefault();
                        if (visit == null)
                        {
                            var visitModel = new VisitModel();
                            visitModel.VisitType = followUpVisitType;
                            visitModel.MotherId = null;
                            visitModel.InfantId = null;
                            visitModel.LinkedVisitId = linkedVisit.Id;
                            visitModel.PractitionerId = practitionerId;
                            visitModel.Attended = false;
                            visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                            visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                            newVisit = AddVisitForPractitioner(visitModel);
                        }
                    }
                }
            }

            return newVisit;
        }

        public Visit AddSelfAssessmentVisit(Visit visit)
        {
            // EC-548 -- add self assessment
            // Deadline for self - assessment = 1 week before a scheduled PQA / reaccreditation visit OR before the PQA / reaccreditation deadline, whichever comes first. 
            DateTime plannedVisitDate = visit.PlannedVisitDate.AddDays(-7);
            DateTime dueDate = default(DateTime);
            if (visit.DueDate.HasValue)
            {
                dueDate = visit.DueDate.Value.AddDays(-7);
            }
            
            VisitType selfType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name.Equals(Constants.SSSettings.visitType_self_assessment)).FirstOrDefault();
            Visit selfVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == visit.PractitionerId && x.VisitTypeId == selfType.Id && x.LinkedVisitId == visit.Id && x.PlannedVisitDate == plannedVisitDate.Date).FirstOrDefault();
            if (selfVisit == null && visit != null)
            {
                var input = new VisitModel
                {
                    VisitType = selfType,
                    Attended = false,
                    MotherId = null,
                    InfantId = null,
                    LinkedVisitId = visit.Id,
                    PlannedVisitDate = plannedVisitDate.Date,
                    DueDate = dueDate == default(DateTime) ? null : dueDate.Date,
                    PractitionerId = visit.PractitionerId
                };
                return AddVisit(input);
            }

            return null;
        }

        public Visit AddNextReAccreditationOrFollowUpVisit(string color, Guid practitionerId, Visit linkedVisit)
        {
            // saving the color to the visit's comment
            linkedVisit.Comment = color;
            _visitRepo.Update(linkedVisit);

            Visit newVisit = new Visit();
            VisitType visitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();
            VisitType followUpVisitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_re_accreditation_follow_up).FirstOrDefault();

            Visit lastPQAVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.Attended == true &&
                                                        x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1).OrderByDescending(x => x.PlannedVisitDate).FirstOrDefault();

            // total follow-ups linked to pqa visit
            int totalVisits = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                           x.LinkedVisitId == lastPQAVisit.Id && x.VisitType.Name == followUpVisitType.Name).OrderByDescending(x => x.PlannedVisitDate).Count();


            // If rating is green add new re-accreditation visit 1 year from previous one
            if (color == MetricsColorEnum.Success.ToString())
            {
                DateTime deadlineDate = lastPQAVisit.ActualVisitDate.Value.AddYears(1);

                // check to see if visit exists
                Visit visit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.PlannedVisitDate.Date == deadlineDate.Date && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.VisitType.Name == visitType.Name).FirstOrDefault();
                if (visit == null)
                {
                    var visitModel = new VisitModel();
                    visitModel.VisitType = visitType;
                    visitModel.MotherId = null;
                    visitModel.InfantId = null;
                    visitModel.LinkedVisitId = lastPQAVisit.Id;
                    visitModel.PractitionerId = practitionerId;
                    visitModel.Attended = false;
                    visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                    visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                    newVisit = AddVisitForPractitioner(visitModel);
                    AddSelfAssessmentVisit(newVisit);
                }
            }
            else if (color == MetricsColorEnum.Error.ToString())
            {
                // Red rating follow up
                // the coach must schedule another First PQA visit; deadline = date of the initial First PQA visit + 14 days
                DateTime deadlineDate = lastPQAVisit.ActualVisitDate.Value.AddDays(14);

                visitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_pqa_visit_1).FirstOrDefault();
                // check to see if visit exists
                Visit visit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.PlannedVisitDate.Date == deadlineDate.Date && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.VisitType.Name == visitType.Name).FirstOrDefault();
                if (visit == null)
                {
                    var visitModel = new VisitModel();
                    visitModel.VisitType = visitType;
                    visitModel.MotherId = null;
                    visitModel.InfantId = null;
                    visitModel.LinkedVisitId = lastPQAVisit.Id;
                    visitModel.PractitionerId = practitionerId;
                    visitModel.Attended = false;
                    visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                    visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                    newVisit = AddVisitForPractitioner(visitModel);
                    AddSelfAssessmentVisit(newVisit);
                }
            }
            else if (color == MetricsColorEnum.Warning.ToString())
            {
                // Follow-up visit 1 is handled within VisitMutation when pqa data is added and rating is not green (AddReAccreditationVisitForPractitioner)

                // can conduct up to 3 follow up visits if needed; 
                // deadline for follow up visit 1 = 14 days from initial reaccreditation rating; 
                // deadline for follow up visit 2 = 14 days from follow-up visit1;
                // deadline for follow up visit 3(if added) = 14 days from follow up visit 2
                if (totalVisits < 4)
                {
                    DateTime deadlineDate = linkedVisit.ActualVisitDate.Value.AddDays(14);

                    // check to see if visit exists
                    Visit visit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.PlannedVisitDate.Date == deadlineDate.Date && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.VisitType.Name == followUpVisitType.Name).FirstOrDefault();
                    if (visit == null)
                    {
                        var visitModel = new VisitModel();
                        visitModel.VisitType = followUpVisitType;
                        visitModel.MotherId = null;
                        visitModel.InfantId = null;
                        visitModel.LinkedVisitId = lastPQAVisit.Id;
                        visitModel.PractitionerId = practitionerId;
                        visitModel.Attended = false;
                        visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        newVisit = AddVisitForPractitioner(visitModel);
                    }

                    //Regardless of how many follow - up visits are conducted, the next ""Annual re-accreditation"" deadline = date of the first annual reaccreditation + 3 months.
                    Visit lastReAccreditationVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.Attended == true &&
                                                        x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1).OrderByDescending(x => x.PlannedVisitDate).FirstOrDefault();

                    deadlineDate = lastReAccreditationVisit.PlannedVisitDate.AddMonths(3);
                    // check to see if visit exists
                    Visit reAccreditationVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.PlannedVisitDate.Date == deadlineDate.Date && x.VisitType.Type == Constants.SSSettings.client_practitioner && x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();
                    if (reAccreditationVisit == null)
                    {
                        var visitModel = new VisitModel();
                        visitModel.VisitType = visitType;
                        visitModel.MotherId = null;
                        visitModel.InfantId = null;
                        visitModel.LinkedVisitId = lastPQAVisit.Id;
                        visitModel.PractitionerId = practitionerId;
                        visitModel.Attended = false;
                        visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        newVisit = AddVisitForPractitioner(visitModel);
                        AddSelfAssessmentVisit(newVisit);
                    }
                }
            }

            return newVisit;
        }

        public bool ValidateDefaultVisitsForPractitioner(string userId)
        {
            var smartSpaceLic = _userLicenseManager.GetLicenseForUserForType(userId, Constants.SSSettings.ss_smart_space_licence);

            if (smartSpaceLic != null)
            {
                Practitioner practitioner = _practitionerRepo.GetAll().Where(x => x.UserId == userId).FirstOrDefault();
                List<VisitType> visitTypes = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner)).OrderBy(x => x.Order).ToList();

                var input = new VisitModel();
                foreach (VisitType visitType in visitTypes)
                {
                    input = new VisitModel
                    {
                        VisitType = visitType,
                        Attended = false,
                        MotherId = null,
                        InfantId = null,
                        LinkedVisitId = null,
                        PractitionerId = practitioner.Id
                    };

                    // -- first visit; Deadline for first visit = { date SmartSpace licence was received + 1 month }
                    if (visitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_1)
                    {
                        DateTime dt = (DateTime)smartSpaceLic.LicenseDate;
                        DateTime newDate = dt.AddMonths(1);
                        input.PlannedVisitDate = newDate;
                        Visit visit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitioner.Id && x.VisitTypeId == visitType.Id).FirstOrDefault();
                        if (visit == null)
                        {
                            AddVisit(input);
                        }
                    }
                    // --second visit; Deadline for second visit = { date SmartSpace licence was received + 2 months }
                    if (visitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_2)
                    {
                        DateTime dt = (DateTime)smartSpaceLic.LicenseDate;
                        DateTime newDate = dt.AddMonths(2);
                        input.PlannedVisitDate = newDate;
                        Visit visit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitioner.Id && x.VisitTypeId == visitType.Id).FirstOrDefault();
                        if (visit == null)
                        {
                            AddVisit(input);
                        }
                    }
                    // SmartSpace licence received date + 3 months
                    if (visitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
                    {
                        DateTime dt = (DateTime)smartSpaceLic.LicenseDate;
                        DateTime newDate = dt.AddMonths(3);
                        input.PlannedVisitDate = newDate;
                        Visit visit = _visitRepo.GetAll().Where(x => x.PractitionerId == practitioner.Id && x.VisitTypeId == visitType.Id).FirstOrDefault();
                        if (visit == null)
                        {
                            visit = AddVisit(input);

                        }
                        // EC-548 -- add self assessment
                        AddSelfAssessmentVisit(visit);
                    }
                }
            }
            return true;
        }
        public Visit UpdateVisitPlannedVisitDate(UpdateVisitPlannedVisitDateModel input)
        {
            var visit = _visitRepo.GetById(input.VisitId);
            visit.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visit.EventId = input.EventId;
            _visitRepo.Update(visit);
            return visit;
        }
    }
}

