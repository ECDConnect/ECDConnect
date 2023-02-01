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
using System.Collections.Generic;
using System.Linq;

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
            List<ClassroomGroup> group = classroomGrooupRepo.GetAll().Where(x => x.Classroom.Id.Equals(classroomId)).ToList();
            foreach (var groupItem in group)
            {
                if (groupItem.Learners.Any())
                {
                    foreach (var item in groupItem.Learners)
                    {
                        List<Child> learnerChildren = dbRepo.GetAll().Where(x => x.UserId.Contains(item.UserId)).ToList();
                        children.AddRange(learnerChildren);
                    }
                }
            }

            return children;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ChildCreatedByDetail GetChildCreatedByDetail([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] PersonnelManager personnelManager,
        string firstName, string surname, string practitionerId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Child>(userContext: uId);
            var child = dbRepo.GetAll().Where(x => x.User.FirstName.ToLower() == firstName.ToLower() && x.User.Surname.ToLower() == surname.ToLower()).FirstOrDefault();

            if (child != null && child.User != null)
            {
                //TODO: ensure children returned is only based on same sitename as the uId belongs to
                var practitioners = personnelManager.GetPractitionerPeers(practitionerId);
                if (practitioners != null)
                {
                    foreach (var practitioner in practitioners)
                    {
                        bool childExists = false;
                        var children = personnelManager.GetAllChildrenForPractitioner(practitioner.UserId).ToList();
                        if (children.Count > 0)
                        {
                            childExists = children.Where(x => x.Equals(child)).Any();
                        }
                        if (childExists)
                        {
                            return new ChildCreatedByDetail()
                            {
                                ChildUserId = child.UserId,
                                FullName = child.User.FullName,
                                CreatedByName = child.InsertedBy,
                                CreatedById = child.UpdatedBy,
                                CreatedByDate = child.InsertedDate,
                                PractitionerName = practitioner.User.FullName
                            };
                        }
                    }
                }

                return null;
            }
            else return null;

        }

    }
}
