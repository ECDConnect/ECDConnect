using HotChocolate;
using HotChocolate.Types;
using System;

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

        public SortByField[] SortBy { get; set; } = Array.Empty<SortByField>();
        public FilterByField[] FilterBy { get; set; } = Array.Empty<FilterByField>();

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
            descriptor.Field(f => f.FilterBy).Type<FilterByFieldType>();
            descriptor.Field(f => f.SortBy).Type<SortByFieldType>();
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