
create table public."PQARating" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"VisitName" text NULL,
    "OverallScore" numeric NULL,
    "OverallRating" text NULL,
    "OverallRatingStars" text NULL,
    "OverallRatingColor" text NULL,
    "VisitTypeName" text NULL,
    "LinkedVisitId" uuid NULL,
    "VisitId" uuid NULL,

	CONSTRAINT "PK_PQARating" PRIMARY KEY ("Id")
);

ALTER TABLE "PQARating" ADD CONSTRAINT "FK_PQARating_VisitId" FOREIGN KEY ("VisitId") REFERENCES "Visit"("Id") ON DELETE RESTRICT;
ALTER TABLE "PQARating" ADD CONSTRAINT "FK_PQARating_LinkedVisitId" FOREIGN KEY ("LinkedVisitId") REFERENCES "Visit"("Id") ON DELETE RESTRICT;
 

create table public."PQASectionRating" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,	
	"PQARatingId" uuid NULL,
    "VisitSection" text NULL,
    "SectionScore" numeric NULL,
    "SectionRating" text NULL,
    "SectionRatingColor" text NULL,

	CONSTRAINT "PK_PQASectionRating" PRIMARY KEY ("Id")	
);

ALTER TABLE "PQASectionRating" ADD CONSTRAINT "FK_PQASectionRating_PQARatingId" FOREIGN KEY ("PQARatingId") REFERENCES "PQARating"("Id") ON DELETE RESTRICT;


drop table "PQA" 
drop table "SmartSpaceVisit" 