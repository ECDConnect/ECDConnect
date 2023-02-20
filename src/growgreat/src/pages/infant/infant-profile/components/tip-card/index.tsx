import { Button, renderIcon, Typography } from '@ecdlink/ui';

interface TipCardProps {
  buttonText: string;
  buttonIcon?: string;
  onClick: () => void;
}
export const TipCard = ({ buttonText, buttonIcon, onClick }: TipCardProps) => {
  return (
    <div className="bg-infoBb rounded-10 flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        {renderIcon('InformationCircleIcon', 'w-5 h-5 text-infoMain')}
        <Typography
          type="body"
          align="left"
          weight="normal"
          text="Need tips?"
          color="infoDark"
        />
      </div>
      <Button
        className="rounded-10 h-8"
        type="filled"
        color="primary"
        textColor="white"
        text={buttonText}
        icon={buttonIcon}
        iconPosition="end"
        onClick={onClick}
      />
    </div>
  );
};
