using EcdLink.Api.CoreApi.GraphApi.Models.Visits;
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
        private HierarchyEngine _hierarchyEngine;

        private Guid _applicationUserId;

        public VisitManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();
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
                PractitionerId = input.PractitionerId,
                Risk = input.Risk ?? "normal",
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
                PractitionerId = input.PractitionerId,
                Risk = input.Risk ?? "normal",
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
                PractitionerId = input.PractitionerId,
                CoachId = input.CoachId,
                Risk = input.Risk ?? "normal",
                Comment = input.Comment,
                UpdatedBy = _applicationUserId.ToString(),
                LinkedVisitId = input.LinkedVisitId,
                ActualVisitDate = input.ActualVisitDate,
                PlannedVisitDate = input.PlannedVisitDate,
                EventId = input.EventId,
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
                PractitionerId = input.PractitionerId,
                Risk = input.Risk ?? "normal",
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

           if (type == Constants.SSSettings.client_practitioner)
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

                if (type == Constants.SSSettings.client_practitioner)
                {
                    nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == Id && !x.Attended && x.PlannedVisitDate.Date >= monday.Date && x.PlannedVisitDate.Date <= next7Days.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).LastOrDefault();
                }
            }
            else
            {
                DateTime next7Days = today.AddDays(7);

                if (type == Constants.SSSettings.client_practitioner)
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

            if (type == Constants.SSSettings.client_practitioner)
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

        public DateTime? GetClientsNextVisitDate(Guid Id, string type)
        {
            Visit nextVisit = null;
            DateTime today = DateTime.Today;

            if (type == Constants.SSSettings.client_practitioner)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == Id && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }

            if (nextVisit != null)
            {
                return nextVisit.PlannedVisitDate.Date;
            }
            return default(DateTime);
        }

        public DateTime? GetClientsNextDueVisitDate(Guid Id, string type)
        {
            Visit nextVisit = null;
            DateTime today = DateTime.Today;

            if (type == Constants.SSSettings.client_practitioner)
            {
                nextVisit = _visitRepo.GetAll().Where(x => x.PractitionerId == Id && !x.Attended && x.PlannedVisitDate.Date >= today.Date && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).FirstOrDefault();
            }

            if (nextVisit != null)
            {
                return nextVisit.DueDate != null ? nextVisit.DueDate.Value.Date : nextVisit.PlannedVisitDate.Date;
            }
            return default(DateTime);
        }

        public List<Visit> GetVisitsForClient(string id, string type)
        {
            List<Visit> allVisits = new List<Visit>();
            if (type == Constants.SSSettings.client_practitioner)
            {
                allVisits = _visitRepo.GetAll().Where(x => x.Practitioner.UserId.ToString() == id && x.VisitType.Type == Constants.SSSettings.client_practitioner).OrderBy(y => y.PlannedVisitDate).ToList();
            }
            else if (type == Constants.SSSettings.client_coach)
            {
                allVisits = _visitRepo.GetAll().Where(x => x.Coach.UserId.ToString() == id && x.VisitType.Type == Constants.SSSettings.client_coach).OrderBy(y => y.PlannedVisitDate).ToList();
            }

            foreach (var visit in allVisits)
            {
                // Adding this 1 day to match the next visit's planned date.
                visit.DueDate = visit.DueDate != null ? visit.DueDate.Value.Date.AddDays(1) : visit.PlannedVisitDate;

                if (visit.Attended == false)
                {
                    visit.VisitInProgress = _visitDataRepo.GetAll().Where(x => x.VisitId == visit.Id).Count() > 0;
                }

                // Order by started date if any visit data added, otherwise due date or planned date
                visit.OrderDate = visit.VisitData != null && visit.VisitData.Any()
                    ? visit.VisitData.OrderBy(x => x.InsertedDate).First().InsertedDate
                    : visit.DueDate != null 
                        ? visit.DueDate.Value.Date 
                        : visit.PlannedVisitDate;
            }

            // var additionalVisits = allVisits.Where(x => x.VisitType.Name == Constants.GGSettings.VisitTypeAdditionalVisit).ToList();
            // foreach (var item in additionalVisits)
            // {
            //     if (item.DueDate == null)
            //     {
            //         var linkedVisit = allVisits.Where(x => x.Id == item.LinkedVisitId).FirstOrDefault();
            //         if (linkedVisit != null)
            //         {
            //             item.OrderDate = linkedVisit.OrderDate.HasValue
            //                 ? linkedVisit.OrderDate.Value.AddMinutes(1) // Ensure that the additional visit appears after the visit it was created from
            //                 : linkedVisit.DueDate ?? linkedVisit.PlannedVisitDate;

            //         }
            //     }
            // }

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
            return totalVisits;
        }

        public Guid GetLastCompletedVisitId(string id, string type)
        {
            Guid visitId = Guid.Empty;

            if (type == Constants.SSSettings.client_practitioner)
            {
                visitId = _visitRepo.GetAll().Where(x => x.PractitionerId.ToString() == id && x.Attended == true && x.VisitType.Type == type).OrderBy(x => x.PlannedVisitDate).Select(x => x.Id).FirstOrDefault();
            }
            return visitId;
        }
        
        public Visit GetVisitForUserForType(string id, string userType, string vType)
        {
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

        public Visit RestartVisit(Guid existingVisitId)
        {
            var exisitngVisit = _visitRepo.GetById(existingVisitId);

            if (exisitngVisit == null || exisitngVisit.Attended || (exisitngVisit.DueDate.HasValue && exisitngVisit.DueDate.Value < DateTime.Now))
            {
                throw new ArgumentException("Invalid visit to restart");
            }

            var newVisit = new Visit()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                Attended = false,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                PlannedVisitDate = exisitngVisit.PlannedVisitDate,
                DueDate = exisitngVisit.DueDate,
                VisitTypeId = exisitngVisit.VisitType.Id,
                Risk = exisitngVisit.Risk,
                Comment = exisitngVisit.Comment,
                UpdatedBy = _applicationUserId.ToString(),
                LinkedVisitId = existingVisitId
            };

            var insertedVisit = _visitRepo.Insert(newVisit);

            exisitngVisit.IsCancelled = true;
            _visitRepo.Update(exisitngVisit);

            return insertedVisit;
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

