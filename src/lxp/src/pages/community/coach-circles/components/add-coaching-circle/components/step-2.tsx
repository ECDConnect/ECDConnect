import { practitionerSelectors } from '@/store/practitioner';
import { Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';

export const Step2 = () => {
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  console.log({ practitioners });

  return (
    <div className="flex flex-col p-4">
      <Typography
        type="h2"
        color="textDark"
        text={'Add a coaching circle'}
        className="mt-4"
      />
      <Typography
        type="h3"
        color="textDark"
        text={'Take attendance for this meeting'}
        className="mt-4"
      />
      <Typography
        type="help"
        color="textMid"
        text={'Take attendance for this meeting'}
        className="mt-2"
      />
    </div>
  );
};
