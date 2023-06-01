using ECDLink.EGraphQL.ObjectTypes.Input;
using HotChocolate;
using HotChocolate.Types;
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

//public class PagedQueryInputType : InputObjectType<PagedQueryInput>
//{
//    public PagedQueryInputType()
//    {
//    }

//    protected override void Configure(
//        IInputObjectTypeDescriptor<PagedQueryInput> descriptor)
//    {
//        descriptor.BindFields(BindingBehavior.Explicit);
//        descriptor.Field(t => t.PageNumber).Type<NonNullType<IntType>>();
//        descriptor.Field(t => t.PageSize).Type<NonNullType<IntType>>();
//        descriptor.Field(t => t.RowOffset).Ignore();

//    }
//}