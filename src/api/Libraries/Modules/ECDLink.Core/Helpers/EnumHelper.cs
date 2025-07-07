using System;
using System.ComponentModel;
using System.Reflection;

namespace ECDLink.Core.Helpers
{
    public static class EnumHelper
    {
        public static string GetDescription(Enum value)
        {
            FieldInfo fi = value.GetType().GetField(value.ToString());
            var attribute = (DescriptionAttribute)fi.GetCustomAttribute(typeof(DescriptionAttribute));
            return attribute.Description;
        }

        public static T GetEnumFromDescription<T>(string description) where T : Enum
        {
            foreach (var value in Enum.GetValues(typeof(T)))
            {
                var enumValue = (T)value;
                if (GetDescription(enumValue) == description)
                {
                    return enumValue;
                }
            }
            throw new ArgumentException($"No {typeof(T).Name} with description '{description}' found.");
        }
    }
}
