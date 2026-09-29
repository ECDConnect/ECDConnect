ALTER TABLE public."AspNetUsers" ADD "AcquisitionUrl" text NULL;
ALTER TABLE public."AspNetUsers" ADD "UtmSource" varchar NULL DEFAULT 'Unknown';
ALTER TABLE public."AspNetUsers" ADD "UtmMedium" varchar NULL DEFAULT 'Unknown';
ALTER TABLE public."AspNetUsers" ADD "UtmCampaign" varchar NULL DEFAULT 'Unknown';
