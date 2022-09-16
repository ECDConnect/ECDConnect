import { renderIcon, Typography } from '@ecdlink/ui';

export const OfflineCard: React.FC = () => {
  return (
    <div
      className={
        'bg-white rounded-lg shadow-sm flex flex-col justify-around items-center w-full p-6'
      }
    >
      <div className="rounded-full bg-alertBg w-12 h-12 flex flex-col justify-center items-center">
        {renderIcon('InformationCircleIcon', 'h-5 w-5 text-alertMain')}
      </div>

      <Typography
        text="Information not available when offline"
        type={'body'}
        weight={'bold'}
        align="center"
        className="mt-2"
      />

      <Typography
        text="Please go online and refresh the page to see previous months"
        type={'body'}
        color={'textLight'}
        align="center"
        className="mt-2"
      />
    </div>
  );
};
