using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
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
            Guid userId)
        {
            var classroom = classroomService.GetClassroomForUser(userId);

            return new ClassroomModel()
            {
                Id = classroom.Id,
                Name = classroom.Name,
                ImageUrl = classroom.ClassroomImageUrl,
                NumberOfAssistants = classroom.NumberOfAssistants,
                NumberOfOtherAssistants = classroom.NumberOfOtherAssistants,
                NumberOfPractitioners = classroom.NumberPractitioners,
                PreschoolFeeAmount = classroom.PreschoolFeeAmount,
                PreschoolFeeAmountLastUpdateDate = classroom.PreschoolFeeAmountLastUpdateDate,
                SiteAddress = new BaseSiteAddressModel(classroom.SiteAddress),
                Principal = new BasePractitionerModel()
                {
                    Email = classroom.User.Email,
                    FirstName = classroom.User.FirstName,
                    Surname = classroom.User.Surname,
                    PhoneNumber = classroom.User.PhoneNumber,
                    ProfileImageUrl = classroom.User.ProfileImageUrl,
                    UserId = classroom.UserId.Value,
                }
            };
        }

        // This seems to be mostly used to get the school details for a user, lets rename and clean it up
        public List<ClassroomGroupModel> GetClassroomGroupsForUser(
            [Service] IClassroomService classroomService,
            Guid userId)
        {
            var classroomGroups = classroomService.GetClassroomGroupsForUser(userId);

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
                    StartedAttendance = y.StartedAttendance
                }).ToList(),
            }).ToList();
        }
    }
}
