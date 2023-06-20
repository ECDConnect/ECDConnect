using ECDLink.Core.Extensions;
using ECDLink.EGraphQL.Enums;
using System;

namespace ECDLink.EGraphQL.Services
{
    public static class GraphFieldNamingHelper
    {
        public static string GetFieldName(GraphFieldTypeEnum type, string contentType)
        {
            switch (type)
            {
                case GraphFieldTypeEnum.GetById:
                    return $"Get{contentType.NoSpace()}ById";
                case GraphFieldTypeEnum.GetByUserId:
                    return $"Get{contentType.NoSpace()}ByUserId";
                case GraphFieldTypeEnum.GetListByUserId:
                    return $"Get{contentType.NoSpace()}ListByUserId";
                case GraphFieldTypeEnum.GetAll:
                    return $"GetAll{contentType.NoSpace()}";
                case GraphFieldTypeEnum.Create:
                    return $"create{contentType.NoSpace()}";
                case GraphFieldTypeEnum.Update:
                    return $"update{contentType.NoSpace()}";
                case GraphFieldTypeEnum.Delete:
                    return $"delete{contentType.NoSpace()}";
                case GraphFieldTypeEnum.Count:
                    return $"count{contentType.NoSpace()}";
                default:
                    throw new NotImplementedException("No such Field case exists");
            }
        }
    }
}
