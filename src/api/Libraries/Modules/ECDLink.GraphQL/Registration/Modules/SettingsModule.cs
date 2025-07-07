using ECDLink.Core.Models.Settings;
using ECDLink.Core.Services.Interfaces;
using ECDLink.EGraphQL.Builders.Queries;
using HotChocolate.Execution.Configuration;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using HotChocolate.Types.Descriptors.Definitions;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Registration.Modules
{
    public class SettingsModule : ITypeModule
    {
        public event EventHandler<EventArgs> TypesChanged;

        public SettingsModule(DynamicContentReload reloader)
        {
            reloader.StructureUpdated += (sender, args) => TypesChanged?.Invoke(this, EventArgs.Empty);
        }

        public ValueTask<IReadOnlyCollection<ITypeSystemMember>> CreateTypesAsync(IDescriptorContext context, CancellationToken cancellationToken)
        {
            var types = new List<ITypeSystemMember>();

            types.AddRange(CreateContentObjects(context));
            types.Add(CreateEndpoints(context));

            return new ValueTask<IReadOnlyCollection<ITypeSystemMember>>(types);
        }

        private ObjectTypeExtension CreateEndpoints(IDescriptorContext context)
        {
            var settingsService = context.Services.GetService<ISystemSettingsService>();

            var definitions = settingsService.GetSystemSettings();

            return SettingsQueryBuilder.BuildSettingsQueries(context, definitions);
        }

        private List<ObjectType> CreateContentObjects(IDescriptorContext context)
        {
            var settingsService = context.Services.GetService<ISystemSettingsService>();

            var definitions = settingsService.GetSystemSettings();

            return CreateObjectType(definitions);
        }

        private List<ObjectType> CreateObjectType(IEnumerable<ISetting> settings)
        {
            var settingsGroup = settings.GroupBy(x => x.Grouping);
            var types = new List<ObjectType>();

            foreach (var setting in settingsGroup)
            {
                var typeDefinition = new ObjectTypeDefinition($"Setting_{setting.Key.Split(".").Last()}");

                foreach (var field in setting)
                {
                    var definition = new ObjectFieldDefinition(
                            field.Name,
                            type: TypeReference.Parse("String!"),
                            pureResolver: ctx => field.Value);

                    typeDefinition.Fields.Add(definition);
                }
                types.Add(ObjectType.CreateUnsafe(typeDefinition));
            }

            return types;
        }
    }
}
