CREATE OR REPLACE FUNCTION public.notify_important_error()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    payload JSON;
    severity_level TEXT;
    endpoint_id TEXT;
BEGIN
    
        -- Determine severity based on message content
        IF NEW."Message" = 'Not Authorised' THEN
            severity_level := 'NORMAL';
        ELSE
            severity_level := 'HIGH';
        END IF;

        -- Safely extract the GraphQL operation id from RequestPayload
        BEGIN
            endpoint_id := NEW."RequestPayload"::jsonb ->> 'id';
        EXCEPTION WHEN OTHERS THEN
            endpoint_id := NULL;
        END;
        
        payload := json_build_object(
            'id', NEW."Id",
            'event_date', NEW."EventDate",
            'type', NEW."Type",
            'message', LEFT(NEW."Message", 500),
            'user_id', NEW."UserId",
            'app_version', NEW."AppVersion",
            'client_url', NEW."ClientUrl",
            'is_online', NEW."IsOnline",
            'endpoint', endpoint_id,
            'severity', severity_level
        );
        
        PERFORM pg_notify('app_errors', payload::text);
    
    
    RETURN NEW;
END;
$function$
;


-- create trigger on AppLog table to notify on important errors
create trigger trigger_notify_important_error after
insert
    on
    public."AppLog" for each row execute function notify_important_error();