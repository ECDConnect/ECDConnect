using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECDConnect.WorkerService.Utils;

internal sealed class TenantSettings
{
    public required string Organisation { get; set; }
    public required string Application { get; set; }
    public required string SiteAddress { get; set; }
    public required string DbProvider { get; set; }
    public required string ConnectionString { get; set; }
}
