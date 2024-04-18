import { Typography } from '@ecdlink/ui';

export const EmptyClinic = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-center p-24">
        <Typography
          type={'h4'}
          weight={'bold'}
          text={'This user has no clinics'}
          color={'textDark'}
        />
      </div>
    </div>
  );
};
