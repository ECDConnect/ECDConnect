using Cronos;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Cron
{
    public abstract class CronJobService : IHostedService, IDisposable
    {
        private System.Timers.Timer _timer;
        protected readonly string _name;
        private readonly string _cronExpression;
        private readonly CronExpression _expression;
        private readonly TimeZoneInfo _timeZoneInfo;
        private readonly bool _testMode;
        private readonly List<string> _tenants;
        protected ILogger _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private IServiceScope _scope;

        protected CronJobService(IServiceScopeFactory scopeFactory, ICronJobConfig config, ILogger logger)
        {
            _name = config.Name;
            _cronExpression = config.Cron;
            _expression = CronExpression.Parse(_cronExpression);
            _timeZoneInfo = config.TimeZoneInfo;
            _testMode = config.TestMode;
            _logger = logger;
            _scopeFactory = scopeFactory;
            if (config.Tenants == null || config.Tenants == "*" || config.Tenants.ToLower() == "all")
            {
                _tenants = null;
            }
            else if (config.Tenants.Trim() == "")
            {
                _tenants = new List<string>();
            }
            else
            {
                _tenants = config.Tenants.Split(",").ToList();
            }

        }

        public IServiceScope Scope { get { return _scope; } }

        public T GetRequiredService<T>() {
          if (this._scope == null) throw new NullReferenceException("_scope is null.  Only call this within the context of DoWork method.");
          var service = _scope.ServiceProvider.GetRequiredService<T>();
          if (service == null) throw new Exception(string.Format("Service {0} not found.", typeof(T).Name ));
          return service;
        }
        public List<T> GetServices<T>()
        {
            if (this._scope == null) throw new NullReferenceException("_scope is null.  Only call this within the context of DoWork method.");
            var services = _scope.ServiceProvider.GetServices<T>();
            if (services == null || services.All(x => x == null)) throw new Exception(string.Format("Service {0} not found.", typeof(T).Name));
            return services.Where(x => x != null).ToList();
        }

        public virtual async Task StartAsync(CancellationToken cancellationToken)
        {
            var tenants = this._tenants == null ? "all" : string.Join(",", this._tenants);
            _logger.LogInformation("CronJobs: {0} Registered '{1}' TZ='{2}' [{3}] for tenants [{4}]", _name, _cronExpression, _timeZoneInfo.DisplayName, this.GetType().Name, tenants);
            await ScheduleJob(cancellationToken);
        }

        protected virtual async Task ScheduleJob(CancellationToken cancellationToken)
        {
            var next = _expression.GetNextOccurrence(DateTimeOffset.Now, _timeZoneInfo);
            if (next.HasValue)
            {
                var delay = next.Value - DateTimeOffset.Now;
                var totalMilliseconds = Math.Truncate(delay.TotalMilliseconds);
                if (delay.TotalMilliseconds <= 0)   // prevent non-positive values from being passed into Timer
                {
                    await ScheduleJob(cancellationToken);
                }
                try
                {
                    if (totalMilliseconds > (double)Int32.MaxValue)
                    {   // Schedule for a bit then check if we can really schedule
                        _timer = new System.Timers.Timer(Int32.MaxValue / 2);
                        _timer.Elapsed += async (sender, args) =>
                        {
                            _timer.Dispose();  // reset and dispose timer
                            _timer = null;
                            if (!cancellationToken.IsCancellationRequested)
                            {
                                await ScheduleJob(cancellationToken);
                            }
                        };
                        _logger.LogInformation("CronJobs: {0} Next Run @ {1} ({2} from now)", _name, next.Value.ToString(), delay);
                    }
                    else
                    {
                        _timer = new System.Timers.Timer(Math.Truncate(delay.TotalMilliseconds));
                        _timer.Elapsed += async (sender, args) =>
                        {
                            _timer.Dispose();  // reset and dispose timer
                            _timer = null;

                            if (!cancellationToken.IsCancellationRequested)
                            {
                                _logger.LogInformation("CronJobs: {0} Work Start", _name);
                                try
                                {
                                    if (_testMode)
                                    {
                                        _logger.LogInformation("CronJobs: {0} Work TESTING", _name);
                                    }
                                    else
                                    {
                                        DoTenantsWork(cancellationToken);
                                    }
                                    _logger.LogInformation("CronJobs: {0} Work End", _name);
                                }
                                catch (Exception ex)
                                {
                                    _logger.LogError(ex, "CronJobs: {0} Work Failed: {1}", _name, ex.Message);
                                }
                            }

                            if (!cancellationToken.IsCancellationRequested)
                            {
                                await ScheduleJob(cancellationToken);    // reschedule next
                            }
                        };
                        _logger.LogInformation("CronJobs: {0} Next Run @ {1} ({2} from now)", _name, next.Value.ToString(), delay);
                    }
                    _timer.Start();
                } 
                catch (Exception ex)
                {
                    throw new Exception("Exception in ScheduleJob", ex);
                }
            }
            await Task.CompletedTask;
        }

        private void _timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            throw new NotImplementedException();
        }

        private List<TenantInternalModel> GetTenantsInScope()
        {
            var tenancyRepo = Scope.ServiceProvider.GetRequiredService<TenantService>();
            var tenants = new List<TenantInternalModel>();
            if (this._tenants == null)
            {
                tenants.AddRange(tenancyRepo.GetAllTenants(false)
                    .Where(x => x.TenantType != Tenancy.Enums.TenantType.Host && x.TenantType != Tenancy.Enums.TenantType.WhiteLabelTemplate && x.ApplicationName != "API")
                    .OrderBy(x => x.Id).ThenBy(x => x.ApplicationName)
                    .DistinctBy(x => x.Id)
                    .ToList());
            }
            else if (this._tenants.Count > 0)
            {
                var tenantNames = new List<string>();
                var tenantIds = new List<Guid>();
                _tenants.ForEach(x => {
                    Guid id;
                    if (Guid.TryParse(x, out id)) {
                        tenantIds.Add(id);
                    }
                    else {
                        tenantNames.Add(x);
                    }
                });
                tenants.AddRange(tenancyRepo.GetAllTenants(false)
                    .Where(x => x.TenantType != Tenancy.Enums.TenantType.Host && x.TenantType != Tenancy.Enums.TenantType.WhiteLabelTemplate && x.ApplicationName != "API" && (tenantNames.Contains(x.ApplicationName) || tenantIds.Contains(x.Id)))
                    .OrderBy(x => x.Id).ThenBy(x => x.ApplicationName)
                    .DistinctBy(x => x.Id)
                    .ToList());
            }
            return tenants;
        }
            

        private async void DoTenantsWork(CancellationToken cancellationToken)
        {
            if (this._tenants != null && this._tenants.Count == 0) return;

            try
            {
                this._scope = _scopeFactory.CreateScope();
                List<TenantInternalModel> tenants = GetTenantsInScope();
                _logger.LogInformation("CronJobs: {0} Work Start for {1} tenants", _name, tenants.Count);
                foreach (var tenant in tenants)
                {
                    try
                    {
                        if (this._scope == null) this._scope = _scopeFactory.CreateScope();
                        TenantExecutionContext.SetTenant(tenant);
                        _logger.LogInformation("CronJobs: {0} Work Start for Tenant: {1} {2}", _name, tenant.ApplicationName, tenant.Id);
                        await DoWork(cancellationToken);
                        _logger.LogInformation("CronJobs: {0} Work End for Tenant: {1} {2}", _name, tenant.ApplicationName, tenant.Id);
                    }
                    catch(Exception ex)
                    {
                        _logger.LogError(ex, "CronJobs: {0} Work Failed for Tenant: {1} {2}: {3}", _name, tenant.ApplicationName, tenant.Id, ex.Message);
                    }
                    finally
                    {
                        TenantExecutionContext.SetTenant(null, true);
                        if (this._scope  != null) this._scope.Dispose();
                        this._scope = null;
                    }
                }

            }
            finally
            {
                if (_scope != null) _scope.Dispose();
                _scope = null;
            }
        }

        public abstract Task DoWork(CancellationToken cancellationToken);

        public virtual async Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Stop();
            _logger.LogInformation("CronJobs: {0} Stop", _name);
            await Task.CompletedTask;
        }

        public virtual void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
