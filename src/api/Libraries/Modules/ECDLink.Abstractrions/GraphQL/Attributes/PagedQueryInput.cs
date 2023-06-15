using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace ECDLink.Abstractrions.GraphQL.Attributes
{
    public class PagedQueryInput
    {
        private const int DEFAULT_PAGESIZE = 10;
        private int pageNumber;
        private int pageSize;

        public int PageNumber { get => pageNumber; set => pageNumber = value - 1 > 0 ? value - 1 : 0; }
        public int PageSize { get => pageSize; set => pageSize = value >= 0 ? value : DEFAULT_PAGESIZE; }

        public PagedQueryInput()
        {
        }

        public List<SortByField>? SortBy { get; set; }
        public List<FilterByField>? FilterBy { get; set; }

        [GraphQLIgnore]
        public int RowOffset
        {
            get => PageNumber * PageSize;
        }
    }

    public class PagedQueryInputType : InputObjectType<PagedQueryInput>
    {
        protected override void Configure(
            IInputObjectTypeDescriptor<PagedQueryInput> descriptor)
        {
            descriptor.Field(f => f.FilterBy).Type<ListType<FilterByFieldType>>();
            descriptor.Field(f => f.SortBy).Type<ListType<SortByFieldType>>();
        }
    }

    public class SortByFieldType : InputObjectType<SortByField>
    {
        protected override void Configure(
            IInputObjectTypeDescriptor<SortByField> descriptor)
        {
            descriptor.BindFieldsImplicitly();
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