using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.ChildProgress;
using EcdLink.Api.CoreApi.GraphApi.Models.Classroom;
using EcdLink.Api.CoreApi.GraphApi.Models.Users;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ClassroomQueryExtension
    {
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.View)]
        public ClassroomModel GetClassroomForUser(
            [Service] IClassroomService classroomService,
            [Service] INotificationService notificationService,
            Guid userId)
        {
            var classroom = classroomService.GetClassroomForUser(userId);

            if (classroom == null)
            {
                return null;
            }

            var result =  new ClassroomModel()
            {
                Id = classroom.Id,
                Name = classroom.Name,
                ClassroomImageUrl = classroom.ClassroomImageUrl,
                PreschoolCode = classroom.PreschoolCode,
                NumberOfAssistants = classroom.NumberOfAssistants,
                NumberOfOtherAssistants = classroom.NumberOfOtherAssistants,
                NumberPractitioners = classroom.NumberPractitioners,
                IsDummySchool = classroom.IsDummySchool,
                SiteAddress = classroom.SiteAddress != null ? new BaseSiteAddressModel(classroom.SiteAddress) : null,
                Principal = new BasePractitionerModel()
                {
                    Email = classroom.User.Email,
                    FirstName = classroom.User.FirstName,
                    Surname = classroom.User.Surname,
                    PhoneNumber = classroom.User.PhoneNumber,
                    ProfileImageUrl = classroom.User.ProfileImageUrl,
                    UserId = classroom.UserId.Value,
                },
                ChildProgressReportPeriods = classroom.ChildProgressReportPeriods
                    .Select(x => new ChildProgressReportPeriodModel
                {
                    Id = x.Id,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    Notifications = notificationService.GetMessages(TemplateTypeConstants.FinishProgressReport, x.Id)
                }).ToList(),
            };

            return result;
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.View)]
        public List<ClassroomGroupModel> GetClassroomGroupsForUser(
            [Service] IClassroomService classroomService,
            Guid userId)
        {
            var classroomGroups = classroomService.GetClassroomGroupsForUser(userId);

            if (classroomGroups == null)
            {
                return null;
            }

            return classroomGroups.Select(x => new ClassroomGroupModel
            {
                Id = x.Id,
                ClassroomId = x.ClassroomId,
                Name = x.Name,
                UserId = x.UserId.Value,
                Learners = x.Learners.Select(y => new BaseLearnerModel
                {
                    LearnerId = y.Id,
                    ChildUserId = y.UserId.Value,
                    StartedAttendance = y.StartedAttendance,
                    StoppedAttendance = y.StoppedAttendance,
                    IsActive = y.IsActive,
                }).ToList(),
                ClassProgrammes = x.ClassProgrammes.Where(x => x.IsActive).ToList(),
            }).ToList();
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.View)]
        public Classroom ValidatePreSchoolCode(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory, 
            string preSchoolCode)
        {
            if (preSchoolCode == "")
            {
               throw new ArgumentException("Pre-school code is empty");
            }
            var uId = contextAccessor.HttpContext.GetUser().Id.ToString();
            var classRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
            return classRepo.GetAll().Where(x => x.PreschoolCode == preSchoolCode).FirstOrDefault();
        }

    }
}
