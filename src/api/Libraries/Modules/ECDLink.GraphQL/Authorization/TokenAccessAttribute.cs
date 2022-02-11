using ECDLink.EGraphQL.Enums;
using ECDLink.Security.AccessModifiers.OpenAccess;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace ECDLink.EGraphQL.Authorization
{
    public class TokenAccessAttribute : DescriptorAttribute
    {
        private Type _validator { get; set; }

        public TokenAccessAttribute(Type validator)
        {
            _validator = validator;
        }

        protected override void TryConfigure(IDescriptorContext context, IDescriptor descriptor, ICustomAttributeProvider element)
        {
            if (descriptor is IObjectFieldDescriptor field)
            {
                field.Directive(new TokenAccessDirective 
                { 
                    Validator = _validator
                });
            }
        }
    }
}
