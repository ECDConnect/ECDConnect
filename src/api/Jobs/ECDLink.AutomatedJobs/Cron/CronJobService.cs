using Cronos;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NPOI.SS.Formula.Functions;
using System;
using System.Threading;
using System.Threading.Tasks;
using static Org.BouncyCastle.Math.EC.ECCurve;

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
        protected ILogger _logger;

        protected CronJobService(ICronJobConfig config, ILogger logger)
        {
            _name = config.Name;
            _cronExpression = config.Cron;
            _expression = CronExpression.Parse(_cronExpression);
            _timeZoneInfo = config.TimeZoneInfo;
            _testMode = config.TestMode;
            _logger = logger;
        }

        public virtual async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("CronJobs: {0} Registered '{1}' TZ='{2}' [{3}]", _name, _cronExpression, _timeZoneInfo.DisplayName, this.GetType().Name);
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
                                        await DoWork(cancellationToken);
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
                } catch (Exception ex)
                {
                    throw ex;
                }
            }
            await Task.CompletedTask;
        }

        private void _timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            throw new NotImplementedException();
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
