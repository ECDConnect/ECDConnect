import { Button, Typography } from '@ecdlink/ui';

export interface WalkthroughInfoPageProps {
  sectionName: string;
  onHelp: () => void;
}

export const WalkthroughInfoPage = ({
  sectionName,
  onHelp,
}: WalkthroughInfoPageProps) => {
  return (
    <div className="p-4">
      <Typography
        type="h3"
        text={`Need my help using the ${sectionName} section?`}
      />
      <Button
        type="filled"
        color="primary"
        textColor="white"
        text="Start walkthrough"
        onClick={onHelp}
      />
    </div>
  );
};
