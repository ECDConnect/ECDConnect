create table public."NotificationResult" (
	"Id" int NOT NULL,
	"Name" varchar(100) not null,
	"NormilizedName" varchar(100) not null,
	CONSTRAINT "PK_NotificationResult" PRIMARY KEY ("Id")
);

INSERT INTO public."NotificationResult" ("Id", "Name", "NormilizedName") VALUES(0, 'Success', 'Success');
INSERT INTO public."NotificationResult" ("Id", "Name", "NormilizedName") VALUES(1, 'SMS failed - authentication', 'SMS_failed_authentication');
INSERT INTO public."NotificationResult" ("Id", "Name", "NormilizedName") VALUES(2, 'SMS failed - connection', 'SMS_failed_connection');
INSERT INTO public."NotificationResult" ("Id", "Name", "NormilizedName") VALUES(3, 'SMS failed - insufficient credits', 'SMS_failed_insufficient_credits');
INSERT INTO public."NotificationResult" ("Id", "Name", "NormilizedName") VALUES(4, 'SMS failed - blocked/opted out', 'SMS_failed_blocked_opted_out');

ALTER TABLE public."ShortUrl" ADD "NotificationResult" int NULL;
ALTER TABLE public."MessageLog" ADD "NotificationResult" int NULL;
