using Cronos;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Cron
{
    public abstract class CronJobService : IHostedService, IDisposable
    {
        private System.Timers.Timer _timer;
        private readonly string _name;
        private readonly CronExpression _expression;
        private readonly TimeZoneInfo _timeZoneInfo;
        private readonly bool _testMode;

        protected CronJobService(IScheduleConfigBase config)
        {
            _name = config.Name;
            _expression = CronExpression.Parse(config.CronExpression);
            _timeZoneInfo = config.TimeZoneInfo;
            _testMode = config.TestMode;
        }

        public virtual async Task StartAsync(CancellationToken cancellationToken)
        {
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
                        Console.WriteLine("CronJobs: {0} Next Run @ {1} ({2} from now)", _name, next.Value.ToString(), delay);
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
                                Console.WriteLine("CronJobs: {0} Work Start", _name);
                                try
                                {
                                    if (_testMode)
                                    {
                                        Console.WriteLine("CronJobs: {0} Work TESTING", _name);
                                    }
                                    else
                                    {
                                        await DoWork(cancellationToken);
                                    }
                                    Console.WriteLine("CronJobs: {0} Work End", _name);
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine("CronJobs: {0} Work Failed: {1}", _name, ex.Message);
                                    Console.WriteLine(ex.ToString());
                                }
                            }

                            if (!cancellationToken.IsCancellationRequested)
                            {
                                await ScheduleJob(cancellationToken);    // reschedule next
                            }
                        };
                        Console.WriteLine("CronJobs: {0} Next Run @ {1} ({2} from now)", _name, next.Value.ToString(), delay);
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
            Console.WriteLine("CronJobs: {0} Stop", _name);
            await Task.CompletedTask;
        }

        public virtual void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
