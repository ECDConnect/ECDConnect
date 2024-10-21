update "Content" set "TenantId" = null where "ContentTypeId" =25;

update "ContentValue" set "Value" = 'Site visit' where "ContentId" = 754 and "ContentTypeFieldId" = 371;
update "ContentValue" set "Value" = '#FFF6D0' where "ContentId" = 754 and "ContentTypeFieldId" = 372;
update "ContentValue" set "Value" = 'Preschool event' where "ContentId" = 755 and "ContentTypeFieldId" = 371;
update "ContentValue" set "Value" = '#FFD3E6' where "ContentId" = 755 and "ContentTypeFieldId" = 372;
update "ContentValue" set "Value" = 'Birthday' where "ContentId" = 756 and "ContentTypeFieldId" = 371;
update "ContentValue" set "Value" = '#FFF6D0' where "ContentId" = 756 and "ContentTypeFieldId" = 372;
update "ContentValue" set "Value" = 'Caregiver meeting' where "ContentId" = 757 and "ContentTypeFieldId" = 371;
update "ContentValue" set "Value" = '#FFD3E6' where "ContentId" = 757 and "ContentTypeFieldId" = 372;
update "ContentValue" set "Value" = 'Fundraising event' where "ContentId" = 758 and "ContentTypeFieldId" = 371;
update "ContentValue" set "Value" = '#E6F1D4' where "ContentId" = 758 and "ContentTypeFieldId" = 372;
update "ContentValue" set "Value" = 'Holiday celebration' where "ContentId" = 759 and "ContentTypeFieldId" = 371;
update "ContentValue" set "Value" = '#D2F1F9' where "ContentId" = 759 and "ContentTypeFieldId" = 372;
update "ContentValue" set "Value" = 'Open day' where "ContentId" = 760 and "ContentTypeFieldId" = 371;
update "ContentValue" set "Value" = '#DBDDEC' where "ContentId" = 760 and "ContentTypeFieldId" = 372;
update "ContentValue" set "Value" = 'Training' where "ContentId" = 766 and "ContentTypeFieldId" = 371;
update "ContentValue" set "Value" = '#E2CADE' where "ContentId" = 766 and "ContentTypeFieldId" = 372;
update "ContentValue" set "Value" = 'Other' where "ContentId" = 781 and "ContentTypeFieldId" = 371;
update "ContentValue" set "Value" = '#FFE8CC' where "ContentId" = 781 and "ContentTypeFieldId" = 372;


delete from "Content" where "ContentTypeId" = 25 and "Id" in (783,787,788,789);