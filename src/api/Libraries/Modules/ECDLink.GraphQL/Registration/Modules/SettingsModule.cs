using ECDLink.Core.Services.Interfaces;
using HotChocolate.Execution.Configuration;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using ECDLink.Core.Models.Settings;
using System.Linq;
using HotChocolate.Types.Descriptors.Definitions;
using ECDLink.EGraphQL.Builders.Queries;

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

            CreateContentObjects(context, types);

            CreateEndpoints(context, types);

            return new ValueTask<IReadOnlyCollection<ITypeSystemMember>>(types);
        }

        private void CreateEndpoints(IDescriptorContext context, List<ITypeSystemMember> types)
        {
            var settingsService = context.Services.GetService<ISystemSettingsService>();

            var definitions = settingsService.GetSystemSettings().Result;

            var safeQueryExtension = SettingsQueryBuilder.BuildSettingsQueries(context, definitions);
            types.Add(safeQueryExtension);
        }

        private void CreateContentObjects(IDescriptorContext context, List<ITypeSystemMember> types)
        {
            var settingsService = context.Services.GetService<ISystemSettingsService>();

            var definitions = settingsService.GetSystemSettings().Result;

            CreateObjectType(definitions, types);
        }

        private void CreateObjectType(IEnumerable<ISetting> settings, List<ITypeSystemMember> types)
        {
            var settingsGroup = settings.GroupBy(x => x.Grouping);

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
        }
    }
}
