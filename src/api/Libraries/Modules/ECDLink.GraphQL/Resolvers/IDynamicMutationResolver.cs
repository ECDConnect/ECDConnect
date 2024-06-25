using HotChocolate.Resolvers;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Resolvers
{
    public interface IDynamicMutationResolver
    {
        public ValueTask<object> CreateMutationResolver(IResolverContext context);

        public ValueTask<object> UpdateMutationResolver(IResolverContext context);

        public ValueTask<object> DeleteMutationResolver(IResolverContext context);
    }
}
