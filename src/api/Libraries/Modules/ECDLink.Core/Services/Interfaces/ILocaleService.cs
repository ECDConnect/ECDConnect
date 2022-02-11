using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface ILocaleService<T>
    {
        T GetLocale(string locale);

        IEnumerable<T> GetAvailableLocale();


    }
}
