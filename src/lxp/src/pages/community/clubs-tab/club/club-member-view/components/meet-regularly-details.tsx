import { StatusChip, Typography } from '@ecdlink/ui';

export type MeetRegularlyDetailsProps = {
  firstName: string;
  meetingsAttended: number;
  meetingsTotal: number;
};

export const MeetRegularlyDetails: React.FC<MeetRegularlyDetailsProps> = ({
  firstName,
  meetingsAttended,
  meetingsTotal,
}) => {
  return (
    <>
      <div className="flex">
        <StatusChip
          className="mr-2"
          backgroundColour="alertMain"
          textColour={'white'}
          borderColour="transparent"
          text={`${meetingsAttended}/${meetingsTotal}`}
        />
        <Typography
          type="h3"
          text={`Meetings attended in ${new Date().getFullYear()}`}
        />
      </div>

      <Typography
        type="h3"
        className="mt-4"
        text={`Reach out to ${firstName}`}
      />
      <Typography
        type="body"
        className="mt-4"
        text={`Find out why ${firstName} has missed meetings and see if they need support.`}
      />
    </>
  );
};
