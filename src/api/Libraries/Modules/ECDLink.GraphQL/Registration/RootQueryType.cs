using ECDLink.Core.Util;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.EGraphQL.ObjectTypes;
using ECDLink.EGraphQL.Registration.AutoGenerateTypes.Queries;
using HotChocolate.Types;
using System;

namespace ECDLink.EGraphQL.Registration
{
    public class Query : ObjectType
    {
        protected override void Configure(IObjectTypeDescriptor descriptor)
        {
            descriptor.Name(nameof(Query));

            var descBuilder = typeof(GenericQueryBuilder<>);

            foreach (var type in GetEntities())
            {
                var genericQueryType = descBuilder.MakeGenericType(type);

                Activator.CreateInstance(genericQueryType, args: descriptor);
            }

            descriptor.Field("settings")
                .Type<SettingsType>()
                .Resolve(ctx => true);
        }

        public static Type[] GetEntities()
        {
            var type = typeof(EntityBase<Guid>);

            return TypeUtil.GetImplementingTypes(type);
        }
    }
}
