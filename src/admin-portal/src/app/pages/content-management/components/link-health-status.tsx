import { Typography } from '@ecdlink/ui';

export type ResourceLinkHealthStatus =
  | 'ok'
  | 'broken'
  | 'unverifiable'
  | 'transient'
  | string
  | undefined;

export interface ResourceLinkHealthCheckDto {
  contentId: number;
  contentType?: string;
  sectionType?: string;
  title?: string;
  url?: string;
  status?: string;
  lastCheckStatus?: string;
  lastStatusCode?: number | null;
  lastError?: string | null;
  consecutiveFailureCount?: number;
  lastCheckedDate?: string | null;
}

export const getLinkHealthDisplay = (status?: ResourceLinkHealthStatus) => {
  switch (status) {
    case 'broken':
      return {
        label: 'Broken',
        className: 'bg-errorMain text-white',
      };
    case 'unverifiable':
      return {
        label: 'Unverifiable',
        className: 'bg-infoMain text-white',
      };
    case 'ok':
      return {
        label: 'OK',
        className: 'bg-successMain text-white',
      };
    default:
      return {
        label: 'Not checked',
        className: 'bg-uiLight text-textMid',
      };
  }
};

interface LinkHealthStatusChipProps {
  status?: ResourceLinkHealthStatus;
  lastError?: string | null;
}

export const LinkHealthStatusChip = ({
  status,
  lastError,
}: LinkHealthStatusChipProps) => {
  const display = getLinkHealthDisplay(status);

  return (
    <div className="flex flex-col">
      <span
        className={`${display.className} w-fit rounded-full py-1 px-3 text-xs`}
        title={lastError || display.label}
      >
        {display.label}
      </span>
      {status === 'broken' && lastError ? (
        <Typography
          type="help"
          color="errorMain"
          text={lastError}
          className="pt-1"
        />
      ) : null}
    </div>
  );
};
