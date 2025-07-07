using HotChocolate.Execution.Configuration;
using HotChocolate.Types;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace ECDLink.EGraphQL.Registration
{
    public static class GraphServiceRegistration
    {
        public static void RegisterExtensions(IRequestExecutorBuilder builder)
        {
            var extensions = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(s => s.GetTypes())
                .Where(p => p.GetCustomAttributes(typeof(ExtendObjectTypeAttribute), false).Any());

            foreach (var extension in extensions)
            {
                builder.AddTypeExtension(extension);
            }
        }
    }
}
