using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ChildQueryExtension
    {
        public ChildQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Child GetChildByUserId([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            return dbRepo.GetByUserId(userId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Child> GetChildrenByClassroomId([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string classroomId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var classroomGrooupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            List<Child> children = new List<Child>();
            List<ClassroomGroup> group = classroomGrooupRepo.GetAll().Where(x => x.Classroom.Id == Guid.Parse(classroomId)).ToList();
            foreach (var groupItem in group)
            {
                if (groupItem.Learners.Any())
                {
                    foreach (var item in groupItem.Learners)
                    {
                        List<Child> learnerChildren = dbRepo.GetAll().Where(x => x.UserId.ToString().Contains(item.UserId.ToString())).ToList();
                        children.AddRange(learnerChildren);
                    }
                }
            }

            return children;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<ChildCreatedByDetail> GetChildCreatedByDetailAsync([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] PersonnelService personnelManager,
        string firstName, string surname, string practitionerId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Child>(userContext: uId);
            var children = await dbRepo.GetAll().Where(x => x.User.FirstName.ToLower() == firstName.ToLower() && x.User.Surname.ToLower() == surname.ToLower()).ToListAsync();
            var practitioners = personnelManager.GetPractitionerPeers(practitionerId);
            if (children != null)
            {
                foreach (var child in children)
                {
                    if (practitioners != null)
                    {
                        foreach (var practitioner in practitioners)
                        {
                            bool childExists = false;
                            var pracChildren = personnelManager.GetAllChildrenForPractitioner(practitioner.UserId.ToString()).ToList();
                            if (pracChildren.Count > 0)
                            {
                                childExists = pracChildren.Where(x => x.Equals(child)).Any();
                            }
                            if (childExists)
                            {
                                var programmeName = personnelManager.GetSiteNameForPractitioner(practitioner.UserId.ToString());
                                return new ChildCreatedByDetail()
                                {
                                    ChildUserId = child.UserId.ToString(),
                                    FullName = child.User.FirstName + " " + child.User.Surname,
                                    CreatedByName = child.InsertedBy,
                                    CreatedById = child.UpdatedBy,
                                    CreatedByDate = child.InsertedDate,
                                    PractitionerName = practitioner.User.FullName,
                                    DateOfBirth = child.User.DateOfBirth,
                                    ProfileImageUrl = child.User.ProfileImageUrl,
                                    ProgrammeName = (!string.IsNullOrWhiteSpace(programmeName) ? programmeName : "N/A"),
                                    PractitionerUserId = practitioner.UserId.ToString()
                                };
                            }
                        }
                    }
                }

                return null;
            }
            else return null;

        }

    }
}
