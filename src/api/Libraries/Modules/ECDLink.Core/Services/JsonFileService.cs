using Newtonsoft.Json.Linq;
using System.IO;

namespace ECDLink.Core.Services
{
    public class JsonFileService
    {
        public T ReadFromFile<T>(string fileLocation)
        {
            JObject obj = JObject.Parse(File.ReadAllText(fileLocation));

            JArray a = (JArray)obj["data"];

            return a.ToObject<T>();
        }
    }
}
