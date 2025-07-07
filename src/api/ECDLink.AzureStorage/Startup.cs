using ECDLink.AzureStorage.Blob;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.AzureStorage
{
    public static class AzureStorageStartup
    {
        public static void ConfigureAzureStorageServices(IServiceCollection services, IConfiguration Configuration)
        {
            services.AddScoped<IFileService, FileService>();
        }
    }
}
