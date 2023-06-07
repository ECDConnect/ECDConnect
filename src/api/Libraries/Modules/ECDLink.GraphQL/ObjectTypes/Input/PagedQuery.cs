using ECDLink.Abstractrions.GraphQL.Attributes;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace ECDLink.EGraphQL.ObjectTypes.Input
{
    public class PagedQueryInput //: IPagedQueryInput
    {
        private int pageNumber;

        public int PageNumber { get => pageNumber; set => pageNumber = value < 1 ? 0 : value - 1; }
        public int PageSize { get; }

        public PagedQueryInput()
        {
        }

        public PagedQueryInput(int pageNumber, int pageSize, SortByField[] sortBy, FilterByField[] filterBy)
        {
            PageNumber = (pageNumber - 1) >= 0 ? pageNumber - 1 : 0;
            PageSize = pageSize >= 0 ? pageSize : 10;
            SortBy = sortBy ?? Array.Empty<SortByField>();
            FilterBy = filterBy ?? Array.Empty<FilterByField>();
        }

        public SortByField[] SortBy { get; set; } = new SortByField[] { };
        public FilterByField[] FilterBy { get; set; } = new FilterByField[] { };

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