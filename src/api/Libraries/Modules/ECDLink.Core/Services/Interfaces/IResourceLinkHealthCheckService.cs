using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IResourceLinkHealthCheckService
    {
        Task RunHealthChecksAsync(CancellationToken cancellationToken = default);
    }
}
