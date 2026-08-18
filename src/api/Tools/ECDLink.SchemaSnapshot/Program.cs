using ECDLink.Core.Services.Interfaces;
using ECDLink.EGraphQL;
using ECDLink.EGraphQL.ObjectTypes.Services;
using HotChocolate.Execution;
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

            GraphStartup.ConfigureGraphQlServices(services, isDevelopment: false);

            await using var provider = services.BuildServiceProvider();
            var executor = await provider
                .GetRequiredService<IRequestExecutorResolver>()
                .GetRequestExecutorAsync();

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

        private static void Report(string expected, string actual, string path)
        {
            var want = expected.Split('\n');
            var got = actual.Split('\n');

            Console.Error.WriteLine($"Schema differs from {path}.");
            Console.Error.WriteLine($"  snapshot: {want.Length} lines, {CountTypes(expected)} types");
            Console.Error.WriteLine($"  current:  {got.Length} lines, {CountTypes(actual)} types");
            Console.Error.WriteLine();

            var shown = 0;
            for (var i = 0; i < Math.Max(want.Length, got.Length) && shown < 40; i++)
            {
                var w = i < want.Length ? want[i] : "<end of file>";
                var g = i < got.Length ? got[i] : "<end of file>";
                if (w == g) continue;

                Console.Error.WriteLine($"  line {i + 1}:");
                Console.Error.WriteLine($"    - {w}");
                Console.Error.WriteLine($"    + {g}");
                shown++;
            }

            if (shown == 40) Console.Error.WriteLine("  ... further differences suppressed.");
            Console.Error.WriteLine();
            Console.Error.WriteLine("If this change is intended, regenerate with --out and commit the result.");
        }
    }
}
