using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class LanguageSeedConstants
    {
        public static Guid isiZulu = Guid.Parse("7cc62017-7ee7-4f2c-9214-bc9be3f2396a");
        public static Guid isiXhosa = Guid.Parse("03fff220-106f-4ff7-9e06-20c4ec439483");
        public static Guid Afrikaans = Guid.Parse("058b9d8e-e472-48d6-8415-ba9408b95395");
        public static Guid English = Guid.Parse("9688cd08-adef-408c-9d34-5d75ae5c44df");
        public static Guid Sepedi = Guid.Parse("06370c67-692e-4664-a90a-c2de0621ff4d");
        public static Guid Setswana = Guid.Parse("c45fda51-e967-4414-8916-c39895aeb080");
        public static Guid Sesotho = Guid.Parse("0b86af94-d341-435a-b944-7a8c874c385a");
        public static Guid Xitsonga = Guid.Parse("b603d6d0-8b50-47ec-af3c-c6a2a078e56b");
        public static Guid siSwati = Guid.Parse("8de7442b-4c2e-4bc9-8b0f-0a2b3aa27f46");
        public static Guid Tshivenda = Guid.Parse("e3adeb4f-d4ff-4daf-9e4a-9195181ee412");
        public static Guid isiNdebele = Guid.Parse("9ff6d6ff-4d77-4642-a6c8-9c3d06a40058");
        public static Guid Other = Guid.Parse("1aac8dd2-6860-4e62-bc6a-c37ddf757bbc");
    }

    internal static class LanguageSeed<T>
    where T : Language, new()
    {
        internal static IList<T> GetLanguageSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = LanguageSeedConstants.isiZulu,
                    Locale = "zu",
                    Description = "isiZulu"
                },
                new T
                {
                    Id = LanguageSeedConstants.isiXhosa,
                    Locale = "xh",
                    Description = "isiXhosa"
                },
                new T
                {
                    Id = LanguageSeedConstants.Afrikaans,
                    Locale = "af",
                    Description = "Afrikaans"
                },
                new T
                {
                    Id = LanguageSeedConstants.English,
                    Locale = "en-za",
                    Description = "English"
                },
                new T
                {
                    Id = LanguageSeedConstants.Sepedi,
                    Locale = "nso",
                    Description = "Sepedi"
                },
                new T
                {
                    Id = LanguageSeedConstants.Setswana,
                    Locale = "tn",
                    Description = "Setswana"
                },
                new T
                {
                    Id = LanguageSeedConstants.Sesotho,
                    Locale = "st",
                    Description = "Sesotho"
                },
                new T
                {
                    Id = LanguageSeedConstants.Xitsonga,
                    Locale = "tso",
                    Description = "Xitsonga"
                },
                new T
                {
                    Id = LanguageSeedConstants.siSwati,
                    Locale = "ss",
                    Description = "siSwati"
                },
                new T
                {
                    Id = LanguageSeedConstants.Tshivenda,
                    Locale = "ve",
                    Description = "Tshivenda"
                },
                new T
                {
                    Id = LanguageSeedConstants.isiNdebele,
                    Locale = "nr",
                    Description = "isiNdebele"
                },
                new T
                {
                    Id = LanguageSeedConstants.Other,
                    Locale = "",
                    Description = "Other"
                }
            };
        }
    }
}
