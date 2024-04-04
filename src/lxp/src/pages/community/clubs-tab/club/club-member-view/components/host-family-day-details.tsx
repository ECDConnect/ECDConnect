import { StatusChip, Typography } from '@ecdlink/ui';

export type HostFamilyDayDetailsProps = {
  firstName: string;
  meetingsAttended: number;
  meetingsTotal: number;
};

export const HostFamilyDayDetails: React.FC<HostFamilyDayDetailsProps> = ({
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
          text={`Family days attended in ${new Date().getFullYear()}`}
        />
      </div>

      <Typography
        type="h2"
        className="mt-4"
        text={`Reach out to ${firstName}`}
      />
      <Typography
        type="body"
        className="mt-4"
        text={`Find out why ${firstName} has missed these events and see if they need support.`}
      />
    </>
  );
};
