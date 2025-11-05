-- remove visitTypes not in use
delete from "VisitType" where "Type" in ('child', 'mother');

ALTER TABLE public."Visit" ADD "FormContentId" int NULL;
ALTER TABLE public."Visit" ALTER COLUMN "FormContentId" SET STORAGE PLAIN;


ALTER TABLE public."VisitData" ADD "QuestionContentId" int NULL;
ALTER TABLE public."VisitData" ALTER COLUMN "QuestionContentId" SET STORAGE PLAIN;

ALTER TABLE public."VisitData" ADD "AnswerContentId" text NULL;
ALTER TABLE public."VisitData" ALTER COLUMN "AnswerContentId" SET STORAGE PLAIN;