
CREATE TABLE public."CoachFeedbackType" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"FeedbackTypeId" uuid NULL,
	"CoachFeedbackId" uuid NULL,
	CONSTRAINT "PK_CoachFeedbackType" PRIMARY KEY ("Id")
);

ALTER TABLE public."CoachFeedbackType" ADD CONSTRAINT "FK_CoachFeedbackType_FeedbackTypeId" FOREIGN KEY ("FeedbackTypeId") REFERENCES public."FeedbackType"("Id") ON DELETE RESTRICT;
ALTER TABLE public."CoachFeedbackType" ADD CONSTRAINT "FK_CoachFeedbackType_CoachFeedbackId" FOREIGN KEY ("CoachFeedbackId") REFERENCES public."CoachFeedback"("Id") ON DELETE RESTRICT;