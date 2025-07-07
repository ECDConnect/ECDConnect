using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.IO;

namespace ECDLink.FileStorage
{
    public static class FileStorageStartup
    {
        public static void ConfigureFileStorageServices(IServiceCollection services, IConfiguration Configuration)
        {
            FileServiceConfig config = Configuration.GetSection("Storage").GetSection<FileServiceConfig>("FileSystem");

            var currentDir = Directory.GetCurrentDirectory();
            if (Path.IsPathRooted(config.Location))
            {
                config.FullLocation = currentDir;
            }
            else
            {
                config.FullLocation = Path.Combine(currentDir, config.Location);
            }
            if (!Directory.Exists(config.FullLocation))
            {
                Directory.CreateDirectory(config.FullLocation);
            }

            services.AddScoped<IFileService>(serviceProvider =>
            {
                return new FileService(config);
            });
        }
    }
}
