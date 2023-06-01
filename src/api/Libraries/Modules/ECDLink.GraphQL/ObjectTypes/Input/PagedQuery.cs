using ECDLink.EGraphQL.ObjectTypes.Input;
using HotChocolate;
using HotChocolate.Types;
using System.Globalization;


namespace ECDLink.EGraphQL.ObjectTypes.Input
{
    public class PagedQueryInput
    {
        //private int pageNumber;
        //private int pageSize;

        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public PagedQueryInput()
        {
        }

        public PagedQueryInput(int pageNumber, int pageSize, SortByField[] sortBy, FilterByField[] filterBy)
        {
            PageNumber = (pageNumber - 1) >= 0 ? pageNumber - 1 : 0;
            PageSize = pageSize >= 0 ? pageSize : 10;
            SortBy = sortBy ?? new SortByField[0];
            FilterBy = filterBy ?? new FilterByField[0];
        }

        ////public PagedQueryInput(int pageNumber, int pageSize, ISortByField[] sortBy, IFilterByField[] filterBy) : this()
        ////{
        ////    SortBy = sortBy;
        ////    FilterBy = filterBy;
        ////    PageNumber = pageNumber;
        ////    PageSize = pageSize;
        ////}
        public SortByField[] SortBy { get; } = new SortByField[] { };
        public FilterByField[] FilterBy { get; } = new FilterByField[] { };

        //public int PageNumber
        //{
        //    get => pageNumber;
        //    set => pageNumber = (pageNumber - 1) > 0 ? value : 0;
        //}

        //public int PageSize
        //{
        //    get => pageSize;
        //    set => pageSize = pageSize > 0 ? value : 10;
        //}

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