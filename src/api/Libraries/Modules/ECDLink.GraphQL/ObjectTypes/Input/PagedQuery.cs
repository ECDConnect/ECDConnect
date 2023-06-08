using ECDLink.Abstractrions.GraphQL.Attributes;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace ECDLink.EGraphQL.ObjectTypes.Input
{
    public class PagedQueryInput : IPagedQueryInput
    {
        private const int DEFAULT_PAGESIZE = 10;
        private int pageNumber;
        private int pageSize;

        public int PageNumber { get => pageNumber; set => pageNumber = value - 1 > 0 ? value - 1 : 0; }
        public int PageSize { get => pageSize; set => pageSize = value >= 0 ? value : DEFAULT_PAGESIZE; }

        public PagedQueryInput()
        {
        }

        public ISortByField[] SortBy { get; set; } = Array.Empty<SortByField>();
        public IFilterByField[] FilterBy { get; set; } = Array.Empty<FilterByField>();

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
            descriptor.BindFieldsImplicitly();
        }
    }
}