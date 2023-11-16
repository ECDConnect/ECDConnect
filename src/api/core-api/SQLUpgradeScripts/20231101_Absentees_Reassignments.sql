ALTER TABLE public."ClassReassignmentHistory" ADD "ReassignedRoleBackDate" timestamp NULL;
ALTER TABLE public."ClassReassignmentHistory" ADD "AssignedRole" text NULL;
ALTER TABLE public."ClassReassignmentHistory" ADD "ReassignedRoleBack" text NULL;
ALTER TABLE public."Absentees" ADD "CompletedDate" timestamp NULL;
ALTER TABLE public."Absentees" ADD "IsRoleAssign" bool NULL DEFAULT false;

ALTER TABLE public."Absentees" DROP COLUMN "ReasonNotes";

update "Absentees" set "CompletedDate" = "AbsentDateEnd"  where "AbsentDateEnd" < NOW(); 
update "Absentees" set "CompletedDate" = NOW()  where "AbsentDate" < NOW(); 