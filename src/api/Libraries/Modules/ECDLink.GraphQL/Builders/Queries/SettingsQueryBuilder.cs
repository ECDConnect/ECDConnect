using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models.Settings;
using ECDLink.Core.Services.Interfaces;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.EGraphQL.Builders.Queries
{
    public static class SettingsQueryBuilder
    {
        public static ObjectTypeExtension BuildSettingsQueries(IDescriptorContext context, IEnumerable<ISetting> settings)
        {
            var settingGroup = settings.GroupBy(x => x.Grouping);

            var queryExtension = new ObjectTypeExtension(config =>
            {
                config.Name("SettingsType");

                foreach (var setting in settingGroup)
                {
                    AddSettingsQuery(config, setting.Key);
                }
            });

            return queryExtension;
        }

        private static void AddSettingsQuery(IObjectTypeDescriptor descriptor, string key)
        {
            var metadata = new PermissionDirective
            {
                MethodType = GraphActionEnum.View,
                ObjectType = PermissionGroups.GENERAL
            };

            descriptor.Field(key.Split(".").Last())
             .Type(new DynamicTypeBuilder($"Setting_{key.Split(".").Last()}").Required().Build())
             .Directive(metadata)
             .Resolve(context =>
             {
                 var settings = context.Service<ISystemSetting<Dictionary<string, string>>>();

                 return settings.GetSettings(key);
             });
        }
    }
}
