delete from "MessageTemplate" where "TemplateType" like 'gg-%';
delete from "MessageTemplate" where "TemplateType" = 'three-week-notification' and "Protocol" in ('email', 'hub');
delete from "MessageTemplate" where "TemplateType" = 'four-week-notification' and "Protocol"='email';
delete from "MessageTemplate" where "TemplateType" = 'promoted-to-prinicpal-or-faa' and "Protocol"='sms';
delete from "MessageTemplate" where "TemplateType" = 'marked-onleave' and "Protocol"='hub';
delete from "MessageTemplate" where "TemplateType" = 'removed-from-programme' and "Protocol"='sms';
delete from "MessageTemplate" where "TemplateType" = 'promoted-to-prinicpal-or-faa' and "Protocol"='sms';
