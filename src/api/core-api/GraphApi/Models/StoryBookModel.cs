namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class StoryBookModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Part { get; set; }
        public string PartText { get; set; }
        public int PartContentTypeId { get; set; }
        public string QuestionId { get; set; }
        public string QuestionName { get; set; }
        public string QuestionText { get; set; }
        public bool QuestionChange { get; set; }
        public int QuestionContentTypeId { get; set; }
    }
   



}

