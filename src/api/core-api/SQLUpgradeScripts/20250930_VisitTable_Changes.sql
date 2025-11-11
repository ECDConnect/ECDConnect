-- remove GG visitTypes not in use
delete from "Visit" where "VisitTypeId" in (select vt."Id"  from "VisitType" vt where "Type" in ('child', 'mother'));
delete from "VisitData" where "VisitId" in (select "Id" from "Visit" where "VisitTypeId" in (select vt."Id"  from "VisitType" vt where "Type" in ('child', 'mother')));
delete from "VisitDataStatus" where "VisitDataId" in (select "Id" from "VisitData" where "VisitId" in (select "Id" from "Visit" where "VisitTypeId" in (select vt."Id"  from "VisitType" vt where "Type" in ('child', 'mother'))));
delete from "VisitType" where "Type" in ('child', 'mother');

ALTER TABLE public."Visit" ADD "FormContentId" int NULL;
ALTER TABLE public."Visit" ALTER COLUMN "FormContentId" SET STORAGE PLAIN;


ALTER TABLE public."VisitData" ADD "QuestionContentId" int NULL;
ALTER TABLE public."VisitData" ALTER COLUMN "QuestionContentId" SET STORAGE PLAIN;

ALTER TABLE public."VisitData" ADD "AnswerContentId" text NULL;
ALTER TABLE public."VisitData" ALTER COLUMN "AnswerContentId" SET STORAGE PLAIN;