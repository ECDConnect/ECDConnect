using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Builders;
using ECDLink.EGraphQL.Constants;
using ECDLink.EGraphQL.Enums;
using ECDLink.EGraphQL.Resolvers;
using ECDLink.EGraphQL.Services;
using ECDLink.Security;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;

namespace ECDLink.EGraphQL.Registration.ContentTypes
{
    public static class ContentTypeMutationBuilder
    {
        public static ObjectTypeExtension BuildContentMutation(IDescriptorContext context, IEnumerable<ContentDefinitionModel> definitions)
        {
            var mutationResolver = context.Services.GetService<IDynamicMutationResolver>();

            var mutationExtension = new ObjectTypeExtension(config =>
            {
                config.Name(OperationTypeNames.Mutation);

                foreach (var definition in definitions)
                {
                    AddContentMutation(config, mutationResolver, definition);
                }
            });

            return mutationExtension;
        }

        private static void AddContentMutation(IObjectTypeDescriptor descriptor, IDynamicMutationResolver resolver, ContentDefinitionModel definition)
        {
            AddCreateMutation(descriptor, resolver, definition);
            AddUpdate(descriptor, resolver, definition);
            AddDeleteMutation(descriptor, resolver, definition);
        }

        private static void AddUpdate(IObjectTypeDescriptor descriptor, IDynamicMutationResolver resolver, ContentDefinitionModel definition)
        {
            descriptor.Field(GraphFieldNamingHelper.GetFieldName(GraphFieldTypeEnum.Update, definition.ContentName))
                  .Argument(ArgumentConstants.Id, a => a.Type<NonNullType<StringType>>())
                  .Argument(ArgumentConstants.Input, a => a.Type(new DynamicTypeBuilder(definition.ContentName).Input().Required().Build()))
                  .Argument(ArgumentConstants.Locale, a => a.Type<StringType>())
                  .Argument(ArgumentConstants.LocaleId, a => a.Type<StringType>())
                  .Type(definition.ContentName)
                  .Directive(new PermissionDirective
                  {
                      MethodType = GraphActionEnum.Update,
                      ObjectType = PermissionGroups.GENERAL
                  })
                  .Resolve(context =>
                  {
                      context.ScopedContextData = context.ScopedContextData.SetItem(ContextDataConstants.ContentManagement.Identifier, definition.Identifier);
                      return resolver.UpdateMutationResolver(context);
                  });
        }

        private static void AddDeleteMutation(IObjectTypeDescriptor descriptor, IDynamicMutationResolver resolver, ContentDefinitionModel definition)
        {
            descriptor.Field(GraphFieldNamingHelper.GetFieldName(GraphFieldTypeEnum.Delete, definition.ContentName))
                  .Argument(ArgumentConstants.Id, a => a.Type<NonNullType<StringType>>())
                  .Argument(ArgumentConstants.Locale, a => a.Type<StringType>())
                  .Argument(ArgumentConstants.LocaleId, a => a.Type<StringType>())
                  .Type<BooleanType>()
                  .Directive(new PermissionDirective
                  {
                      MethodType = GraphActionEnum.Delete,
                      ObjectType = PermissionGroups.GENERAL
                  })
                  .Resolve(context =>
                  {
                      context.ScopedContextData = context.ScopedContextData.SetItem(ContextDataConstants.ContentManagement.Identifier, definition.Identifier);
                      return resolver.DeleteMutationResolver(context);
                  });
        }

        private static void AddCreateMutation(IObjectTypeDescriptor descriptor, IDynamicMutationResolver resolver, ContentDefinitionModel definition)
        {
            descriptor.Field(GraphFieldNamingHelper.GetFieldName(GraphFieldTypeEnum.Create, definition.ContentName))
                  .Argument(ArgumentConstants.Input, a => a.Type(new DynamicTypeBuilder(definition.ContentName).Input().Required().Build()))
                  .Argument(ArgumentConstants.Locale, a => a.Type<StringType>())
                  .Argument(ArgumentConstants.LocaleId, a => a.Type<StringType>())
                  .Type<StringType>()
                  .Directive(new PermissionDirective
                  {
                      MethodType = GraphActionEnum.Create,
                      ObjectType = PermissionGroups.GENERAL
                  })
                  .Resolve(context =>
                  {
                      //context.Variables.TryGetVariable(ArgumentConstants.Id, out object contentIdObject);
                      //int.TryParse(contentIdObject as string, out int contentId);
                      context.ScopedContextData = context.ScopedContextData.SetItem(ContextDataConstants.ContentManagement.Identifier, definition.Identifier);
                      return resolver.CreateMutationResolver(context);
                  });
        }
    }
}
