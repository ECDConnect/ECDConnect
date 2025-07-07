using EcdLink.Api.CoreApi.GraphApi.AccessValidators;
using EcdLink.Api.CoreApi.GraphApi.Models.Users;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security.Helpers;
using ECDLink.Security.JwtSecurity.Enums;
using ECDLink.Security.Managers;
using HotChocolate;
using HotChocolate.Types;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ChildTokenAccessQueryExtension
    {
        [TokenAccess(typeof(ChildOpenAccessValidator))]

        public async Task<ChildTokenAccessModel> OpenAccessAddChildDetail(
            [Service] SecurityManager securityManager,
            [Service] ApplicationUserManager userManager,
            [Service] ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
            IGenericRepositoryFactory repoFactory,
            string token)
        {
            var tokenModel = JsonConvert.DeserializeObject<ChildTokenWrapperModel>(TokenHelper.DecodeToken(token));

            var appUser = await tokenManager.GetValidUserWithTokenAsync(tokenModel.ChildUserId, tokenModel.Token);

            if (appUser == default(ApplicationUser))
            {
                // No user with the token. Cannot update
                return null;
            }

            var practitionerUser = await userManager.FindByIdAsync(tokenModel.AddedByUserId);
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: tokenModel.AddedByUserId);
            var classGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: tokenModel.AddedByUserId);

            var classGroup = classGroupRepo.GetById(tokenModel.ClassroomGroupId);
            var classRoom = new Classroom();

            if (classGroup == null)
            {
                classRoom = classroomRepo.GetAll().Where(x => x.UserId == Guid.Parse(tokenModel.AddedByUserId)).OrderBy(x => x.Id).FirstOrDefault();
            }
            else
            {
                classRoom = classroomRepo.GetById(classGroup.ClassroomId);
            }

            var jwt = await securityManager.GenerateJwtForUserAsync(appUser, JwtEncoderEnum.OneTime);

            var response = new ChildTokenAccessModel
            {
                Child = new TokenAccessChildDetailModel
                {
                    Firstname = appUser.FirstName,
                    Surname = appUser.Surname,
                    GroupName = classRoom?.Name ?? classGroup.Name,
                    UserId = appUser.Id.ToString(),
                },
                Practitoner = new TokenAccessPractitionerDetailModel
                {
                    Firstname = practitionerUser.FirstName,
                    Surname = practitionerUser.Surname,
                    PhoneNumber = practitionerUser.PhoneNumber
                },
                AccessToken = jwt
            };

            return response;
        }
    }
}