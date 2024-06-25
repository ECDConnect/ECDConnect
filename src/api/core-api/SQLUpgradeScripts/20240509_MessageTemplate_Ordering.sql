UPDATE public."MessageTemplate" SET "Ordering"=3 WHERE "TemplateType" ='gg-walkthrough-notification-infant';
UPDATE public."MessageTemplate" SET "Ordering"=3 WHERE "TemplateType" ='gg-walkthrough-notification-mother';
UPDATE public."MessageTemplate" SET "Ordering"=5 WHERE "TemplateType" ='gg-redalert-maternal-distress-mother';
UPDATE public."MessageTemplate" SET "Ordering"=5 WHERE "TemplateType" ='gg-redalert-maternal-distress-infant';
UPDATE public."MessageTemplate" SET "Ordering"=6 WHERE "TemplateType" ='gg-referral-danger-signs-mother';
UPDATE public."MessageTemplate" SET "Ordering"=6 WHERE "TemplateType" ='gg-referral-danger-signs-infant';
UPDATE public."MessageTemplate" SET "Ordering"=7 WHERE "TemplateType" ='gg-child-growth-issue';
UPDATE public."MessageTemplate" SET "Ordering"=8 WHERE "TemplateType" ='gg-child-muac-malnutrution';
UPDATE public."MessageTemplate" SET "Ordering"=10 WHERE "TemplateType" ='gg-x-visits-missed';
UPDATE public."MessageTemplate" SET "Ordering"=12 WHERE "TemplateType" ='gg-refer-home-affairs';
UPDATE public."MessageTemplate" SET "Ordering"=13 WHERE "TemplateType" ='gg-refer-sassa';
UPDATE public."MessageTemplate" SET "Ordering"=14 WHERE "TemplateType" ='gg-clinic-visits-not-uptodate';
UPDATE public."MessageTemplate" SET "Ordering"=15 WHERE "TemplateType" ='gg-substance-abuse';
UPDATE public."MessageTemplate" SET "Ordering"=16 WHERE "TemplateType" ='gg-maternal-distress';
UPDATE public."MessageTemplate" SET "Ordering"=17 WHERE "TemplateType" ='gg-pregnant-low-muac';
UPDATE public."MessageTemplate" SET "Ordering"=18 WHERE "TemplateType" ='gg-child-muac';
UPDATE public."MessageTemplate" SET "Ordering"=19 WHERE "TemplateType" ='gg-low-birth-weight';
UPDATE public."MessageTemplate" SET "Ordering"=20 WHERE "TemplateType" ='gg-younger-than-20';
UPDATE public."MessageTemplate" SET "Ordering"=22 WHERE "TemplateType" ='gg-added-breastfeeding-club';
UPDATE public."MessageTemplate" SET "Ordering"=23 WHERE "TemplateType" ='gg-breastfeeding-club';
UPDATE public."MessageTemplate" SET "Ordering"=24 WHERE "TemplateType" ='gg-points-yearly-summary';
UPDATE public."MessageTemplate" SET "Ordering"=25 WHERE "TemplateType" ='gg-top-points-earner';
UPDATE public."MessageTemplate" SET "Ordering"=26 WHERE "TemplateType" ='gg-points-yearly-summary';
UPDATE public."MessageTemplate" SET "Ordering"=27 WHERE "TemplateType" ='gg-top-points-team';
UPDATE public."MessageTemplate" SET "Ordering"=28 WHERE "TemplateType" ='gg-top-25-perc-points-team';
UPDATE public."MessageTemplate" SET "Ordering"=29 WHERE "TemplateType" ='gg-bottom-75-perc-points-team';
UPDATE public."MessageTemplate" SET "Ordering"=30 WHERE "TemplateType" ='gg-points-gold-tier-team';
UPDATE public."MessageTemplate" SET "Ordering"=31 WHERE "TemplateType" ='gg-points-silver-tier-team';
UPDATE public."MessageTemplate" SET "Ordering"=32 WHERE "TemplateType" ='gg-points-bronze-tier-team';
UPDATE public."MessageTemplate" SET "Ordering"=33 WHERE "TemplateType" ='gg-points-placement-team';
UPDATE public."MessageTemplate" SET "Ordering"=34 WHERE "TemplateType" ='gg-points-placement-team-top-25-perc-not-top-three';
UPDATE public."MessageTemplate" SET "Ordering"=35 WHERE "TemplateType" ='gg-points-placement-team-bottom-75perc';

UPDATE public."MessageTemplate" SET "TemplateType"='gg-three-week-notification'
where "TemplateType" = 'three-week-notification' and "Protocol" = 'sms' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';

UPDATE public."MessageTemplate" SET "TemplateType"='gg-four-week-notification'
where "TemplateType" = 'four-week-notification' and "Protocol" = 'sms' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';


