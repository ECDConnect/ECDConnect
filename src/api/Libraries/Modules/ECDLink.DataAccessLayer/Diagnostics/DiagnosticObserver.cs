using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;

namespace ECDLink.DataAccessLayer.Diagnostics
{
    public class DiagnosticObserver : IObserver<System.Diagnostics.DiagnosticListener>
    {
        public void OnCompleted() => throw new NotImplementedException();
        public void OnError(Exception error) => throw new NotImplementedException();
        public void OnNext(DiagnosticListener value)
        {
            if (value.Name == DbLoggerCategory.Name)
            {
                value.Subscribe(new KeyValueLogger());
            }
        }
    }
}