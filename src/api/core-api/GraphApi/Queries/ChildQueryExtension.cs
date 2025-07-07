using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services;
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

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ChildQueryExtension
    {
        // TODO - NEED TO UPDATE ALL PERMISSIONS HERE!!!

        // Registration use, checks for duplicates
        // Permissions - Add permission for child registration???
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<ChildCreatedByDetail> GetChildCreatedByDetailAsync([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] PersonnelService personnelManager,
            string firstName,
            string surname,
            string practitionerId)
        {
            // Move logic to service
            // Need to fix this logic!
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: uId);
            var children = await childRepo.GetAll().Where(x => x.User.FirstName.ToLower() == firstName.ToLower() && x.User.Surname.ToLower() == surname.ToLower()).ToListAsync();
            var practitioners = personnelManager.GetPractitionerPeers(practitionerId);
            if (children != null)
            {
                foreach (var child in children)
                {
                    if (practitioners != null)
                    {
                        foreach (var practitioner in practitioners)
                        {
                            // Children for practitioner
                            if (string.IsNullOrEmpty(practitioner.Hierarchy))
                            {
                                continue;
                            }

                            var pracChildren = childRepo.GetAll().Where(x => x.Hierarchy.StartsWith(practitioner.Hierarchy)).ToList();

                            if (pracChildren.Where(x => x.Equals(child)).Any())
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
                                    ProgrammeName = !string.IsNullOrWhiteSpace(programmeName) ? programmeName : "N/A",
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


        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.View)]
        public List<Child> GetChildrenForClassroomGroup(
            [Service] IChildService childService,
            Guid classRoomGroupId)
        {
            var children = childService.GetChildrenForClassroomGroup(classRoomGroupId);

            if (children == null)
            {
                return null;
            }

            return children.ToList();

        }
    }
}
