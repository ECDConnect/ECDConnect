using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Security;
using HotChocolate;
using System;

namespace ECDLink.EGraphQL.Authorization
{
    public class PermissionDirective
    {
        public string ObjectType { get; set; }

        public GraphActionEnum MethodType { get; set; }

        [GraphQLIgnore]
        public string GetPermissionAction()
        {
            switch (MethodType)
            {
                case GraphActionEnum.Create:
                    return $"{SecurityConstants.ApiActions.CREATE}_{ObjectType}".ToLower();
                case GraphActionEnum.Update:
                    return $"{SecurityConstants.ApiActions.UPDATE}_{ObjectType}".ToLower();
                case GraphActionEnum.View:
                    return $"{SecurityConstants.ApiActions.VIEW}_{ObjectType}".ToLower();
                case GraphActionEnum.Delete:
                    return $"{SecurityConstants.ApiActions.DELETE}_{ObjectType}".ToLower();
                default:
                    throw new Exception("No Graph Action configured for specified Method");
            }
        }
    }
}
