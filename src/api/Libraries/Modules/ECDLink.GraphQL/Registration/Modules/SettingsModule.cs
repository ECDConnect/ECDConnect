using ECDLink.Core.Models.Settings;
using ECDLink.Core.Services.Interfaces;
using ECDLink.EGraphQL.Builders.Queries;
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
    public class SettingsModule : ITypeModule
    {
        public event EventHandler<EventArgs> TypesChanged;

        public SettingsModule(DynamicContentReload reloader)
        {
            reloader.StructureUpdated += (sender, args) => TypesChanged?.Invoke(this, EventArgs.Empty);
        }

        // The schema is shared by every tenant, so its Setting_* types are built from all tenants'
        // settings, and each value is resolved per request from the caller's own tenant.
        //
        // Up to v15 the schema was built lazily inside the first request, read only that request's
        // tenant, and baked that tenant's values into the field resolvers - so whichever tenant
        // reached the API first after a restart decided both which settings existed and the values
        // every tenant was served. v16 builds the schema at startup (and rebuilds it on a background
        // thread after a CMS change), where there is no tenant at all and GetSystemSettings throws.
        public ValueTask<IReadOnlyCollection<ITypeSystemMember>> CreateTypesAsync(IDescriptorContext context, CancellationToken cancellationToken)
        {
            var settingsService = context.Services.GetRootServiceProvider().GetService<ISystemSettingsService>();

            // One entry per grouping and name; the values belong to whichever tenant came first
            // and are never served.
            var definitions = settingsService.GetSystemSettingsForAllTenants()
                .GroupBy(x => (x.Grouping, x.Name))
                .Select(x => x.First())
                .ToList();

            var types = new List<ITypeSystemMember>();

            types.AddRange(CreateObjectType(definitions));
            types.Add(SettingsQueryBuilder.BuildSettingsQueries(context, definitions));

            return new ValueTask<IReadOnlyCollection<ITypeSystemMember>>(types);
        }

        private List<ObjectType> CreateObjectType(IEnumerable<ISetting> settings)
        {
            var settingsGroup = settings.GroupBy(x => x.Grouping);
            var types = new List<ObjectType>();

            foreach (var setting in settingsGroup)
            {
                var typeDefinition = new ObjectTypeConfiguration($"Setting_{setting.Key.Split(".").Last()}");

                foreach (var field in setting)
                {
                    var name = field.Name;

                    // The parent is the caller's tenant's settings for this group, resolved per
                    // request by SettingsQueryBuilder.
                    var definition = new ObjectFieldConfiguration(
                            name,
                            type: TypeReference.Parse("String!"),
                            pureResolver: ctx => ctx.Parent<Dictionary<string, string>>()?.GetValueOrDefault(name));

                    typeDefinition.Fields.Add(definition);
                }
                types.Add(ObjectType.CreateUnsafe(typeDefinition));
            }

            return types;
        }
    }
}
