using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;


namespace ECDLink.DataAccessLayer.Diagnostics
{
    public class KeyValueLogger : IObserver<KeyValuePair<string, object>>
    {
        public void OnCompleted() => throw new NotImplementedException();
        public void OnError(Exception exception) => throw new NotImplementedException();

        public void OnNext(KeyValuePair<string, object> value)
        {
            //if (value.Key == CoreEventId.ContextInitialized.Name)
            //{
            //    var payload = (ContextInitializedEventData)value.Value;
            //    System.Diagnostics.Debug.WriteLine($"** EF is initialized {payload.Context.GetType().Name}, using connection string {payload.Context.Database.GetDbConnection().ConnectionString}");
            //}
            //if (value.Key == RelationalEventId.MigrationApplying.Name)
            //{
            //    var payload = (MigratorEventData)value.Value;
            //    System.Diagnostics.Debug.WriteLine($"** EF is applying a migration - {payload.Migrator}");
            //}
        }
    }
}