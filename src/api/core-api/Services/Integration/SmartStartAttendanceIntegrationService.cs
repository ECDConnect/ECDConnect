using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Core.Models;
using Newtonsoft.Json;
using NPOI.SS.Formula.Functions;
using System.Security.Cryptography;

namespace EcdLink.Api.CoreApi.Services
{
    public partial class SmartStartIntegrationService : IIntegrationService
    {
        private const string _absent = "Absent";
        private const string _noSession = "No Session";
        private const string _unknown = "Unknown";
        private const string _present = "Present";
        private const string _publicHoliday = "Public Holiday";

        public async Task PushMonthlyAttendancePdf()
        {
            if (!this.Enabled) return;

            await _logManager.IntegrationLog($"PushMonthlyAttendancePdf started at {DateTime.Now}", null, null, LogRelatedType.Log, "PushMonthlyAttendancePdf");

            var startPeriod = DateTime.Now.GetStartOfMonth();
            _mappedEntities = await this.GetMappedEntities(Constants.SSIntegrationSettings.SSPractitioner);
            var mappedPractitioners = _mappedEntities.Where(x => x.LocalEntity == Constants.SSIntegrationSettings.SSPractitioner); 
            
            // Get start and end of last month
            var startDate = DateTime.Now.AddMonths(-1).GetStartOfMonth();
            var endDate = DateTime.Now.AddMonths(-1).GetEndOfMonth();

            foreach (var mappedPractitioner in mappedPractitioners)
            {
                try
                {
                    // Create the pdf
                    // Just pass in the default Guid, it then ends up fetching the class based on the userId or their principal. TODO: Make it a nullable parameter
                    var document = await _attendancePdfService.GetClassroomAttendanceReportPDFFile(mappedPractitioner.UserId, new Guid(), startDate, endDate);

                    if (document == null) 
                    {
                        await _logManager.IntegrationLog(
                            $"Log: No attendance data/document for user",
                            null,
                            mappedPractitioner.UserId,
                            LogRelatedType.Log,
                            "PushMonthlyAttendancePdf");

                        continue;
                    }

                    // Fetch any audit logs, we might have already sent the document
                    var auditLogs = _auditRepo.GetAll().Where(x => x.RelatedId == document.Id.ToString()).ToList(); // Could be a list if we updated it at any point

                    // Send document to smart link, if we haven't already
                    if (!auditLogs.Any(x => x.Submitted.HasValue))
                    {
                        var remoteDocId = await PushNewDocument(document);

                        if (remoteDocId != null)
                        {
                            // Mark the audit logs as submitted so we don't resend it
                            foreach (var auditLog in auditLogs)
                            {
                                auditLog.UpdatedDate = DateTime.Now;
                                auditLog.UpdatedBy = _uId;
                                auditLog.Submitted = DateTime.Now;

                                _auditRepo.Update(auditLog);
                            }

                            await _logManager.IntegrationLog(
                                $"Log: Attendance document sent for user",
                                null,
                                mappedPractitioner.UserId,
                                LogRelatedType.Log,
                                "PushMonthlyAttendancePdf");
                        }
                    }                    
                }
                catch (Exception e)
                {
                    await _logManager.IntegrationLog(
                        $"Error: {e.Message}", 
                        e.InnerException != null ? e.InnerException.ToString() : null, 
                        mappedPractitioner.UserId,
                        LogRelatedType.Error, 
                        "PushMonthlyAttendancePdf");
                }                
            }

            await _logManager.IntegrationLog($"PushMonthlyAttendancePdf completed at {DateTime.Now}", null, null, LogRelatedType.Log, "PushMonthlyAttendancePdf");
        }

