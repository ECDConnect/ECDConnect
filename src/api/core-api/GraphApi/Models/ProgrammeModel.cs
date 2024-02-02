using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ProgrammeModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string PreferredLanguage { get; set; }

        public Guid? ClassroomGroupId { get; set; } 

        public Guid ClassroomId { get; set; } 

        public List<DailyProgrammeModel> dailyProgrammes { get; set; }


        public bool IsActive { get; set; }
    }

    public class DailyProgrammeModel
    {
        public Guid Id { get; set; }

        public Guid ProgrammeId { get; set; }
        public int Day { get; set; }
        public DateTime DayDate { get; set; }

        public string MessageBoardText { get; set; }

        public int SmallGroupActivityId { get; set; }

        public int LargeGroupActivityId { get; set; }

        public int StoryBookId { get; set; }

        public int StoryActivityId { get; set; }

        public bool IsActive { get; set; }

    }
}
