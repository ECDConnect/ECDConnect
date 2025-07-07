using ECDLink.DataAccessLayer.Entities.Classroom;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Classroom
{
    public class ClassroomGroupModel
    {
        public Guid Id { get; set; }
        public Guid ClassroomId { get; set; }
        public string Name { get; set; }
        public Guid UserId { get; set; }
        public List<BaseLearnerModel> Learners { get; set; }
        public List<ClassProgramme> ClassProgrammes { get; set; }
    }

    public class BaseLearnerModel
    {
        public Guid LearnerId { get; set; }
        public Guid ChildUserId { get; set; }
        public DateTime StartedAttendance { get; set; }
        public DateTime? StoppedAttendance { get; set; }
        public bool IsActive { get; set; }
    }
}