        /// <summary>
        /// Pushes weekly attendance data to Smart Link
        /// </summary>
        /// <returns></returns>
        public async Task IntegrationAttendanceByDueData()
        {
            // Skip if integration is not currently enabled
            if (!this.Enabled) return;

            await _logManager.IntegrationLog($"IntegrationAttendanceByDueData Started at {DateTime.Now}", null, null, LogRelatedType.Log, "IntegrationAttendanceData");
            var attendancesSent = 0;

            // Need to fix this at some point, just fetching basically all mapped entities from the DB
            _mappedEntities = await GetMappedEntities(null, true, true);

            var attendanceUrl = $"{Constants.SSIntegrationSettings.SLChildAttendanceRegister}{Constants.SSIntegrationSettings.Upsert}{Constants.SSIntegrationSettings.CreateMultiple}";

            var trackingDays = 2;
            var trackingDate = DateTime.Now;
            var trackingWeekDate = trackingDate.AddDays(-trackingDays).StartOfWeek(DayOfWeek.Monday);
            var followingWeekDate = trackingDate.AddDays((-trackingDays) + 7).StartOfWeek(DayOfWeek.Monday);
            var trackingWeekOfYear = trackingWeekDate.GetWeekOfYear();

            var attendancesDueList = _mappedEntities.Where(x => string.Equals(x.LocalEntity, Constants.SSIntegrationSettings.SSPractitioner) && (x.LastAttendanceSubmittedDate == null || x.LastAttendanceSubmittedDate <= DateTime.Now.Date.AddDays(-trackingDays))).ToList();
                       

            // Get holidays to determine which days are falling on holidays
            var holidays = _holidayService.GetHolidays(trackingWeekDate, followingWeekDate, "en-za").ToList();

            foreach (var mappedPractitioner in attendancesDueList)
            {
                var allClassDataSent = true;

                // TODO - This should not be calling a query extension, logic needs to move to a service
                var weeklyAttendance = new AttendanceQueryExtension().GetWeeklyAttendance(_attendanceTrackingRepository, mappedPractitioner.UserId, trackingWeekDate.Year, null, trackingWeekOfYear);

                foreach (var classroomGroup in _attendanceService.GetUserClassroomGroups(mappedPractitioner.UserId))
                {
                    var attendanceData = new List<AttendanceList>();
                    var learnersForClassroomGroup = _attendanceService.GetLearnersActiveDuringTimePeriod(classroomGroup.Id, trackingWeekDate, followingWeekDate);
                    var programmeIds = classroomGroup.ClassProgrammes.Select(x => x.Id).ToList();

                    // Setup default class schedule
                    var classroomGroupAttendanceData = GetClassroomGroupAttendanceData(classroomGroup, trackingWeekDate, followingWeekDate, holidays);

                    // Loop through unique children for this class, since they can potentially have multiple learner records for the same day/week and we don't want duplicate records
                    foreach (var childUserId in learnersForClassroomGroup.Select(x => x.UserId).Distinct())
                    {
                        var mappedChild = _mappedEntities.Where(x => string.Equals(x.UserId, childUserId) && string.Equals(x.LocalEntity, Constants.SSIntegrationSettings.SSChild)).FirstOrDefault(); 
                        
                        var childLearnerRecordsForClassroomGroup = learnersForClassroomGroup.Where(learner => learner.UserId == childUserId);

                        // If child isn't mapped just continue
                        if (mappedChild == null)
                            continue;

                        var attendanceDataForLearner = new AttendanceList()
                        {
                            DaysAbsent = 0,
                            DaysPresent = 0,
                            LearnerRemoteId = mappedChild.RemoteId,
                            PractitionerRemoterId = mappedPractitioner.RemoteId,
                            WeeklyAttendance = new Dictionary<string, string>(),
                        };

                        // Update basic data with actual attendance for each day
                        var weeklyAttendanceForLearner = weeklyAttendance.Where(x => x.UserId == childUserId).ToList();
                        foreach (var day in classroomGroupAttendanceData)
                        {
                            var key = day.Key.DayOfWeek.ToString();

                            // Check if we have any attendance data for this day (irrelevant of class but for this practitioner)
                            var attendanceRecord = weeklyAttendanceForLearner.FirstOrDefault(x => x.AttendanceDate.Date == day.Key.Date);

                            if (attendanceRecord != null)
                            {
                                // Present
                                if (attendanceRecord.Attended)
                                {
                                    attendanceDataForLearner.DaysPresent++;
                                    attendanceDataForLearner.WeeklyAttendance[key] = _present;
                                }
                                // Absent
                                else
                                {
                                    attendanceDataForLearner.DaysAbsent++;
                                    attendanceDataForLearner.WeeklyAttendance[key] = _absent;
                                }
                            }
                            else
                            {
                                // If learner wasn't in this class this day skip. i.e they must have at least one learner record that was active on this day
                                var activeLearnerRecordsForThisDay = childLearnerRecordsForClassroomGroup
                                    .Where(learner => learner.StartedAttendance.Date <= day.Key.Date && (!learner.StoppedAttendance.HasValue || learner.StoppedAttendance.Value.Date >= day.Key.Date));

                                if (!activeLearnerRecordsForThisDay.Any())
                                {
                                    continue;
                                }

                                // Public holiday or no session
                                if (day.Value != _unknown)
                                {
                                    attendanceDataForLearner.WeeklyAttendance[key] = day.Value;
                                    continue;
                                }
                                else
                                {
                                    attendanceDataForLearner.DaysAbsent++;
                                    attendanceDataForLearner.WeeklyAttendance[key] = _unknown;
                                }
                            }
                        }

                        attendanceData.Add(attendanceDataForLearner);
                    }

                    // If no attendance for the classroom group, just continue
                    if (!attendanceData.Any())
                        continue;

                    // Send data for classroom group, so if child is in multiple classes this week, we send in different calls                
                    var jsonAttendanceString = MapDataToJsonRequest(attendanceData, trackingWeekDate);                        

                    if (!SyncAttendanceData(attendanceUrl, jsonAttendanceString).Result)
                    {
                        allClassDataSent = false;
                    }
                }

                if (allClassDataSent)
                {
                    //mark mapped parent practitioner of last date attendance was sent
                    mappedPractitioner.LastAttendanceSubmittedDate = DateTime.Now;
                    _mapperRepo.Update(mappedPractitioner);
                }
            }

            await _logManager.IntegrationLog("IntegrationAttendanceByDueData", $"Attendance upsert calls made {attendancesSent}", null, LogRelatedType.Log, "IntegrationAttendanceByDueData");
        }       

