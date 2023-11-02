using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ClubActivityUploadMutationExtension
    {
        public ClubActivityUploadMutationExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public bool AddBeCreativeActivity([Service] IClubService clubService, BeCreativeUpload input)
        {
            return clubService.AddBeCreativeActivity(input);
        }

    }
}
