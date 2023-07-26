using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace ECDLink.Abstractrions.GraphQL.Attributes
{
    public class PagedQueryInput
    {
        private const int DEFAULT_PAGESIZE = 10;
        private const int DEFAULT_PAGENUMBER = 10;
        private int? pageNumber;
        private int? pageSize;

        public int? PageNumber { 
            get => pageNumber; 
            set => pageNumber = value - 1 > 0 ? value - 1 : 0; 
        }
        public int? PageSize { 
            get => pageSize;
            set => pageSize = value >= 1 ? value : null;
        }

        public PagedQueryInput()
        {
        }

        public List<FilterByField> FilterBy { get; set; }

        [GraphQLIgnore]
        public int RowOffset
        {
            get => PageNumber ?? DEFAULT_PAGENUMBER * PageSize ?? DEFAULT_PAGESIZE;
        }
    }

    public class PagedQueryInputType : InputObjectType<PagedQueryInput>
    {
        protected override void Configure(
            IInputObjectTypeDescriptor<PagedQueryInput> descriptor)
        {
            descriptor.Field(f => f.FilterBy).Type<ListType<FilterByFieldType>>();
        }
    }

    public class FilterByFieldType : InputObjectType<FilterByField>
    {
        protected override void Configure(
            IInputObjectTypeDescriptor<FilterByField> descriptor)
        {
            descriptor.BindFieldsImplicitly();
        }
    }
}