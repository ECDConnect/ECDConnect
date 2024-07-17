import { Typography } from '@ecdlink/ui';
import { format } from 'date-fns';

export type AcceptLeaderDetailsProps = {
  firstName: string;
  dateAssigned: Date;
};

export const AcceptLeaderDetails: React.FC<AcceptLeaderDetailsProps> = ({
  firstName,
  dateAssigned,
}) => {
  const dateAssignedText = format(dateAssigned, 'dd MMMM yyyy');
  const deadlineDateText = format(
    dateAssigned.setDate(dateAssigned.getDate() + 14),
    'dd MMMM yyyy'
  );

  return (
    <>
      <Typography
        type="h1"
        className="mt-6"
        text={`${firstName} has not accepted the club leader agreement`}
      />
      <Typography
        type="h3"
        className="mt-6"
        text={`You assigned ${firstName} the club leader role on ${dateAssignedText}`}
      />
      <ul className="mt-2 list-disc pl-4 text-black">
        <li>
          <Typography
            type={'help'}
            hasMarkup
            text={`If ${firstName} does not accept the agreement by ${deadlineDateText}, you will need to assign a new leader.`}
            className={'text-sm font-normal'}
          />
        </li>
      </ul>
      <Typography
        type="h3"
        className="mt-6"
        text={`Reach out to ${firstName}`}
      />
      <ul className="mt-2 list-disc pl-4 text-black">
        <li>
          <Typography
            type={'help'}
            hasMarkup
            text={`Discuss the role with ${firstName} and make sure they have agreed to be club leader.`}
            className={'text-sm font-normal'}
          />
        </li>
        <li>
          <Typography
            type={'help'}
            hasMarkup
            text={`Find out if they need support with accepting the agreement on Funda App.`}
            className={'text-sm font-normal'}
          />
        </li>
      </ul>
    </>
  );
};
