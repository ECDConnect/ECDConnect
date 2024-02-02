ALTER TABLE public."ClassReassignmentHistory" ADD "ReassignedRoleBackDate" timestamp NULL;
ALTER TABLE public."ClassReassignmentHistory" ADD "AssignedRole" text NULL;
ALTER TABLE public."ClassReassignmentHistory" ADD "ReassignedRoleBack" text NULL;
ALTER TABLE public."ClassReassignmentHistory" ADD "RoleAssignedToUser" text NULL;
ALTER TABLE public."Absentees" ADD "CompletedDate" timestamp NULL;
ALTER TABLE public."Absentees" ADD "IsRoleAssign" bool NULL DEFAULT false;
ALTER TABLE public."Absentees" ADD "AssignedDate" timestamp NULL;


ALTER TABLE public."Absentees" DROP COLUMN "ReasonNotes";

ALTER TABLE public."ClassReassignmentHistory" ADD "AssignedToDate" timestamp NULL;
UPDATE public."ClassReassignmentHistory" set "AssignedToDate" = "ReassignedToDate";
ALTER TABLE  public."ClassReassignmentHistory" ALTER COLUMN "AssignedToDate" SET NOT NULL;
ALTER TABLE public."ClassReassignmentHistory" ADD "AbsenteeId" UUID NULL;
ALTER TABLE public."ClassReassignmentHistory" ADD CONSTRAINT "FK_ClassReassignmentHistory_Absentees_AbsenteeId" FOREIGN KEY ("AbsenteeId") REFERENCES public."Absentees"("Id") ON DELETE RESTRICT;
ALTER TABLE public."ClassReassignmentHistory" ADD "AssignedRoleDate" timestamp NULL;

--clean out old absentees
update "Absentees" set "CompletedDate" = "AbsentDateEnd", "AssignedDate" = NOW()  where "AbsentDateEnd" < NOW(); 
update "Absentees" set "CompletedDate" = NOW(), "AssignedDate" = NOW()  where "AbsentDate" < NOW(); 