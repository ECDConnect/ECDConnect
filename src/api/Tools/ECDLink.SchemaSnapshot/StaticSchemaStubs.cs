using ECDLink.ContentManagement.Constants;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.Core.Models.Settings;
using ECDLink.Core.Services.Interfaces;
using ECDLink.EGraphQL.Enums;
using ECDLink.EGraphQL.ObjectTypes.Services;

namespace ECDLink.SchemaSnapshot
{
    /// <summary>
    /// The schema is not a pure function of the code. ContentTypeModule and SettingsModule add
    /// types built from CMS content definitions and system settings held in the database, and
    /// system settings are tenant-scoped - so the live schema differs per environment and per
    /// tenant. To keep the snapshot reproducible without a database, both sources are stubbed.
    ///
    /// Neither can be emptied outright. Six CMS types are referenced by name from static
    /// resolvers via [GraphQLType("[Consent]!")] and friends, and SettingsType needs at least
    /// one field to be valid GraphQL. Both stubs therefore return minimal placeholder data and
    /// run through the real module builders, which keeps that builder code inside the snapshot's
    /// coverage.
    ///
    /// What this costs: the shape of these placeholder types is a stand-in rather than the live
    /// shape, and CMS types that exist only in a deployed database are absent. Naming conventions
    /// do not apply to any of them - dynamic field names are passed explicitly from CMS data
    /// rather than inferred from CLR members - so this does not weaken the snapshot's job of
    /// proving that LegacyNamingConventions leaves the code-derived schema untouched.
    /// </summary>
    internal sealed class PlaceholderContentTypes : IDynamicTypeDefinitionService
    {
        /// Content types referenced by name from [GraphQLType] attributes on static resolvers.
        /// Identifiers are the real ones from ContentTypeConstants so the generated query and
        /// mutation fields match production.
        private static readonly (string Name, int Id)[] StaticallyReferenced =
        {
            (ContentTypeConstants.Consent, ContentTypeConstants.ConsentId),
            (ContentTypeConstants.MoreInformation, ContentTypeConstants.MoreInformationId),
            (ContentTypeConstants.HealthPromotion, ContentTypeConstants.HealthPromotionId),
            (ContentTypeConstants.VisitVideos, ContentTypeConstants.VisitVideosId),
            (ContentTypeConstants.Infographics, ContentTypeConstants.InfographicsId),
            (ContentTypeConstants.ClassroomBusinessResource, ContentTypeConstants.ClassroomBusinessResourceId),
        };

        private static readonly List<ContentDefinitionModel> Definitions = StaticallyReferenced
            .Select(t => new ContentDefinitionModel
            {
                ContentName = t.Name,
                Identifier = t.Id.ToString(),
                // At least one field is required: the generated input object would otherwise have
                // no fields, which is invalid GraphQL. Object types also gain an Identifier field
                // automatically from ContentTypeModule.
                Fields = new[]
                {
                    new FieldDefinitionModel
                    {
                        Name = "name",
                        DisplayName = "name",
                        DataType = "text",
                        GraphDataTypeName = "String",
                        FieldTypeId = (int)FieldTypeEnum.Text,
                        AssemblyDataTypeName = typeof(string).FullName,
                    },
                },
            })
            .ToList();

        public IEnumerable<ContentDefinitionModel> GetObjectTypes() => Definitions;

        public IEnumerable<ContentDefinitionModel> GetInputTypes() => Definitions;

        public IEnumerable<ContentDefinitionModel> GetExtensionTypes() => Definitions;
    }

    /// <summary>
    /// SettingsModule turns each settings group into a Setting_&lt;group&gt; object type and hangs a
    /// field for it off SettingsType. Returning nothing would leave SettingsType with no fields,
    /// which is invalid GraphQL, so one placeholder group is supplied. Real groupings exist only
    /// as data, so there is nothing in the code to reproduce them from.
    /// </summary>
    internal sealed class PlaceholderSystemSettings : ISystemSettingsService
    {
        private sealed class Setting : ISetting
        {
            public string Grouping { get; set; }
            public string Name { get; set; }
            public string Value { get; set; }
            public bool? IsSystemValue { get; set; }
        }

        public IEnumerable<ISetting> GetSystemSettings() => GetSystemSettingsForAllTenants();

        public IEnumerable<ISetting> GetSystemSettingsForAllTenants() => new ISetting[]
        {
            new Setting
            {
                Grouping = "SchemaSnapshot.Placeholder",
                Name = "placeholder",
                Value = string.Empty,
                IsSystemValue = true,
            },
        };
    }
}
