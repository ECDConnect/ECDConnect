using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Constants;
using ECDLink.EGraphQL.Enums;
using ECDLink.EGraphQL.ObjectTypes.Input;
using ECDLink.EGraphQL.Resolvers;
using ECDLink.EGraphQL.Services;
using ECDLink.Security.Attributes;
using HotChocolate.Types;
using System;
using System.Reflection;

namespace ECDLink.EGraphQL.Registration.AutoGenerateTypes.Mutations
{
    public class GenericMutationBuilder<T> : ObjectType
    where T : EntityBase<Guid>
    {
        public GenericMutationBuilder(IObjectTypeDescriptor descriptor)
        {
            var permissionGrouping = typeof(T).GetCustomAttribute<EntityPermissionAttribute>();

            descriptor.Field(GraphFieldNamingHelper.GetFieldName(GraphFieldTypeEnum.Update, typeof(T).Name))
                  .Argument(ArgumentConstants.Input, a => a.Type<IgnoreFieldInputType<T>>())
                  .Argument(ArgumentConstants.Id, a => a.Type<UuidType>())
                  .Type<ObjectType<T>>()
                  .Directive(new PermissionDirective
                  {
                      MethodType = GraphActionEnum.Update,
                      ObjectType = permissionGrouping?.PermissionName ?? "*"
                  })
                  .ResolveWith<GenericMutationResolvers<T>>(r => r.Update(default, default, default, default));

            descriptor.Field(GraphFieldNamingHelper.GetFieldName(GraphFieldTypeEnum.Create, typeof(T).Name))
                  .Argument(ArgumentConstants.Input, a => a.Type<IgnoreFieldInputType<T>>())
                  .Type<ObjectType<T>>()
                  .Directive(new PermissionDirective
                  {
                      MethodType = GraphActionEnum.Create,
                      ObjectType = permissionGrouping?.PermissionName ?? "*"
                  })
                  .ResolveWith<GenericMutationResolvers<T>>(r => r.Create(default, default, default));

            descriptor.Field(GraphFieldNamingHelper.GetFieldName(GraphFieldTypeEnum.Delete, typeof(T).Name))
                  .Argument(ArgumentConstants.Id, a => a.Type<UuidType>())
                  .Type<BooleanType>()
                  .Directive(new PermissionDirective
                  {
                      MethodType = GraphActionEnum.Delete,
                      ObjectType = permissionGrouping?.PermissionName ?? "*"
                  })
                  .ResolveWith<GenericMutationResolvers<T>>(r => r.Delete(default, default, default));
        }
    }
}
