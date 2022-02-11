using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.EGraphQL.ObjectTypes
{
    public class SettingsType : ObjectType
    {
        protected override void Configure(IObjectTypeDescriptor descriptor)
        {
            descriptor.Name("SettingsType");

            descriptor.Field("Holder")
                .Type<StringType>()
                .Resolve(ctx => "temp");
        }
    }
}
