using System;
using System.IO;
using System.Text;

namespace ECDLink.Core.Extensions
{
    public static class StreamExtension
    {
        public static string ConvertToString(this Stream stream, Encoding enc = null)
        {
            enc = enc ?? Encoding.UTF8;

            byte[] bytes = new byte[stream.Length];
            stream.Position = 0;
            stream.Read(bytes, 0, (int)stream.Length);

            return Convert.ToBase64String(bytes);
        }
    }
}
