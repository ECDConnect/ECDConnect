using HotChocolate.Types;

namespace ECDLink.EGraphQL.Registration
{
    /// <summary>
    /// Pins DateTime output to the Hot Chocolate 12-15 format: always three fractional digits.
    ///
    /// Hot Chocolate 16 emits up to seven fractional digits and strips trailing zeros, so
    /// 09:15:30.120Z became 09:15:30.12Z and 09:15:30.000+02:00 became 09:15:30+02:00. That touches
    /// every one of the ~730 DateTime fields, and the PWA stores and compares these strings
    /// offline. The output here was verified byte for byte against 15.1.18. Input parsing is
    /// unchanged apart from v16 also accepting more than seven fractional digits.
    ///
    /// How it is registered matters, and both obvious ways are wrong:
    ///
    /// - AddType(instance) builds the first schema correctly, but a type-system object can only
    ///   be initialised once, so every rebuild after a CMS change fails - and v16 swallows rebuild
    ///   failures, leaving the old schema in place for good.
    /// - A DateTimeType subclass collides with the built-in DateTime, because Hot Chocolate's
    ///   filter and sort inputs reference DateTimeType by CLR type.
    ///
    /// So it has to be a plain DateTimeType, created fresh for every schema build: register it
    /// with ConfigureSchema(b => b.AddType(LegacyDateTime.Create())).
    /// </summary>
    public static class LegacyDateTime
    {
        public static DateTimeType Create()
            => new DateTimeType(new DateTimeOptions { OutputPrecision = 3, AlwaysOutputFractionalSeconds = true });
    }
}
