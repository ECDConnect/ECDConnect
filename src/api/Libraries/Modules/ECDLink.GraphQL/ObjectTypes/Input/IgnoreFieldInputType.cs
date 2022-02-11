using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Linq;

namespace ECDLink.EGraphQL.ObjectTypes.Input
{
    public class IgnoreFieldInputType<T> : InputObjectType<T>
    where T : EntityBase<Guid>
    {
        protected override void Configure(
           IInputObjectTypeDescriptor<T> descriptor)
        {
            descriptor.BindFields(BindingBehavior.Explicit);

            var fieldList = typeof(T).GetProperties()
              .Where(x => !x.GetCustomAttributes(typeof(GraphIgnoreInputAttribute), true).Any())
              .Where(x => !x.GetCustomAttributes(typeof(GraphQLIgnoreAttribute), true).Any())
              .ToList();

            foreach (var field in fieldList)
            {
                Type fieldType = field.PropertyType;

                if (string.Equals(field.Name, "Id"))
                {
                    var nullableType = typeof(Nullable<>).MakeGenericType(fieldType);

                    fieldType = nullableType;
                }

                descriptor.Field(field.Name)
                  .Type(fieldType);
            }
        }
    }
}
