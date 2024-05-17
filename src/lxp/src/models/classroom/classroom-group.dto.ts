export type ClassroomGroupDto = {
  id: string;
  classroomId: string;
  name: string;
  userId: string; // This would be the practitioner running the classroom group
  learners: LearnerDto[];
};

export type LearnerDto = {
  learnerId: string;
  childUserId: string;
  startedAttendace: string;
};
