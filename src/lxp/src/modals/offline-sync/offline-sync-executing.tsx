import { ActionModal, Alert, LoadingSpinner, Typography } from '@ecdlink/ui';

export type OfflineSyncExecutingProps = {
  title: string;
  step: number;
  stepTotal: number;
  error?: string;
  onSyncIssueClick?: () => void;
};

export const OfflineSyncExecuting: React.FC<OfflineSyncExecutingProps> = ({
  title,
  step,
  stepTotal,
  error,
  onSyncIssueClick,
}) => {
  return (
    <ActionModal
      icon={error ? 'ExclamationCircleIcon' : 'SwitchVerticalIcon'}
      iconColor={error ? 'alertMain' : 'primary'}
      iconBorderColor="errorBg"
      title={
        error
          ? 'There was a problem syncing your information'
          : 'Syncing your app'
      }
    >
      <div className="flex flex-col align-center">
        <LoadingSpinner
          className="mt-6"
          size={'medium'}
          spinnerColor={'primary'}
          backgroundColor={'uiLight'}
        />
        <Typography
          className={'mt-2'}
          type={'body'}
          text={`${step} of ${stepTotal}`}
          align="center"
          color={'primary'}
        />
        <Typography
          className={'mt-2'}
          type={'body'}
          text={title}
          align="center"
          fontSize={'14'}
          color={'textLight'}
        />
        {error && (
          <Typography
            className={'mt-2'}
            type={'body'}
            text={'Unable to sync?'}
            align="center"
            fontSize={'16'}
            underline
            color={'primary'}
            onClick={onSyncIssueClick}
          />
        )}
        <Alert
          className={'mt-4'}
          message={
            'Do not close the app or disconnect while syncing. You will need to complete the data sync before continuing.'
          }
          type={'warning'}
        />
      </div>
    </ActionModal>
  );
};
