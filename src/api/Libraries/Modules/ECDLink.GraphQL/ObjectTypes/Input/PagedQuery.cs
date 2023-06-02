using HotChocolate;
using System;

namespace ECDLink.EGraphQL.ObjectTypes.Input
{
    public class PagedQueryInput
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }

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

        public SortByField[] SortBy { get; } = new SortByField[] { };
        public FilterByField[] FilterBy { get; } = new FilterByField[] { };

        [GraphQLIgnore]
        public int RowOffset
        {
            get => PageNumber * PageSize;
        }
    }
}