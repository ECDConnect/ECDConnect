using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.ChildProgress
{
    public class ChildProgressReportDetailedModel
    {
        public string Id { get; set; }

        public string ChildId { get; set; }

        public string ChildFirstname { get; set; }

        public string DateCompleted { get; set; }

        public string DateCreated { get; set; }

        public string ObservationNote { get; set; }

        public string ChildSurname { get; set; }

        public int AchievedLevelId { get; set; }

        public string ReportingPeriod { get; set; }

        public string ClassroomName { get; set; }

        public string ReportingDate { get; set; }

        public string PractitionerFirstname { get; set; }

        public string PractitionerSurname { get; set; }

        public string PractitionerPhotoUrl { get; set; }

        public string ChildEnjoys { get; set; }

        public string ChildProgressedWith { get; set; }

        public string HowCanCaregiverHelpChild { get; set; }

        public List<ObservationCategory> Categories { get; set; }
    }

    public class ObservationCategory
    {
        public int CategoryId { get; set; }

        public int AchievedLevelId { get; set; }
        public int Status { get; set; }

        public ProgressObservationCategorySupportingTask SupportingTask { get; set; }

        public List<CategoryTask> Tasks { get; set; }

        public List<CategoryTask> MissingTasks { get; set; }
    }

    public class CategoryTask
    {
        public int LevelId { get; set; }

        public int SkillId { get; set; }

        public string Description { get; set; }

        public string Value { get; set; }
    }

    public class ProgressObservationCategorySupportingTask
    {
        public int TaskId { get; set; }

        public string TaskDescription { get; set; }

        public string TodoText { get; set; }
    }
}
