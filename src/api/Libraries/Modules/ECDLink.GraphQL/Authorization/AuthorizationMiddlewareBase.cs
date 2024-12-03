using ECDLink.Security.Enums;
using HotChocolate;
using HotChocolate.Resolvers;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Authorization
{
    public abstract class AuthorizationMiddlewareBase
    {
        public abstract Task InvokeAsync(IDirectiveContext context);

        protected virtual void SetError(IDirectiveContext context, AuthState state)
        {
            switch (state)
            {
                case AuthState.NotAllowed:
                    context.Result = ErrorBuilder.New()
                                  .SetMessage("Not Authorised")
                                  .SetCode(ErrorCodes.Authentication.NotAuthorized)
                                  .SetPath(context.Path)
                                  .AddLocation(context.Selection.SyntaxNode)
                                  .Build();
                    break;
                case AuthState.NotAuthenticated:
                    context.Result = ErrorBuilder.New()
                                  .SetMessage("Not Authenticated")
                                  .SetCode(ErrorCodes.Authentication.NotAuthenticated)
                                  .SetPath(context.Path)
                                  .AddLocation(context.Selection.SyntaxNode)
                                  .Build();
                    break;
                default:
                    context.Result = ErrorBuilder.New()
                                  .SetMessage("Unknown Exception")
                                  .SetCode(ErrorCodes.Execution.TaskProcessingError)
                                  .SetPath(context.Path)
                                  .AddLocation(context.Selection.SyntaxNode)
                                  .Build();
                    break;
            }
        }
    }
}