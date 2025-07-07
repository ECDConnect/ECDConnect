using ECDLink.Abstractrions.GraphQL.Enums;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using System;
using System.Reflection;

namespace ECDLink.EGraphQL.Authorization
{
    public class PermissionAttribute : DescriptorAttribute
    {
        private string _objectType { get; set; }
        private GraphActionEnum _methodType { get; set; }

        public PermissionAttribute(Type objectType, GraphActionEnum methodType)
        {
            if (objectType == default(Type))
            {
                throw new NotImplementedException("Permission attribute not specified");
            }

            _objectType = objectType.Name;
            _methodType = methodType;
        }

        public PermissionAttribute(string objectType, GraphActionEnum methodType)
        {
            _objectType = objectType ?? "*";
            _methodType = methodType;
        }

        protected override void TryConfigure(IDescriptorContext context, IDescriptor descriptor, ICustomAttributeProvider element)
        {
            if (descriptor is IObjectTypeDescriptor type)
            {
                type.Directive(new PermissionDirective
                {
                    MethodType = _methodType,
                    ObjectType = _objectType
                });
            }
            else if (descriptor is IObjectFieldDescriptor field)
            {
                field.Directive(new PermissionDirective
                {
                    MethodType = _methodType,
                    ObjectType = _objectType
                });
            }
        }
    }
}
