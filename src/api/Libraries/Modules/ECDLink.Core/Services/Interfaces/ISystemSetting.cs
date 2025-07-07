namespace ECDLink.Core.Services.Interfaces
{
    public interface ISystemSetting<T>
    {
        T GetSettings(string settingsGroup);

        T Value { get; }
    }
}
