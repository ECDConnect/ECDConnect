using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Constants;
using ECDLink.EGraphQL.Enums;
using ECDLink.EGraphQL.Resolvers;
using ECDLink.EGraphQL.Services;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate.Types;
using System;
using System.Reflection;

namespace ECDLink.EGraphQL.Registration.AutoGenerateTypes.Queries
{
    public class GenericQueryBuilder<T> : ObjectType
        where T : EntityBase<Guid>
    {
        public GenericQueryBuilder(IObjectTypeDescriptor descriptor)
        {
            var permissionGrouping = typeof(T).GetCustomAttribute<EntityPermissionAttribute>();

            var metadata = new PermissionDirective
            {
                MethodType = GraphActionEnum.View,
                ObjectType = permissionGrouping?.PermissionName ?? "*"
            };

            descriptor.Field(GraphFieldNamingHelper.GetFieldName(GraphFieldTypeEnum.GetAll, typeof(T).Name))
              .Type<ListType<ObjectType<T>>>()
              .Directive(metadata)
              .UseDbContext<AuthenticationDbContext>()
              .ResolveWith<GenericQueryResolvers<T>>(r => r.GetAll(default, default))
              .UseFiltering();

            descriptor.Field(GraphFieldNamingHelper.GetFieldName(GraphFieldTypeEnum.GetById, typeof(T).Name))
              .Argument(ArgumentConstants.Id, a => a.Type<UuidType>())
              .Type<ObjectType<T>>()
              .Directive(metadata)
              .ResolveWith<GenericQueryResolvers<T>>(r => r.Get(default, default, default))
              .UseFiltering();
        }
    }
}
