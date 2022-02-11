using ECDLink.Core.Models.ContentManagement;
using ECDLink.EGraphQL.Enums;

namespace ECDLink.EGraphQL.Helpers
{
    public static class FieldTypeHelper
    {
        public static bool IsRelationType(FieldDefinitionModel field)
        {
            if (field.FieldTypeId == (int)FieldTypeEnum.DynamicRelation)
            {
                return true;
            }

            if (field.FieldTypeId == (int)FieldTypeEnum.StaticRelation)
            {
                return true;
            }

            return false;
        }
    }
}
