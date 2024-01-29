using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using ECDLink.Core.Extensions;
using Newtonsoft.Json;
using ECDLink.SmartStart.Reports.ChildProgressReport;
using ECDLink.DataAccessLayer.Entities.Reports;

namespace EcdLink.Api.CoreApi.Services
{
    public partial class SmartStartIntegrationService : IIntegrationService
    {
        public async Task PushChildProgressReports()
        {
            if (!this.Enabled) return;

            await _logManager.IntegrationLog($"PushChildProgressReports started at {DateTime.Now}", null, null, LogRelatedType.Log, "PushChildProgressReports");

            _mappedEntities = await this.GetMappedEntities();
            var mappedPractitionersDictionary =
                _mappedEntities.Where(x => x.LocalEntity == Constants.SSIntegrationSettings.SSPractitioner && !string.IsNullOrEmpty(x.UserId))
                .Select(x => new { x.UserId, x.RemoteId })
                .ToDictionary(x => x.UserId, x => x.RemoteId);

            var mappedChildrenDictionary = _mappedEntities
                .Where(x => x.LocalEntity == Constants.SSIntegrationSettings.SSChild && !string.IsNullOrEmpty(x.LocalId))
                .Select(x => new { x.LocalId, x.RemoteId })
                .ToDictionary(x => x.LocalId, x => x.RemoteId);

            var hierarchy = _userHierarchyRepo.GetAll()
                .Select(x => new { x.Hierarchy, x.UserId })
                .ToDictionary(x => x.Hierarchy, x => x.UserId);


            // GET COMPLETED BUT NOT SYNCED CHILD PROGRESS REPORTS
            var reportsToSync = _childProgressReportRepo.GetAll().Where(x => x.DateCompleted.HasValue && !x.IntegrationSubmitDate.HasValue).ToList();

            foreach (var reportBatch in  reportsToSync.Batch(10)) 
            {
                var inputBuilder = new StringBuilder("[");

                // Map report to input
                foreach (var report in reportBatch)
                {
                    if (!hierarchy.ContainsKey(report.Hierarchy))
                    {
                        await _logManager.IntegrationLog($"Practitioner hierarchy not found", report.Hierarchy, null, LogRelatedType.Log, "PushChildProgressReports > GetAPIHandlerResponse");
                        continue;
                    }

                    var practitionerUserId = hierarchy[report.Hierarchy];

                    if (!mappedPractitionersDictionary.ContainsKey(practitionerUserId))
                    {
                        await _logManager.IntegrationLog($"Practitioner not mapped", practitionerUserId, null, LogRelatedType.Log, "PushChildProgressReports > GetAPIHandlerResponse");
                        continue;
                    }

                    var practitionerRemoteId = mappedPractitionersDictionary[practitionerUserId];

                    if (!mappedChildrenDictionary.ContainsKey(report.ChildId.ToString()))
                    {
                        await _logManager.IntegrationLog($"Child not mapped", report.ChildId.ToString(), null, LogRelatedType.Log, "PushChildProgressReports > GetAPIHandlerResponse");
                        continue;
                    }

                    var childRemoteId = mappedChildrenDictionary[report.ChildId.ToString()];

                    // Need to figure out how to get the practitioner remote id from just the hierarchy :/ 
                    var reportInput = MapToInput(
                        report,
                        practitionerRemoteId,
                        childRemoteId);

                    inputBuilder.Append(reportInput);
                    inputBuilder.AppendLine(",");
                }
                inputBuilder.AppendLine("]");

                // Send all
                try
                {
                    if (inputBuilder.Length > 20)
                    {
                        var success = await SyncChildProgressData(inputBuilder.ToString());

                        if (success)
                        {
                            foreach (var report in reportBatch)
                            {
                                report.IntegrationSubmitDate = DateTime.Now;
                                _childProgressReportRepo.Update(report);
                            }
                        }
                    }
                }
                catch(Exception e)
                {
                    await _logManager.IntegrationLog(
                        $"Error: {e.Message}",
                        e.InnerException != null ? e.InnerException.ToString() : null,
                        null,
                        LogRelatedType.Error,
                        "PushChildProgressReports");
                }                
            }

            await _logManager.IntegrationLog($"PushMonthlyAttendancePdf completed at {DateTime.Now}", null, null, LogRelatedType.Log, "PushMonthlyAttendancePdf");
        }

