import { renderIcon, Typography } from '@ecdlink/ui';

export const OfflineCard: React.FC = () => {
  return (
    <div
      className={
        'flex w-full flex-col items-center justify-around rounded-lg bg-white p-6 shadow-sm'
      }
    >
      <div className="bg-alertBg flex h-12 w-12 flex-col items-center justify-center rounded-full">
        {renderIcon('InformationCircleIcon', 'h-5 w-5 text-alertMain')}
      </div>

      <Typography
        text="You need to go online to use this feature"
        type={'body'}
        weight={'bold'}
        align="center"
        className="mt-2"
      />

      <Typography
        text="Switch on your mobile data or connect to a wifi network to use this feature"
        type={'body'}
        color={'textLight'}
        align="center"
        className="mt-2"
      />
    </div>
  );
};
