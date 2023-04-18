ALTER TABLE public."Programme" ADD "ClassroomGroupId" uuid NULL;
ALTER TABLE public."Programme" ADD CONSTRAINT "FK_Programme_ClassroomGroup_ClassroomGroupId" FOREIGN KEY ("ClassroomGroupId") REFERENCES public."ClassroomGroup"("Id");
