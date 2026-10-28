using ECDLink.Core.Models.ContentManagement;
using ECDLink.EGraphQL.Builders;
using ECDLink.EGraphQL.Constants;
using ECDLink.EGraphQL.Enums;
using ECDLink.EGraphQL.Helpers;
using ECDLink.EGraphQL.ObjectTypes.Services;
using ECDLink.EGraphQL.Registration.ContentTypes;
using ECDLink.EGraphQL.Resolvers;
using HotChocolate.Execution.Configuration;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using HotChocolate.Types.Descriptors.Configurations;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Registration.Modules
{
    public class ContentTypeModule : ITypeModule
    {
        public event EventHandler<EventArgs> TypesChanged;

        public ContentTypeModule(DynamicContentReload reloader)
        {
            reloader.StructureUpdated += (sender, args) => TypesChanged?.Invoke(this, EventArgs.Empty);
        }

        public ValueTask<IReadOnlyCollection<ITypeSystemMember>> CreateTypesAsync(IDescriptorContext context, CancellationToken cancellationToken)
        {
            var types = new List<ITypeSystemMember>();

            CreateContentObjects(context, types);

            CreateEndpoints(context, types);

            return new ValueTask<IReadOnlyCollection<ITypeSystemMember>>(types);
        }

        // From v16 context.Services is the schema service provider, which holds none of the
        // application's services; GetRootServiceProvider() is what context.Services was up to v15.
        private void CreateEndpoints(IDescriptorContext context, List<ITypeSystemMember> types)
        {
            var contentDefinitionService = context.Services.GetRootServiceProvider().GetService<IDynamicTypeDefinitionService>();

            var definitions = contentDefinitionService.GetObjectTypes();

            var safeQueryExtension = ContentTypeQueryBuilder.BuildContentQueries(context, definitions);
            types.Add(safeQueryExtension);

            var safeMutationExtension = ContentTypeMutationBuilder.BuildContentMutation(context, definitions);
            types.Add(safeMutationExtension);
        }

        private void CreateContentObjects(IDescriptorContext context, List<ITypeSystemMember> types)
        {

            var service = context.Services.GetRootServiceProvider().GetService<IDynamicTypeDefinitionService>();

            var definitions = service.GetObjectTypes();

            CreateObjectType(context, definitions, types);

            CreateInputObjectType(definitions, types);
        }

        private void CreateInputObjectType(IEnumerable<ContentDefinitionModel> definitions, List<ITypeSystemMember> types)
        {
            foreach (var item in definitions)
            {
                var typeDefinition = new InputObjectTypeConfiguration(new DynamicTypeBuilder(item.ContentName).Input().Build());

                foreach (var field in item.Fields)
                {
                    InputFieldConfiguration definition;

                    if (FieldTypeHelper.IsRelationType(field))
                    {
                        definition = new InputFieldConfiguration(
                              field.Name,
                              type: TypeReference.Parse("String"));
                    }
                    else
                    {
                        definition = new InputFieldConfiguration(
                              field.Name,
                              type: TypeReference.Parse(field.GraphDataTypeName));
                    }

                    typeDefinition.Fields.Add(definition);
                }

                types.Add(InputObjectType.CreateUnsafe(typeDefinition));
            }
        }

        private void CreateObjectType(IDescriptorContext context, IEnumerable<ContentDefinitionModel> definitions, List<ITypeSystemMember> types)
        {
            var fieldResolver = context.Services.GetRootServiceProvider().GetService<IDynamicFieldResolverFactory>();

            foreach (var item in definitions)
            {
                var typeDefinition = new ObjectTypeConfiguration(item.ContentName);

                foreach (var field in item.Fields)
                {
                    ObjectFieldConfiguration definition = null;
                    if (field.DataType == "link")
                    {
                        var fieldType = definitions.FirstOrDefault(x => "[" + x.ContentName + "]" == field.GraphDataTypeName);
                        definition = new ObjectFieldConfiguration(
                            field.Name,
                            type: TypeReference.Parse(field.GraphDataTypeName),
                            pureResolver: ctx => fieldResolver.CreateFieldResolver((FieldTypeEnum)field.FieldTypeId).ResolveField(ctx, field, Convert.ToInt32(fieldType.Identifier)));
                    }
                    else
                    {
                        definition = new ObjectFieldConfiguration(
                            field.Name,
                            type: TypeReference.Parse(field.GraphDataTypeName),
                            pureResolver: ctx => fieldResolver.CreateFieldResolver((FieldTypeEnum)field.FieldTypeId).ResolveField(ctx, field));
                    }

                    typeDefinition.Fields.Add(definition);
                }

                typeDefinition.Fields.Add(new ObjectFieldConfiguration(
                          ObjectFieldConstants.Identifier,
                          type: TypeReference.Create("Int"),
                          pureResolver: ctx => fieldResolver.CreateFieldResolver(FieldTypeEnum.Text).ResolveField(ctx, new FieldDefinitionModel { Name = ObjectFieldConstants.Identifier })));

                types.Add(ObjectType.CreateUnsafe(typeDefinition));
            }
        }
    }
}
