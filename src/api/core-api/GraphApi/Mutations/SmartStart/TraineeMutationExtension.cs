using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class TraineeMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Trainee ScheduleConsolidationMeetingDate([Service] PersonnelService personnelService, string userId, DateTime? scheduledDate)
        {
            return personnelService.ScheduleConsolidationMeetingDate(userId, scheduledDate);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Trainee UpdateCommunitySupport([Service] PersonnelService personnelService, string userId, bool? haveCommunitySupport)
        {
            return personnelService.UpdateCommunitySupport(userId, haveCommunitySupport);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Trainee UpdateTrainee([Service] IHttpContextAccessor contextAccessor,
          IGenericRepositoryFactory repoFactory,
          Guid? id,
          Trainee input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: uId);

            if (id == null) id = input.Id;

            Trainee trainee = dbRepo.GetById((Guid)id);
            {
                if (trainee != null)
                {
                    
                    Trainee updateResult = dbRepo.Update(trainee);

                    return updateResult;
                } else
                {
                    //create trainee
                    trainee = dbRepo.Insert(input);
                    //get practitioner details
                    var pracRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
                    Practitioner traineePrac = pracRepo.GetByUserId(input.UserId.ToString());
                    if (traineePrac != null)
                    {
                        //create unsure classes and N/A classroom
                        Classroom pracClass = new Classroom()
                        {
                            Id = Guid.NewGuid(),
                            UserId = traineePrac.UserId,
                            IsActive = true,
                            Name = "N/A",
                            IsPrinciple = true,
                            NumberPractitioners = 1,
                            Hierarchy = traineePrac.Hierarchy,
                            TenantId = traineePrac.TenantId
                        };
                        var _classroomGenericRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
                        
                        _classroomGenericRepo.Insert(pracClass);

                        var _programmeTypeGenericRepo = repoFactory.CreateGenericRepository<ProgrammeType>(userContext: uId);                        
                        var programmeType = _programmeTypeGenericRepo.GetAll().Where(x => string.Equals(x.Description, "Preschool")).OrderBy(x => x.Id).FirstOrDefault();

                        //create UNSURE classroomgroup to assign children to
                        ClassroomGroup pracUnsureClass = new ClassroomGroup()
                        {
                            Id = Guid.NewGuid(),
                            UserId = traineePrac.UserId,
                            IsActive = true,
                            Name = "Unsure",
                            TenantId = traineePrac.TenantId,
                            Hierarchy = traineePrac.Hierarchy,
                            ProgrammeTypeId = programmeType.Id,
                            ClassroomId = pracClass.Id
                        };
                        var _classroomGroupGenericRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
                        _classroomGroupGenericRepo.Insert(pracUnsureClass);

                    }
                }
                return trainee;
            }
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Trainee UpdateTraineeAddress(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory, 
            string userId,
            TraineeAddressModel input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var _traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: uId);

            Trainee trainee = _traineeRepo.GetByUserId(userId);
            trainee.HomeAddressLine1 = input.HomeAddressLine1;
            trainee.HomeAddressLine2 = input.HomeAddressLine2;
            trainee.HomeAddressLine3 = input.HomeAddressLine3;
            trainee.HomeAddressPostalCode = input.HomeAddressPostalCode;
            
            return _traineeRepo.Update(trainee);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public License AddSmartSpaceLicenseForTrainee(
            [Service] UserLicenseManager licenseManager,
            string userId,
            DateTime dateAwarded)
        {
            return licenseManager.AddSmartSpaceLicense(Guid.Parse(userId), dateAwarded);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public License DeclineSmartSpaceLicenseForTrainee(
    [Service] UserLicenseManager licenseManager,
    string userId,
    DateTime dateDeclined, string nextStepsComments)
        {
            return licenseManager.DeclineSmartSpaceLicense(Guid.Parse(userId), dateDeclined, nextStepsComments);
        }

    }
}
