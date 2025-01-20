using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class StoryBookPartModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Question { get; set; }

        public StoryBookPartModel(Object record) {

            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);
            item.TryGetValue("question", out var question);

            Id = id.ToString();
            Name = name != null ? name.ToString() : "";
            Question = question != null ? question.ToString() : "";
        }
    }
}
