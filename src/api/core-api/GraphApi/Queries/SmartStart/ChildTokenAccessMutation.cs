using EcdLink.Api.CoreApi.GraphApi.AccessValidators;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security.Helpers;
using ECDLink.Security.JwtSecurity.Enums;
using ECDLink.Security.Managers;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ChildTokenAccessQuery
    {
        [TokenAccess(typeof(ChildOpenAccessValidator))]

        public async Task<ChildTokenAccessModel> OpenAccessAddChildDetail(
            [Service] SecurityManager securityManager,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
            [Service] IGenericRepositoryFactory repoFactory,
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

            var classGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: tokenModel.AddedByUserId);

            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: tokenModel.AddedByUserId);

            var classGroup = classGroupRepo.GetById(tokenModel.ClassroomGroupId);

            var classroom = classroomRepo.GetById(classGroup.ClassroomId);

            var jwt = await securityManager.GenerateJwtForUserAsync(appUser, JwtEncoderEnum.OneTime);

            var response = new ChildTokenAccessModel
            {
                Child = new TokenAccessChildDetailModel
                {
                    Firstname = appUser.FirstName,
                    Surname = appUser.Surname,
                    GroupName = classroom.Name
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