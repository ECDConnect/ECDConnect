using HotChocolate.Resolvers;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Resolvers
{
    public interface IDynamicQueryResolver
    {
        public ValueTask<object?> GetAllResolver(IResolverContext context, int identifier);

        public ValueTask<object?> GetResolver(IResolverContext context);
    }
}
