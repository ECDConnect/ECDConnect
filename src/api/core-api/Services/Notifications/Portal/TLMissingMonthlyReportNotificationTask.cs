using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clinics;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services
{
    public class TLMissingMonthlyReportNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;

        private IGenericRepository<Clinic, Guid> _clinicRepo;

        public TLMissingMonthlyReportNotificationTask(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            
            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _clinicRepo = repositoryFactory.CreateGenericRepository<Clinic>(userContext: applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return DateTime.Now.Day == 4;
        }

        public async Task SendNotifications()
        {
            var clinics = _clinicRepo.GetAll().Where(x => x.IsActive).ToList();
            var prevMonth = DateTime.Now.AddMonths(-1);
            var expireDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 8);

            foreach (var clinic in clinics)
            {
                var hasPrevMonthMeeting = clinic.ClinicMeetings.Where(x => x.IsActive &&
                                                                      x.MeetingDate.Year == prevMonth.Year &&
                                                                      x.MeetingDate.Month == prevMonth.Month).Any();
                if (!hasPrevMonthMeeting)
                {
                    var teamLeads = clinic.TeamLeads.Where(x => x.IsActive).ToList();

                    foreach (var teamLead in teamLeads)
                    {
                        var replacements = new List<TagsReplacements>
                        {
                            new TagsReplacements()
                            {
                                FindValue = "PreviousMonthName",
                                ReplacementValue = prevMonth.Date.ToString("MMMM yyyy")
                            },
                            new TagsReplacements()
                            {
                                FindValue = "ClinicName",
                                ReplacementValue = clinic.Name
                            }
                        };
                        // When the deadline has passed(ie on 00:01 of the 8th of the month)
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPortalTLMissingMonthlyReport, DateTime.Now.Date, teamLead.TeamLead.User, "", MessageStatusConstants.Amber, replacements, expireDate);
                    }

                }
            }
               
        }
    }
}
