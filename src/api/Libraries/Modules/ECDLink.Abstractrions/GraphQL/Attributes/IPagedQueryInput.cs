using HotChocolate.Types;

namespace ECDLink.Abstractrions.GraphQL.Attributes
{
    [InterfaceType("PagedQueryInput")]
    public interface IPagedQueryInput
    {
        public IFilterByField[] FilterBy { get; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int RowOffset { get; }
        public ISortByField[] SortBy { get; }
    }
}