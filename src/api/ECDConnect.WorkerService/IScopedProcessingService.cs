using ECDLink.DataAccessLayer.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECDConnect.WorkerService
{
    internal interface IScopedProcessingService
    {
        Task DoWorkAsync(CancellationToken stoppingToken, IServiceScope scope);
    }
}
