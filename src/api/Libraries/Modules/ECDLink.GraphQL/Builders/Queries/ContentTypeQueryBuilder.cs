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
    public static class ContentTypeQueryBuilder
    {
        public static ObjectTypeExtension BuildContentQueries(IDescriptorContext context, IEnumerable<ContentDefinitionModel> definitions)
        {
            var queryResolver = context.Services.GetService<IDynamicQueryResolver>();

            var queryExtension = new ObjectTypeExtension(config =>
            {
                config.Name(OperationTypeNames.Query);

                foreach (var definition in definitions)
                {
                    AddContentQuery(config, queryResolver, definition);
                }
            });

            return queryExtension;
        }

        private static void AddContentQuery(IObjectTypeDescriptor descriptor, IDynamicQueryResolver resolver, ContentDefinitionModel definition)
        {
            var metadata = new PermissionDirective
            {
                MethodType = GraphActionEnum.View,
                ObjectType = PermissionGroups.GENERAL
            };

            descriptor.Field(GraphFieldNamingHelper.GetFieldName(GraphFieldTypeEnum.GetAll, definition.ContentName))
              .Argument(ArgumentConstants.Locale, a => a.Type<StringType>())
              .Argument(ArgumentConstants.LocaleId, a => a.Type<StringType>())
              .Type(new DynamicTypeBuilder(definition.ContentName).Enumerable().Required().Build())
              .Directive(metadata)
              .Resolve(context =>
              {
                  context.ScopedContextData = context.ScopedContextData.SetItem(ContextDataConstants.ContentManagement.Identifier, definition.Identifier);
                  return resolver.GetAllResolver(context);
              });

            descriptor.Field(GraphFieldNamingHelper.GetFieldName(GraphFieldTypeEnum.GetById, definition.ContentName))
              .Argument(ArgumentConstants.Id, a => a.Type<IntType>())
              .Argument(ArgumentConstants.Locale, a => a.Type<StringType>())
              .Argument(ArgumentConstants.LocaleId, a => a.Type<StringType>())
              .Type(new DynamicTypeBuilder(definition.ContentName).Enumerable().Required().Build())
              .Directive(metadata)
              .Resolve(context =>
              {
                  context.ScopedContextData = context.ScopedContextData.SetItem(ContextDataConstants.ContentManagement.Identifier, definition.Identifier);
                  return resolver.GetResolver(context);
              });
        }
    }
}