        private string MapToInput(ChildProgressReport report, string practitionerRemoteId, string childRemoteId)
        {
            var reportContent = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(report.ReportContent);
            var learning = reportContent.Categories.FirstOrDefault(x => x.CategoryId == ECDLink.SmartStart.Reports.Constants.Categories.CognitiveAndNumeracy);
            var social = reportContent.Categories.FirstOrDefault(x => x.CategoryId == ECDLink.SmartStart.Reports.Constants.Categories.SocialAndEmotional);
            var physical = reportContent.Categories.FirstOrDefault(x => x.CategoryId == ECDLink.SmartStart.Reports.Constants.Categories.Physical);
            var language = reportContent.Categories.FirstOrDefault(x => x.CategoryId == ECDLink.SmartStart.Reports.Constants.Categories.LanguageAndLiteracy);


            var stringBuilder = new StringBuilder("{");
            stringBuilder.AppendLine($"\"CreatedPlatform\": \"Funda App\",");
            stringBuilder.AppendLine($"\"Month\": \"{report.DateCompleted.Value.ToString("MMMM")}\",");

            if (learning.SupportingTask != null)
            {
                stringBuilder.AppendLine($"\"CognitiveSkillToWorkOn\": \"{learning.SupportingTask.TaskDescription}\", ");
            }
            if (language.SupportingTask != null)
            {
                stringBuilder.AppendLine($"\"LanguageSkillToWorkOn\": \"{language.SupportingTask.TaskDescription}\", ");
            }
            if (physical.SupportingTask != null)
            {
                stringBuilder.AppendLine($"\"PhysicalSkillToWorkOn\": \"{physical.SupportingTask.TaskDescription}\", ");
            }
            if (social.SupportingTask != null)
            {
                stringBuilder.AppendLine($"\"SocialOrEmotionalSkillToWorkOn\": \"{social.SupportingTask.TaskDescription}\", ");
            }

            //stringBuilder.AppendLine($"\"SharedWithCaregiver\": null, "); We don't currently track this
            stringBuilder.AppendLine($"\"DateOfReport\": \"{report.DateCompleted.Value.ToString("yyyy-MM-ddTHH:mm:ssZ")}\", ");
            stringBuilder.AppendLine($"\"Learning\": \"{MapLevel(learning.AchievedLevelId)}\", ");
            stringBuilder.AppendLine($"\"FeelingSecure\": \"{MapLevel(social.AchievedLevelId)}\", ");
            stringBuilder.AppendLine($"\"Growing\": \"{MapLevel(physical.AchievedLevelId)}\", ");
            stringBuilder.AppendLine($"\"Communicating\": \"{MapLevel(language.AchievedLevelId)}\", ");
            stringBuilder.AppendLine("\"Franchisee\": {");
            stringBuilder.AppendLine($"\"Guid\": \"{practitionerRemoteId}\"");
            stringBuilder.AppendLine("},");
            stringBuilder.AppendLine("\"Child\": {");
            stringBuilder.AppendLine($"\"Guid\": \"{childRemoteId}\"");
            stringBuilder.AppendLine("},");
            stringBuilder.AppendLine($"\"Type\": \"{MapReportDateToType(report.ReportDate)}\", ");
            stringBuilder.Append("}");

            return stringBuilder.ToString();
        }

        private async Task<bool> SyncChildProgressData(string inputString)
        {
            var childProgressUrl = $"{Constants.SSIntegrationSettings.SSChildProgressReport}{Constants.SSIntegrationSettings.CreateMultiple}";
            try
            {
                //now send to API call <entity type>/Multiple
                var apiResponse = await _apiManager.GetAPIHandlerResponse(childProgressUrl, null, null, null, false, false, inputString);
                if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                {
                    var returnObj = JsonConvert.DeserializeObject<List<PostResponse>>(apiResponse.ResponseString);
                    if (returnObj != null && returnObj.Any() && returnObj.All(x => x.HttpStatusCode == 200 || x.HttpStatusCode == 201))
                    {
                        return true;
                    }
                    else //error empty response received
                    {
                        await _logManager.IntegrationLog($"Data Push Fail: {apiResponse.ResponseString}", $"{inputString} | {apiResponse.ResponseString}", null, LogRelatedType.Error, "PushChildProgressReports > GetAPIHandlerResponse");
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog("SmartLink API Error: " + e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "PushChildProgressReports > GetAPIHandlerResponse");
                return false;
            }
        }

        private string MapLevel(int achievedLevelId)
        {
            switch (achievedLevelId)
            {
                case ECDLink.SmartStart.Reports.Constants.AchievedLevels.Beginning:
                    return "P";
                case ECDLink.SmartStart.Reports.Constants.AchievedLevels.MovingOn:
                    return "1";
                case ECDLink.SmartStart.Reports.Constants.AchievedLevels.AdvancingFurther:
                    return "2";
                case ECDLink.SmartStart.Reports.Constants.AchievedLevels.TowardsGradeR:
                    return "3";
                default:
                    return "";//throw new NotImplementedException();
            }
        }

        private string MapReportDateToType(DateTime reportDate)
        {
            if (reportDate < new DateTime(2020,1,1))
            {
                return "Initial";
            }

            if (reportDate.Month < 8)
            {
                return "June";
            }

            return "November";
        }
    }
}