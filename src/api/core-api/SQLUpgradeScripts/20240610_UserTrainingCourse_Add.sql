drop table "UserTrainingCourse";

CREATE TABLE public."UserTrainingCourse" (
    "Id" 				uuid PRIMARY KEY,
    "UserId" 			uuid not null,
    "CourseName"		varchar(100) not null,
    "CompletedDate"		timestamp not null,
    "TenantId"			uuid not null,
    "InsertedDate"		timestamp not null,
    "UpdatedDate"		timestamp not null,
    "UpdatedBy"			varchar(36)
);

CREATE INDEX "IX_UserTrainingCourse_UserId" ON public."UserTrainingCourse" USING btree ("UserId");
CREATE INDEX "IX_UserTrainingCourse_TenantId_CompletedDate" ON public."UserTrainingCourse" USING btree ("TenantId", "CompletedDate");

ALTER TABLE public."UserTrainingCourse" ADD CONSTRAINT "FK_UserTrainingCourse_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;

