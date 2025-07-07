using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.EGraphQL.ObjectTypes.Services;
using System;
using System.Collections.Generic;

namespace ECDLink.ContentManagement.Services
{
    public class DynamicTypeDefinitionService : IDynamicTypeDefinitionService
    {
        private readonly ContentDefinitionRepository _repository;

        public DynamicTypeDefinitionService(ContentDefinitionRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<ContentDefinitionModel> GetExtensionTypes()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ContentDefinitionModel> GetInputTypes()
        {
            return _repository.GetContentDefinitions();
        }

        public IEnumerable<ContentDefinitionModel> GetObjectTypes()
        {
            return _repository.GetContentDefinitions();
        }
    }
}
