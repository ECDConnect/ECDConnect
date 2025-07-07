using ECDLink.Core.Models.ContentManagement;
using System.Collections.Generic;

namespace ECDLink.EGraphQL.ObjectTypes.Services
{
    public interface IDynamicTypeDefinitionService
    {
        public IEnumerable<ContentDefinitionModel> GetObjectTypes();

        public IEnumerable<ContentDefinitionModel> GetInputTypes();

        public IEnumerable<ContentDefinitionModel> GetExtensionTypes();
    }
}
