CREATE OR REPLACE FUNCTION public.notify_slack_user_resource_problem_report()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM pg_notify(
        'user_resource_problem_report',
        jsonb_build_object(
            'id',                NEW."Id",
            'problemType',       NEW."ProblemType",
            'contentId',         NEW."ContentId",
            'userId',            NEW."UserId",
            'tenantId',          NEW."TenantId",
            'additionalDetails', NEW."AdditionalDetails",
            'dataFreeAtReport',  NEW."DataFreeAtReport",
            'linkAtReport',      NEW."LinkAtReport",
            'insertedDate',      NEW."InsertedDate"
        )::text
    );
    RETURN NEW;
END;
$$;



CREATE TRIGGER trg_notify_slack_user_resource_problem_report
AFTER INSERT ON public."UserResourceProblemReport"
FOR EACH ROW
EXECUTE FUNCTION public.notify_slack_user_resource_problem_report();