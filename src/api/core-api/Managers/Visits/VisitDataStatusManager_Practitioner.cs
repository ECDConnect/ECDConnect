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
using System.Linq;
using static EcdLink.Api.CoreApi.Constants;

namespace EcdLink.Api.CoreApi.Managers.Visits
{
    public class VisitDataStatusManager_Practitioner: BaseManager {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;

        private Guid _applicationUserId;
        private List<string> _clientVisitDataIds;
        private HierarchyEngine _hierarchyEngine;

        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitData, Guid> _visitDataRepo;
        private IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;
        
        public VisitDataStatusManager_Practitioner(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine) {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;

            _applicationUserId = contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            _visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            _visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);
        }

        public bool ManageVisitDataStatus(string id, string visitId) 
        {
            Visit visitRecord = _visitRepo.GetById(new Guid(visitId));
            List<VisitData> allVisitData = _visitDataRepo.GetAll().Where(x => x.VisitId.ToString() == visitId).ToList();

            Practitioner practitioner = _practitionerRepo.GetAll().Where(x => x.User.Id == Guid.Parse(id)).OrderBy(x => x.Id).FirstOrDefault();
            _clientVisitDataIds = (
                from visit in _visitRepo.GetAll().Where(x => x.PractitionerId == practitioner.Id)
                join visitData in _visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                select visitData.Id.ToString()
            ).ToList();

            if (visitRecord.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
            {
                ManagePQAVisitData(allVisitData, practitioner.Id.ToString(), practitioner.User.FirstName);
            }

            return true;
        }

        private Boolean ManagePQAVisitData(List<VisitData> allVisitData, string practitionerId, string firstName)
        {
            var color = "";
            var type = Constants.SSSettings.pqa_visit;

            var step2_score = 0;
            var step2_final = 0.0;

            var step3_score = 0;

            var step4_score = 0;
            var step4_final = 0;

            var step5_score = 0;
            var step5_final = 0;

            var step6_score = 0;
            var step6_final = 0;

            var step7_score = 0;
            var step7_final = 0;

            var step8_score = 0;
            var step8_final = 0;

            var step12_score = 0;
            var step13_score = 0;
            var step16_score = 0;

            // loop through data and add status data
            foreach (VisitData vData in allVisitData)
            {
                // Step 2
                if (vData.Question == Constants.SSSettings.step2_q1)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q1_a2) { step2_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q1_a3) { step2_score += 2; }
                }
                if (vData.Question == Constants.SSSettings.step2_q2)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q2_a2) { step2_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q2_a3) { step2_score += 2; }
                }
                if (vData.Question == Constants.SSSettings.step2_q3)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q3_a2) { step2_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q3_a3) { step2_score += 2; }
                }
                if (vData.Question == Constants.SSSettings.step2_q4)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q4_a2) { step2_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q4_a3) { step2_score += 2; }
                }
                if (vData.Question == Constants.SSSettings.step2_q5)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q5_a2) { step2_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q5_a3) { step2_score += 2; }
                }
                if (vData.Question == Constants.SSSettings.step2_q6)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q6_a2) { step2_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step2_q6_a3) { step2_score += 2; }
                }
                // Step 3
                if (vData.Question == Constants.SSSettings.step3_q1)
                {
                    var _score = 0;
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a1) { _score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a2) { _score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a3) { _score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a4) { _score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a5) { _score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a6) { _score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a7) { _score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a8) { _score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a9) { _score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a10) { _score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step3_q1_a11) { _score++; }

                    if (_score == 4)
                    {
                        step3_score += 1;
                    }
                    else if (_score > 4)
                    {
                        step3_score += 2;
                    }

                }
                // Step 4
                if (vData.Question == Constants.SSSettings.step4_q1)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q1_a2) { step4_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q1_a3) { step4_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q2_a2) { step4_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q2_a3) { step4_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q3_a2) { step4_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q3_a3) { step4_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q4_a2) { step4_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q4_a3) { step4_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q5_a2) { step4_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q5_a3) { step4_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q6_a2) { step4_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q6_a3) { step4_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q7_a2) { step4_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step4_q7_a3) { step4_score += 2; }
                }
                // Step 5
                if (vData.Question == Constants.SSSettings.step5_q1)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q1_a2) { step5_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q1_a3) { step5_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q2_a2) { step5_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q2_a3) { step5_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q3_a2) { step5_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q3_a3) { step5_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q4_a2) { step5_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q4_a3) { step5_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q5_a2) { step5_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q5_a3) { step5_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q6_a2) { step5_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step5_q6_a3) { step5_score += 2; }
                }
                // Step 6
                if (vData.Question == Constants.SSSettings.step6_q1)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step6_q1_a2) { step6_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step6_q1_a3) { step6_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step6_q2_a2) { step6_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step6_q2_a3) { step6_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step6_q3_a2) { step6_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step6_q3_a3) { step6_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step6_q4_a2) { step6_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step6_q4_a3) { step6_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step6_q5_a2) { step6_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step6_q5_a3) { step6_score += 2; }
                }
                // Step 7
                if (vData.Question == Constants.SSSettings.step7_q1)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step7_q1_a2) { step7_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step7_q1_a3) { step7_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step7_q2_a2) { step7_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step7_q2_a3) { step7_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step7_q3_a2) { step7_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step7_q3_a3) { step7_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step7_q4_a2) { step7_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step7_q4_a3) { step7_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step7_q5_a2) { step7_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step7_q5_a3) { step7_score += 2; }
                }
                // Step 8
                if (vData.Question == Constants.SSSettings.step8_q1)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step8_q1_a2) { step8_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step8_q1_a3) { step8_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step8_q2_a2) { step8_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step8_q2_a3) { step8_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step8_q3_a2) { step8_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step8_q3_a3) { step8_score += 2; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step8_q4_a2) { step8_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step8_q4_a3) { step8_score += 2; }
                }

                // Step 12 
                if (vData.Question == Constants.SSSettings.step12_q1)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a1) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a2) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a3) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a4) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a5) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a6) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a7) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a8) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a9) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a10) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a11) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a12) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a13) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a14) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a15) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a16) { step12_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step12_q1_a17) { step12_score++; }
                }
                // Step 13
                if (vData.Question == Constants.SSSettings.step13_q1)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.step13_q1_a1) { step13_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step13_q1_a2) { step13_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step13_q1_a3) { step13_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step13_q1_a4) { step13_score++; }
                    if (vData.QuestionAnswer == Constants.SSSettings.step13_q1_a5) { step13_score++; }
                }
                // Step 16
                if (vData.Question == Constants.SSSettings.step16_q1)
                {
                    if (vData.QuestionAnswer == Constants.SSSettings.answer_yes)
                    {
                        step16_score++;
                    }
                }
            }


            var step2 = allVisitData.Where(x => x.VisitSection == Constants.SSSettings.step2).FirstOrDefault();
            step2_final = (step2_score / Constants.SSSettings.step2_total) * 100;
            color = GetStepRatingColor(step2_final);
            AddVisitDataStatus(step2, step2_final.ToString(), color, type, step2.VisitSection, false);

            var step3 = allVisitData.Where(x => x.VisitSection == Constants.SSSettings.step3).FirstOrDefault();
            color = GetStep3RatingColor(step3_score);
            AddVisitDataStatus(step3, step3_score.ToString(), color, type, step3.VisitSection, false);

            var step4 = allVisitData.Where(x => x.VisitSection == Constants.SSSettings.step4).FirstOrDefault();
            step4_final = (step4_score / Constants.SSSettings.step4_total) * 100;
            color = GetStepRatingColor(step4_final);
            AddVisitDataStatus(step4, step4_final.ToString(), color, type, step4.VisitSection, false);

            var step5 = allVisitData.Where(x => x.VisitSection == Constants.SSSettings.step5).FirstOrDefault();
            step5_final = (step5_score / Constants.SSSettings.step5_total) * 100;
            color = GetStepRatingColor(step5_final);
            AddVisitDataStatus(step5, step5_final.ToString(), color, type, step5.VisitSection, false);

            var step6 = allVisitData.Where(x => x.VisitSection == Constants.SSSettings.step6).FirstOrDefault();
            step6_final = (step6_score / Constants.SSSettings.step6_total) * 100;
            color = GetStepRatingColor(step6_final);
            AddVisitDataStatus(step6, step6_final.ToString(), color, type, step6.VisitSection, false);

            var step7 = allVisitData.Where(x => x.VisitSection == Constants.SSSettings.step7).FirstOrDefault();
            step7_final = (step7_score / Constants.SSSettings.step7_total) * 100;
            color = GetStepRatingColor(step7_final);
            AddVisitDataStatus(step7, step7_final.ToString(), color, type, step7.VisitSection, false);

            var step8 = allVisitData.Where(x => x.VisitSection == Constants.SSSettings.step8).FirstOrDefault();
            step8_final = (step8_score / Constants.SSSettings.step8_total) * 100;
            color = GetStepRatingColor(step8_final);
            AddVisitDataStatus(step8, step8_final.ToString(), color, type, step8.VisitSection, false);

            var step11 = allVisitData.Where(x => x.Question == Constants.SSSettings.step11_q1).FirstOrDefault();
            if (step11.QuestionAnswer == Constants.SSSettings.answer_yes)
            {
                var step12 = allVisitData.Where(x => x.VisitSection == Constants.SSSettings.step12).FirstOrDefault();
                if (step12_score == 17)
                {
                    color = StatusColours.Green;
                }
                else if (step12_score >= 1 && step12_score < 17)
                {
                    color = StatusColours.Amber;
                }
                else if (step12_score == 0)
                {
                    color = StatusColours.Red;
                }
                AddVisitDataStatus(step12, step12_score.ToString(), color, type, step12.VisitSection, false);

                var step13 = allVisitData.Where(x => x.VisitSection == Constants.SSSettings.step13).FirstOrDefault();
                if (step13_score == 5)
                {
                    color = StatusColours.Green;
                }
                else if (step13_score >= 1 && step13_score < 5)
                {
                    color = StatusColours.Amber;
                }
                else if (step13_score == 0)
                {
                    color = StatusColours.Red;
                }
                AddVisitDataStatus(step13, step13_score.ToString(), color, type, step13.VisitSection, false);

                // step 14 scenarios
                var step14 = allVisitData.Where(x => x.Question == Constants.SSSettings.step14_q1).FirstOrDefault();
                if (step14.QuestionAnswer == Constants.SSSettings.answer_yes)
                {
                    // scenario 1
                    if (step12_score == 17 && step13_score == 0)
                    {
                        List<string> list = new List<string>();
                        list.Add(Constants.SSSettings.step13_q1_a1);
                        list.Add(Constants.SSSettings.step13_q1_a2);
                        list.Add(Constants.SSSettings.step13_q1_a3);
                        list.Add(Constants.SSSettings.step13_q1_a4);
                        list.Add(Constants.SSSettings.step13_q1_a5);

                        string comments = FormatBulletList(list.ToArray());

                        AddVisitDataStatus(step14, comments, StatusColours.None, type, step14.VisitSection, false);
                    }
                    // scenario 2
                    if (step12_score == 17 && step13_score == 5)
                    {
                        string comment = Constants.SSSettings.step14_success.Replace("{client}", firstName);
                        AddVisitDataStatus(step14, comment, StatusColours.Green, type, step14.VisitSection, false);
                    }
                    // scenario 3
                    if (step12_score < 12)
                    {
                        string comment = Constants.SSSettings.step14_not_reissue.Replace("{client}", firstName);
                        AddVisitDataStatus(step14, comment, StatusColours.Red, type, step14.VisitSection, false);
                    }
                    // scenario 4
                    if (step12_score >= 12)
                    {
                        string comment = Constants.SSSettings.step14_not_meet.Replace("{client}", firstName);
                        AddVisitDataStatus(step14, comment, StatusColours.Amber, type, step14.VisitSection, false);
                    }
                }
                else
                {
                    // red flag
                    AddVisitDataStatus(step14, Constants.SSSettings.step14_not_reissue.Replace("{client}", firstName), StatusColours.Red, type, step14.VisitSection, false);
                }
            }

            var step16a = allVisitData.Where(x => x.Question == Constants.SSSettings.step16_q1).FirstOrDefault();
            if (step16_score == 1)
            {
                AddVisitDataStatus(step16a, step16a.QuestionAnswer, StatusColours.Red, type, step16a.VisitSection, false);
            }

            var step16b = allVisitData.Where(x => x.Question == Constants.SSSettings.step16_q2).FirstOrDefault();
            if (step16b.QuestionAnswer == Constants.SSSettings.answer_no)
            {
                AddVisitDataStatus(step16b, step16b.QuestionAnswer, StatusColours.Amber, type, step16b.VisitSection, false);
            }

            var step16c = allVisitData.Where(x => x.Question == Constants.SSSettings.step16_q3).FirstOrDefault();
            if (step16c.QuestionAnswer == Constants.SSSettings.answer_yes)
            {
                AddVisitDataStatus(step16c, step16c.QuestionAnswer, StatusColours.Amber, type, step16c.VisitSection, false);
            }

            return true;
        }
        private Boolean AddVisitDataStatus(VisitData input, string comment, string color, string type, string section, Boolean isCompleted)
        {
            if (input != null) {
                var visitDataStatus = GetVisitDataStatusFromInputModel(input);
                visitDataStatus.Id = Guid.NewGuid();
                visitDataStatus.Comment = comment;
                visitDataStatus.Color = color;
                visitDataStatus.Type = type;
                visitDataStatus.Section = section;
                visitDataStatus.IsCompleted = isCompleted;
                InsertVisitDataStatus(visitDataStatus);
            }
            return true;
        }
        private Boolean InsertVisitDataStatus(VisitDataStatus input)
        {
            // Ensure we don't add duplicate records for a client
            if (!ValidateVisitDataStatusRecord(input))
            {
                _visitDataStatusRepo.Insert(input);
            }
            return true;
        }
        private Boolean ValidateVisitDataStatusRecord(VisitDataStatus input)
        {
            var visitStatusRecord = _visitDataStatusRepo.GetAll().Where(x => x.Comment == input.Comment && x.Type == input.Type && _clientVisitDataIds.Contains(x.VisitDataId.ToString())).OrderBy(x => x.Id).FirstOrDefault();

            if (visitStatusRecord != null)
            {
                return true;
            }
            return false;
        }
        private VisitDataStatus GetVisitDataStatusFromInputModel(VisitData input)
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
                UpdatedBy = _applicationUserId.ToString(),
                VisitDataId = input.Id,
                Comment = "",
                Color = "",
                Type = "",
                Section = ""
            };
        }
        public string GetStepRatingColor(double finalScore)
        {
            string color = "";

            if (finalScore <= 25)
            {
                color = StatusColours.Red;
            }
            else if (finalScore >= 26 && finalScore <= 69)
            {
                color = StatusColours.Amber;
            }
            else if (finalScore > 69)
            {
                color = StatusColours.Green;
            }

            return color;
        }
        public string GetStep3RatingColor(double finalScore)
        {
            string color = "";
            if (finalScore == 0)
            {
                color = StatusColours.Red;
            }
            else if (finalScore == 1)
            {
                color = StatusColours.Amber;
            }
            else if (finalScore == 2)
            {
                color = StatusColours.Green;
            }

            return color;
        }

    }
}
