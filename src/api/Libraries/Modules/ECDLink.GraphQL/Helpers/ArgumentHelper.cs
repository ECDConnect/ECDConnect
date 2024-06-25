using HotChocolate.Execution.Processing;
using HotChocolate.Resolvers;
using System.Linq;

namespace ECDLink.EGraphQL.Helpers
{
    public static class ArgumentHelper
    {
        public static object GetArgument(IPureResolverContext ctx, string field)
        {
            Selection selection = ctx.Selection as Selection;

            if (ctx.Variables.Any())
            {
                var variableField = ctx.Variables.Where(x => string.Equals(field, x.Name)).FirstOrDefault();

                if (variableField.Value?.Value != default)
                {
                    return variableField.Value?.Value;
                }
            }

            if (selection.Arguments.TryGetValue(field, out var argumentfield))
            {
                if (argumentfield?.Value != default)
                {
                    return argumentfield?.Value;
                }
            }

            return default;
        }
    }
}
