using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL;
using ECDLink.EGraphQL.ObjectTypes.Services;
using HotChocolate.Execution;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.SchemaSnapshot
{
    /// <summary>
    /// Prints the static GraphQL schema as SDL, without needing a database.
    ///
    ///   --out   &lt;path&gt;  write the SDL to path
    ///   --check &lt;path&gt;  regenerate and fail (exit 1) if it differs from path
    ///
    /// The snapshot exists to make schema drift visible during the Hot Chocolate
    /// upgrade. v13 changed how consecutive uppercase letters are camel-cased, which
    /// silently renames fields such as cTAText and pQARatings; LegacyNamingConventions
    /// pins the v12 spelling, and an unchanged snapshot is the proof that it does.
    /// </summary>
    internal static class Program
    {
        private static async Task<int> Main(string[] args)
        {
            var mode = args.Length > 0 ? args[0] : "--out";
            var path = args.Length > 1
                ? args[1]
                : Path.Combine(AppContext.BaseDirectory, "schema.graphql");

            string sdl;
            try
            {
                sdl = Normalise(await BuildSdlAsync());
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Failed to build the schema: {ex.Message}");
                Console.Error.WriteLine(ex);
                return 2;
            }

            switch (mode)
            {
                case "--out":
                    Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(path))!);
                    await File.WriteAllTextAsync(path, sdl);
                    Console.WriteLine($"Wrote {CountTypes(sdl)} types to {path}");
                    return 0;

                case "--check":
                    if (!File.Exists(path))
                    {
                        Console.Error.WriteLine($"No snapshot at {path}. Create one with --out first.");
                        return 2;
                    }

                    var expected = Normalise(await File.ReadAllTextAsync(path));
                    if (expected == sdl)
                    {
                        Console.WriteLine($"Schema matches {path} ({CountTypes(sdl)} types).");
                        return 0;
                    }

                    Report(expected, sdl, path);
                    return 1;

                default:
                    Console.Error.WriteLine($"Unknown mode '{mode}'. Use --out or --check.");
                    return 2;
            }
        }

        private static async Task<string> BuildSdlAsync()
        {
            // GraphServiceRegistration scans AppDomain.CurrentDomain.GetAssemblies() for
            // [ExtendObjectType] types. Assemblies load lazily, so core-api - which holds 84 of
            // the 88 type extensions - must be loaded before the schema is built or the snapshot
            // silently comes out nearly empty.
            _ = typeof(EcdLink.Api.CoreApi.GraphApi.Queries.UserQueryTypeExtension).Assembly;

            var services = new ServiceCollection();
            services.AddLogging();
            services.AddSingleton<IDynamicTypeDefinitionService, PlaceholderContentTypes>();
            services.AddSingleton<ISystemSettingsService, PlaceholderSystemSettings>();

            // From v14 Hot Chocolate infers what is a service purely from the DI container:
            // RegisterService and RegisterDbContext were removed, so there is no longer any way
            // to mark a resolver parameter as a service explicitly. Anything it cannot find in
            // the container it treats as a GraphQL input argument and then tries to build a type
            // from - so an unregistered ApplicationUserManager surfaces as failures to infer
            // types for ILookupNormalizer, IPasswordHasher and a uint property on it.
            //
            // These are never resolved while the schema is built, only recognised, so a throwing
            // factory is enough. They are the services that used to be listed explicitly via
            // RegisterService(ServiceKind.Synchronized).
            foreach (var serviceType in new[]
            {
                typeof(AuthenticationDbContext),
                typeof(IDbContextFactory<AuthenticationDbContext>),
                typeof(HierarchyEngine),
                typeof(ApplicationUserManager),
                typeof(IGenericRepositoryFactory),
            })
            {
                services.AddSingleton(serviceType, _ => throw new NotSupportedException(
                    $"{serviceType.Name} is registered so the schema builder recognises it as a " +
                    "service; the snapshot never executes resolvers, so it is never resolved."));
            }

            GraphStartup.ConfigureGraphQlServices(services, isDevelopment: false);

            await using var provider = services.BuildServiceProvider();
            var executor = await provider
                .GetRequiredService<IRequestExecutorProvider>()
                .GetExecutorAsync();

            return executor.Schema.ToString();
        }

        /// <summary>Trailing whitespace and line endings vary by platform; the schema does not.</summary>
        private static string Normalise(string sdl)
        {
            var lines = sdl.Replace("\r\n", "\n").Split('\n').Select(l => l.TrimEnd());
            return string.Join("\n", lines).Trim() + "\n";
        }

        private static int CountTypes(string sdl) => sdl
            .Split('\n')
            .Count(l => l.StartsWith("type ") || l.StartsWith("input ") || l.StartsWith("enum ")
                     || l.StartsWith("interface ") || l.StartsWith("union ") || l.StartsWith("scalar "));

        /// <summary>
        /// Reports differences as removed and added lines rather than by position: a single
        /// inserted field shifts every following line, so a positional comparison reports the
        /// whole file as changed and buries the actual change. Counts are compared as multisets,
        /// so a line appearing twice as often shows up. A rename appears as a matching pair, one
        /// on each side - which is exactly what a naming-convention regression looks like.
        /// </summary>
        private static void Report(string expected, string actual, string path)
        {
            Console.Error.WriteLine($"Schema differs from {path}.");
            Console.Error.WriteLine($"  snapshot: {expected.Split('\n').Length} lines, {CountTypes(expected)} types");
            Console.Error.WriteLine($"  current:  {actual.Split('\n').Length} lines, {CountTypes(actual)} types");

            var removed = Surplus(expected, actual);
            var added = Surplus(actual, expected);

            Write("Only in the snapshot (removed)", removed, '-');
            Write("Only in the current schema (added)", added, '+');

            Console.Error.WriteLine();
            Console.Error.WriteLine("If the change is intended, regenerate with --out and commit the result.");
            Console.Error.WriteLine("If it is not, something has changed the public schema - read the lines above first.");
        }

        /// <summary>Lines occurring more often in <paramref name="a"/> than in <paramref name="b"/>.</summary>
        private static List<string> Surplus(string a, string b)
        {
            var counts = new Dictionary<string, int>();
            foreach (var line in b.Split('\n'))
            {
                counts.TryGetValue(line, out var n);
                counts[line] = n + 1;
            }

            var surplus = new List<string>();
            foreach (var line in a.Split('\n'))
            {
                if (counts.TryGetValue(line, out var n) && n > 0)
                {
                    counts[line] = n - 1;
                    continue;
                }

                // Braces and blank lines carry no meaning without position; they only ever differ
                // because something else did, and listing them hides the real change.
                var trimmed = line.Trim();
                if (trimmed.Length == 0 || trimmed == "}" || trimmed == "{") continue;

                surplus.Add(line);
            }

            return surplus;
        }

        private static void Write(string heading, List<string> lines, char marker)
        {
            if (lines.Count == 0) return;

            Console.Error.WriteLine();
            Console.Error.WriteLine($"  {heading}: {lines.Count}");
            foreach (var line in lines.Take(40)) Console.Error.WriteLine($"    {marker} {line.Trim()}");
            if (lines.Count > 40) Console.Error.WriteLine($"    ... and {lines.Count - 40} more");
        }
    }
}
