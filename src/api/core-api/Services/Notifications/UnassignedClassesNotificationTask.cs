using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class UnassignedClassesNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly IClassroomService _classroomService;

        public UnassignedClassesNotificationTask(
            [Service] INotificationService notificationService,
            [Service] IClassroomService classroomService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            _classroomService = classroomService;
        }

        public bool ShouldRunToday()
        {
            return true;
        }

        public async Task SendNotifications()
        {
            var classrooms = _classroomService.GetPrincipalUserIdsForClassesWithoutPractitioners();
            foreach (var item in classrooms)
            {
                var replacements = new List<TagsReplacements>
                {
                    new TagsReplacements()
                    {
                        FindValue = "ClassName",
                        ReplacementValue = item.ClassroomName
                    }
                };

                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.UnassignedClasses, DateTime.Now.Date, item.User, "", MessageStatusConstants.Red, replacements, null, false, false, null, new List<RelatedEntity> { new RelatedEntity(item.ClassroomId, "ClassroomGroup") });
            }
        }
    }
}
