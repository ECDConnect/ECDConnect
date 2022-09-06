using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Users;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
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
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class InfantMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Infant AddInfant([Service] InfantManager infantManager, InfantModel input)
        {
            return infantManager.AddInfant(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Infant UpdateInfant(
            [Service] InfantManager infantManager,
            string id,
            InfantModel input)
        {
            return infantManager.UpdateInfant(id, input);
        }
    }
}
