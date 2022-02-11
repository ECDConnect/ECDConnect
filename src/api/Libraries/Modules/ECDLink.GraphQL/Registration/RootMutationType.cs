using ECDLink.Core.Util;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.EGraphQL.Registration.AutoGenerateTypes.Mutations;
using HotChocolate.Types;
using System;

namespace ECDLink.EGraphQL.Registration
{
    public class Mutation : ObjectType
    {
        public Mutation()
        {
        }

        protected override void Configure(IObjectTypeDescriptor descriptor)
        {
            descriptor.Name(nameof(Mutation));

            var descBuilder = typeof(GenericMutationBuilder<>);

            foreach (var type in TypeUtil.GetImplementingTypes(typeof(EntityBase<Guid>)))
            {
                var genericQueryType = descBuilder.MakeGenericType(type);

                Activator.CreateInstance(genericQueryType, args: descriptor);
            }
        }
    }
}