        private Dictionary<DateTime, string> GetClassroomGroupAttendanceData(ClassroomGroup classroomGroup, DateTime startDate, DateTime endDate, List<Holiday> holidays)
        {
            // Set up defaults for class group
            var classroomGroupAttendanceData = new Dictionary<DateTime, string>();
            var date = startDate;
            do
            {
                // Check if there no session for the class group on this day
                if (!classroomGroup.ClassProgrammes.Any(x => x.MeetingDay == (int)date.DayOfWeek)) // Day of week, is a 0 indexed enum starting with 0 = Sunday
                {
                    classroomGroupAttendanceData.Add(date, _noSession);
                }
                // Check for public holiday
                else if (holidays.Any(x => x.Day.Date == date.Date))
                {
                    classroomGroupAttendanceData.Add(date, _publicHoliday);
                }
                else
                {
                    classroomGroupAttendanceData.Add(date, _unknown);
                }

                date = date.AddDays(1);
            } while (date < endDate && date.DayOfWeek < DayOfWeek.Saturday); // Stop at end of the range or when we get to Saturday

            return classroomGroupAttendanceData;
        }

        private string MapDataToJsonRequest(List<AttendanceList> attendanceData, DateTime startOfWeekDate)
        {
            // TODO - Break the mapping to output json into a separate method
            var jsonAttendanceString = new StringBuilder();
            jsonAttendanceString.AppendLine("[");

            // Shift date to match SmartStart expected date
            // Smart start create default attendance records, saved with a UTC time of Sunday 22:00 (Midnight SA time), so we have to match that
            var outputDate = startOfWeekDate
                .StartOfWeek(DayOfWeek.Monday)      // Make sure we are at the start of the week
                .AddDays(-1)                        // Go back to Sunday
                .ToString("yyyy-MM-ddT22:00:00Z");  // Output with 22:00 as the time

            foreach (var attendance in attendanceData)
            {
                if (!string.IsNullOrWhiteSpace(attendance.LearnerRemoteId))
                {
                    jsonAttendanceString.AppendLine("{");
                    jsonAttendanceString.AppendLine($"\"StartDateOfWeek\": \"{outputDate}\",");
                    jsonAttendanceString.AppendLine($"\"NumberOfDaysPresent\":{attendance.DaysPresent},");
                    jsonAttendanceString.AppendLine($"\"NumberOfDaysAbsent\":{attendance.DaysAbsent},");
                    foreach (var item in attendance.WeeklyAttendance)
                    {
                        jsonAttendanceString.AppendLine($"\"{item.Key}\":\"{item.Value}\",");
                    }
                    jsonAttendanceString.AppendLine("\"Franchisee\":{\"Guid\": \"" + attendance.PractitionerRemoterId + "\"},");
                    jsonAttendanceString.AppendLine("\"Child\":{\"Guid\": \"" + attendance.LearnerRemoteId + "\"}");
                    jsonAttendanceString.AppendLine("},");
                }
            }
            jsonAttendanceString.AppendLine("]");

            return jsonAttendanceString.ToString();
        }

        private async Task<bool> SyncAttendanceData(string attendanceUrl, string jsonAttendanceString)
        {
            // TODO - Add no send logic for testing ? 
            try
            {
                //now send to API call <entity type>/Multiple
                var apiResponse = await _apiManager.GetAPIHandlerResponse(attendanceUrl, null, null, null, false, false, jsonAttendanceString);
                if (!string.IsNullOrEmpty(apiResponse.ResponseString))
                {
                    var returnObj = JsonConvert.DeserializeObject<List<PostResponse>>(apiResponse.ResponseString);
                    if (returnObj != null)
                    {
                        var remoteStatementId = returnObj.Count() > 0 ? returnObj[0].Guid.ToString() : null;
                    }
                    else //error empty response received
                    {
                        await _logManager.IntegrationLog("Data Push Fail: " + apiResponse.ResponseString, jsonAttendanceString.ToString() + " | " + apiResponse.ResponseString, null, LogRelatedType.Error, "IntegrationAttendanceByDueData > GetAPIHandlerResponse");
                        return false;
                    }
                }
                // TODO: if response is empty, should we log an error?

                return true;
            }
            catch (Exception e)
            {
                await _logManager.IntegrationLog("SmartLink API Error: " + e.Message, e.InnerException != null ? e.InnerException.ToString() : null, null, LogRelatedType.Error, "IntegrationAttendanceByDueData > GetAPIHandlerResponse");
                return false;
            }
        }
    }
}
