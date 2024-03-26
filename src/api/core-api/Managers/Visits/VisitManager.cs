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

        private Guid _applicationUserId;

        public VisitManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            UserLicenseManager userLicenseManager, HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _userLicenseManager = userLicenseManager;
            _hierarchyEngine = hierarchyEngine;

            _applicationUserId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);
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
                UpdatedBy = _applicationUserId.ToString(),
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
                UpdatedBy = _applicationUserId.ToString(),
                LinkedVisitId = input.LinkedVisitId,
                ActualVisitDate = input.ActualVisitDate,
                PlannedVisitDate = input.PlannedVisitDate,
                DueDate = input.DueDate
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
                UpdatedBy = _applicationUserId.ToString(),
                LinkedVisitId = input.LinkedVisitId,
                ActualVisitDate = input.ActualVisitDate,
                PlannedVisitDate = input.PlannedVisitDate,
                EventId = input.EventId,
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
                UpdatedBy = _applicationUserId.ToString(),
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
                UpdatedBy = _applicationUserId.ToString(),
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
                missedVisit = _visitRepo.GetAll().Where(x => x.MotherId == Id && !x.Attended && x.PlannedVisitDate.Date <= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.GGSettings.client_child)
            {
                missedVisit = _visitRepo.GetAll().Where(x => x.InfantId == Id && !x.Attended && x.PlannedVisitDate.Date <= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                missedVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == Id && !x.Attended && x.PlannedVisitDate.Date <= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
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
                    nextVisit = _visitRepo.GetAll().Where(x => x.MotherId == Id && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
                else if (type == Constants.GGSettings.client_child)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.InfantId == Id && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
                else if (type == Constants.SSSettings.client_practitioner)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == Id && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
            }
            else
            {
                DateTime next7Days = today.AddDays(7);

                if (type == Constants.GGSettings.client_mother)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.MotherId == Id && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date < next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
                else if (type == Constants.GGSettings.client_child)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.InfantId == Id && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date < next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
                else if (type == Constants.SSSettings.client_practitioner)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == Id && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date < next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
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
                nextVisit = _visitRepo.GetAll().Where(x => x.MotherId == Id && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date >= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.GGSettings.client_child)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.InfantId == Id && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date >= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == Id && !x.Attended && x.PlannedVisitDate.Date > today && x.PlannedVisitDate.Date >= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
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

        public HealthCareWorkerVisitStatusModel GetHealthCareWorkerVisitStatus(Guid healthCareWorkerUserId)
        {
            var monday = StartOfWeek(DateTime.Today, DayOfWeek.Monday);
            var sunday = monday.AddDays(6);
            var startDate = DateTime.Now.AddYears(-1);

            var visits = _visitRepo.GetAll()
                .Where(x =>
                    ((x.Mother.HealthCareWorker.UserId == healthCareWorkerUserId && x.Mother.IsActive) || (x.Infant.Caregiver.HealthCareWorker.UserId == healthCareWorkerUserId && x.Infant.IsActive))
                    && ((!x.Attended && x.PlannedVisitDate.Date <= sunday) || (x.Attended && x.PlannedVisitDate.Date >= startDate)))
                .Select(x => new { x.Id, x.MotherId, x.InfantId, x.Attended, x.PlannedVisitDate, x.ActualVisitDate, x.VisitType.Type })
                .ToList();

            var motherVisitsCompletedThisMonth = visits.Where(x => x.MotherId.HasValue && x.Attended && x.PlannedVisitDate.Month == DateTime.Now.Month).Count();
            var motherVisitsCompletedThisYear = visits.Where(x => x.MotherId.HasValue && x.Attended && x.PlannedVisitDate.Year == DateTime.Now.Year).Count();

            var childVisitsCompletedThisMonth = visits.Where(x => x.InfantId.HasValue && x.Attended && x.PlannedVisitDate.Month == DateTime.Now.Month).Count();
            var childVisitsCompletedThisYear = visits.Where(x => x.InfantId.HasValue && x.Attended && x.PlannedVisitDate.Year == DateTime.Now.Year).Count();

            var motherOverDueVisits = visits.Where(x => x.MotherId.HasValue && !x.Attended && x.PlannedVisitDate.Date <= DateTime.Today).Count();

            var motherDueVisits = visits.Where(x => x.MotherId.HasValue && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= sunday.Date).Count();
            var childDueVisits = visits.Where(x => x.MotherId.HasValue && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= sunday.Date).Count();

            var lastCompletedVisit = visits.Where(x => x.Attended).OrderByDescending(x => x.ActualVisitDate).FirstOrDefault();

            return new HealthCareWorkerVisitStatusModel
            {
                MotherVisitsCompletedThisMonth = motherVisitsCompletedThisMonth,
                MotherVisitsCompletedThisYear = motherVisitsCompletedThisYear,
                MotherDueVisits = motherDueVisits,
                MotherOverDueVisits = motherOverDueVisits,
                ChildVisitsCompletedThisMonth = childVisitsCompletedThisMonth,
                ChildVisitsCompletedThisYear = childVisitsCompletedThisYear,
                ChildDueVisits = childDueVisits,
                LastCompletedVisit = lastCompletedVisit == null ? null : lastCompletedVisit.ActualVisitDate,
            };
        }
        
        public DateTime? GetClientsNextVisitDate(Guid Id, string type)
        {
            Visit nextVisit = null;
            DateTime today = DateTime.Today;

            if (type == Constants.GGSettings.client_mother)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.MotherId == Id && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();

            }
            else if (type == Constants.GGSettings.client_child)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.InfantId == Id && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == Id && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
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
                nextVisit = _visitRepo.GetAll().Where(x => x.MotherId == Id && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.GGSettings.client_child)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.InfantId == Id && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == Id && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
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
                allVisits = _visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id && x.VisitType.Type == Constants.GGSettings.client_mother).OrderBy(y => y.PlannedVisitDate).ToList();
            }
            else if (type == Constants.GGSettings.client_child)
            {
                // returning visits only applicable after infant was registered
                var child_visits = _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id &&
                                                      x.VisitType.Type == Constants.GGSettings.client_child &&
                                                      x.VisitType.Name != Constants.GGSettings.VisitTypeAdditionalVisit &&
                                                     (x.DueDate.HasValue && x.DueDate.Value.Date.AddDays(1).Date >= x.Infant.InsertedDate.Date)).
                                                     OrderBy(y => y.PlannedVisitDate).ToList();
                var other_visits_due_date = _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id &&
                                                                 x.VisitType.Type == Constants.GGSettings.client_child &&
                                                                 x.VisitType.Name == Constants.GGSettings.VisitTypeAdditionalVisit &&
                                                                (x.DueDate.HasValue && x.DueDate.Value.Date.AddDays(1).Date >= x.Infant.InsertedDate.Date)).
                                                                OrderBy(y => y.PlannedVisitDate).ToList();
                var other_visits_no_due_date = _visitRepo.GetAll().Where(x => x.Infant.UserId.ToString() == id &&
                                                                 x.VisitType.Type == Constants.GGSettings.client_child &&
                                                                 x.VisitType.Name == Constants.GGSettings.VisitTypeAdditionalVisit && x.DueDate.HasValue == false &&
                                                                (x.PlannedVisitDate.Date >= x.Infant.InsertedDate.Date)).
                                                                OrderBy(y => y.PlannedVisitDate).ToList();

                allVisits.AddRange(child_visits);
                allVisits.AddRange(other_visits_due_date);
                allVisits.AddRange(other_visits_no_due_date);
            }
            else if (type == Constants.SSSettings.client_practitioner)
            {
                allVisits = _visitRepo.GetAll().Where(x => x.Practitioner.UserId.ToString() == id && x.VisitType.Type == Constants.SSSettings.client_practitioner).OrderBy(y => y.PlannedVisitDate).ToList();
            }
            else if (type == Constants.SSSettings.client_trainee)
            {
                allVisits = _visitRepo.GetAll().Where(x => x.Trainee.UserId.ToString() == id && x.CoachId == null && x.VisitType.Type == Constants.SSSettings.client_trainee).OrderBy(y => y.PlannedVisitDate).ToList();
            }
            else if (type == Constants.SSSettings.client_coach)
            {
                allVisits = _visitRepo.GetAll().Where(x => x.Coach.UserId.ToString() == id && x.VisitType.Type == Constants.SSSettings.client_coach).OrderBy(y => y.PlannedVisitDate).ToList();
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

            var additional_visits = allVisits.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeAdditionalVisit).ToList();
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

        public List<Visit> GetCoachVisits(Guid coachId, Guid practitionerId) {

            return _visitRepo.GetAll().Where(x => x.CoachId == coachId && x.PractitionerId == practitionerId).OrderBy(y => y.PlannedVisitDate).ToList();
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
                totalVisits = _visitRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.ToString() == id && x.Mother.IsActive && x.Attended && x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Date >= monday.Date && x.ActualVisitDate.Value.Date <= next7Days.Date).OrderBy(x => x.ActualVisitDate).Distinct().Count();
            }
            else
            {
                totalVisits = _visitRepo.GetAll().Where(x => x.Infant.Caregiver.HealthCareWorker.UserId.ToString() == id && x.Infant.IsActive && x.Attended && x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Date >= monday.Date && x.ActualVisitDate.Value.Date <= next7Days.Date).OrderBy(x => x.ActualVisitDate).Distinct().Count();
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
                    && x.Mother.HealthCareWorker.UserId.ToString() == heathCareWorkerId);
            }
            else if (clientType == Constants.GGSettings.client_child)
            {
                totalPlannedVisits = totalPlannedVisits.Where(i => i.Infant.IsActive
                    // TODO: Performance impact of multiple joins:
                    && i.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerId);
            }
            else
            {
                totalPlannedVisits = totalPlannedVisits.Where(i => i.IsActive
                    // TODO: Performance impact of multiple joins:
                    && i.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerId);
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
                    && x.Mother.HealthCareWorker.UserId.ToString() == heathCareWorkerId)
                || (x.Infant.IsActive
                    && x.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerId));

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
                    && m.Mother.HealthCareWorker.UserId.ToString() == heathCareWorkerId);
            }
            else if (type == Constants.GGSettings.client_child)
            {
                totalVisitsMissed = totalVisitsMissed.Where(i =>
                    i.VisitType.Type == type
                    && i.IsActive == true
                    && i.Infant.IsActive == true
                    // TODO: Performance impact of multiple joins:     
                    && i.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerId);
            }
            else
            {
                totalVisitsMissed = totalVisitsMissed.Where(i =>
                    i.VisitType.Type == type
                    && i.IsActive == true
                    // TODO: Performance impact of multiple joins:     
                    && i.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerId);
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
                    && m.Mother.HealthCareWorker.UserId.ToString() == heathCareWorkerId);
            }
            else if (type == Constants.GGSettings.client_child)
            {
                totalVisitsOverdue = totalVisitsOverdue.Where(i =>
                    i.VisitType.Type == type
                    && i.IsActive == true
                    && i.Infant.IsActive == true
                    && i.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerId);
            }
            else
            {
                totalVisitsOverdue = totalVisitsOverdue.Where(v =>
                    v.VisitType.Type == type
                    && v.IsActive == true
                    && ((v.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerId)
                        || (v.Mother.HealthCareWorker.UserId.ToString() == heathCareWorkerId))
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
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.UserId.ToString() == heathCareWorkerUserId
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
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.UserId.ToString() == heathCareWorkerUserId
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
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.UserId.ToString() == heathCareWorkerUserId
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
                    && vsd.VisitData.Visit.Mother.HealthCareWorker.UserId.ToString() == heathCareWorkerUserId
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
                    vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerUserId
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
                    vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerUserId
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
                    vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerUserId
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
                    vsd.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == heathCareWorkerUserId
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
            return _visitRepo.GetAll().Where(x => 
                x.Practitioner.UserId == Guid.Parse(userId)
                && x.VisitType.Type == Constants.SSSettings.client_practitioner 
                && x.Attended == true 
                && (x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1 ||
                    x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up))
                .OrderByDescending(x => x.PlannedVisitDate)
                .ToList();
        }

        public List<Visit> GetReAccreditationVisitsForPractitioner(string userId)
        {
            return _visitRepo.GetAll().Where(x => 
                x.Practitioner.UserId == Guid.Parse(userId) 
                && x.VisitType.Type == Constants.SSSettings.client_practitioner 
                && x.Attended == true 
                && (x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1 ||
                    x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up))
                .OrderByDescending(x => x.PlannedVisitDate)
                .ToList();
        }

        #endregion


        public Visit AddNextPQAOrFollowUpVisit(string color, Guid practitionerId, Visit linkedVisit)
        {
            Visit newVisit = new Visit();

            List<Visit> allPractitionerVisits = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId).OrderByDescending(x => x.PlannedVisitDate).ToList();
            List<VisitType> visitTypes = _visitTypeRepo.GetAll().Where(x => x.Type == Constants.SSSettings.client_practitioner).OrderBy(x => x.Order).ToList();

            // get last completed PQA
            Visit lastPQAVisit = allPractitionerVisits.Where(x => x.VisitType.Type == Constants.SSSettings.client_practitioner && x.Attended == true &&
                                                                x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1).OrderByDescending(x => x.PlannedVisitDate).FirstOrDefault();

            // total follow-ups linked to pqa visit
            int totalVisits = allPractitionerVisits.Where(x => x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                            x.LinkedVisitId == lastPQAVisit.Id &&
                                                            x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).OrderByDescending(x => x.PlannedVisitDate).Count();

            // if visit is pqa_visit_1
            if (linkedVisit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
            {
                VisitType visitType = new VisitType();
                DateTime deadlineDate = new DateTime();
                Guid linkedVisitId = new Guid();

                if (color == MetricsColorEnum.Success.ToString())
                {
                    // and rating is green, we add an re-accreditation visit for next year
                    deadlineDate = linkedVisit.ActualVisitDate.Value.AddYears(1);
                    visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();
                    linkedVisitId = linkedVisit.Id;
                }
                else if (color == MetricsColorEnum.Error.ToString())
                {
                    // Red rating follow up -- if the practitioner receives a red rating:
                    // --optional - the coach can schedule / start 1 follow up visit only(no deadline since the item is only shown if the coach schedules it in calendar)
                    // --the coach must schedule another First PQA visit; deadline = date of the initial First PQA visit +14 days

                    deadlineDate = linkedVisit.ActualVisitDate.Value.AddDays(14);
                    visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_pqa_visit_1).FirstOrDefault();
                    linkedVisitId = linkedVisit.Id;
                }
                else if (color == MetricsColorEnum.Warning.ToString())
                {
                    // Orange rating follow up -- if the practitioner receives an orange rating:
                    // --coach must conduct at least 1 follow up visit & can conduct up to 3 follow up visits if needed; deadline for follow up visit 1 = 14 days from First PQA; deadline for follow up visit 2 = 14 days from follow up visit 1; deadline for follow up visit 3(if added) = 14 days from follow up visit 2

                    // get previous follow-up record
                    Visit prevVisit = allPractitionerVisits.Where(x => x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                x.LinkedVisitId == lastPQAVisit.Id &&
                                                                x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).OrderByDescending(x => x.PlannedVisitDate).FirstOrDefault();
                    if (prevVisit == null)
                    {
                        deadlineDate = linkedVisit.ActualVisitDate.Value.AddDays(14);
                    } else
                    {
                        deadlineDate = prevVisit.ActualVisitDate.Value.AddDays(14);
                    }
                    visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).FirstOrDefault();
                    linkedVisitId = linkedVisit.Id;
                }

                // TODO - I don't think this code can ever run, its inside an if block checking for a different visist type
                // Is it meant to check the new visits type (visitType) not the linked visit?
                if (linkedVisit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up)
                {
                    if (totalVisits < 3) { 
                        // check to see if visit exists
                        Visit visit = allPractitionerVisits.Where(x => x.PlannedVisitDate.Date == deadlineDate.Date &&
                                                                    x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                    x.LinkedVisitId == linkedVisitId &&
                                                                    x.Attended == false &&
                                                                    x.VisitType.Name == visitType.Name).FirstOrDefault();
                        if (visit == null)
                        {
                            var visitModel = new VisitModel();
                            visitModel.VisitType = visitType;
                            visitModel.MotherId = null;
                            visitModel.InfantId = null;
                            visitModel.LinkedVisitId = linkedVisitId;
                            visitModel.PractitionerId = practitionerId;
                            visitModel.Attended = false;
                            visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                            visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                            newVisit = AddVisitForPractitioner(visitModel);
                        }
                    }
                }
                else // visitType_re_accreditation_1 & visitType_pqa_visit_1
                {
                    // check to see if visit exists
                    Visit visit = allPractitionerVisits.Where(x => x.PlannedVisitDate.Date == deadlineDate.Date &&
                                                                x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                x.LinkedVisitId == linkedVisitId &&
                                                                x.Attended == false &&
                                                                x.VisitType.Name == visitType.Name).FirstOrDefault();
                    if (visit == null)
                    {
                        var visitModel = new VisitModel();
                        visitModel.VisitType = visitType;
                        visitModel.MotherId = null;
                        visitModel.InfantId = null;
                        visitModel.LinkedVisitId = linkedVisitId;
                        visitModel.PractitionerId = practitionerId;
                        visitModel.Attended = false;
                        visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        newVisit = AddVisitForPractitioner(visitModel);
                        if (visitType.Name == Constants.SSSettings.visitType_re_accreditation_1 || visitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
                        {
                            AddSelfAssessmentVisit(newVisit);
                        }
                    }
                }
            }
            // PQA Follow-up visit start here - there are no ratings on follow-up visits
            if (linkedVisit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up)
            {
                string followUpAnswer = _visitDataRepo.GetAll().Where(x => x.VisitId == linkedVisit.Id && x.Question == Constants.SSSettings.pqa_follow_up).Select(x => x.QuestionAnswer).FirstOrDefault();
                VisitType visitType = new VisitType();
                DateTime deadlineDate = new DateTime();
                Guid linkedVisitId = new Guid();

                if (followUpAnswer != null)
                {
                    // IF coach selects ""Yes"" for the question ""Is {practitioner first name} ready for a follow-up pqa visit?"", add the pqa to do item at the top of the screen & add the pqa item to the journey list (see UI)
                    if (followUpAnswer == Constants.SSSettings.answer_yes)
                    {
                        // When answer was yes to Is {client} ready for a follow-up pqa visit?, we add new accreditation visit (3 months)
                        deadlineDate = lastPQAVisit.ActualVisitDate.Value.AddMonths(3);
                        visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_pqa_visit_1).FirstOrDefault();
                        linkedVisitId = lastPQAVisit.Id;
                    }
                    else
                    {
                        // - IF coach selects ""No"" for the question ""Is {practitioner first name} ready for a follow-up pqa visit?"" auto-add another
                        // get previous follow-up record
                        Visit prevVisit = allPractitionerVisits.Where(x => x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                        x.LinkedVisitId == lastPQAVisit.Id &&
                                                                        x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).OrderByDescending(x => x.PlannedVisitDate).FirstOrDefault();
                        if (prevVisit == null)
                        {
                            deadlineDate = linkedVisit.ActualVisitDate.Value.AddDays(14);
                        }
                        else
                        {
                            deadlineDate = prevVisit.ActualVisitDate.Value.AddDays(14);
                        }


                        visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).FirstOrDefault();
                        linkedVisitId = lastPQAVisit.Id;
                    }
                }

                if (visitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up)
                {
                    if (totalVisits < 3)
                    {
                        Visit visit = allPractitionerVisits.Where(x => x.PlannedVisitDate.Date == deadlineDate.Date &&
                                                                        x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                        x.Attended == false &&
                                                                        x.LinkedVisitId == linkedVisitId &&
                                                                        x.VisitType.Name == visitType.Name).FirstOrDefault();
                        if (visit == null)
                        {
                            var visitModel = new VisitModel();
                            visitModel.VisitType = visitType;
                            visitModel.MotherId = null;
                            visitModel.InfantId = null;
                            visitModel.LinkedVisitId = linkedVisitId;
                            visitModel.PractitionerId = practitionerId;
                            visitModel.Attended = false;
                            visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                            visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                            newVisit = AddVisitForPractitioner(visitModel);
                        }
                    }
                }
                else
                {
                    Visit visit = allPractitionerVisits.Where(x => x.PlannedVisitDate.Date == deadlineDate.Date &&
                                                                    x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                    x.LinkedVisitId == linkedVisitId &&
                                                                    x.Attended == false &&
                                                                    x.VisitType.Name == visitType.Name).FirstOrDefault();
                    if (visit == null)
                    {
                        var visitModel = new VisitModel();
                        visitModel.VisitType = visitType;
                        visitModel.MotherId = null;
                        visitModel.InfantId = null;
                        visitModel.LinkedVisitId = linkedVisitId;
                        visitModel.PractitionerId = practitionerId;
                        visitModel.Attended = false;
                        visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        newVisit = AddVisitForPractitioner(visitModel);
                        if (visitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
                        {
                            AddSelfAssessmentVisit(newVisit);
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
            Visit newVisit = new Visit();

            List<Visit> allPractitionerVisits = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId).OrderByDescending(x => x.PlannedVisitDate).ToList();
            List<VisitType> visitTypes = _visitTypeRepo.GetAll().Where(x => x.Type == Constants.SSSettings.client_practitioner).OrderBy(x => x.Order).ToList();

            // get last completed PQA
            Visit lastPQAVisit = allPractitionerVisits.Where(x => x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                x.Attended == true &&
                                                                x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1).OrderByDescending(x => x.PlannedVisitDate).FirstOrDefault();

            // get last completed Re-accreditation
            Visit lastReAccreditationVisit = allPractitionerVisits.Where(x => x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                x.Attended == true &&
                                                                x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1).OrderByDescending(x => x.PlannedVisitDate).FirstOrDefault();

            // get list of re-accreditation visits to see if there are 2 orange ratings
            List<Visit> warningReAccreditationVisit = allPractitionerVisits.Where(x => x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                x.Attended == true &&
                                                                x.Rating == "Warning" && // this can be joined with new rating tables when done
                                                                x.LinkedVisitId == lastPQAVisit.Id &&
                                                                x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1).OrderByDescending(x => x.PlannedVisitDate).ToList();

            // total follow-ups linked to Re-accreditation visit
            int totalVisits = allPractitionerVisits.Where(x => x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                             x.LinkedVisitId == lastReAccreditationVisit.Id &&
                                                             x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up).OrderByDescending(x => x.PlannedVisitDate).Count();

            // if visit is visitType_re_accreditation_1
            if (linkedVisit.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1)
            {
                VisitType visitType = new VisitType();
                DateTime deadlineDate = new DateTime();
                Guid linkedVisitId = new Guid();
                // Regardless of how many follow-up visits are conducted, the next ""Annual re-accreditation"" deadline = date of the first annual reaccreditation + 3 months.
                bool addNewReAccreditationVisit = false;

                // and rating is green, we add an re-accreditation visit for next year
                if (color == MetricsColorEnum.Success.ToString())
                {
                    deadlineDate = linkedVisit.ActualVisitDate.Value.AddYears(1);
                    visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();
                    linkedVisitId = lastPQAVisit.Id;
                }
                else if (color == MetricsColorEnum.Error.ToString())
                {
                    // "Red rating follow up -- if the practitioner receives a red rating:
                    // -- optional - the coach can schedule / start 1 follow up visit only(no deadline since the item is only shown if the coach schedules it in calendar)
                    // --the coach must schedule another Re-accreditation visit; deadline = date of the initial Re-accreditation visit +14 days

                    deadlineDate = lastReAccreditationVisit.ActualVisitDate.Value.AddDays(14);
                    visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();
                    linkedVisitId = lastPQAVisit.Id;
                    
                }
                else if (color == MetricsColorEnum.Warning.ToString() && warningReAccreditationVisit.Count != 2)
                {
                    // get previous follow-up record
                    Visit prevVisit = allPractitionerVisits.Where(x => x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                             x.LinkedVisitId == lastReAccreditationVisit.Id &&
                                                             x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up).OrderByDescending(x => x.PlannedVisitDate).FirstOrDefault();
                    if (prevVisit == null)
                    {
                        deadlineDate = linkedVisit.ActualVisitDate.Value.AddDays(14);
                    }
                    else
                    {
                        deadlineDate = prevVisit.ActualVisitDate.Value.AddDays(14);
                    }
                    visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_re_accreditation_follow_up).FirstOrDefault();
                    linkedVisitId = lastReAccreditationVisit.Id;
                    addNewReAccreditationVisit = true;
                }

                // Adding the follow up visits - max 3 allowed
                if (linkedVisit.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up)
                {
                    if (totalVisits < 3)
                    {
                        // check to see if visit exists
                        Visit visit = allPractitionerVisits.Where(x => x.PlannedVisitDate.Date == deadlineDate.Date &&
                                                                 x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                 x.LinkedVisitId == linkedVisitId &&
                                                                 x.Attended == false &&
                                                                 x.VisitType.Name == visitType.Name).FirstOrDefault();
                        if (visit == null)
                        {
                            var visitModel = new VisitModel();
                            visitModel.VisitType = visitType;
                            visitModel.MotherId = null;
                            visitModel.InfantId = null;
                            visitModel.LinkedVisitId = linkedVisitId;
                            visitModel.PractitionerId = practitionerId;
                            visitModel.Attended = false;
                            visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                            visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                            newVisit = AddVisitForPractitioner(visitModel);
                        }
                    }
                }
                else // visitType_re_accreditation_1
                {
                    if (warningReAccreditationVisit.Count != 2)
                    {
                        // check to see if visit exists
                        Visit visit = allPractitionerVisits.Where(x => x.PlannedVisitDate.Date == deadlineDate.Date &&
                                                                 x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                 x.LinkedVisitId == linkedVisitId &&
                                                                 x.Attended == false &&
                                                                 x.VisitType.Name == visitType.Name).FirstOrDefault();
                        if (visit == null)
                        {
                            var visitModel = new VisitModel();
                            visitModel.VisitType = visitType;
                            visitModel.MotherId = null;
                            visitModel.InfantId = null;
                            visitModel.LinkedVisitId = linkedVisitId;
                            visitModel.PractitionerId = practitionerId;
                            visitModel.Attended = false;
                            visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                            visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                            newVisit = AddVisitForPractitioner(visitModel);
                            if (visitType.Name == Constants.SSSettings.visitType_re_accreditation_1 || visitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
                            {
                                AddSelfAssessmentVisit(newVisit);
                            }
                        }
                    }
                }

                // Regardless of how many follow-up visits are conducted, the next ""Annual re-accreditation"" deadline = date of the first annual reaccreditation + 3 months.
                if (addNewReAccreditationVisit)
                {
                    deadlineDate = lastReAccreditationVisit.ActualVisitDate.Value.AddMonths(3);
                    visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();
                    linkedVisitId = lastPQAVisit.Id;

                    Visit visit = allPractitionerVisits.Where(x => x.PlannedVisitDate.Date == deadlineDate.Date &&
                                                           x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                           x.LinkedVisitId == linkedVisitId &&
                                                           x.Attended == false &&
                                                           x.VisitType.Name == visitType.Name).FirstOrDefault();
                    if (visit == null)
                    {
                        var visitModel = new VisitModel();
                        visitModel.VisitType = visitType;
                        visitModel.MotherId = null;
                        visitModel.InfantId = null;
                        visitModel.LinkedVisitId = linkedVisitId;
                        visitModel.PractitionerId = practitionerId;
                        visitModel.Attended = false;
                        visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                        newVisit = AddVisitForPractitioner(visitModel);
                        AddSelfAssessmentVisit(newVisit);
                    }
                }
            }

            // Re-accreditation Follow-up visit start here - there are no ratings on follow-up visits
            if (linkedVisit.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up) 
            {
                string followUpAnswer = _visitDataRepo.GetAll().Where(x => x.VisitId == linkedVisit.Id && x.Question == Constants.SSSettings.re_accreditation_follow_up).Select(x => x.QuestionAnswer).FirstOrDefault();
                VisitType _visitType = new VisitType();
                DateTime _deadlineDate = new DateTime();
                Guid _linkedVisitId = new Guid();

                if (followUpAnswer != null)
                {
                    // IF coach selects ""Yes"" for the question ""Is {practitioner first name} ready for a follow-up reaccreditation visit?"", add the re-accreditation to do item at the top of the screen & add the reaccreditation item to the journey list (see UI)
                    if (followUpAnswer == Constants.SSSettings.answer_yes)
                    {
                        // When answer was yes to Is {client} ready for a follow-up reaccreditation visit?, we add new accreditation visit (3 months)
                        _deadlineDate = lastReAccreditationVisit.ActualVisitDate.Value.AddMonths(3);
                        _visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();
                        _linkedVisitId = lastPQAVisit.Id;
                    }
                    else
                    {
                        // - IF coach selects ""No"" for the question ""Is {practitioner first name} ready for a follow-up reaccreditation visit?"" auto-add another
                        Visit prevVisit = allPractitionerVisits.Where(x => x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                            x.LinkedVisitId == lastReAccreditationVisit.Id &&
                                                            x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up).OrderByDescending(x => x.PlannedVisitDate).FirstOrDefault();
                        if (prevVisit == null)
                        {
                            _deadlineDate = linkedVisit.ActualVisitDate.Value.AddDays(14);
                        }
                        else
                        {
                            _deadlineDate = prevVisit.ActualVisitDate.Value.AddDays(14);
                        }

                        _visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_re_accreditation_follow_up).FirstOrDefault();
                        _linkedVisitId = lastReAccreditationVisit.Id;
                    }
                }

                if (_visitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up)
                {
                    if (totalVisits < 3)
                    {
                        Visit visit = allPractitionerVisits.Where(x => x.PlannedVisitDate.Date == _deadlineDate.Date &&
                                                                    x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                    x.LinkedVisitId == _linkedVisitId &&
                                                                    x.Attended == false &&
                                                                    x.VisitType.Name == _visitType.Name).FirstOrDefault();
                        if (visit == null)
                        {
                            var visitModel = new VisitModel();
                            visitModel.VisitType = _visitType;
                            visitModel.MotherId = null;
                            visitModel.InfantId = null;
                            visitModel.LinkedVisitId = _linkedVisitId;
                            visitModel.PractitionerId = practitionerId;
                            visitModel.Attended = false;
                            visitModel.PlannedVisitDate = Convert.ToDateTime(_deadlineDate.Date, CultureInfo.InvariantCulture);
                            visitModel.DueDate = Convert.ToDateTime(_deadlineDate.Date, CultureInfo.InvariantCulture);
                            newVisit = AddVisitForPractitioner(visitModel);
                        }
                    }
                } else
                {
                    Visit visit = allPractitionerVisits.Where(x => x.PlannedVisitDate.Date == _deadlineDate.Date &&
                                                                    x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                    x.LinkedVisitId == _linkedVisitId &&
                                                                    x.Attended == false &&
                                                                    x.VisitType.Name == _visitType.Name).FirstOrDefault();
                    if (visit == null)
                    {
                        var visitModel = new VisitModel();
                        visitModel.VisitType = _visitType;
                        visitModel.MotherId = null;
                        visitModel.InfantId = null;
                        visitModel.LinkedVisitId = _linkedVisitId;
                        visitModel.PractitionerId = practitionerId;
                        visitModel.Attended = false;
                        visitModel.PlannedVisitDate = Convert.ToDateTime(_deadlineDate.Date, CultureInfo.InvariantCulture);
                        visitModel.DueDate = Convert.ToDateTime(_deadlineDate.Date, CultureInfo.InvariantCulture);
                        newVisit = AddVisitForPractitioner(visitModel);
                        if (_visitType.Name == Constants.SSSettings.visitType_re_accreditation_1)
                        {
                            AddSelfAssessmentVisit(newVisit);
                        }
                    }
                }
            }

            // "In the same reaccreditation period, the practitioner received 2 orange ratings in a row." add new PQA Visit
            if (warningReAccreditationVisit.Count == 2)
            {
                Visit latestAccreditationVisit = warningReAccreditationVisit.FirstOrDefault();
                DateTime deadlineDate = latestAccreditationVisit.ActualVisitDate.Value.AddMonths(3);
                VisitType visitType = visitTypes.Where(x => x.Name == Constants.SSSettings.visitType_pqa_visit_1).FirstOrDefault();
                Guid linkedVisitId = latestAccreditationVisit.Id;

                Visit visit = allPractitionerVisits.Where(x =>  x.PlannedVisitDate.Date == deadlineDate.Date &&
                                                                x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                                                x.LinkedVisitId == linkedVisitId &&
                                                                x.Attended == false &&
                                                                x.VisitType.Name == visitType.Name).FirstOrDefault();
                if (visit == null)
                {
                    var visitModel = new VisitModel();
                    visitModel.VisitType = visitType;
                    visitModel.MotherId = null;
                    visitModel.InfantId = null;
                    visitModel.LinkedVisitId = linkedVisitId;
                    visitModel.PractitionerId = practitionerId;
                    visitModel.Attended = false;
                    visitModel.PlannedVisitDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                    visitModel.DueDate = Convert.ToDateTime(deadlineDate.Date, CultureInfo.InvariantCulture);
                    newVisit = AddVisitForPractitioner(visitModel);
                    AddSelfAssessmentVisit(newVisit);
                }
            }

            return newVisit;
        }

        public bool ValidateDefaultVisitsForPractitioner(string userId, Guid practitionerId)
        {
            var smartSpaceLic = _userLicenseManager.GetLicenseForUserForType(Guid.Parse(userId), Constants.SSSettings.ss_smart_space_licence);

            if (smartSpaceLic == null)
            {
                return false;
            } 

            List<VisitType> visitTypes = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) &&
                                                                        (x.Name == Constants.SSSettings.visitType_pre_pqa_visit_1 ||
                                                                        x.Name == Constants.SSSettings.visitType_pre_pqa_visit_2 ||
                                                                        x.Name == Constants.SSSettings.visitType_pqa_visit_1)
                                                                        ).OrderBy(x => x.Order).ToList();
            List<Visit> visits = _visitRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.IsActive == true).ToList();


            DateTime dt = smartSpaceLic.LicenseDate.Value.Date;
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
                    PractitionerId = practitionerId
                };

                // -- first visit; Deadline for first visit = { date SmartSpace licence was received + 1 month }
                if (visitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_1)
                {
                    DateTime newDate = dt.AddMonths(1);
                    input.PlannedVisitDate = newDate;
                    Visit visit = visits.Where(x => x.VisitTypeId == visitType.Id && x.PlannedVisitDate.Date == newDate.Date).FirstOrDefault();
                    if (visit == null)
                    {
                        AddVisit(input);
                    }
                }
                // --second visit; Deadline for second visit = { date SmartSpace licence was received + 2 months }
                if (visitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_2)
                {
                    DateTime newDate = dt.AddMonths(2);
                    input.PlannedVisitDate = newDate;
                    Visit visit = visits.Where(x => x.VisitTypeId == visitType.Id && x.PlannedVisitDate.Date == newDate.Date).FirstOrDefault();
                    if (visit == null)
                    {
                        AddVisit(input);
                    }
                }
                // SmartSpace licence received date + 3 months
                if (visitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
                {
                    DateTime newDate = dt.AddMonths(3);
                    input.PlannedVisitDate = newDate;
                    Visit visit = visits.Where(x => x.VisitTypeId == visitType.Id && x.PlannedVisitDate.Date == newDate.Date).FirstOrDefault();
                    if (visit == null)
                    {
                        visit = AddVisit(input);
                    }
                    // EC-548 -- add self assessment
                    AddSelfAssessmentVisit(visit);
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

