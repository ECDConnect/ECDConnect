export interface ProgrammeRoutineDto {
  id: number;
  description: string; // Markdown
  name: string;
  headerBanner: string;
  routineItems: ProgrammeRoutineItemDto[];
}

export interface ProgrammeRoutineItemDto {
  id: number;
  name: string;
  description: string; // Markdown
  image: string;
  imageBackgroundColor: string;
  icon: string;
  iconBackgroundColor: string;
  alert: string;
  timeSpan: string;
  sequence?: string;
  routineSubItems: ProgrammeRoutineSubItemDto[];
}

export interface ProgrammeRoutineSubItemDto {
  id: number;
  name: string;
  description: string;
  image: string;
  imageBackgroundColor: string;
  timeSpan: string;
}
